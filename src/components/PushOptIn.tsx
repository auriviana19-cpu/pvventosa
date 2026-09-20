"use client";

import { useEffect, useState } from "react";

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) outputArray[i] = rawData.charCodeAt(i);
  return outputArray;
}

type Status = "unsupported" | "checking" | "subscribed" | "unsubscribed" | "denied";

export function PushOptIn() {
  const [status, setStatus] = useState<Status>("checking");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void check();
  }, []);

  async function check() {
    if (typeof window === "undefined" || !("serviceWorker" in navigator) || !("PushManager" in window)) {
      setStatus("unsupported");
      return;
    }
    if (Notification.permission === "denied") {
      setStatus("denied");
      return;
    }
    const reg = await navigator.serviceWorker.ready;
    const sub = await reg.pushManager.getSubscription();
    setStatus(sub ? "subscribed" : "unsubscribed");
  }

  async function subscribe() {
    setBusy(true);
    setError(null);
    try {
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        setStatus(permission === "denied" ? "denied" : "unsubscribed");
        return;
      }
      const keyRes = await fetch("/api/push/vapid-public-key");
      const keyJson = await keyRes.json();
      if (!keyRes.ok) throw new Error(keyJson.error || "Falha ao obter chave VAPID.");

      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(keyJson.publicKey) as BufferSource,
      });

      const res = await fetch("/api/push/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subscription: sub.toJSON() }),
      });
      if (!res.ok) throw new Error("Falha ao salvar a inscrição no servidor.");
      setStatus("subscribed");
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  }

  async function unsubscribe() {
    setBusy(true);
    setError(null);
    try {
      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.getSubscription();
      if (sub) {
        await fetch("/api/push/unsubscribe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ endpoint: sub.endpoint }),
        });
        await sub.unsubscribe();
      }
      setStatus("unsubscribed");
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  }

  if (status === "unsupported") {
    return (
      <p className="muted">
        Este navegador não suporta notificações push. No iPhone, adicione a dashboard à Tela de Início (compartilhar →
        Adicionar à Tela de Início) e abra por lá para ativar.
      </p>
    );
  }

  if (status === "denied") {
    return <p className="muted">Notificações bloqueadas pelo navegador. Habilite nas permissões do site para ativar.</p>;
  }

  return (
    <div>
      {status === "subscribed" ? (
        <>
          <p className="muted" style={{ marginBottom: 8 }}>
            ✅ Notificações ativadas neste dispositivo.
          </p>
          <button onClick={unsubscribe} disabled={busy}>
            Desativar notificações
          </button>
        </>
      ) : (
        <>
          <p className="muted" style={{ marginBottom: 8 }}>
            Ative para receber alertas de gasto, ROAS e o resumo diário direto no celular.
          </p>
          <button className="primary" onClick={subscribe} disabled={busy}>
            Ativar notificações neste dispositivo
          </button>
        </>
      )}
      {error && (
        <p className="muted" style={{ color: "var(--critical)", marginTop: 8 }}>
          {error}
        </p>
      )}
    </div>
  );
}
