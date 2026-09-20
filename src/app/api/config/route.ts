import { NextRequest, NextResponse } from "next/server";
import { getConfig, saveConfig } from "@/lib/db";

export async function GET() {
  const config = getConfig();
  return NextResponse.json({ config });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const fbAccessToken: string = typeof body.fbAccessToken === "string" ? body.fbAccessToken.trim() : "";
  const fbAdAccountIds: string[] = Array.isArray(body.fbAdAccountIds)
    ? body.fbAdAccountIds.filter((s: unknown) => typeof s === "string")
    : [];

  saveConfig({
    fbAccessToken: fbAccessToken || null,
    fbAdAccountIds,
  });

  return NextResponse.json({ ok: true });
}
