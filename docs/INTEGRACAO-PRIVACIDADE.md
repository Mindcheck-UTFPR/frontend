# Privacidade — MIND-117

Não foi encontrada uma tela de privacidade na página atual de alta fidelidade (500:2). A interface usa a mesma tipografia, cartões e botões das páginas de perfil. A confirmação é uma seção da página, com foco acessível, sem janela modal improvisada.

Conectar ServicoPrivacidade ao sessionStore.request após MIND-79/80. O backend deve autenticar todos os pedidos, impedir acesso cruzado e duplicidade, devolver protocolo/estado/prazo real e fornecer download autenticado. Nenhuma URL ou prazo legal foi inventado. A tela não declara a conta apagada quando apenas recebeu um pedido. O adaptador provisório recusa as operações.

baixarExportacao deve devolver Blob JSON do servidor. O navegador usa URL temporária de objeto, revogada após o download; não há URL pública de dados de saúde nem persistência local pelo aplicativo. O arquivo baixado é uma ação explícita da pessoa. O backend precisa definir expiração, conteúdo e exclusão efetiva antes de habilitar a integração. Se a conta já tiver sido removida, o fluxo de sessão deve tratar a revogação conforme MIND-136/auth.
