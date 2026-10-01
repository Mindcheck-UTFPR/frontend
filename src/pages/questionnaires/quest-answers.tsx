import { ChangeEvent } from 'react'
import { Link, useParams } from 'react-router-dom'

import { useQuestionnaireDraft } from '../../hooks/use-questionnaire-draft'

function normalizeTextValue(value: string | number | boolean | null | undefined) {
  if (value === undefined || value === null) {
    return ''
  }

  return String(value)
}

function QuestAnswersContent({ questionnaireId }: { questionnaireId: string }) {
  const { draft, updateAnswer } = useQuestionnaireDraft(questionnaireId)
  const questionValue = draft['question-1']

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    updateAnswer('question-1', event.target.value)
  }

  return (
    <div className="questionnaire-draft">
      <p className="questionnaire-draft__status">Rascunho salvo durante esta sessão.</p>
      <label htmlFor="question-1">Question 1</label>
      <input
        id="question-1"
        name="question-1"
        type="text"
        value={normalizeTextValue(questionValue)}
        onChange={handleChange}
      />
      <Link to={`/questionnaires/${questionnaireId}/review`}>
          Revisar respostas
      </Link>
    </div>
  )
}

const QuestAnswers = () => {
  const { questionnaireId } = useParams<{ questionnaireId: string }>()

  if (!questionnaireId) {
    return <div className="questionnaire-draft__status">Questionário indisponível.</div>
  }

  return <QuestAnswersContent questionnaireId={questionnaireId} />
}

export default QuestAnswers