import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, expect, it } from 'vitest'
import { useState } from 'react'
import { CartoesEscolha } from './cartoesEscolha'
afterEach(cleanup)
function Exemplo() {
  const [valor,setValor]=useState('')
  return <CartoesEscolha titulo="Estudou hoje?" valor={valor} aoMudar={setValor}/>
}
it('permite selecionar, trocar e desmarcar sem botão de limpeza separado',()=>{
  render(<Exemplo/>)
  const sim=screen.getByRole('radio',{name:'Sim'}),nao=screen.getByRole('radio',{name:'Não'})
  expect(sim).not.toBeChecked();expect(nao).not.toBeChecked()
  fireEvent.click(sim)
  expect(sim).toBeChecked();expect(nao).not.toBeChecked()
  fireEvent.click(nao)
  expect(nao).toBeChecked();expect(sim).not.toBeChecked()
  fireEvent.click(nao)
  expect(nao).not.toBeChecked();expect(sim).not.toBeChecked()
  expect(screen.queryByText('Limpar resposta')).not.toBeInTheDocument()
  expect(screen.getByRole('radiogroup',{name:'Estudou hoje? Opcional'})).toHaveAccessibleDescription('Toque novamente na opção marcada para desmarcar.')
})
