# MIND-50 Revisão da navegação e dos componentes

A PR #3 atende à revisão de 12/10/2026 preservando as URLs, as classes CSS e as chaves dos rascunhos já existentes.

## Organização

- `src/componentes/atomos`: `BotaoVoltar`.
- `src/componentes/moleculas`: `EstadoCarregamento`, `EstadoErro`, `EstadoVazio`.
- `src/componentes/organismos`: `Cabecalho`, `NavegacaoDesktop`, `NavegacaoMobile`.
- `src/componentes/modelos`: `LayoutPublico`, `LayoutPrivado`.
- As páginas continuam separadas por domínio em `src/pages`, com arquivos camelCase e componentes em português, exportados por nome.
- Rotas e estado de navegação ficam em `src/routes`; os rascunhos ficam em `src/hooks`.

O hook se chama `useRascunhoQuestionario` no arquivo `rascunhoQuestionarioUsar.ts`. O prefixo `use` é necessário para as regras de hooks do React e seu lint. Não foi desabilitada nenhuma regra para aceitar uma função sem esse prefixo. Identificadores definidos por APIs externas, como os parâmetros de rota, são preservados.

## Limites desta base

A proteção da PR #3 ainda é um placeholder com token local. A sessão verificada no backend pertence à continuação MIND-18 (frontend #6 e backend #5). Os placeholders não representam funcionalidades concluídas. Abrir a página de resultado não limpa respostas.

Esta revisão não publica em produção nem conclui MIND-50. Ainda são necessários nova revisão, aprovação, integração e aceite da navegação publicada por HTTPS, conforme a issue.
