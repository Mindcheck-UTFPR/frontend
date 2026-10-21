import { Link, useParams } from 'react-router-dom'

import { BotaoVoltar } from '../../componentes/atomos/botaoVoltar'
import { useRascunhoQuestionario } from '../../hooks/rascunhoQuestionarioUsar'

function ConteudoRevisaoQuestionario({ questionnaireId }: { questionnaireId: string }) {
  const { rascunho } = useRascunhoQuestionario(questionnaireId)
  const respostas = Object.entries(rascunho)

  return (
    <div className="questionnaire-draft">
      <BotaoVoltar caminhoRetorno={`/questionnaires/${questionnaireId}/answer`} />
      <p className="questionnaire-draft__status">Resumo do rascunho salvo nesta sessão.</p>
      {respostas.length === 0 ? (
        <p>Nenhuma resposta salva ainda.</p>
      ) : (
        <ul>
          {respostas.map(([idPergunta, value]) => (
            <li key={idPergunta}>
              {idPergunta}: {String(value)}
            </li>
          ))}
        </ul>
      )}
      <Link to={`/questionnaires/${questionnaireId}/result`}>
        Consultar resultado (em desenvolvimento)
      </Link>
    </div>
  )
}

const RevisaoQuestionario = () => {
  const { questionnaireId } = useParams<{ questionnaireId: string }>()

  if (!questionnaireId) {
    return <div className="questionnaire-draft__status">Questionário indisponível.</div>
  }

  return <ConteudoRevisaoQuestionario questionnaireId={questionnaireId} />
}

export { RevisaoQuestionario }
