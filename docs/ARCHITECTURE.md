# Arquitetura do frontend

## Objetivo

Construir uma única interface React mobile-first para navegador e aplicativo Android WebView. A interface consome a API. Pontuação, faixa e texto orientativo vêm do backend.

## Organização

A base de navegação da MIND-50 usa `src/componentes/{atomos,moleculas,organismos,modelos}` e páginas em `src/pages`, conforme a revisão da PR #3. Arquivos usam camelCase em português, componentes usam PascalCase e exportações são nomeadas. URLs, classes CSS e identificadores de APIs externas são preservados. Hooks mantêm o prefixo `use`, exigido pelo React.

O código de tela se divide em **features** (jornada e dados), **pages** (composição das telas) e **componentes** (peças reutilizáveis em design atômico). A MIND-18 usa a mesma biblioteca da navegação, sem duplicá-la em `shared/ui`.

```text
src/
  App.tsx                      # composição da aplicação e das jornadas
  routes/                      # rotas privadas e estado de navegação
  pages/                       # telas separadas por domínio
  features/
    auth/
  componentes/
    atomos/
    moleculas/
    organismos/
    modelos/
  shared/
    api/
```

A página de uma feature monta o fluxo, chama a API e preenche um template. Ela não redefine botão, campo, diálogo nem layout.

## Design atômico

Cada peça tem um único nível. O nível de baixo não conhece o de cima.

| Nível | Pasta | Responsabilidade | Exemplos |
| --- | --- | --- | --- |
| Átomo | `componentes/atomos` | Um controle, com estilo Mindcheck | `Botao`, `BotaoVoltar` |
| Molécula | `componentes/moleculas` | Poucos átomos com uma função | `CampoFormulario`, `EstadoVazio`, `AvisoErro` |
| Organismo | `componentes/organismos` | Bloco de interface ainda genérico | `Cabecalho`, `NavegacaoDesktop`, `NavegacaoMobile` |
| Modelo | `componentes/modelos` | Estrutura da tela, com espaços para conteúdo | `LayoutPrivado`, `ModeloAutenticacao` |
| Página | `pages/<domínio>` e composição da feature | Dados, cópia do domínio e navegação | check-in, questionário, dashboard |

Regras de dependência:

- Átomo importa só estilo e, quando precisar, um primitivo Radix. Não importa molécula, organismo, feature nem `shared/api`.
- Molécula importa átomos. Organismo importa átomos e moléculas. Template importa os níveis abaixo.
- Feature importa `componentes` e `shared/api`. Não importa `@radix-ui` direto.
- Peça usada por uma única jornada fica na feature, composta com átomos e moléculas. Se uma segunda feature precisar da mesma peça, ela sobe para organismo.

Estados de loading, vazio, erro e falta de conexão são moléculas ou organismos. A página usa essas peças; não copia o markup em cada tela.

## Radix UI

Comportamento acessível difícil (foco preso, teclado, diálogo, menu, abas, popover, seleção exclusiva, interruptor, dica) usa o primitivo correspondente em `@radix-ui/react-*`.

O átomo ou a molécula Mindcheck envolve o primitivo e aplica o visual: cor, tipo, espaçamento e alvo de toque no celular. O Radix não define aparência.

Controle com comportamento nativo suficiente (`button`, `a`, campo de texto) continua elemento HTML estilizado no átomo.

Instalar só o primitivo que a tela precisa. A feature importa o componente Mindcheck, nunca o pacote Radix.

## Regras de interface

- Projetar primeiro para celular: toque confortável, texto legível, ação principal ao alcance de uma mão.
- Manter o check-in diário curto. Check-in de humor não é questionário.
- Prever loading, erro, vazio, falta de conexão, conteúdo extremo e permissão negada.
- Exibir faixa e texto devolvidos pela API. Não calcular score no frontend e não afirmar diagnóstico ou causalidade.
- Fornecer alternativa textual para gráficos.
- Guardar o mínimo possível no dispositivo.
- Abrir links externos fora do WebView quando apropriado.

O endereço da API continua configurável por `VITE_API_URL`. Em produção, o aplicativo acessa a API somente por HTTPS.
