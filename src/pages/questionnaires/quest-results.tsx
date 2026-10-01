import { useEffect } from 'react'
import { useParams } from 'react-router-dom'

import BackButton from '../../components/navigation/back-button'
import { useQuestionnaireDraft } from '../../hooks/use-questionnaire-draft'

function QuestResultsContent({ questionnaireId }: { questionnaireId: string }) {
  const { clearDraft } = useQuestionnaireDraft(questionnaireId)

  useEffect(() => {
    clearDraft()
  }, [clearDraft])

  return (
    <div className="questionnaire-draft">
      <BackButton fallbackPath="/questionnaires" />
      <p className="questionnaire-draft__status">Resultado concluído. O rascunho foi removido.</p>
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