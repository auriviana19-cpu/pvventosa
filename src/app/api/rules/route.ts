import { NextRequest, NextResponse } from "next/server";
import { addRule, listRules } from "@/lib/db";
import type { RuleType } from "@/lib/types";

const VALID_TYPES: RuleType[] = ["daily_summary", "spend_threshold", "roas_below", "profit_negative"];

export async function GET() {
  return NextResponse.json({ rules: listRules() });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const type = body.type as RuleType;
  if (!VALID_TYPES.includes(type)) {
    return NextResponse.json({ error: "Tipo de regra inválido." }, { status: 400 });
  }
  const scopeLevel = body.scopeLevel === "campaign" ? "campaign" : "account";
  const scopeId = typeof body.scopeId === "string" && body.scopeId ? body.scopeId : null;
  const scopeName = typeof body.scopeName === "string" && body.scopeName ? body.scopeName : null;
  const threshold = Number(body.threshold);
  if (Number.isNaN(threshold)) {
    return NextResponse.json({ error: "Valor (threshold) inválido." }, { status: 400 });
  }

  const rule = addRule({ type, scopeLevel, scopeId, scopeName, threshold });
  return NextResponse.json({ rule });
}
