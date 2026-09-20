import type { AdAccount, AdSet, Campaign, DatePreset, InsightMetrics, Level } from "./types";

const GRAPH_VERSION = "v21.0";
const GRAPH_BASE = `https://graph.facebook.com/${GRAPH_VERSION}`;

// Tipos de ação (Pixel / CAPI) que representam receita de compra, em ordem
// de preferência. "omni_purchase" combina web+app+offline quando disponível.
const PURCHASE_ACTION_TYPES = [
  "omni_purchase",
  "purchase",
  "offsite_conversion.fb_pixel_purchase",
  "onsite_web_purchase",
];

export class FacebookApiError extends Error {
  constructor(message: string, public status: number, public fbError?: unknown) {
    super(message);
    this.name = "FacebookApiError";
  }
}

async function fbGet<T = any>(path: string, token: string, params: Record<string, string> = {}): Promise<T> {
  const url = new URL(`${GRAPH_BASE}${path}`);
  url.searchParams.set("access_token", token);
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);

  const res = await fetch(url.toString(), { cache: "no-store" });
  const json = await res.json();
  if (!res.ok || json.error) {
    const msg = json?.error?.message || `Erro ${res.status} ao consultar a Graph API`;
    throw new FacebookApiError(msg, res.status, json?.error);
  }
  return json as T;
}

export async function listAdAccounts(token: string): Promise<AdAccount[]> {
  const data = await fbGet<{ data: any[] }>("/me/adaccounts", token, {
    fields: "account_id,name,currency,account_status",
    limit: "200",
  });
  return data.data.map((a) => ({
    id: `act_${a.account_id}`,
    accountId: a.account_id,
    name: a.name,
    currency: a.currency,
    status: a.account_status,
  }));
}

export async function listCampaigns(token: string, actId: string): Promise<Campaign[]> {
  const data = await fbGet<{ data: any[] }>(`/${actId}/campaigns`, token, {
    fields: "id,name,status,effective_status,objective,daily_budget,lifetime_budget",
    limit: "500",
  });
  return data.data.map((c) => ({
    id: c.id,
    name: c.name,
    status: c.status,
    effectiveStatus: c.effective_status,
    objective: c.objective ?? null,
    dailyBudget: c.daily_budget ? Number(c.daily_budget) / 100 : null,
    lifetimeBudget: c.lifetime_budget ? Number(c.lifetime_budget) / 100 : null,
  }));
}

export async function listAdSets(token: string, campaignId: string): Promise<AdSet[]> {
  const data = await fbGet<{ data: any[] }>(`/${campaignId}/adsets`, token, {
    fields: "id,name,status,effective_status,daily_budget,lifetime_budget,optimization_goal",
    limit: "500",
  });
  return data.data.map((s) => ({
    id: s.id,
    name: s.name,
    status: s.status,
    effectiveStatus: s.effective_status,
    dailyBudget: s.daily_budget ? Number(s.daily_budget) / 100 : null,
    lifetimeBudget: s.lifetime_budget ? Number(s.lifetime_budget) / 100 : null,
    optimizationGoal: s.optimization_goal ?? null,
  }));
}

function pickActionValue(entries: { action_type: string; value: string }[] | undefined): number {
  if (!entries || entries.length === 0) return 0;
  for (const type of PURCHASE_ACTION_TYPES) {
    const match = entries.find((e) => e.action_type === type);
    if (match) return Number(match.value) || 0;
  }
  return 0;
}

function emptyMetrics(): InsightMetrics {
  return { spend: 0, revenue: 0, profit: 0, roas: 0, purchases: 0, impressions: 0, clicks: 0, ctr: 0, cpc: 0 };
}

function rowToMetrics(row: any): InsightMetrics {
  const spend = Number(row.spend) || 0;
  const revenue = pickActionValue(row.action_values);
  const purchases = pickActionValue(row.actions);
  return {
    spend,
    revenue,
    profit: revenue - spend,
    roas: spend > 0 ? revenue / spend : 0,
    purchases,
    impressions: Number(row.impressions) || 0,
    clicks: Number(row.clicks) || 0,
    ctr: Number(row.ctr) || 0,
    cpc: Number(row.cpc) || 0,
  };
}

const INSIGHT_FIELDS =
  "spend,actions,action_values,impressions,clicks,ctr,cpc,campaign_id,adset_id,account_id";

/** Retorna métricas agregadas em nível de conta para o período informado. */
export async function getAccountInsights(
  token: string,
  actId: string,
  datePreset: DatePreset
): Promise<InsightMetrics> {
  const data = await fbGet<{ data: any[] }>(`/${actId}/insights`, token, {
    level: "account",
    fields: INSIGHT_FIELDS,
    date_preset: datePreset,
  });
  return data.data.length ? rowToMetrics(data.data[0]) : emptyMetrics();
}

/** Retorna um mapa campaignId -> métricas para todas as campanhas com atividade no período. */
export async function getCampaignInsightsMap(
  token: string,
  actId: string,
  datePreset: DatePreset
): Promise<Map<string, InsightMetrics>> {
  const data = await fbGet<{ data: any[] }>(`/${actId}/insights`, token, {
    level: "campaign",
    fields: INSIGHT_FIELDS,
    date_preset: datePreset,
    limit: "500",
  });
  const map = new Map<string, InsightMetrics>();
  for (const row of data.data) map.set(row.campaign_id, rowToMetrics(row));
  return map;
}

/** Retorna um mapa adsetId -> métricas para todos os conjuntos de uma campanha no período. */
export async function getAdSetInsightsMap(
  token: string,
  actId: string,
  campaignId: string,
  datePreset: DatePreset
): Promise<Map<string, InsightMetrics>> {
  const data = await fbGet<{ data: any[] }>(`/${actId}/insights`, token, {
    level: "adset",
    fields: INSIGHT_FIELDS,
    date_preset: datePreset,
    limit: "500",
    filtering: JSON.stringify([{ field: "campaign.id", operator: "EQUAL", value: campaignId }]),
  });
  const map = new Map<string, InsightMetrics>();
  for (const row of data.data) map.set(row.adset_id, rowToMetrics(row));
  return map;
}

/** Métricas de um nó qualquer (conta, campanha ou conjunto) direto pelo seu id. */
export async function getNodeInsights(token: string, nodeId: string, datePreset: DatePreset): Promise<InsightMetrics> {
  const data = await fbGet<{ data: any[] }>(`/${nodeId}/insights`, token, {
    fields: INSIGHT_FIELDS,
    date_preset: datePreset,
  });
  return data.data.length ? rowToMetrics(data.data[0]) : emptyMetrics();
}

export function mergeMetrics(list: InsightMetrics[]): InsightMetrics {
  const total = emptyMetrics();
  for (const m of list) {
    total.spend += m.spend;
    total.revenue += m.revenue;
    total.purchases += m.purchases;
    total.impressions += m.impressions;
    total.clicks += m.clicks;
  }
  total.profit = total.revenue - total.spend;
  total.roas = total.spend > 0 ? total.revenue / total.spend : 0;
  total.ctr = total.impressions > 0 ? (total.clicks / total.impressions) * 100 : 0;
  total.cpc = total.clicks > 0 ? total.spend / total.clicks : 0;
  return total;
}

export function getMetricsFor(id: string, map: Map<string, InsightMetrics>): InsightMetrics {
  return map.get(id) ?? emptyMetrics();
}

export type { Level };
