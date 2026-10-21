import { BotaoVoltar } from '../../componentes/atomos/botaoVoltar'

const DetalheCheckin = () => {
  return (
    <div>
      <BotaoVoltar caminhoRetorno="/history/check-ins" />
      <div>CheckInDetail</div>
    </div>
  )
}

export { DetalheCheckin }
