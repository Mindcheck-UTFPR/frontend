import { useCallback, useEffect, useMemo, useState } from 'react'

export type QuestionnaireAnswerValue = string | number | boolean | null

export type QuestionnaireDraft = Record<string, QuestionnaireAnswerValue>

const QUESTIONNAIRE_DRAFT_PREFIX = 'mindcheck:questionnaire:'
const QUESTIONNAIRE_DRAFT_SUFFIX = ':draft'

function isBrowserEnvironment() {
  return typeof window !== 'undefined' && typeof window.sessionStorage !== 'undefined'
}

function getQuestionnaireDraftStorageKey(questionnaireId: string) {
  return `${QUESTIONNAIRE_DRAFT_PREFIX}${questionnaireId}${QUESTIONNAIRE_DRAFT_SUFFIX}`
}

function isQuestionnaireAnswerValue(value: unknown): value is QuestionnaireAnswerValue {
  return (
    typeof value === 'string' ||
    typeof value === 'number' ||
    typeof value === 'boolean' ||
    value === null
  )
}

function readQuestionnaireDraft(questionnaireId: string): QuestionnaireDraft {
  if (!isBrowserEnvironment()) {
    return {}
  }

  try {
    const storedDraft = window.sessionStorage.getItem(
      getQuestionnaireDraftStorageKey(questionnaireId),
    )

    if (!storedDraft) {
      return {}
    }

    const parsedDraft: unknown = JSON.parse(storedDraft)

    if (
      !parsedDraft ||
      typeof parsedDraft !== 'object' ||
      Array.isArray(parsedDraft)
    ) {
      return {}
    }

    const draftEntries = Object.entries(parsedDraft)

    if (!draftEntries.every(([, value]) => isQuestionnaireAnswerValue(value))) {
      return {}
    }

    return parsedDraft as QuestionnaireDraft
  } catch {
    return {}
  }
}

function persistQuestionnaireDraft(questionnaireId: string, draft: QuestionnaireDraft) {
  if (!isBrowserEnvironment()) {
    return
  }

  try {
    const storageKey = getQuestionnaireDraftStorageKey(questionnaireId)

    if (Object.keys(draft).length === 0) {
      window.sessionStorage.removeItem(storageKey)
      return
    }

    window.sessionStorage.setItem(storageKey, JSON.stringify(draft))
  } catch {
    // The draft is session-only; if storage is unavailable, keep the in-memory state.
  }
}

// Formulários como perfil, cadastro e senha podem reutilizar um padrão parecido quando
// o escopo exigir, sem armazenar credenciais ou dados sensíveis em storage.
export function useQuestionnaireDraft(questionnaireId: string) {
  const storageKey = useMemo(
    () => getQuestionnaireDraftStorageKey(questionnaireId),
    [questionnaireId],
  )
  const [draft, setDraft] = useState<QuestionnaireDraft>(() => readQuestionnaireDraft(questionnaireId))

  useEffect(() => {
    persistQuestionnaireDraft(questionnaireId, draft)
  }, [draft, questionnaireId, storageKey])

  const updateAnswer = useCallback((questionId: string, value: QuestionnaireAnswerValue) => {
    setDraft((currentDraft) => {
      if (currentDraft[questionId] === value) {
        return currentDraft
      }

      return {
        ...currentDraft,
        [questionId]: value,
      }
    })
  }, [])

  const clearDraft = useCallback(() => {
    persistQuestionnaireDraft(questionnaireId, {})
    setDraft({})
  }, [questionnaireId])

  return {
    draft,
    updateAnswer,
    clearDraft,
  }
}

export { getQuestionnaireDraftStorageKey }
