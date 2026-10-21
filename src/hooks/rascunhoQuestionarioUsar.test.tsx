import { act, renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import { obterChaveRascunhoQuestionario, useRascunhoQuestionario } from './rascunhoQuestionarioUsar'

beforeEach(() => sessionStorage.clear())

describe('useRascunhoQuestionario', () => {
  it('restaura as respostas usando a chave de armazenamento existente', () => {
    sessionStorage.setItem('mindcheck:questionnaire:7:draft', JSON.stringify({ q1: 3 }))
    const { result } = renderHook(() => useRascunhoQuestionario('7'))
    expect(result.current.rascunho).toEqual({ q1: 3 })
    expect(obterChaveRascunhoQuestionario('7')).toBe('mindcheck:questionnaire:7:draft')
  })

  it('salva e limpa apenas o questionário selecionado', () => {
    const outraChave = obterChaveRascunhoQuestionario('8')
    sessionStorage.setItem(outraChave, JSON.stringify({ q2: false }))
    const { result } = renderHook(() => useRascunhoQuestionario('7'))
    act(() => result.current.atualizarResposta('q1', 'Resposta'))
    expect(JSON.parse(sessionStorage.getItem(obterChaveRascunhoQuestionario('7'))!)).toEqual({
      q1: 'Resposta',
    })
    act(() => result.current.limparRascunho())
    expect(sessionStorage.getItem(obterChaveRascunhoQuestionario('7'))).toBeNull()
    expect(JSON.parse(sessionStorage.getItem(outraChave)!)).toEqual({ q2: false })
  })

  it.each(['json inválido', '[]', '{"q1": {"invalido": true}}'])(
    'ignora rascunho inválido sem quebrar a tela: %s',
    (conteudo) => {
      sessionStorage.setItem(obterChaveRascunhoQuestionario('7'), conteudo)
      const { result } = renderHook(() => useRascunhoQuestionario('7'))
      expect(result.current.rascunho).toEqual({})
    },
  )
})
