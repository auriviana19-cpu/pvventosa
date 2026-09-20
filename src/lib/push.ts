import webpush from "web-push";
import { listSubscriptions, removeSubscription } from "./db";

let configured = false;

function ensureConfigured() {
  if (configured) return;
  const publicKey = process.env.VAPID_PUBLIC_KEY;
  const privateKey = process.env.VAPID_PRIVATE_KEY;
  const subject = process.env.VAPID_SUBJECT || "mailto:admin@example.com";
  if (!publicKey || !privateKey) {
    throw new Error(
      "VAPID_PUBLIC_KEY / VAPID_PRIVATE_KEY não configuradas. Rode `npm run generate-vapid`."
    );
  }
  webpush.setVapidDetails(subject, publicKey, privateKey);
  configured = true;
}

export interface NotificationPayload {
  title: string;
  body: string;
  url?: string;
  tag?: string;
}

/** Envia uma notificação para todos os dispositivos inscritos. Remove inscrições mortas. */
export async function broadcastNotification(payload: NotificationPayload): Promise<{ sent: number; removed: number }> {
  ensureConfigured();
  const subs = listSubscriptions();
  let sent = 0;
  let removed = 0;

  await Promise.all(
    subs.map(async (sub) => {
      try {
        await webpush.sendNotification(
          {
            endpoint: sub.endpoint,
            keys: { p256dh: sub.p256dh, auth: sub.auth },
          },
          JSON.stringify(payload)
        );
        sent++;
      } catch (err: any) {
        if (err?.statusCode === 404 || err?.statusCode === 410) {
          removeSubscription(sub.endpoint);
          removed++;
        }
      }
    })
  );

  return { sent, removed };
}
