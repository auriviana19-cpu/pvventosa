import { NextRequest, NextResponse } from "next/server";
import { getConfig } from "@/lib/db";
import { FacebookApiError, getAdSetInsightsMap, getMetricsFor, listAdSets, mergeMetrics } from "@/lib/facebook";
import type { AdSetRow, DatePreset } from "@/lib/types";

export async function GET(req: NextRequest) {
  const config = getConfig();
  if (!config.fbAccessToken) {
    return NextResponse.json({ error: "Configure seu Access Token do Facebook em /settings." }, { status: 400 });
  }
  const actId = req.nextUrl.searchParams.get("actId");
  const campaignId = req.nextUrl.searchParams.get("campaignId");
  const datePreset = (req.nextUrl.searchParams.get("datePreset") || "today") as DatePreset;
  if (!actId || !campaignId) {
    return NextResponse.json({ error: "Parâmetros actId e campaignId são obrigatórios." }, { status: 400 });
  }

  try {
    const [adSets, insightsMap] = await Promise.all([
      listAdSets(config.fbAccessToken, campaignId),
      getAdSetInsightsMap(config.fbAccessToken, actId, campaignId, datePreset),
    ]);

    const rows: AdSetRow[] = adSets.map((s) => ({
      ...s,
      metrics: getMetricsFor(s.id, insightsMap),
    }));

    const totals = mergeMetrics(rows.map((r) => r.metrics));

    return NextResponse.json({ adSets: rows, totals });
  } catch (err) {
    const status = err instanceof FacebookApiError ? 502 : 500;
    return NextResponse.json({ error: (err as Error).message }, { status });
  }
}
