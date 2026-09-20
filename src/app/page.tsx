"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { StatTile } from "@/components/StatTile";
import { DateRangePicker } from "@/components/DateRangePicker";
import { CampaignsTable } from "@/components/CampaignsTable";
import { AdSetsTable } from "@/components/AdSetsTable";
import { SpendRevenueChart } from "@/components/SpendRevenueChart";
import { PushOptIn } from "@/components/PushOptIn";
import { formatCurrency, formatRoas } from "@/lib/format";
import type { AdAccount, AdSetRow, CampaignRow, DatePreset } from "@/lib/types";

export default function DashboardPage() {
  const [accounts, setAccounts] = useState<AdAccount[]>([]);
  const [accountsError, setAccountsError] = useState<string | null>(null);
  const [loadingAccounts, setLoadingAccounts] = useState(true);

  const [selectedAccount, setSelectedAccount] = useState<string>("");
  const [datePreset, setDatePreset] = useState<DatePreset>("today");

  const [campaigns, setCampaigns] = useState<CampaignRow[]>([]);
  const [campaignsError, setCampaignsError] = useState<string | null>(null);
  const [loadingCampaigns, setLoadingCampaigns] = useState(false);

  const [selectedCampaign, setSelectedCampaign] = useState<CampaignRow | null>(null);
  const [adSets, setAdSets] = useState<AdSetRow[]>([]);
  const [loadingAdSets, setLoadingAdSets] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/fb/accounts");
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || "Erro ao carregar contas.");
        setAccounts(json.accounts);
        if (json.accounts.length > 0) setSelectedAccount(json.accounts[0].id);
      } catch (err) {
        setAccountsError((err as Error).message);
      } finally {
        setLoadingAccounts(false);
      }
    })();
  }, []);

  useEffect(() => {
    if (!selectedAccount) return;
    setSelectedCampaign(null);
    setAdSets([]);
    setLoadingCampaigns(true);
    setCampaignsError(null);
    (async () => {
      try {
        const res = await fetch(
          `/api/fb/campaigns?actId=${encodeURIComponent(selectedAccount)}&datePreset=${datePreset}`
        );
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || "Erro ao carregar campanhas.");
        setCampaigns(json.campaigns);
      } catch (err) {
        setCampaignsError((err as Error).message);
        setCampaigns([]);
      } finally {
        setLoadingCampaigns(false);
      }
    })();
  }, [selectedAccount, datePreset]);

  useEffect(() => {
    if (!selectedCampaign) return;
    setLoadingAdSets(true);
    (async () => {
      try {
        const res = await fetch(
          `/api/fb/adsets?actId=${encodeURIComponent(selectedAccount)}&campaignId=${selectedCampaign.id}&datePreset=${datePreset}`
        );
        const json = await res.json();
        if (res.ok) setAdSets(json.adSets);
      } finally {
        setLoadingAdSets(false);
      }
    })();
  }, [selectedCampaign, selectedAccount, datePreset]);

  const currency = accounts.find((a) => a.id === selectedAccount)?.currency || "BRL";
  const totals = campaigns.reduce(
    (acc, c) => ({
      spend: acc.spend + c.metrics.spend,
      revenue: acc.revenue + c.metrics.revenue,
      profit: acc.profit + c.metrics.profit,
      purchases: acc.purchases + c.metrics.purchases,
    }),
    { spend: 0, revenue: 0, profit: 0, purchases: 0 }
  );
  const roas = totals.spend > 0 ? totals.revenue / totals.spend : 0;

  return (
    <div className="page">
      <div className="topbar">
        <div className="brand">
          <h1>FB Ads Dashboard</h1>
          <span>gasto, receita e lucro em tempo real</span>
        </div>
        <Link className="nav-link" href="/settings">
          Configurações
        </Link>
      </div>

      {accountsError && (
        <div className="error-box" style={{ marginBottom: 16 }}>
          {accountsError}{" "}
          <Link href="/settings" style={{ textDecoration: "underline" }}>
            Ir para configurações
          </Link>
        </div>
      )}

      {!loadingAccounts && !accountsError && accounts.length === 0 && (
        <div className="card">
          <p className="muted">
            Nenhuma conta de anúncios encontrada com este token. Verifique o Access Token em{" "}
            <Link href="/settings">Configurações</Link>.
          </p>
        </div>
      )}

      {accounts.length > 0 && (
        <>
          <div className="filters-row">
            <select value={selectedAccount} onChange={(e) => setSelectedAccount(e.target.value)} aria-label="Conta de anúncios">
              {accounts.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name} ({a.id})
                </option>
              ))}
            </select>
            <DateRangePicker value={datePreset} onChange={setDatePreset} />
          </div>

          <div className="stat-grid">
            <StatTile label="Gasto" value={formatCurrency(totals.spend, currency)} />
            <StatTile label="Receita" value={formatCurrency(totals.revenue, currency)} />
            <StatTile
              label="Lucro"
              value={formatCurrency(totals.profit, currency)}
              tone={totals.profit >= 0 ? "good" : "bad"}
            />
            <StatTile label="ROAS" value={formatRoas(roas)} tone={roas >= 1 ? "good" : "bad"} />
            <StatTile label="Compras" value={String(totals.purchases)} />
          </div>

          <div className="card">
            <h2 className="section-title">Gasto vs. receita por campanha</h2>
            {loadingCampaigns ? (
              <p className="muted">Carregando...</p>
            ) : (
              <SpendRevenueChart campaigns={campaigns} currency={currency} />
            )}
          </div>

          <div className="card">
            <h2 className="section-title">Campanhas</h2>
            {campaignsError && <div className="error-box">{campaignsError}</div>}
            {loadingCampaigns ? (
              <p className="muted">Carregando...</p>
            ) : (
              <CampaignsTable
                campaigns={campaigns}
                currency={currency}
                selectedId={selectedCampaign?.id ?? null}
                onSelect={setSelectedCampaign}
              />
            )}
          </div>

          {selectedCampaign && (
            <div className="card">
              <h2 className="section-title">Conjuntos de anúncios — {selectedCampaign.name}</h2>
              {loadingAdSets ? <p className="muted">Carregando...</p> : <AdSetsTable adSets={adSets} currency={currency} />}
            </div>
          )}

          <div className="card">
            <h2 className="section-title">Notificações no celular</h2>
            <PushOptIn />
          </div>
        </>
      )}

      <p className="footer-note">Dados via Facebook Marketing API · Receita calculada a partir do Pixel/Conversions API</p>
    </div>
  );
}
