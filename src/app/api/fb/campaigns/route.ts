import { NextRequest, NextResponse } from "next/server";
import { getConfig } from "@/lib/db";
import { FacebookApiError, getCampaignInsightsMap, getMetricsFor, listCampaigns, mergeMetrics } from "@/lib/facebook";
import type { CampaignRow, DatePreset } from "@/lib/types";

export async function GET(req: NextRequest) {
  const config = getConfig();
  if (!config.fbAccessToken) {
    return NextResponse.json({ error: "Configure seu Access Token do Facebook em /settings." }, { status: 400 });
  }
  const actId = req.nextUrl.searchParams.get("actId");
  const datePreset = (req.nextUrl.searchParams.get("datePreset") || "today") as DatePreset;
  if (!actId) {
    return NextResponse.json({ error: "Parâmetro actId é obrigatório." }, { status: 400 });
  }

  try {
    const [campaigns, insightsMap] = await Promise.all([
      listCampaigns(config.fbAccessToken, actId),
      getCampaignInsightsMap(config.fbAccessToken, actId, datePreset),
    ]);

    const rows: CampaignRow[] = campaigns.map((c) => ({
      ...c,
      metrics: getMetricsFor(c.id, insightsMap),
    }));

    const totals = mergeMetrics(rows.map((r) => r.metrics));

    return NextResponse.json({ campaigns: rows, totals });
  } catch (err) {
    const status = err instanceof FacebookApiError ? 502 : 500;
    return NextResponse.json({ error: (err as Error).message }, { status });
  }
}
