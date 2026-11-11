import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, expect, it, vi } from 'vitest'
import { PrivacidadePagina } from './privacidadePagina'
import type { PedidoPrivacidade, ServicoPrivacidade } from './servicoPrivacidade'
afterEach(cleanup)
const servico:ServicoPrivacidade={consultar:async()=>({exportacao:null,exclusao:null}),solicitarExportacao:vi.fn(),baixarExportacao:vi.fn(),solicitarExclusao:vi.fn()}
function abrir(s?:ServicoPrivacidade){render(<MemoryRouter><PrivacidadePagina servico={s}/></MemoryRouter>)}
it('não informa sucesso nem solicita exclusão sem confirmação',async()=>{
  const excluir=vi.fn().mockResolvedValue({protocolo:'teste-1',estado:'recebido'})
  abrir({...servico,solicitarExclusao:excluir})
  await screen.findByRole('button',{name:'Solicitar exclusão'})
  await screen.findByRole('button',{name:'Atualizar andamento'})
  // Aguarda terminar a consulta.
  await screen.findByRole('heading',{name:'Excluir minha conta'})
  await new Promise(r=>setTimeout(r,0))
  fireEvent.click(screen.getByRole('button',{name:'Solicitar exclusão'}))
  expect(excluir).not.toHaveBeenCalled()
  const confirmar=screen.getByRole('button',{name:'Confirmar solicitação de exclusão'})
  expect(confirmar).toBeDisabled()
  fireEvent.click(screen.getByRole('checkbox'))
  fireEvent.click(confirmar)
  expect(await screen.findByRole('status')).toHaveTextContent('Solicitação de exclusão recebida')
  expect(excluir).toHaveBeenCalledTimes(1)
  expect(screen.queryByText('Conta excluída')).not.toBeInTheDocument()
})
it('mantém indisponibilidade explícita sem fingir exportação',async()=>{
  abrir()
  expect(await screen.findByRole('alert')).toHaveTextContent('Nenhum pedido foi enviado')
  fireEvent.click(screen.getByRole('button',{name:'Solicitar cópia dos dados'}))
  expect(await screen.findByRole('alert')).toHaveTextContent('Nenhum pedido foi enviado')
  expect(screen.queryByText('Solicitação de exportação recebida.')).not.toBeInTheDocument()
})
it('não permite repetir pedido de exportação em andamento',async()=>{
  let resolver!:(v:PedidoPrivacidade)=>void
  const solicitarExportacao=vi.fn(()=>new Promise<PedidoPrivacidade>(r=>{resolver=r}))
  abrir({...servico,solicitarExportacao})
  await new Promise(r=>setTimeout(r,0))
  const b=screen.getByRole('button',{name:'Solicitar cópia dos dados'})
  fireEvent.click(b);fireEvent.click(b)
  expect(solicitarExportacao).toHaveBeenCalledTimes(1)
  resolver({protocolo:'teste-2',estado:'processando'})
  expect(await screen.findByRole('status')).toHaveTextContent('exportação recebida')
  expect(screen.getByRole('button',{name:'Solicitar cópia dos dados'})).toBeDisabled()
})
