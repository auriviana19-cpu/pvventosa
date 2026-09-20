import { NextRequest, NextResponse } from "next/server";
import { addSubscription } from "@/lib/db";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const sub = body?.subscription;
  if (!sub?.endpoint || !sub?.keys?.p256dh || !sub?.keys?.auth) {
    return NextResponse.json({ error: "Inscrição push inválida." }, { status: 400 });
  }
  addSubscription(sub.endpoint, sub.keys.p256dh, sub.keys.auth);
  return NextResponse.json({ ok: true });
}
