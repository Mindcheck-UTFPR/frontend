# Deploy Oracle Cloud — MIND-86

O frontend é compilado no GitHub Actions e servido pelo Nginx da mesma VM da API. `VITE_API_URL=/api` mantém as chamadas na origem HTTPS do site. A configuração do Nginx e da infraestrutura está em `../backend/deploy/README.md` no workspace com os clones irmãos.

Configurar o environment `production` com os secrets `DEPLOY_HOST`, `DEPLOY_USER`, `DEPLOY_PATH`, `DEPLOY_SSH_KEY` e `DEPLOY_KNOWN_HOSTS`. Usar `/opt/mindcheck/frontend` como caminho. IP e chaves nunca entram no Git.

Variables do repositório: `DEPLOY_ENABLED=true`, `PUBLIC_URL=https://SEU_DOMINIO` e `VITE_API_URL=/api`. Habilitar somente após a VM e o certificado HTTPS estarem prontos.

Em push para `main` ou execução manual nessa branch, o job instala dependências fixadas, executa lint/testes/build, envia `dist` e publica em `releases/<SHA>`. A troca de `current` é atômica; um lock evita publicações concorrentes. A identidade SSH do servidor é validada com a chave fixada em `DEPLOY_KNOWN_HOSTS` e o endpoint HTTPS é verificado após a publicação.

Para rollback, publicar novamente um SHA cujo arquivo `frontend-SHA.tgz` continue no diretório do usuário: `bash deploy/publish.sh /opt/mindcheck/frontend SHA_COMPLETO`. Releases antigas podem ser removidas após confirmar que não são a atual nem a reserva para rollback.

Mudanças seguem PR para `develop`, revisão e release para `main`.
