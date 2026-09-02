# Arquitetura do frontend

## Objetivo

Construir uma única interface React mobile-first para navegador e aplicativo Android WebView.

## Organização sugerida

```text
src/
  app/
  features/
    auth/
    mood/
    questionnaires/
    dashboard/
    history/
    referrals/
    admin/
  shared/
    api/
    ui/
    lib/
```

## Regras de interface

- projetar primeiro para celular;
- manter check-in diário curto;
- prever loading, erro, vazio e falta de conexão;
- não afirmar diagnóstico ou causalidade no dashboard;
- fornecer alternativa textual para gráficos;
- guardar o mínimo possível no dispositivo;
- abrir links externos fora do WebView quando apropriado.

O endereço da API deve continuar configurável por `VITE_API_URL`. Em produção, o aplicativo acessa a API somente por HTTPS.
