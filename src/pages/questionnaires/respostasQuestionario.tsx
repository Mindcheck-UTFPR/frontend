import { ChangeEvent } from 'react'
import { Link, useParams } from 'react-router-dom'

import { useRascunhoQuestionario } from '../../hooks/rascunhoQuestionarioUsar'

function normalizarTexto(value: string | number | boolean | null | undefined) {
  if (value === undefined || value === null) {
    return ''
  }

  return String(value)
}

function ConteudoRespostasQuestionario({ questionnaireId }: { questionnaireId: string }) {
  const { rascunho, atualizarResposta } = useRascunhoQuestionario(questionnaireId)
  const valorResposta = rascunho['question-1']

  const alterarResposta = (event: ChangeEvent<HTMLInputElement>) => {
    atualizarResposta('question-1', event.target.value)
  }

  return (
    <div className="questionnaire-draft">
      <p className="questionnaire-draft__status">Rascunho salvo durante esta sessão.</p>
      <label htmlFor="question-1">Question 1</label>
      <input
        id="question-1"
        name="question-1"
        type="text"
        value={normalizarTexto(valorResposta)}
        onChange={alterarResposta}
      />
      <Link to={`/questionnaires/${questionnaireId}/review`}>Revisar respostas</Link>
    </div>
  )
}

const RespostasQuestionario = () => {
  const { questionnaireId } = useParams<{ questionnaireId: string }>()

  if (!questionnaireId) {
    return <div className="questionnaire-draft__status">Questionário indisponível.</div>
  }

  return <ConteudoRespostasQuestionario questionnaireId={questionnaireId} />
}

export { RespostasQuestionario }
