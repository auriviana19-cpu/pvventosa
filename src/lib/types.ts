export interface AdAccount {
  id: string; // "act_123456"
  accountId: string; // "123456"
  name: string;
  currency: string;
  status: number;
}

export interface Campaign {
  id: string;
  name: string;
  status: string;
  effectiveStatus: string;
  objective: string | null;
  dailyBudget: number | null;
  lifetimeBudget: number | null;
}

export interface AdSet {
  id: string;
  name: string;
  status: string;
  effectiveStatus: string;
  dailyBudget: number | null;
  lifetimeBudget: number | null;
  optimizationGoal: string | null;
}

export interface InsightMetrics {
  spend: number;
  revenue: number;
  profit: number;
  roas: number;
  purchases: number;
  impressions: number;
  clicks: number;
  ctr: number;
  cpc: number;
}

export type Level = "account" | "campaign" | "adset";

export type DatePreset =
  | "today"
  | "yesterday"
  | "last_7d"
  | "last_14d"
  | "last_30d"
  | "this_month"
  | "last_month";

export interface CampaignRow extends Campaign {
  metrics: InsightMetrics;
}

export interface AdSetRow extends AdSet {
  metrics: InsightMetrics;
}

export type RuleType =
  | "daily_summary"
  | "spend_threshold"
  | "roas_below"
  | "profit_negative";

export interface Rule {
  id: number;
  type: RuleType;
  enabled: boolean;
  scopeLevel: "account" | "campaign";
  scopeId: string | null; // null = toda a conta / todas as campanhas
  scopeName: string | null;
  threshold: number; // significado depende do tipo (ver RULE_LABELS)
  lastFiredAt: string | null;
  lastFiredKey: string | null; // usado p/ daily_summary (data) e cooldown
}

export interface AppConfig {
  fbAccessToken: string | null;
  fbAdAccountIds: string[]; // ex: ["act_123456"]
}

export interface PushSubscriptionRecord {
  id: number;
  endpoint: string;
  p256dh: string;
  auth: string;
  createdAt: string;
}
