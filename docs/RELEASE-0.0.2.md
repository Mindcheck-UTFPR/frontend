# Mindcheck 0.0.2

## Novidades

- Telas alinhadas ao Figma de alta fidelidade, com navegação para celular e computador.
- Controles próprios de humor, respostas Sim/Não, menus e calendário com escolha de dia, mês e ano.
- Layouts responsivos, animações que respeitam a preferência por movimento reduzido e melhorias de acessibilidade.
- Interfaces de check-in, histórico, recuperação de acesso, perfil, privacidade e questionários preparadas para integração.
- Estrutura Android com Capacitor e fontes otimizadas; calendário carregado sob demanda.

## Validação

- 52 testes automatizados, lint e build.
- Verificações de telas entre 320 e 1440px, navegação por teclado, toque e acessibilidade.

## Limitações conhecidas

As novas interfaces que dependem de endpoints ainda não entregues mostram a indisponibilidade de forma explícita. Esta release não conclui essas integrações de backend nem inclui APK Android. A demonstração com dados fictícios permanece apenas local e não faz parte do build publicado.

## Entregas

PRs #11–#19 do frontend: Android, alta fidelidade, check-in, histórico, recuperação, perfil, privacidade, questionários e refinamento de UX.
