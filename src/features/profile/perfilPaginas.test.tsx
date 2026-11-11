import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, expect, it, vi } from 'vitest'
import { EditarPerfilPagina } from './perfilPaginas'
import type { ServicoPerfil } from './servicoPerfil'
afterEach(cleanup)
const inicial={nome:'Pessoa Teste',email:'pessoa@example.test'}
function abrir(servico?:ServicoPerfil){render(<MemoryRouter><EditarPerfilPagina servico={servico} dadosIniciais={inicial}/></MemoryRouter>)}
it('valida os dados antes de salvar e mantém os campos se o serviço falhar',async()=>{
  const salvar=vi.fn().mockRejectedValue(new Error('Esse e-mail não pode ser usado.'))
  abrir({salvar,alterarSenha:vi.fn()})
  fireEvent.change(screen.getByLabelText('Nome completo'),{target:{value:'A'}})
  fireEvent.click(screen.getByRole('button',{name:'Salvar alterações'}))
  expect(salvar).not.toHaveBeenCalled()
  fireEvent.change(screen.getByLabelText('Nome completo'),{target:{value:'Novo Nome'}})
  fireEvent.click(screen.getByRole('button',{name:'Salvar alterações'}))
  expect(await screen.findByRole('alert')).toHaveTextContent('Esse e-mail')
  expect(screen.getByLabelText('Nome completo')).toHaveValue('Novo Nome')
  expect(screen.queryByText('Seus dados foram atualizados.')).not.toBeInTheDocument()
})
it('usa somente nome e email ao salvar e aguarda a resposta',async()=>{
  let resolver!:(v:typeof inicial)=>void
  const salvar=vi.fn(()=>new Promise<typeof inicial>(r=>{resolver=r}))
  abrir({salvar,alterarSenha:vi.fn()})
  const b=screen.getByRole('button',{name:'Salvar alterações'});fireEvent.click(b);fireEvent.click(b)
  expect(salvar).toHaveBeenCalledExactlyOnceWith(inicial)
  expect(b).toBeDisabled()
  resolver(inicial)
  expect(await screen.findByRole('status')).toHaveTextContent('Seus dados foram atualizados')
})
it('não informa alteração de senha com serviço indisponível',async()=>{
  abrir()
  fireEvent.change(screen.getByLabelText('Senha atual',{exact:true}),{target:{value:'atual-ficticia'}})
  fireEvent.change(screen.getByLabelText('Nova senha',{exact:true}),{target:{value:'nova-ficticia'}})
  fireEvent.change(screen.getByLabelText('Confirmar nova senha',{exact:true}),{target:{value:'nova-ficticia'}})
  fireEvent.click(screen.getByRole('button',{name:'Alterar senha',exact:true}))
  expect(await screen.findByRole('alert')).toHaveTextContent('Nenhuma mudança foi salva')
  expect(screen.queryByText('Senha alterada.')).not.toBeInTheDocument()
})
