import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, expect, it, vi } from 'vitest'
import { RecuperacaoPagina } from './recuperacaoPagina'
import { ErroRecuperacao, type ServicoRecuperacao } from './servicoRecuperacao'
afterEach(cleanup)
function abrir(servico?: ServicoRecuperacao, rota = '/password-recovery') { render(<MemoryRouter initialEntries={[rota]}><RecuperacaoPagina servico={servico}/></MemoryRouter>) }
it('valida e-mail e não informa envio com serviço indisponível', async () => {
  abrir()
  fireEvent.click(screen.getByRole('button',{name:'Enviar'}))
  expect(screen.getByText('Informe um e-mail válido.')).toBeInTheDocument()
  fireEvent.change(screen.getByLabelText('E-mail'),{target:{value:'teste@example.test'}})
  fireEvent.click(screen.getByRole('button',{name:'Enviar'}))
  expect(await screen.findByRole('alert')).toHaveTextContent('ainda não está disponível')
  expect(screen.queryByText(/Se houver uma conta/)).not.toBeInTheDocument()
})
it('usa confirmação genérica, respeita espera e impede pedido duplicado', async () => {
  let resolver!: (v:{tentarNovamenteEm:number})=>void
  const solicitar = vi.fn(()=> new Promise<{tentarNovamenteEm:number}>(r=>{resolver=r}))
  abrir({solicitar,redefinir:vi.fn()})
  fireEvent.change(screen.getByLabelText('E-mail'),{target:{value:'teste@example.test'}})
  const b=screen.getByRole('button',{name:'Enviar'}); fireEvent.click(b); fireEvent.click(b)
  expect(solicitar).toHaveBeenCalledTimes(1)
  resolver({tentarNovamenteEm:30})
  expect(await screen.findByRole('status')).toHaveTextContent('Se houver uma conta')
  expect(screen.getByRole('button',{name:'Aguarde 30s'})).toBeDisabled()
})
it('trata token inválido e permite solicitar outro sem guardar a senha', async () => {
  const redefinir=vi.fn().mockRejectedValue(new ErroRecuperacao('link_invalido'))
  abrir({solicitar:vi.fn(),redefinir},'/password-recovery?token=token-somente-de-teste')
  fireEvent.change(screen.getByLabelText('Nova senha',{exact:true}),{target:{value:'senha-ficticia'}})
  fireEvent.change(screen.getByLabelText('Confirmar senha',{exact:true}),{target:{value:'senha-ficticia'}})
  fireEvent.click(screen.getByRole('button',{name:'Salvar nova senha'}))
  expect(await screen.findByRole('alert')).toHaveTextContent('inválido, expirou ou já foi usado')
  fireEvent.click(screen.getByRole('button',{name:'Solicitar novo link'}))
  expect(screen.getByLabelText('E-mail')).toBeInTheDocument()
  expect(screen.queryByLabelText('Nova senha',{exact:true})).not.toBeInTheDocument()
})
