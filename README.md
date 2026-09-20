# FB Ads Dashboard

Dashboard pessoal para acompanhar suas campanhas do Facebook Ads: contas de
anúncios, campanhas, conjuntos de anúncios, gasto, receita e lucro — com
notificações push direto no celular (instalando como PWA).

- **Stack:** Next.js (frontend + backend em um único app), SQLite local para
  guardar configurações/regras/inscrições push, `web-push` para as
  notificações.
- **Lucro:** calculado como `receita (valor de compra do Pixel/CAPI) - gasto`,
  por campanha e por conjunto de anúncios.
- **Notificações:** Web Push (padrão PWA) — funciona instalando a dashboard
  na tela inicial do celular.

---

## 1. Criar o App no Facebook (Meta for Developers)

1. Acesse https://developers.facebook.com/apps e clique em **Criar app**.
2. Escolha o tipo **Empresa** (Business) e siga os passos, dando um nome
   qualquer ao app (ex: "Minha Dashboard de Ads").
3. Dentro do app, adicione o produto **Marketing API**.
4. Vá em **Ferramentas > Explorador da API Graph** (Graph API Explorer):
   - Selecione o app que você criou.
   - Em "Permissões", marque `ads_read` (leitura de campanhas/insights) e
     `ads_management` caso queira também gerenciar campanhas no futuro.
   - Clique em **Gerar Token de Acesso** e autorize.
5. Esse token gerado no Explorer expira em ~1h. Para um token de longa
   duração (~60 dias, renovável), use o
   **Access Token Debugger** (Ferramentas > Depurador de Access Token):
   - Cole o token gerado, clique em **Estender Token de Acesso**.
   - Copie o token estendido — é esse que você vai colar na dashboard, em
     **Configurações**.
6. Para não precisar renovar a cada ~60 dias, o ideal a médio prazo é criar
   um **token de usuário do sistema (System User)** nas Configurações do
   Business Manager (Business Settings > Usuários do sistema), que pode ser
   gerado sem expiração. Isso é opcional para começar.
7. Sua conta de anúncios precisa ter o **Pixel do Facebook** (ou a
   **Conversions API**) instalado e enviando eventos de `Purchase` com
   `value` e `currency` — é esse valor que a dashboard usa para calcular a
   receita e o lucro. Sem isso, o gasto aparece normalmente, mas
   receita/lucro ficam zerados.

Você **não** precisa colocar o `account_id` manualmente: depois de salvar o
token em Configurações, a dashboard lista automaticamente todas as contas de
anúncios às quais o token tem acesso.

---

## 2. Rodar localmente

```bash
npm install
npm run generate-vapid   # gera as chaves de notificação push
```

Copie `.env.example` para `.env.local` e preencha:

- `DASHBOARD_PASSWORD`: senha para proteger o acesso à dashboard (usuário
  fixo `admin`). **Importante**: sem isso, qualquer pessoa com o link vê o
  gasto/receita das suas campanhas.
- `VAPID_PUBLIC_KEY` / `VAPID_PRIVATE_KEY`: cole a saída do comando acima.
- `VAPID_SUBJECT`: `mailto:seuemail@exemplo.com`.
- `CRON_SECRET`: qualquer string aleatória (ex: gere com
  `openssl rand -hex 16`).

```bash
npm run build
npm start        # ou `npm run dev` durante desenvolvimento
```

Abra `http://localhost:3000`, faça login com `admin` + a senha definida, e
vá em **Configurações** para colar o Access Token do Facebook.

---

## 3. Ativar as notificações no celular

Notificações push na web só funcionam com o site aberto via **HTTPS** (ou
`localhost`) e, no iPhone, apenas quando a dashboard está **instalada na
Tela de Início**:

- **Android (Chrome):** abra a dashboard, toque no menu (⋮) →
  **Adicionar à tela inicial**. Depois abra pelo ícone instalado e toque em
  **Ativar notificações neste dispositivo** (na Home ou em Configurações).
- **iPhone (Safari, iOS 16.4+):** toque em **Compartilhar** →
  **Adicionar à Tela de Início**. Abra o app pelo ícone (não pelo Safari) e
  então ative as notificações.

Use o botão **"Enviar notificação de teste"** em Configurações para
confirmar que chegou no celular.

---

## 4. Configurar as regras de alerta

Em **Configurações → Regras de alerta**, você pode criar:

- **Resumo diário**: envia gasto/receita/lucro/ROAS do dia num horário
  definido.
- **Alerta de gasto acima de**: dispara quando o gasto do dia passa de um
  valor.
- **Alerta de ROAS abaixo de**: dispara quando o retorno sobre o investimento
  do dia cai abaixo de um valor (ex: `1.5`).
- **Alerta de lucro negativo**: dispara quando o prejuízo do dia passa de um
  valor.

Cada regra pode ser restrita a uma conta específica ou aplicada a todas as
contas marcadas em "Contas monitoradas".

### Disparando as regras automaticamente

As regras só são avaliadas quando algo chama o endpoint
`GET /api/cron/check` (protegido pelo header `x-cron-secret` ou
`?secret=`). A forma mais simples é usar um cron externo gratuito, por
exemplo o [cron-job.org](https://cron-job.org): crie uma tarefa que chama,
a cada 15–30 minutos:

```
https://SUA-DASHBOARD.com/api/cron/check?secret=SEU_CRON_SECRET
```

Se você estiver rodando em um servidor próprio (VPS), pode usar o
`crontab` do sistema:

```
*/15 * * * * BASE_URL=https://SUA-DASHBOARD.com CRON_SECRET=xxx node /caminho/do/projeto/scripts/run-cron-check.js
```

---

## 5. Deploy

Este projeto usa **SQLite em arquivo local** (`data/app.sqlite`) para
guardar o token, as contas monitoradas, as regras e as inscrições de push.
Isso é o mais simples possível para uso pessoal, mas exige um host com
**disco persistente** — funções serverless "puras" (como a Vercel no plano
padrão) apagam o disco a cada novo deploy/instância, o que faria você
perder as configurações.

Opções simples que funcionam bem com esse modelo:

- **Railway** ou **Render** (planos com disco persistente / volume): conecte
  o repositório, defina as variáveis de ambiente da seção 2, configure um
  volume apontando para a pasta `data/`, e rode `npm run build && npm start`.
- **Um VPS pequeno** (ex: um droplet da DigitalOcean, ou até uma Raspberry
  Pi em casa): `git clone`, `npm install && npm run build`, rode com `pm2` ou
  um serviço `systemd`, e coloque um proxy reverso (Caddy/Nginx) com HTTPS
  na frente (obrigatório para notificações push).

Se no futuro você preferir hospedar 100% na Vercel, dá para trocar o SQLite
por um banco gerenciado (Vercel Postgres, Turso, etc.) — o código de acesso
a dados está isolado em `src/lib/db.ts`, então a troca fica localizada
nesse arquivo.

---

## Estrutura do projeto

```
src/app/               páginas (dashboard e configurações) e rotas de API
src/components/        componentes de UI (tabelas, gráfico, stat tiles, push)
src/lib/                facebook.ts (Graph API), db.ts (SQLite), push.ts (web-push)
public/manifest.json    manifesto do PWA
public/sw.js            service worker (recebe e exibe as notificações push)
scripts/                geração de chaves VAPID, ícones e disparo do cron
```
