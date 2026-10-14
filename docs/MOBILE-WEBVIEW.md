# Aplicativo Android com Capacitor/WebView

## Proposta

O projeto continuará sendo uma aplicação React. O Capacitor será usado para gerar um aplicativo Android que carrega os arquivos compilados pelo Vite dentro de um WebView.

## Etapas planejadas

1. Adicionar `@capacitor/core`, `@capacitor/cli` e `@capacitor/android`.
2. Criar a configuração do Capacitor apontando `webDir` para `dist`.
3. Gerar o projeto Android e executar `pnpm build` antes de sincronizar.
4. Testar em emulador e pelo menos um aparelho físico.
5. Validar teclado, safe areas, botão voltar, links externos e perda de conexão.
6. Documentar geração do APK de demonstração.

## Decisão importante

Para o MVP, o aplicativo deve empacotar os arquivos web compilados. Evitar carregar uma URL remota diretamente no WebView, porque isso piora disponibilidade e pode complicar a publicação. A API continua hospedada na Oracle Cloud e é acessada por HTTPS.

Não versionar o projeto Android gerado até o grupo revisar o tamanho, os arquivos necessários e a estratégia de build.
