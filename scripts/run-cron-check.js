// Utilitário para disparar a verificação de regras/notificações a partir de
// um cron externo (crontab do servidor, GitHub Actions, etc).
// Uso: BASE_URL=https://sua-dashboard.com CRON_SECRET=xxx node scripts/run-cron-check.js
const baseUrl = process.env.BASE_URL || "http://localhost:3000";
const secret = process.env.CRON_SECRET;

if (!secret) {
  console.error("Defina a variável de ambiente CRON_SECRET.");
  process.exit(1);
}

fetch(`${baseUrl}/api/cron/check`, { headers: { "x-cron-secret": secret } })
  .then(async (res) => {
    const json = await res.json();
    console.log(res.status, JSON.stringify(json));
    if (!res.ok) process.exit(1);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
