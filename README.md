# Mindcheck Frontend

Interface **mobile-first** do Mindcheck (React + TypeScript + Vite). A mesma UI serve o navegador e o Android (Capacitor / WebView).

O Mindcheck ajuda universitários a registrar humor e rotina, responder questionários validados e ver um dashboard simples. **Não é diagnóstico.**

A regra de negócio, o PostgreSQL e o Prisma ficam no [backend](https://github.com/Mindcheck-UTFPR/backend). Este repositório só consome a API (em produção via HTTPS, `VITE_API_URL`).

## Arquitetura da interface

```text
Android WebView ou navegador
        →  Vite / React
        →  HTTPS  →  Nginx
                      /           /api
                 estáticos     Express + Prisma + PostgreSQL
```

Pastas previstas:

```text
src/
  app/
  features/
    auth/
    mood/              # check-in diário
    questionnaires/    # instrumentos (não calcula score no app)
    dashboard/
    history/
  shared/
    api/
    ui/
    lib/
```

A pontuação do questionário **não** roda no frontend. O app envia respostas; o backend soma e devolve faixa + texto orientativo.

Diretrizes: celular primeiro; check-in curto; estados de loading/erro/vazio/offline; sem afirmar causa ou diagnóstico nos gráficos; mínimo de dado no dispositivo.

## Execução local

Requisitos: Node.js 22+ e pnpm 10+ (no Windows, `npx pnpm@10.34.5 install` ou `npm run dev` se `pnpm` não estiver no PATH).

A API precisa estar no ar (`http://localhost:3000`). No backend: `docker compose up -d` ou `pnpm dev` + Postgres.

```bash
cp .env.example .env
pnpm install
pnpm dev
```

App: `http://localhost:5173`. Configure `VITE_API_URL` apontando para a API.

```bash
pnpm lint
pnpm test
pnpm build
```

## GitHub Actions

| Arquivo | Papel |
| --- | --- |
| `ci.yml` | lint, testes Vitest, build Vite |
| `deploy.yml` | publica a pasta `dist/` no Nginx da VM (segredos SSH) |
| `monitoring.yml` | `curl --fail` em `FRONTEND_URL` a cada 15 min |

## Documentação

- [Arquitetura do frontend](docs/ARCHITECTURE.md)
- [Plano do aplicativo WebView](docs/MOBILE-WEBVIEW.md)
