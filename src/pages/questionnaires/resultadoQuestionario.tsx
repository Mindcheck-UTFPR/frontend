import { useParams } from 'react-router-dom'

import { BotaoVoltar } from '../../componentes/atomos/botaoVoltar'

function ConteudoResultadoQuestionario({ questionnaireId }: { questionnaireId: string }) {
  return (
    <div className="questionnaire-draft">
      <BotaoVoltar caminhoRetorno="/questionnaires" />
      <p className="questionnaire-draft__status">
        Resultado indisponível: o envio para a API ainda não foi implementado. Seu rascunho foi
        preservado.
      </p>
      <p>Questionário: {questionnaireId}</p>
      <div>QuestResults</div>
    </div>
  )
}

const ResultadoQuestionario = () => {
  const { questionnaireId } = useParams<{ questionnaireId: string }>()

  if (!questionnaireId) {
    return <div className="questionnaire-draft__status">Questionário indisponível.</div>
  }

  return <ConteudoResultadoQuestionario questionnaireId={questionnaireId} />
}

export { ResultadoQuestionario }
