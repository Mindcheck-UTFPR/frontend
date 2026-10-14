import { useParams } from 'react-router-dom'

import BackButton from '../../components/navigation/back-button'

function QuestResultsContent({ questionnaireId }: { questionnaireId: string }) {
  return (
    <div className="questionnaire-draft">
      <BackButton fallbackPath="/questionnaires" />
      <p className="questionnaire-draft__status">Resultado indisponível: o envio para a API ainda não foi implementado. Seu rascunho foi preservado.</p>
      <p>Questionário: {questionnaireId}</p>
      <div>QuestResults</div>
    </div>
  )
}

const QuestResults = () => {
  const { questionnaireId } = useParams<{ questionnaireId: string }>()

  if (!questionnaireId) {
    return <div className="questionnaire-draft__status">Questionário indisponível.</div>
  }

  return <QuestResultsContent questionnaireId={questionnaireId} />
}

export default QuestResults
