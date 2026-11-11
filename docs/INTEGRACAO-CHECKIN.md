# Check-in — MIND-24 / 61 / 65

Referências Figma: 577:1063 (formulário), 577:1456 (edição), 577:1163 (confirmação). Formulário pronto para um serviço autenticado por meio de ServicoCheckin; o adaptador atual recusa operações, sem enviar nem armazenar dados. Nenhuma URL de API foi inventada.

MIND-23/60 devem ligar buscarHoje e salvar ao sessionStore.request, com a resposta CheckinSalvo e erro seguro. A leitura deve distinguir ausência de registro de erro. A API define autorização, unicidade por usuário/data e podeEditar; conflito deve recuperar o registro existente antes de permitir edição. Datas são locais (YYYY-MM-DD), sono é número de horas, booleans opcionais são null quando não respondidos e observação tem até 280 caracteres. Não se deve derivar intensidade do humor: o contrato desse campo obrigatório no modelo ainda precisa ser definido no backend. Pontuação/diagnóstico não fazem parte do check-in.

Não há persistência de respostas no navegador. O formulário mantém os dados apenas enquanto aberto; sucesso é exibido somente após resolução do serviço. Testes usam implementação injetada para verificar envio, edição, erro e proteção contra duplicidade. Integração e aceitação final continuam pendentes.
