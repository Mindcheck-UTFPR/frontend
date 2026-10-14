# Arquitetura do frontend

## Objetivo

Construir uma única interface React mobile-first para navegador e aplicativo Android WebView. A interface consome a API. Pontuação, faixa e texto orientativo vêm do backend.

## Organização

O código de tela se divide em duas camadas: **features** (jornada e dados) e **`shared/ui`** (peças visuais reutilizáveis, em design atômico).

```text
src/
  app/                         # rotas, providers, casca da aplicação
  features/
    auth/
    mood/                      # check-in diário
    questionnaires/            # envia respostas; exibe a faixa devolvida
    dashboard/
    history/
    referrals/
    admin/
  shared/
    api/
    lib/
    ui/
      atoms/
      molecules/
      organisms/
      templates/
```

A página de uma feature monta o fluxo, chama a API e preenche um template. Ela não redefine botão, campo, diálogo nem layout.

## Design atômico

Cada peça tem um único nível. O nível de baixo não conhece o de cima.

| Nível | Pasta | Responsabilidade | Exemplos |
| --- | --- | --- | --- |
| Átomo | `shared/ui/atoms` | Um controle, com estilo Mindcheck | `Button`, `TextInput`, `Label`, `Icon` |
| Molécula | `shared/ui/molecules` | Poucos átomos com uma função | `FormField`, `EmptyState`, `ErrorNotice` |
| Organismo | `shared/ui/organisms` | Bloco de interface ainda genérico | `AppBar`, `ConfirmDialog`, `ResultCard` |
| Template | `shared/ui/templates` | Estrutura da tela, com espaços para conteúdo | `MobilePage`, `AuthShell` |
| Página | `features/<domínio>` | Dados, cópia do domínio e navegação | check-in, questionário, dashboard |

Regras de dependência:

- Átomo importa só estilo e, quando precisar, um primitivo Radix. Não importa molécula, organismo, feature nem `shared/api`.
- Molécula importa átomos. Organismo importa átomos e moléculas. Template importa os níveis abaixo.
- Feature importa `shared/ui` e `shared/api`. Não importa `@radix-ui` direto.
- Peça usada por uma única jornada fica na feature, composta com átomos e moléculas. Se uma segunda feature precisar da mesma peça, ela sobe para organismo.

Estados de loading, vazio, erro e falta de conexão são moléculas ou organismos. A página usa essas peças; não copia o markup em cada tela.

## Radix UI

Comportamento acessível difícil (foco preso, teclado, diálogo, menu, abas, popover, seleção exclusiva, interruptor, dica) usa o primitivo correspondente em `@radix-ui/react-*`.

O átomo ou a molécula Mindcheck envolve o primitivo e aplica o visual: cor, tipo, espaçamento e alvo de toque no celular. O Radix não define aparência.

Controle com comportamento nativo suficiente (`button`, `a`, campo de texto) continua elemento HTML estilizado no átomo.

Instalar só o primitivo que a tela precisa. A feature importa o componente Mindcheck (`ConfirmDialog`, `Tabs`), nunca o pacote Radix.

## Regras de interface

- Projetar primeiro para celular: toque confortável, texto legível, ação principal ao alcance de uma mão.
- Manter o check-in diário curto. Check-in de humor não é questionário.
- Prever loading, erro, vazio, falta de conexão, conteúdo extremo e permissão negada.
- Exibir faixa e texto devolvidos pela API. Não calcular score no frontend e não afirmar diagnóstico ou causalidade.
- Fornecer alternativa textual para gráficos.
- Guardar o mínimo possível no dispositivo.
- Abrir links externos fora do WebView quando apropriado.

O endereço da API continua configurável por `VITE_API_URL`. Em produção, o aplicativo acessa a API somente por HTTPS.
