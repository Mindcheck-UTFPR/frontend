import { useCallback, useEffect, useMemo, useState } from 'react'

export type ValorRespostaQuestionario = string | number | boolean | null

export type RascunhoQuestionario = Record<string, ValorRespostaQuestionario>

const PREFIXO_RASCUNHO_QUESTIONARIO = 'mindcheck:questionnaire:'
const SUFIXO_RASCUNHO_QUESTIONARIO = ':draft'

function estaNoNavegador() {
  return typeof window !== 'undefined' && typeof window.sessionStorage !== 'undefined'
}

function obterChaveRascunhoQuestionario(questionnaireId: string) {
  return `${PREFIXO_RASCUNHO_QUESTIONARIO}${questionnaireId}${SUFIXO_RASCUNHO_QUESTIONARIO}`
}

function validarValorRespostaQuestionario(value: unknown): value is ValorRespostaQuestionario {
  return (
    typeof value === 'string' ||
    typeof value === 'number' ||
    typeof value === 'boolean' ||
    value === null
  )
}

function lerRascunhoQuestionario(questionnaireId: string): RascunhoQuestionario {
  if (!estaNoNavegador()) {
    return {}
  }

  try {
    const rascunhoSalvo = window.sessionStorage.getItem(
      obterChaveRascunhoQuestionario(questionnaireId),
    )

    if (!rascunhoSalvo) {
      return {}
    }

    const rascunhoInterpretado: unknown = JSON.parse(rascunhoSalvo)

    if (
      !rascunhoInterpretado ||
      typeof rascunhoInterpretado !== 'object' ||
      Array.isArray(rascunhoInterpretado)
    ) {
      return {}
    }

    const respostasRascunho = Object.entries(rascunhoInterpretado)

    if (!respostasRascunho.every(([, value]) => validarValorRespostaQuestionario(value))) {
      return {}
    }

    return rascunhoInterpretado as RascunhoQuestionario
  } catch {
    return {}
  }
}

function salvarRascunhoQuestionario(questionnaireId: string, rascunho: RascunhoQuestionario) {
  if (!estaNoNavegador()) {
    return
  }

  try {
    const chaveArmazenamento = obterChaveRascunhoQuestionario(questionnaireId)

    if (Object.keys(rascunho).length === 0) {
      window.sessionStorage.removeItem(chaveArmazenamento)
      return
    }

    window.sessionStorage.setItem(chaveArmazenamento, JSON.stringify(rascunho))
  } catch {
    // Se o armazenamento da sessão falhar, manter o rascunho em memória.
  }
}

// Formulários como perfil, cadastro e senha podem reutilizar um padrão parecido quando
// o escopo exigir, sem armazenar credenciais ou dados sensíveis em storage.
export function useRascunhoQuestionario(questionnaireId: string) {
  const chaveArmazenamento = useMemo(
    () => obterChaveRascunhoQuestionario(questionnaireId),
    [questionnaireId],
  )
  const [rascunho, definirRascunho] = useState<RascunhoQuestionario>(() =>
    lerRascunhoQuestionario(questionnaireId),
  )

  useEffect(() => {
    salvarRascunhoQuestionario(questionnaireId, rascunho)
  }, [rascunho, questionnaireId, chaveArmazenamento])

  const atualizarResposta = useCallback((idPergunta: string, value: ValorRespostaQuestionario) => {
    definirRascunho((rascunhoAtual) => {
      if (rascunhoAtual[idPergunta] === value) {
        return rascunhoAtual
      }

      return {
        ...rascunhoAtual,
        [idPergunta]: value,
      }
    })
  }, [])

  const limparRascunho = useCallback(() => {
    salvarRascunhoQuestionario(questionnaireId, {})
    definirRascunho({})
  }, [questionnaireId])

  return {
    rascunho,
    atualizarResposta,
    limparRascunho,
  }
}

export { obterChaveRascunhoQuestionario }
