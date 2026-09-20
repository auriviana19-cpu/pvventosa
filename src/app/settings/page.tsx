"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { PushOptIn } from "@/components/PushOptIn";
import { RULE_TYPE_LABELS } from "@/lib/format";
import type { AdAccount, AppConfig, Rule, RuleType } from "@/lib/types";

const RULE_TYPES: RuleType[] = ["daily_summary", "spend_threshold", "roas_below", "profit_negative"];

function defaultThreshold(type: RuleType): number {
  switch (type) {
    case "daily_summary":
      return 20;
    case "spend_threshold":
      return 100;
    case "roas_below":
      return 1.5;
    case "profit_negative":
      return 50;
  }
}

function thresholdLabel(type: RuleType): string {
  switch (type) {
    case "daily_summary":
      return "Hora do dia (0-23)";
    case "spend_threshold":
      return "Valor de gasto";
    case "roas_below":
      return "ROAS mínimo (ex: 1.5)";
    case "profit_negative":
      return "Prejuízo máximo tolerado";
  }
}

export default function SettingsPage() {
  const [token, setToken] = useState("");
  const [savingToken, setSavingToken] = useState(false);
  const [tokenMessage, setTokenMessage] = useState<string | null>(null);
  const [tokenError, setTokenError] = useState<string | null>(null);

  const [accounts, setAccounts] = useState<AdAccount[]>([]);
  const [selectedAccounts, setSelectedAccounts] = useState<Set<string>>(new Set());

  const [rules, setRules] = useState<Rule[]>([]);
  const [newRuleType, setNewRuleType] = useState<RuleType>("daily_summary");
  const [newRuleScope, setNewRuleScope] = useState<string>(""); // "" = todas as contas
  const [newRuleThreshold, setNewRuleThreshold] = useState<number>(defaultThreshold("daily_summary"));
  const [savingRule, setSavingRule] = useState(false);

  const [testMessage, setTestMessage] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const [configRes, rulesRes] = await Promise.all([fetch("/api/config"), fetch("/api/rules")]);
      const configJson = await configRes.json();
      const config: AppConfig = configJson.config;
      setToken(config.fbAccessToken || "");
      setSelectedAccounts(new Set(config.fbAdAccountIds));
      const rulesJson = await rulesRes.json();
      setRules(rulesJson.rules);

      if (config.fbAccessToken) {
        const accRes = await fetch("/api/fb/accounts");
        if (accRes.ok) {
          const accJson = await accRes.json();
          setAccounts(accJson.accounts);
        }
      }
    })();
  }, []);

  async function saveTokenAndTest() {
    setSavingToken(true);
    setTokenError(null);
    setTokenMessage(null);
    try {
      await fetch("/api/config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fbAccessToken: token, fbAdAccountIds: Array.from(selectedAccounts) }),
      });
      const res = await fetch("/api/fb/accounts");
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      setAccounts(json.accounts);
      setTokenMessage(`Conexão ok! ${json.accounts.length} conta(s) de anúncios encontrada(s).`);
    } catch (err) {
      setTokenError((err as Error).message);
    } finally {
      setSavingToken(false);
    }
  }

  async function saveSelectedAccounts(next: Set<string>) {
    setSelectedAccounts(next);
    await fetch("/api/config", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fbAccessToken: token, fbAdAccountIds: Array.from(next) }),
    });
  }

  function toggleAccount(id: string) {
    const next = new Set(selectedAccounts);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    void saveSelectedAccounts(next);
  }

  async function addRule() {
    setSavingRule(true);
    try {
      const scopeAccount = accounts.find((a) => a.id === newRuleScope);
      const res = await fetch("/api/rules", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: newRuleType,
          scopeLevel: "account",
          scopeId: newRuleScope || null,
          scopeName: scopeAccount?.name || null,
          threshold: newRuleThreshold,
        }),
      });
      const json = await res.json();
      if (res.ok) setRules((r) => [json.rule, ...r]);
    } finally {
      setSavingRule(false);
    }
  }

  async function toggleRule(rule: Rule) {
    const enabled = !rule.enabled;
    setRules((rs) => rs.map((r) => (r.id === rule.id ? { ...r, enabled } : r)));
    await fetch(`/api/rules/${rule.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ enabled }),
    });
  }

  async function removeRule(id: number) {
    setRules((rs) => rs.filter((r) => r.id !== id));
    await fetch(`/api/rules/${id}`, { method: "DELETE" });
  }

  async function sendTest() {
    setTestMessage(null);
    const res = await fetch("/api/push/test", { method: "POST" });
    const json = await res.json();
    setTestMessage(res.ok ? `Notificação de teste enviada para ${json.sent} dispositivo(s).` : json.error);
  }

  return (
    <div className="page">
      <div className="topbar">
        <div className="brand">
          <h1>Configurações</h1>
        </div>
        <Link className="nav-link" href="/">
          ← Voltar para a dashboard
        </Link>
      </div>

      <div className="card">
        <h2 className="section-title">Conexão com o Facebook</h2>
        <div className="form-grid">
          <div className="form-field">
            <label htmlFor="token">Access Token da Marketing API</label>
            <input
              id="token"
              type="password"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="EAAG..."
              autoComplete="off"
            />
          </div>
          <div className="form-row">
            <button className="primary" onClick={saveTokenAndTest} disabled={savingToken || !token}>
              {savingToken ? "Testando..." : "Salvar e testar conexão"}
            </button>
          </div>
          {tokenMessage && <p className="muted">{tokenMessage}</p>}
          {tokenError && <div className="error-box">{tokenError}</div>}
        </div>
        <p className="muted" style={{ marginTop: 10 }}>
          Não tem um token ainda? Veja o passo-a-passo no arquivo README.md do projeto.
        </p>
      </div>

      {accounts.length > 0 && (
        <div className="card">
          <h2 className="section-title">Contas monitoradas</h2>
          <p className="muted" style={{ marginBottom: 10 }}>
            Selecione as contas que devem entrar no resumo diário e nos alertas sem escopo específico.
          </p>
          {accounts.map((a) => (
            <label key={a.id} className="pill-toggle" style={{ display: "flex", padding: "6px 0" }}>
              <input type="checkbox" checked={selectedAccounts.has(a.id)} onChange={() => toggleAccount(a.id)} />
              {a.name} ({a.id}) — {a.currency}
            </label>
          ))}
        </div>
      )}

      <div className="card">
        <h2 className="section-title">Notificações neste dispositivo</h2>
        <PushOptIn />
        <div style={{ marginTop: 10 }}>
          <button onClick={sendTest}>Enviar notificação de teste</button>
          {testMessage && (
            <p className="muted" style={{ marginTop: 8 }}>
              {testMessage}
            </p>
          )}
        </div>
      </div>

      <div className="card">
        <h2 className="section-title">Regras de alerta</h2>

        {rules.length === 0 && <p className="muted">Nenhuma regra configurada ainda.</p>}

        {rules.map((rule) => (
          <div key={rule.id} className="rule-item">
            <div>
              <div>{RULE_TYPE_LABELS[rule.type]}</div>
              <div className="meta">
                {rule.type === "daily_summary" ? `às ${rule.threshold}h` : rule.threshold}
                {rule.scopeName ? ` · ${rule.scopeName}` : " · todas as contas"}
              </div>
            </div>
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <label className="pill-toggle">
                <input type="checkbox" checked={rule.enabled} onChange={() => toggleRule(rule)} />
                Ativa
              </label>
              <button onClick={() => removeRule(rule.id)}>Remover</button>
            </div>
          </div>
        ))}

        <h3 style={{ fontSize: 14, marginTop: 18, marginBottom: 10 }}>Nova regra</h3>
        <div className="form-row">
          <div className="form-field">
            <label>Tipo</label>
            <select
              value={newRuleType}
              onChange={(e) => {
                const t = e.target.value as RuleType;
                setNewRuleType(t);
                setNewRuleThreshold(defaultThreshold(t));
              }}
            >
              {RULE_TYPES.map((t) => (
                <option key={t} value={t}>
                  {RULE_TYPE_LABELS[t]}
                </option>
              ))}
            </select>
          </div>
          <div className="form-field">
            <label>Conta (opcional)</label>
            <select value={newRuleScope} onChange={(e) => setNewRuleScope(e.target.value)}>
              <option value="">Todas as contas monitoradas</option>
              {accounts.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name}
                </option>
              ))}
            </select>
          </div>
          <div className="form-field">
            <label>{thresholdLabel(newRuleType)}</label>
            <input
              type="number"
              step="0.1"
              value={newRuleThreshold}
              onChange={(e) => setNewRuleThreshold(Number(e.target.value))}
            />
          </div>
          <button className="primary" onClick={addRule} disabled={savingRule}>
            Adicionar regra
          </button>
        </div>
        <p className="muted" style={{ marginTop: 12 }}>
          As regras só disparam se houver um cron externo chamando <code>/api/cron/check</code> periodicamente — veja o
          README para configurar.
        </p>
      </div>
    </div>
  );
}
