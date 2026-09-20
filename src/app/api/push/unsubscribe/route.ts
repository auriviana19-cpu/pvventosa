import { NextRequest, NextResponse } from "next/server";
import { removeSubscription } from "@/lib/db";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const endpoint = body?.endpoint;
  if (typeof endpoint !== "string") {
    return NextResponse.json({ error: "endpoint é obrigatório." }, { status: 400 });
  }
  removeSubscription(endpoint);
  return NextResponse.json({ ok: true });
}
