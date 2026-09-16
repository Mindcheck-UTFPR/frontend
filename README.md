# Mindcheck Frontend

Aplicação React, TypeScript e Vite do Mindcheck, criada com abordagem mobile-first.

A mesma interface será usada no navegador e em um aplicativo Android empacotado com Capacitor, executando dentro de um WebView.

## Execução local

Requisitos: Node.js 22+ e pnpm 10+.

```bash
cp .env.example .env
pnpm install
pnpm dev
```

A aplicação estará em `http://localhost:5173`. Verificações: `pnpm lint`, `pnpm test` e `pnpm build`.

## Diretrizes mobile-first

- começar pelo menor tamanho de tela;
- usar áreas de toque confortáveis e formulários curtos;
- respeitar safe areas, teclado e botão voltar do Android;
- testar perda de conexão e abertura de links externos;
- evitar depender de recursos exclusivos do navegador desktop.

Consulte [Arquitetura do frontend](docs/ARCHITECTURE.md) e [Plano do aplicativo WebView](docs/MOBILE-WEBVIEW.md).

## Pipelines

`.github/workflows/`: `ci.yml` (lint, testes Vitest, build), `deploy.yml` (publica `dist/` no Nginx da VM) e `monitoring.yml` (`curl --fail` em `FRONTEND_URL` a cada 15 min).
