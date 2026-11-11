# Recuperação — MIND-101 / 120

Referência Figma: 574:266 e 574:313. Solicitação, espera para reenvio e redefinição estão implementadas. A redefinição usa ?token= na mesma rota /password-recovery; o token é removido da URL após leitura, mantido apenas em memória e nunca salvo ou registrado. O link final precisa ser confirmado em MIND-100.

ServicoRecuperacao é uma porta de integração, ainda sem endpoint. Conectar ao backend MIND-100 com http, sem autenticação. Solicitação deve devolver a mesma mensagem/tempo para contas existentes e inexistentes. Não propagar mensagem bruta de conta não encontrada. tentarNovamenteEm e ErroRecuperacao('limite', segundos) vêm do servidor; a contagem visual não substitui o limite no backend. Link inválido, expirado ou usado compartilham tratamento seguro. Senhas somente no formulário, limpas após sucesso.

O adaptador atual retorna indisponibilidade e nunca informa e-mail enviado ou senha alterada. Fluxos de sucesso são testados com serviço injetado. O backend deverá validar token, uso único, prazo, senha e revogar sessões conforme sua política.
