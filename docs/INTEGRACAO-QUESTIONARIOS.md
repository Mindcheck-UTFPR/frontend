# Respostas, retomada e revisão — MIND-105 / 132

## Implementação

1. Carregar uma execução da versão publicada, com perguntas e opções devolvidas pelo serviço.
2. Responder, avançar e voltar; validar obrigatórias e indicar progresso.
3. Salvar automaticamente após pausa e serializar gravações para impedir sobrescrita por resposta antiga.
4. Abrir mapa/revisão, voltar à pergunta e concluir só depois de salvar o progresso atual.
5. Usar exclusivamente o resultado devolvido pelo backend; o frontend não calcula pontuação nem cria faixa clínica.

Referências Figma: pergunta 578:1236 e revisão 579:1791. Diálogos usam Radix, com foco, Escape e bloqueio durante envio. Não foram copiados exemplos clínicos do desenho para um instrumento fictício. Todos os enunciados, opções, versão e obrigatoriedade vêm de ServicoExecucao.

## Integração posterior — MIND-20 / 137

Conectar carregar/salvarRascunho/concluir ao sessionStore.request. Definir endpoints, DTO e conflito de versão antes de habilitar. A API deve autorizar pessoa/avaliação, devolver versão imutável, impor reaplicação, aceitar rascunhos com opcionais e garantir idempotência da conclusão. Serializar no frontend não substitui controle de concorrência no servidor.

Execucao e EnvioRespostas são portas da interface, não contrato HTTP aprovado. O resultadoId vem do serviço; a página de resultado ainda depende da implementação própria. Não traduzir IDs de opções em pontos no cliente. Escala, polar e escolha única exigem opções explícitas; pergunta aberta permite limite de caracteres fornecido pelo servidor.

## Dados e falhas

Rascunhos novos ficam em memória, isolados por usuário/execução; são limpos ao sair ou trocar de conta. Não são gravados em storage nem no histórico de navegação. Retomada após recarregar depende do rascunho confirmado pelo backend. O hook antigo de sessionStorage não é mais usado pelas páginas de respostas/revisão; dados antigos não são migrados para outra pessoa. O teste existente de preservação do rascunho na página de resultado foi mantido.

Se o salvamento falhar, o progresso não é anunciado como salvo. Fechar o navegador com alterações pendentes pede confirmação nativa. Salvar e sair aguarda o serviço; sair sem salvar restaura somente as respostas já confirmadas. Nenhum sucesso é produzido pelo adaptador indisponível. Testes usam perguntas fictícias, sem dados pessoais reais.
