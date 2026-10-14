# MIND-18 — cadastro, login e sessão

## Plano e dependências

Esta branch parte da PR de rotas #3, preservando suas telas e navegação. A PR original permanece aberta e NÃO deve ser mesclada por esta tarefa. A implementação usa PR empilhada, com a branch `feature/estrutura-rotas` como base. Novas correções dessa base devem ser incorporadas por merge normal antes da integração, nunca force-push na branch da equipe.

Sequência: revisar contrato → implementar formulários/validação → restaurar, renovar e revogar sessão → testar → revisar PRs → integrar/publicar somente após liberação das bases. Backend correspondente: PR empilhada MIND-18 sobre `feature/MIND-17-cadastro-login`.

## Contrato

- `GET /auth/config`: versão vigente e URL HTTPS dos termos. Sem URL, cadastro bloqueado; não inventar documento ou reaproveitar política de outro serviço.
- `POST /auth/cadastro`: nome, e-mail, senha, termosAceitos e termosVersao. Retorna usuario; encaminha ao login.
- `POST /auth/login` e `/auth/refresh`: accessToken, refreshToken, expiraEm (validade absoluta do refresh) e usuario.
- `GET /auth/me`: Authorization Bearer; verifica assinatura, expiração e sessão no banco.
- `POST /auth/logout`: refreshToken no corpo e accessToken em Authorization para revogar a sessão mesmo após rotação concorrente. Idempotente.

`VITE_API_URL` é `/api` por padrão. Produção usa API relativa no mesmo domínio HTTPS ou URL absoluta HTTPS.

## Sessão e falhas

Access token e usuário ficam em memória. Somente o refresh fica em sessionStorage da aba; senha nunca é persistida. Há deduplicação de refresh e restauração compatível com StrictMode, proteção contra respostas atrasadas e um único retry de 401. Verificação de /me no foco/retorno à aba e a cada minuto; nenhuma requisição de verificação se não houver sessão autenticada. Falha de verificação oculta conteúdo privado e oferece nova tentativa. O servidor continua sendo a autoridade em cada acesso.

Logout só informa sucesso depois do 204. Falha mantém a sessão e oferece repetir ou remover apenas a sessão local com aviso de revogação não confirmada. Logout remove apenas as chaves de sessão/rascunho do Mindcheck. O token fictício `localStorage.token` da base não autentica ninguém.

Refresh em sessionStorage é compatível com o contrato existente, mas continua exposto a XSS e pode ser copiado por navegadores ao duplicar abas. Rotação resolve consumo duplo sem prolongar validade; uma aba com refresh antigo precisará entrar novamente. Não inserir HTML não confiável. Esta entrega não substitui o hardening MIND-34.

## Figma e pendências

Inspeção local em 14/10/2026: arquivo MindCheck, página UI, seções LOGIN e CADASTRO; estados de credenciais inválidas, e-mail inválido e confirmação divergente. O wireframe exige dois aceites (uso e privacidade), mas o contrato atual registra um aceite versionado combinado. A reprodução visual, os dois documentos e a decisão de versionamento dependem da revisão UX/privacidade.

As skills figma-design-to-code e computer-use orientaram a inspeção. `get_design_context` e `get_screenshot` recusaram acesso de editor; portanto a implementação é funcional sobre os estilos existentes, NÃO uma reprodução fiel aprovada do Figma. Não foram extraídos ou substituídos assets. A imagem cruzada no wireframe é placeholder, não um asset fornecido.

Não foram encontrados termos aprovados nos três repositórios, no Jira pesquisado ou na busca pública. Não declarar o cadastro disponível em produção sem o PO publicar o documento e configurar TERMOS_URL na API.

Recuperação de senha permanece MIND-100/101, sem link que prometa envio inexistente. Check-ins/questionários/dashboard continuam fora desta entrega; as telas da PR de rotas são estruturas, não funcionalidades concluídas.

## Validação

`pnpm lint`, `pnpm test`, `pnpm build`. Testes de formulários cobrem validação, confirmação, versão dos termos, 409, 429, 500, configuração indisponível e envio único. Sessão cobre restauração, rede offline, expiração, 401 sem loop, logout, limpeza seletiva e respostas atrasadas.

Teste de navegador local com API de fixture: 360, 390 e 1280 px, cadastro, erro de login, retorno à rota privada, refresh, reload e logout. Não equivale à validação contra a VM. Deploy e aceite HTTPS pendentes porque as PRs base devem continuar abertas.
