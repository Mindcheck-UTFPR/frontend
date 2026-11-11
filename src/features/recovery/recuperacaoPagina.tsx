import { useEffect, useRef, useState, type FormEvent } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { CampoFormulario } from '../../componentes/moleculas/campoFormulario'
import { AvisoErro } from '../../componentes/moleculas/avisoErro'
import { Botao } from '../../componentes/atomos/botao'
import { ErroRecuperacao, servicoRecuperacao, type ServicoRecuperacao } from './servicoRecuperacao'
import './recuperacao.css'

export function RecuperacaoPagina({ servico = servicoRecuperacao }: { servico?: ServicoRecuperacao }) {
  const [params, setParams] = useSearchParams()
  const [token, setToken] = useState(() => params.get('token') ?? '')
  const [email, setEmail] = useState('')
  const [erro, setErro] = useState('')
  const [campos, setCampos] = useState<Record<string,string>>({})
  const [ocupado, setOcupado] = useState(false)
  const [enviado, setEnviado] = useState(false)
  const [concluido, setConcluido] = useState(false)
  const [linkInvalido, setLinkInvalido] = useState(false)
  const [espera, setEspera] = useState(0)
  const pendente = useRef(false)
  useEffect(() => {
    if (params.has('token')) { const p = new URLSearchParams(params); p.delete('token'); setParams(p, { replace:true }) }
  }, [params,setParams])
  useEffect(() => {
    if (espera <= 0) return
    const timer = window.setTimeout(() => setEspera(v => Math.max(0,v - 1)), 1000)
    return () => window.clearTimeout(timer)
  }, [espera])
  const enviar = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (pendente.current || espera > 0) return
    const form = e.currentTarget
    const dados = new FormData(form)
    const senha = String(dados.get('senha') ?? '')
    const invalidos: Record<string,string> = {}
    if (token) {
      if (senha.length < 8 || senha.length > 128) invalidos.senha = 'Use entre 8 e 128 caracteres.'
      if (senha !== dados.get('confirmacao')) invalidos.confirmacao = 'As senhas precisam ser iguais.'
    } else if (!email.trim() || !form.querySelector<HTMLInputElement>('#rec-email')?.validity.valid) invalidos.email = 'Informe um e-mail válido.'
    setCampos(invalidos); setErro('')
    if (Object.keys(invalidos).length) { form.querySelector<HTMLInputElement>(`[name="${Object.keys(invalidos)[0]}"]`)?.focus(); return }
    pendente.current = true; setOcupado(true)
    try {
      if (token) { await servico.redefinir({ token, senha }); form.reset(); setToken(''); setConcluido(true) }
      else { const resposta = await servico.solicitar(email.trim()); setEnviado(true); setEspera(Math.max(0, Math.min(3600, resposta.tentarNovamenteEm))) }
    } catch (causa) {
      if (causa instanceof ErroRecuperacao && causa.motivo === 'link_invalido') { setLinkInvalido(true); setErro('Este link é inválido, expirou ou já foi usado. Solicite um novo link.') }
      else if (causa instanceof ErroRecuperacao && causa.motivo === 'limite') { setEspera(Math.max(1, Math.min(3600, causa.segundos))); setErro('Muitas tentativas. Aguarde antes de tentar novamente.') }
      else setErro('A recuperação de acesso ainda não está disponível. Tente novamente mais tarde.')
    } finally { pendente.current = false; setOcupado(false) }
  }
  return <section className="recovery-page">
    <Link to="/login" className="recovery-back" aria-label="Voltar ao login">←</Link>
    <h1>{concluido ? 'Senha alterada' : token ? 'Crie uma nova senha' : 'Esqueceu sua senha?'}</h1>
    {concluido ? <p role="status">Sua senha foi alterada. Entre novamente com a nova senha.</p> : <>
      <p className="recovery-description">{token ? 'Escolha uma senha para acessar sua conta.' : 'Insira o e-mail cadastrado na sua conta do MindCheck para recuperar sua senha.'}</p>
      <AvisoErro message={erro}/>
      {enviado && <p className="success-notice" role="status">Se houver uma conta para esse e-mail, você receberá as instruções para recuperar o acesso.</p>}
      {!linkInvalido && <form onSubmit={enviar} noValidate aria-busy={ocupado}><fieldset disabled={ocupado || espera > 0}>
        {token ? <>
          <CampoFormulario id="rec-senha" name="senha" label="Nova senha" type="password" autoComplete="new-password" required minLength={8} maxLength={128} placeholder="Mínimo de 8 caracteres" error={campos.senha}/>
          <CampoFormulario id="rec-confirmacao" name="confirmacao" label="Confirmar senha" type="password" autoComplete="new-password" required maxLength={128} placeholder="Repita a senha" error={campos.confirmacao}/>
        </> : <CampoFormulario id="rec-email" name="email" label="E-mail" type="email" autoComplete="email" required maxLength={255} placeholder="usuario@email.com" value={email} onChange={e => { setEmail(e.target.value); setEnviado(false) }} error={campos.email}/>}
        <Botao type="submit">{ocupado ? 'Aguarde…' : espera > 0 ? `Aguarde ${espera}s` : token ? 'Salvar nova senha' : enviado ? 'Reenviar' : 'Enviar'}</Botao>
      </fieldset></form>}
      {linkInvalido && <Botao onClick={() => { setToken(''); setLinkInvalido(false); setErro('') }}>Solicitar novo link</Botao>}
      {!token && <p className="recovery-help">O e-mail pode levar alguns minutos para chegar.<br/>Confira também a caixa de spam.</p>}
    </>}
    <Link className="recovery-login" to="/login">Voltar ao login</Link>
  </section>
}
