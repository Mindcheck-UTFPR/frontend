# Refinamento de UX — MIND-85

## Problema e aceite

O foco do campo invisível criava um quadrado no humor; Sim/Não tinha uma ação de limpeza desproporcional. Datas e dropdowns exibiam controles visuais do navegador, e o desktop reaproveitava o formulário estreito do celular.

Aceite deste refinamento: preservar a alta fidelidade e os fluxos existentes; selecionar humor com anel circular; selecionar/trocar/desmarcar Sim/Não por toque; oferecer calendário e menus próprios com teclado; evitar overflow entre 320 e 1440px; adaptar painéis ao dispositivo; respeitar movimento reduzido; preservar contrato e estados de erro.

## Componentes

- CartoesEscolha envolve Radix Toggle Group: seleção exclusiva, navegação por setas/Espaço e desmarcação ao repetir a escolha. O opcional continua enviando null quando não respondido; não existe mais o link separado de limpeza.
- Selecao envolve Radix Select: lista com seleção visível, busca pelo teclado, posicionamento com detecção de colisão, Escape e retorno de foco. Nenhum select nativo fica visível.
- SeletorData mostra dia/mês/ano e carrega CalendarioConteudo só ao abrir. O calendário usa React Aria e CalendarDate, sem converter a data escolhida para UTC. Mês e ano têm menus próprios; dias permitem teclado e toque. Em celular o diálogo entra pela parte inferior; no desktop fica centralizado. A seleção fecha o painel e devolve foco ao campo.
- Dialogo centraliza o comportamento de foco e fechamento de diálogos Radix. O questionário usa o componente do Mindcheck em vez de importar o primitivo na feature.
- Experiencia e EntradaSuave centralizam as transições com Motion. As preferências de movimento reduzido são respeitadas tanto no CSS quanto nas animações React.

React Aria é usado na lacuna de calendário/data, para a qual não existe um primitivo Radix equivalente. O visual continua em CSS do projeto. As features não possuem lógica de calendário nem de foco de menus.

## Layout e movimento

Celular primeiro, com navegação inferior e áreas seguras. A partir de 768px há navegação lateral e cartões maiores; a partir de 1100px, campos de rotina e formulários relacionados podem usar colunas. Filtros ficam recolhidos até serem necessários, preservando a prioridade da lista. Datas aplicadas continuam na URL ao voltar do detalhe.

Há feedback de toque, hover somente para dispositivos que o oferecem, transição circular do humor, seleção animada dos cartões, entrada de páginas/questões/ilustrações, menus, painéis e confirmações. Nenhuma animação bloqueia o envio. Não há movimentos decorativos contínuos; em prefers-reduced-motion, as transições e animações CSS são removidas.

Os controles mantêm elementos e papéis acessíveis; personalizar aparência não remove rótulos, teclado, autocomplete nem o teclado adequado do celular. O foco por teclado permanece visível e específico do componente.

## Desempenho

As fontes Inter locais passaram de quatro TTF (1.302.640 bytes) para dois WOFF2 variáveis (133.324 bytes). O subconjunto latino usado pelo português tem 48.256 bytes. Mantida a licença OFL; não há consulta a fontes externas em produção.

O calendário é um módulo carregado sob demanda. Motion usa LazyMotion com domAnimation; os controles comuns não importam o calendário para a primeira renderização. Não houve alteração de autenticação, pontuação ou serviço do backend.

## Verificação

- 52 testes automatizados, incluindo selecionar/trocar/desmarcar e retorno com filtros.
- Lint e build.
- 49 combinações de sete telas com larguras 320/360/390/430/768/1024/1440px sem overflow horizontal.
- Fluxos de teclado/toque, mês/ano/dia, dropdown, foco preso, Escape e retorno ao campo.
- Diálogo centralizado no desktop e movimento reduzido.
- Axe em check-in, calendário e perfil, sem violações após ajuste de contraste. Isso não substitui avaliação completa com leitores de tela e dispositivos físicos.
- Regressão de cadastro/login, sessão, revisão de questionário e edição de check-in. Evidências em docs/evidencias/ux; dados de demonstração são fictícios.

## Dependências de código

Este refinamento parte da composição local das PRs 11–18. Elas continuam independentes e abertas. O commit-base da composição é 03f6ed414ff00ae417ed7edba43b97a823180675; os commits posteriores pertencem ao refinamento. Ao integrar as entregas anteriores em develop, atualizar a branch de refinamento antes do merge.

## Referências

- [Alta fidelidade atual](https://www.figma.com/design/n3v5N26ivCtFiJ7diBRdAI/MindCheck?node-id=500-2)
- [React Aria Calendar](https://react-aria.adobe.com/Calendar)
- [Radix Select](https://www.radix-ui.com/primitives/docs/components/select)
- [Radix Toggle Group](https://www.radix-ui.com/primitives/docs/components/toggle-group)
- [MotionConfig e movimento reduzido](https://motion.dev/docs/react-motion-config)
