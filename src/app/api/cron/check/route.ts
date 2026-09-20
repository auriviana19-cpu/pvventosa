import { NextRequest, NextResponse } from "next/server";
import { getConfig, listRules, markRuleFired } from "@/lib/db";
import { getNodeInsights, mergeMetrics } from "@/lib/facebook";
import { broadcastNotification } from "@/lib/push";
import { formatCurrency, formatRoas } from "@/lib/format";
import type { InsightMetrics, Rule } from "@/lib/types";

// Data de hoje no fuso de Brasília, formato YYYY-MM-DD.
function todayBR(): string {
  return new Date().toLocaleDateString("en-CA", { timeZone: "America/Sao_Paulo" });
}

function hourBR(): number {
  return Number(
    new Intl.DateTimeFormat("en-US", { timeZone: "America/Sao_Paulo", hour: "numeric", hour12: false }).format(
      new Date()
    )
  );
}

const MIN_SPEND_FOR_RATIO_RULES = 20; // evita alertas de ROAS/lucro falsos-positivos no início do dia

async function metricsForRule(token: string, accountIds: string[], rule: Rule): Promise<InsightMetrics> {
  if (rule.scopeId) {
    return getNodeInsights(token, rule.scopeId, "today");
  }
  // sem escopo definido: soma todas as contas configuradas
  const all = await Promise.all(accountIds.map((id) => getNodeInsights(token, id, "today")));
  return mergeMetrics(all);
}

export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  const provided = req.headers.get("x-cron-secret") || req.nextUrl.searchParams.get("secret");
  if (!secret || provided !== secret) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }

  const config = getConfig();
  if (!config.fbAccessToken || config.fbAdAccountIds.length === 0) {
    return NextResponse.json({ skipped: true, reason: "Nenhum token/conta configurados." });
  }

  const rules = listRules().filter((r) => r.enabled);
  const today = todayBR();
  const hour = hourBR();
  const fired: string[] = [];
  const errors: string[] = [];

  for (const rule of rules) {
    try {
      if (rule.type === "daily_summary") {
        if (hour < rule.threshold) continue;
        if (rule.lastFiredKey === today) continue;
        const m = await metricsForRule(config.fbAccessToken, config.fbAdAccountIds, rule);
        const scopeLabel = rule.scopeName ? ` (${rule.scopeName})` : "";
        await broadcastNotification({
          title: `Resumo do dia${scopeLabel}`,
          body: `Gasto: ${formatCurrency(m.spend)} · Receita: ${formatCurrency(m.revenue)} · Lucro: ${formatCurrency(
            m.profit
          )} · ROAS: ${formatRoas(m.roas)}`,
          tag: `rule-${rule.id}`,
        });
        markRuleFired(rule.id, today);
        fired.push(`daily_summary#${rule.id}`);
        continue;
      }

      const m = await metricsForRule(config.fbAccessToken, config.fbAdAccountIds, rule);
      const scopeLabel = rule.scopeName ? ` em ${rule.scopeName}` : "";

      if (rule.type === "spend_threshold") {
        if (m.spend >= rule.threshold && rule.lastFiredKey !== today) {
          await broadcastNotification({
            title: "Gasto acima do limite",
            body: `Gasto de hoje${scopeLabel}: ${formatCurrency(m.spend)} (limite: ${formatCurrency(rule.threshold)})`,
            tag: `rule-${rule.id}`,
          });
          markRuleFired(rule.id, today);
          fired.push(`spend_threshold#${rule.id}`);
        }
        continue;
      }

      if (m.spend < MIN_SPEND_FOR_RATIO_RULES) continue;

      if (rule.type === "roas_below") {
        if (m.roas < rule.threshold && rule.lastFiredKey !== today) {
          await broadcastNotification({
            title: "ROAS abaixo do esperado",
            body: `ROAS de hoje${scopeLabel}: ${formatRoas(m.roas)} (mínimo: ${formatRoas(rule.threshold)})`,
            tag: `rule-${rule.id}`,
          });
          markRuleFired(rule.id, today);
          fired.push(`roas_below#${rule.id}`);
        }
        continue;
      }

      if (rule.type === "profit_negative") {
        if (m.profit <= -Math.abs(rule.threshold) && rule.lastFiredKey !== today) {
          await broadcastNotification({
            title: "Prejuízo detectado",
            body: `Lucro de hoje${scopeLabel}: ${formatCurrency(m.profit)} (gasto ${formatCurrency(
              m.spend
            )}, receita ${formatCurrency(m.revenue)})`,
            tag: `rule-${rule.id}`,
          });
          markRuleFired(rule.id, today);
          fired.push(`profit_negative#${rule.id}`);
        }
        continue;
      }
    } catch (err) {
      errors.push(`regra#${rule.id}: ${(err as Error).message}`);
    }
  }

  return NextResponse.json({ checked: rules.length, fired, errors });
}
