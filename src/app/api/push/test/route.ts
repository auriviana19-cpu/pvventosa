import { NextResponse } from "next/server";
import { broadcastNotification } from "@/lib/push";

export async function POST() {
  try {
    const result = await broadcastNotification({
      title: "Teste de notificação",
      body: "Se você recebeu isso, as notificações da sua dashboard estão funcionando.",
      tag: "test",
    });
    if (result.sent === 0) {
      return NextResponse.json(
        { error: "Nenhum dispositivo inscrito. Ative as notificações na dashboard primeiro." },
        { status: 400 }
      );
    }
    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
