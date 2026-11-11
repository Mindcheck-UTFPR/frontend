# Aplicativo Android com Capacitor/WebView

## Proposta

O projeto continuará sendo uma aplicação React. O Capacitor será usado para gerar um aplicativo Android que carrega os arquivos compilados pelo Vite dentro de um WebView.

## Executar — MIND-88

Requisitos: Node 22+, pnpm 10+, Android Studio 2025.2.1+, SDK 36 e o JDK fornecido pelo Android Studio. O aplicativo suporta Android API 24+. Veja os [requisitos oficiais](https://capacitorjs.com/docs/getting-started/environment-setup).

1. Execute `pnpm install --frozen-lockfile` e, na primeira vez, `pnpm android:init`.
2. Crie `.env.android.local` (ignorado) com `VITE_API_URL=https://seu-dominio.example/api`. Use a API publicada com HTTPS válido: `/api` relativo e localhost não funcionam no aplicativo empacotado.
3. Execute `pnpm android:sync` para compilar e copiar a interface. Depois execute `pnpm android:open`.
4. No Android Studio, aguarde o Gradle, selecione um emulador/aparelho e execute **Run**. Para gerar um APK debug, use **Build > Generate App Bundles or APKs > Generate APKs**.

A API precisa permitir `https://localhost` no CORS, além da origem web. Essa configuração pertence ao backend. Nenhum segredo JWT deve ser incluído no aplicativo.

## Validação pendente no dispositivo

- [ ] Abrir em emulador e aparelho físico.
- [ ] Entrar, sair e restaurar a sessão usando a API real.
- [ ] Conferir teclado, áreas seguras, rolagem e botão voltar (MIND-90).
- [ ] Conferir termos, links externos e recuperação de conexão.
- [ ] Anexar evidência da execução e do APK à revisão.

A geração e a sincronização não substituem a compilação do APK e o teste com SDK/JDK.

## Etapas de configuração

1. Adicionar `@capacitor/core`, `@capacitor/cli` e `@capacitor/android`.
2. Criar a configuração do Capacitor apontando `webDir` para `dist`.
3. Gerar o projeto Android e executar `pnpm build` antes de sincronizar.
4. Testar em emulador e pelo menos um aparelho físico.
5. Validar teclado, safe areas, botão voltar, links externos e perda de conexão.
6. Documentar geração do APK de demonstração.

## Decisão importante

Para o MVP, o aplicativo deve empacotar os arquivos web compilados. Evitar carregar uma URL remota diretamente no WebView, porque isso piora disponibilidade e pode complicar a publicação. A API continua hospedada na Oracle Cloud e é acessada por HTTPS.

O Capacitor 8.6 está configurado com `webDir: dist`, identificador `br.edu.utfpr.mindcheck`, esquema HTTPS e HTTP desabilitado. O build Android recusa API relativa ou sem HTTPS.

`android/` é gerado localmente e permanece ignorado até o grupo revisar o tamanho e a estratégia de build. Não versione APK, `local.properties`, keystore ou credenciais. Configurações necessárias ao produto devem ser automatizadas antes de editar arquivos gerados.
