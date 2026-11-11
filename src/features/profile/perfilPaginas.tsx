import { useRef, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { useSession } from '../auth/use-session'
import { sessionStore } from '../auth/session'
import { LogoutButton } from '../auth/logout-button'
import { Botao } from '../../componentes/atomos/botao'
import { CampoFormulario } from '../../componentes/moleculas/campoFormulario'
import { AvisoErro } from '../../componentes/moleculas/avisoErro'
import { servicoPerfil, type DadosPerfil, type ServicoPerfil } from './servicoPerfil'
import './perfil.css'

function Avatar({ nome }: { nome: string }) { return <div className="profile-avatar" aria-hidden="true">{nome.trim().slice(0,1).toLocaleUpperCase('pt-BR') || '?'}</div> }
export function PerfilPagina() {
  const { user } = useSession()
  if (!user) return <p role="status">Carregando perfil…</p>
  return <section className="profile-page">
    <header className="profile-heading"><Link to="/home" aria-label="Voltar ao início">←</Link><h1>Perfil</h1></header>
    <div className="profile-identity"><Avatar nome={user.nome}/><h2>{user.nome}</h2><p>{user.email}</p></div>
    <dl className="profile-data"><div><dt>Nome completo</dt><dd>{user.nome}</dd></div><div><dt>E-mail</dt><dd>{user.email}</dd></div></dl>
    <Link className="button button--subtle" to="/profile/edit">Editar dados</Link>
    <Link className="profile-privacy-link" to="/profile/privacy">Privacidade da conta</Link>
    <div className="profile-logout"><LogoutButton/></div>
  </section>
}
export function EditarPerfilPagina({ servico = servicoPerfil, dadosIniciais }: { servico?: ServicoPerfil; dadosIniciais?: DadosPerfil }) {
  const { user } = useSession()
  const dados = dadosIniciais ?? user
  return dados ? <FormularioPerfil key={dados.email} servico={servico} dados={dados}/> : <p role="status">Carregando perfil…</p>
}
function FormularioPerfil({ servico, dados }: { servico: ServicoPerfil; dados: DadosPerfil }) {
  const [nome,setNome] = useState(dados.nome), [email,setEmail] = useState(dados.email)
  const [erro,setErro] = useState(''), [campos,setCampos] = useState<Record<string,string>>({})
  const [ocupado,setOcupado] = useState(false), [concluido,setConcluido] = useState(false)
  const pendente = useRef(false)
  const salvar = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (pendente.current) return
    const invalidos: Record<string,string> = {}
    if (nome.trim().length < 2 || nome.trim().length > 120) invalidos.nome = 'Informe um nome entre 2 e 120 caracteres.'
    if (!email.trim() || !e.currentTarget.querySelector<HTMLInputElement>('#perfil-email')?.validity.valid) invalidos.email = 'Informe um e-mail válido.'
    setCampos(invalidos); setErro(''); setConcluido(false)
    if (Object.keys(invalidos).length) { e.currentTarget.querySelector<HTMLInputElement>(`[name="${Object.keys(invalidos)[0]}"]`)?.focus(); return }
    pendente.current = true; setOcupado(true)
    try {
      const atualizado = await servico.salvar({nome:nome.trim(),email:email.trim()})
      setNome(atualizado.nome); setEmail(atualizado.email); setConcluido(true)
      if (sessionStore.getSnapshot().status === 'authenticated') void sessionStore.verify()
    } catch (causa) { setErro(causa instanceof Error ? causa.message : 'Não foi possível salvar suas alterações.') }
    finally { pendente.current = false; setOcupado(false) }
  }
  return <section className="profile-page">
    <header className="profile-heading"><Link to="/profile" aria-label="Voltar ao perfil">←</Link><h1>Editar dados</h1></header>
    <p className="profile-description">Edite os dados que deseja alterar e salve as alterações.</p>
    <div className="profile-photo"><Avatar nome={nome}/><div><Botao disabled className="button--subtle">Escolher foto</Botao><small>Alteração de foto ainda não disponível.</small></div></div>
    <AvisoErro message={erro}/>{concluido && <p role="status" className="success-notice">Seus dados foram atualizados.</p>}
    <form onSubmit={salvar} noValidate aria-busy={ocupado}><fieldset disabled={ocupado}>
      <CampoFormulario id="perfil-nome" name="nome" label="Nome completo" value={nome} onChange={e=>{setNome(e.target.value);setConcluido(false)}} required maxLength={120} autoComplete="name" error={campos.nome}/>
      <CampoFormulario id="perfil-email" name="email" label="E-mail" type="email" value={email} onChange={e=>{setEmail(e.target.value);setConcluido(false)}} required maxLength={255} autoComplete="email" error={campos.email}/>
      <Botao type="submit">{ocupado ? 'Salvando…' : 'Salvar alterações'}</Botao>
    </fieldset></form>
    <div className="profile-password"><AlterarSenhaFormulario servico={servico}/></div>
  </section>
}
export function AlterarSenhaFormulario({ servico = servicoPerfil }: { servico?: ServicoPerfil }) {
  const [erro,setErro] = useState(''), [campos,setCampos] = useState<Record<string,string>>({})
  const [ocupado,setOcupado] = useState(false), [concluido,setConcluido] = useState(false)
  const pendente = useRef(false)
  const enviar = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (pendente.current) return
    const form=e.currentTarget, dados=new FormData(form)
    const atual=String(dados.get('senhaAtual') ?? ''), nova=String(dados.get('novaSenha') ?? '')
    const invalidos: Record<string,string> = {}
    if (!atual) invalidos.senhaAtual='Informe sua senha atual.'
    if (nova.length<8 || nova.length>128) invalidos.novaSenha='Use entre 8 e 128 caracteres.'
    if (nova !== dados.get('confirmacao')) invalidos.confirmacao='As senhas precisam ser iguais.'
    setCampos(invalidos); setErro(''); setConcluido(false)
    if (Object.keys(invalidos).length) { form.querySelector<HTMLInputElement>(`[name="${Object.keys(invalidos)[0]}"]`)?.focus(); return }
    pendente.current=true;setOcupado(true)
    try { await servico.alterarSenha({senhaAtual:atual,novaSenha:nova}); form.reset(); setConcluido(true) }
    catch (causa) { setErro(causa instanceof Error ? causa.message : 'Não foi possível alterar a senha.') }
    finally { pendente.current=false;setOcupado(false) }
  }
  return <section><h2>Alterar senha</h2><AvisoErro message={erro}/>{concluido && <p role="status" className="success-notice">Senha alterada.</p>}
    <form onSubmit={enviar} noValidate aria-busy={ocupado}><fieldset disabled={ocupado}>
      <CampoFormulario id="perfil-senha-atual" name="senhaAtual" label="Senha atual" type="password" autoComplete="current-password" required maxLength={128} error={campos.senhaAtual}/>
      <CampoFormulario id="perfil-nova-senha" name="novaSenha" label="Nova senha" type="password" autoComplete="new-password" required minLength={8} maxLength={128} placeholder="Mínimo de 8 caracteres" error={campos.novaSenha}/>
      <CampoFormulario id="perfil-confirmacao" name="confirmacao" label="Confirmar nova senha" type="password" autoComplete="new-password" required maxLength={128} error={campos.confirmacao}/>
      <Botao type="submit">{ocupado ? 'Alterando…' : 'Alterar senha'}</Botao>
    </fieldset></form>
  </section>
}
