import { NextRequest, NextResponse } from "next/server";
import { deleteRule, setRuleEnabled } from "@/lib/db";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const id = Number(params.id);
  const body = await req.json();
  if (typeof body.enabled === "boolean") {
    setRuleEnabled(id, body.enabled);
  }
  return NextResponse.json({ ok: true });
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  deleteRule(Number(params.id));
  return NextResponse.json({ ok: true });
}
