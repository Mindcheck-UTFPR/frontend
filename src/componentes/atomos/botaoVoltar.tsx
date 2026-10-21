import { useLocation, useNavigate } from 'react-router-dom'

import { possuiEstadoNavegacaoInterna } from '../../routes/estadoNavegacao'

type PropriedadesBotaoVoltar = {
  caminhoRetorno: string
  rotulo?: string
}

function BotaoVoltar({ caminhoRetorno, rotulo = 'Voltar' }: PropriedadesBotaoVoltar) {
  const navegar = useNavigate()
  const localizacao = useLocation()

  const voltar = () => {
    if (possuiEstadoNavegacaoInterna(localizacao.state)) {
      navegar(-1)
      return
    }

    navegar(caminhoRetorno, { replace: true })
  }

  return (
    <button type="button" className="back-button" aria-label={rotulo} onClick={voltar}>
      {rotulo}
    </button>
  )
}

export { BotaoVoltar }
