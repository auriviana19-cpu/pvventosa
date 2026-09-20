import { NextResponse } from "next/server";
import { getConfig } from "@/lib/db";
import { FacebookApiError, listAdAccounts } from "@/lib/facebook";

export async function GET() {
  const config = getConfig();
  if (!config.fbAccessToken) {
    return NextResponse.json({ error: "Configure seu Access Token do Facebook em /settings." }, { status: 400 });
  }
  try {
    const accounts = await listAdAccounts(config.fbAccessToken);
    return NextResponse.json({ accounts });
  } catch (err) {
    const status = err instanceof FacebookApiError ? 502 : 500;
    return NextResponse.json({ error: (err as Error).message }, { status });
  }
}
