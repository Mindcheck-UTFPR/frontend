import { Link, useParams } from 'react-router-dom'

const QuestInstructions = () => {
  const { questionnaireId } = useParams()

  return (
    <section>
      <h1>Instruções do questionário</h1>

      <Link to={`/questionnaires/${questionnaireId}/answer`}>
        Começar questionário
      </Link>
    </section>
  )
}

export default QuestInstructions