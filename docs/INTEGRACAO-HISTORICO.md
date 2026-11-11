# Histórico de check-ins — MIND-28 / 71 / 72

Figma atual: 580:1755 e 580:1882. Implementadas listagem, filtros de data/humor, paginação, detalhe e retorno com filtros na URL. Sem dados de exemplo no produto. A resposta do serviço diferencia lista vazia e falha.

Ligar ServicoHistorico ao sessionStore.request após MIND-62. A API deve limitar os registros à pessoa autenticada, validar identificadores e datas, definir ordenação/paginação e retornar temProxima e podeEditar. Nenhum endpoint foi assumido. Detalhe não recebe dados privados via URL; recebe só o ID. O backend deve negar acesso a ID de outra pessoa. O adaptador atual informa indisponibilidade.

RegistroCheckin representa somente a leitura necessária à tela, não é um contrato HTTP final. Datas usam YYYY-MM-DD; sono é decimal em horas; campos não respondidos são null. Não inferir false de ausência. A autorização de edição vem do servidor. Revisão e integração reais permanecem pendentes.
