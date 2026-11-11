# Alta fidelidade — MIND-85

Referência atual: [UI - Alta Fidelidade](https://www.figma.com/design/n3v5N26ivCtFiJ7diBRdAI/MindCheck?node-id=500-2).

Telas consultadas: onboarding 573:164/206/244, login 573:277, cadastro 574:369 e início 576:646. Ilustrações, ícones de navegação e logo exportados do arquivo; fonte Inter distribuída localmente com licença OFL. Não há dependência de URLs temporárias do Figma ou de fontes externas em tempo de execução.

A navegação móvel usa cinco destinos na ordem do desenho; o perfil é acessível pelo avatar no início e pela navegação desktop. As outras páginas usam seus próprios cabeçalhos. A tela inicial não inventa contagem de dias, questionários em andamento nem afirma ausência de registros sem consultar a API: os textos dos cartões são neutros até o serviço de resumo ser integrado.

As telas usam fluxo e rolagem reais, sem altura fixa nem barra de status iOS desenhada. O aviso de caráter não diagnóstico e o documento de termos publicado foram preservados. Os dois aceites visuais são exigidos antes de enviar `termosAceitos: true` à API existente, com a versão retornada pelo servidor.

Verificações locais: onboarding/login/cadastro em 360, 390 e 1280px sem rolagem horizontal; navegação das três etapas; mostrar/ocultar senha; janela reduzida 390x500. Testes automatizados continuam cobrindo cadastro, validação, login duplicado, erros HTTP e sessão. O teclado físico e a versão publicada devem ser conferidos na aceitação da tarefa.
