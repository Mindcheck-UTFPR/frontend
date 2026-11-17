# Check-in — MIND-24 / 61 / 65

Referências Figma: 577:1063 (formulário), 577:1456 (edição) e 577:1163 (confirmação).

A tela usa `sessionStore.request` para consultar `/checkins/hoje`, criar um registro com `POST /checkins` e atualizar os campos exibidos com `PATCH /checkins/:data`. O servidor determina a data em `America/Sao_Paulo`; o POST não envia data do dispositivo. O adaptador converte `observacao` nula para texto vazio e usa `podeEditar` retornado pela API. Em conflito de criação, consulta novamente o registro antes de permitir edição.

O histórico usa a API autenticada para listar por período, humor e página e para consultar detalhes por ID. Não há persistência das respostas do check-in no navegador. O sucesso só aparece após a confirmação do serviço.
