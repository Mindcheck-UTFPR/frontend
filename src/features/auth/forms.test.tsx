import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import SignupPage from './signup-page'
import LoginPage from './login-page'
import PrivateRoute from '../../routes/private-route'
import { sessionStore } from './session'
import { LogoutButton } from './logout-button'

const fetchMock = vi.fn<typeof fetch>()
const config = { termosVersao: '1.0', termosUrl: 'https://example.test/termos-aprovados' }
const reply = (body: unknown, status = 200) => new Response(status === 204 ? null : JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } })
const session = { accessToken: 'access-valido', refreshToken: 'A'.repeat(43), expiraEm: '2099-01-01T00:00:00Z', usuario: { id: 1, nome: 'Teste', email: 'teste@example.test', papel: 'usuario' } }
beforeEach(() => {
  sessionStore.forget(); sessionStorage.clear(); localStorage.clear()
  fetchMock.mockReset(); vi.stubGlobal('fetch', fetchMock)
})
afterEach(() => { cleanup(); vi.unstubAllGlobals() })
function signup() { return render(<MemoryRouter initialEntries={['/signup']}><Routes><Route path="/signup" element={<SignupPage />} /><Route path="/login" element={<LoginPage />} /></Routes></MemoryRouter>) }
async function fillSignup() {
  await screen.findByRole('checkbox')
  for (const [label, value] of [['Nome', 'Conta Teste'], ['E-mail', 'teste@example.test'], ['Senha', 'senha-segura-123'], ['Confirme a senha', 'senha-segura-123']]) fireEvent.change(screen.getByLabelText(label, { exact: true }), { target: { value } })
  fireEvent.click(screen.getByRole('checkbox'))
}
it('valida os campos e confirmação sem enviar credenciais inválidas', async () => {
  fetchMock.mockResolvedValueOnce(reply(config)); signup(); await fillSignup()
  fireEvent.change(screen.getByLabelText('Confirme a senha', { exact: true }), { target: { value: 'outra-senha' } })
  fireEvent.click(screen.getByRole('button', { name: 'Criar conta' }))
  expect(await screen.findByText('As senhas precisam ser iguais.')).toBeInTheDocument()
  expect(fetchMock).toHaveBeenCalledTimes(1)
})
it('envia cadastro com a versão vigente e redireciona ao login sem guardar senha', async () => {
  fetchMock.mockResolvedValueOnce(reply(config)).mockResolvedValueOnce(reply({ usuario: session.usuario }, 201))
  signup(); await fillSignup(); fireEvent.click(screen.getByRole('button', { name: 'Criar conta' }))
  expect(await screen.findByText(/Cadastro realizado/)).toBeInTheDocument()
  expect(JSON.parse(String(fetchMock.mock.calls[1][1]?.body))).toEqual({ nome: 'Conta Teste', email: 'teste@example.test', senha: 'senha-segura-123', termosAceitos: true, termosVersao: '1.0' })
  expect(sessionStorage.length).toBe(0)
  expect(screen.getByLabelText('Senha', { exact: true })).toHaveValue('')
})
it('mostra conflito de e-mail e preserva os outros campos para correção', async () => {
  fetchMock.mockResolvedValueOnce(reply(config)).mockResolvedValueOnce(reply({ erro: { codigo: 'EMAIL_EM_USO', mensagem: 'Este e-mail já está cadastrado.' } }, 409))
  signup(); await fillSignup(); fireEvent.click(screen.getByRole('button', { name: 'Criar conta' }))
  expect(await screen.findByRole('alert')).toHaveTextContent('Este e-mail já está cadastrado.')
  expect(screen.getByLabelText('E-mail', { exact: true })).toHaveAttribute('aria-invalid', 'true')
  expect(screen.getByLabelText('Nome', { exact: true })).toHaveValue('Conta Teste')
})
it('não oferece aceite sem documento publicado', async () => {
  fetchMock.mockResolvedValueOnce(reply({ ...config, termosUrl: null })); signup()
  expect(await screen.findByText(/termos de uso e privacidade ainda não foram publicados/)).toBeInTheDocument()
  expect(screen.getByRole('button', { name: 'Criar conta' })).toBeDisabled()
  expect(screen.queryByRole('checkbox')).not.toBeInTheDocument()
})
it('permite recuperar falha de configuração de cadastro', async () => {
  fetchMock.mockRejectedValueOnce(new TypeError('offline')).mockResolvedValueOnce(reply(config)); signup()
  fireEvent.click(await screen.findByRole('button', { name: 'Tentar carregar novamente' }))
  expect(await screen.findByRole('checkbox')).toBeInTheDocument()
})
it('não faz login duplicado enquanto a requisição está em andamento', async () => {
  let resolve!: (value: Response) => void
  fetchMock.mockReturnValueOnce(new Promise(done => { resolve = done }))
  render(<MemoryRouter><LoginPage /></MemoryRouter>)
  fireEvent.change(screen.getByLabelText('E-mail', { exact: true }), { target: { value: 'teste@example.test' } })
  fireEvent.change(screen.getByLabelText('Senha', { exact: true }), { target: { value: 'senha' } })
  const button = screen.getByRole('button', { name: 'Entrar' })
  fireEvent.click(button); fireEvent.click(button)
  expect(button).toBeDisabled()
  expect(fetchMock).toHaveBeenCalledTimes(1)
  resolve(reply({ erro: { mensagem: 'E-mail ou senha incorretos.' } }, 401))
  expect(await screen.findByRole('alert')).toHaveTextContent('E-mail ou senha incorretos.')
  expect(screen.getByRole('button', { name: 'Entrar' })).toBeEnabled()
})
it('bloqueia rota privada sem confiar em token inventado no localStorage', async () => {
  localStorage.setItem('token', 'falso')
  render(<MemoryRouter initialEntries={['/profile']}><Routes><Route element={<PrivateRoute />}><Route path="/profile" element={<p>Dados privados</p>} /></Route><Route path="/login" element={<LoginPage />} /></Routes></MemoryRouter>)
  expect(await screen.findByRole('heading', { name: 'Entre na sua conta' })).toBeInTheDocument()
  expect(screen.queryByText('Dados privados')).not.toBeInTheDocument()
})
it.each([429, 500])('trata erro HTTP %s sem expor detalhes internos', async status => {
  fetchMock.mockResolvedValueOnce(reply({ erro: { mensagem: 'Detalhe interno que não deve aparecer' } }, status))
  render(<MemoryRouter><LoginPage /></MemoryRouter>)
  fireEvent.change(screen.getByLabelText('E-mail', { exact: true }), { target: { value: 'teste@example.test' } })
  fireEvent.change(screen.getByLabelText('Senha', { exact: true }), { target: { value: 'senha' } })
  fireEvent.click(screen.getByRole('button', { name: 'Entrar' }))
  expect(await screen.findByRole('alert')).not.toHaveTextContent('Detalhe interno')
  expect(screen.getByRole('alert')).toHaveTextContent(status === 429 ? 'Muitas tentativas' : 'serviço está indisponível')
})
it('logout offline não informa sucesso nem abandona a sessão sem escolha explícita', async () => {
  fetchMock.mockResolvedValueOnce(reply(session)); await sessionStore.login('teste@example.test', 'senha')
  fetchMock.mockRejectedValueOnce(new TypeError('offline'))
  render(<LogoutButton />); fireEvent.click(screen.getByRole('button', { name: 'Sair' }))
  expect(await screen.findByRole('alert')).toHaveTextContent('Não foi possível confirmar a saída no servidor')
  expect(sessionStore.getSnapshot().status).toBe('authenticated')
  fireEvent.click(screen.getByRole('button', { name: 'Remover sessão deste dispositivo' }))
  await waitFor(() => expect(sessionStore.getSnapshot().status).toBe('anonymous'))
})
