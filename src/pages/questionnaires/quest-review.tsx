import { Link, useParams } from 'react-router-dom'

import BackButton from '../../components/navigation/back-button'
import { useQuestionnaireDraft } from '../../hooks/use-questionnaire-draft'

function QuestReviewContent({ questionnaireId }: { questionnaireId: string }) {
  const { draft } = useQuestionnaireDraft(questionnaireId)
  const entries = Object.entries(draft)

  return (
    <div className="questionnaire-draft">
      <BackButton fallbackPath={`/questionnaires/${questionnaireId}/answer`} />
      <p className="questionnaire-draft__status">Resumo do rascunho salvo nesta sessão.</p>
      {entries.length === 0 ? (
        <p>Nenhuma resposta salva ainda.</p>
      ) : (
        <ul>
          {entries.map(([questionId, value]) => (
            <li key={questionId}>
              {questionId}: {String(value)}
            </li>
          ))}
        </ul>
      )}
      <Link to={`/questionnaires/${questionnaireId}/result`}>
         Finalizar questionário
      </Link>
    </div>
  )
}

const QuestReview = () => {
  const { questionnaireId } = useParams<{ questionnaireId: string }>()

  if (!questionnaireId) {
    return <div className="questionnaire-draft__status">Questionário indisponível.</div>
  }

  return <QuestReviewContent questionnaireId={questionnaireId} />
}

export default QuestReview