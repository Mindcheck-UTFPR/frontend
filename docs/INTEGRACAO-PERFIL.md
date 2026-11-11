# Perfil — MIND-104 / 129

Referência atual: Figma 576:816 e 576:878. A visualização usa nome/e-mail reais de useSession; não cria data de cadastro fictícia. Edição, validação e formulário de senha preparados com ServicoPerfil. Escolher foto permanece desabilitado, pois não há armazenamento/contrato para avatar no modelo atual.

MIND-136 deverá conectar salvar e alterarSenha ao sessionStore.request, definir rotas e validação e devolver os dados efetivamente salvos. O frontend não assume que a alteração de e-mail está confirmada antes da resposta; caso o servidor exija confirmação, adaptar a resposta/estado antes de habilitar esse fluxo. Após salvar, a sessão consulta novamente /auth/me. Não persistir senhas nem considerar o estado local como autorização. Erros devem ser seguros e conflitos devem preservar os campos para correção.

Os dois formulários possuem confirmações próprias para evitar alteração de senha acidental ao editar nome. A confirmação adicional da nova senha protege contra erro de digitação. O adaptador provisório falha explicitamente sem enviar informações. Sucesso depende de resolução do serviço; testes usam injeção. Alteração real e avatar continuam pendentes. O link de privacidade é atendido pela entrega MIND-117.
