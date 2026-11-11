import { useEffect, useRef, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { Botao } from '../../componentes/atomos/botao'
import { BotaoVoltar } from '../../componentes/atomos/botaoVoltar'
import { CampoFormulario } from '../../componentes/moleculas/campoFormulario'
import { CartoesEscolha } from '../../componentes/moleculas/cartoesEscolha'
import { AvisoErro } from '../../componentes/moleculas/avisoErro'
import { humores, dataLocalHoje, servicoCheckin, type CheckinSalvo, type Humor, type ServicoCheckin } from './servicoCheckin'
import './checkin.css'

export function FormularioCheckin({ servico = servicoCheckin }: { servico?: ServicoCheckin }) {
  const [carregando, setCarregando] = useState(true)
  const [registro, setRegistro] = useState<CheckinSalvo | null>(null)
  const [editando, setEditando] = useState(false)
  const [humor, setHumor] = useState<Humor | ''>('')
  const [sono, setSono] = useState('')
  const [estudou, setEstudou] = useState('')
  const [atividade, setAtividade] = useState('')
  const [nota, setNota] = useState('')
  const [erro, setErro] = useState('')
  const [erros, setErros] = useState<Record<string, string>>({})
  const [salvando, setSalvando] = useState(false)
  const [confirmado, setConfirmado] = useState(false)
  const pendente = useRef(false)
  const formRef = useRef<HTMLFormElement>(null)
  useEffect(() => {
    let ativo = true
    servico.buscarHoje().then(valor => {
      if (!ativo) return
      setRegistro(valor)
      if (valor) {
        setHumor(valor.humor); setSono(valor.sonoHoras === null ? '' : String(valor.sonoHoras))
        setEstudou(valor.estudou === null ? '' : String(valor.estudou))
        setAtividade(valor.atividadeFisica === null ? '' : String(valor.atividadeFisica)); setNota(valor.observacoes)
      }
    }).catch(causa => { if (ativo) setErro(causa instanceof Error ? causa.message : 'Não foi possível consultar seu check-in.') })
      .finally(() => { if (ativo) setCarregando(false) })
    return () => { ativo = false }
  }, [servico])
  const salvar = async (event: FormEvent) => {
    event.preventDefault()
    if (pendente.current || carregando) return
    const invalidos: Record<string, string> = {}
    if (!humor) invalidos.humor = 'Escolha como você está se sentindo.'
    const horas = sono.trim() === '' ? null : Number(sono.replace(',', '.'))
    if (horas !== null && (!Number.isFinite(horas) || horas < 0 || horas > 24)) invalidos.sono = 'Informe entre 0 e 24 horas.'
    if (nota.length > 280) invalidos.observacoes = 'Use até 280 caracteres.'
    setErros(invalidos)
    if (Object.keys(invalidos).length || !humor) {
      formRef.current?.querySelector<HTMLElement>(invalidos.humor ? 'input[name="humor"]' : '#checkin-sono')?.focus()
      return
    }
    pendente.current = true; setSalvando(true); setErro('')
    try {
      const salvo = await servico.salvar({ data: registro?.data ?? dataLocalHoje(), humor, sonoHoras: horas, estudou: estudou === '' ? null : estudou === 'true', atividadeFisica: atividade === '' ? null : atividade === 'true', observacoes: nota.trim() }, registro?.id)
      setRegistro(salvo); setEditando(false); setConfirmado(true)
    } catch (causa) {
      setErro(causa instanceof Error ? causa.message : 'Não foi possível salvar. Suas respostas continuam no formulário.')
    } finally { pendente.current = false; setSalvando(false) }
  }
  return <section className="checkin-page">
    <header className="checkin-heading"><BotaoVoltar caminhoRetorno="/home"/><span>Check-in diário</span></header>
    {carregando ? <p role="status">Consultando seu check-in…</p> : registro && !editando ? <>
      <div className="checkin-confirmation" role={confirmado ? 'status' : undefined}><span aria-hidden="true">✓</span><h1>{confirmado ? 'Check-in registrado!' : 'Você já realizou seu check-in de hoje'}</h1><p>Seu humor e sua rotina ficaram registrados.</p></div>
      <article className="checkin-summary"><img src={`/assets/checkin/${humores.find(h => h.valor === registro.humor)?.imagem}.svg`} alt=""/><h2>{humores.find(h => h.valor === registro.humor)?.rotulo}</h2><p>{registro.data.split('-').reverse().join('/')}</p></article>
      {registro.podeEditar && <Botao onClick={() => { setEditando(true); setConfirmado(false) }}>Editar check-in</Botao>}
      <Link className="button button--subtle" to="/history/check-ins">Ver histórico</Link>
    </> : <>
      <h1>Como está se sentindo hoje?</h1><p className="checkin-description">{editando ? 'Altere as informações do seu check-in de hoje.' : 'Registre seu humor, sono, estudos e atividades físicas.'}</p>
      <AvisoErro message={erro}/>
      <form ref={formRef} onSubmit={salvar} noValidate aria-busy={salvando}>
        <fieldset disabled={salvando}>
          <fieldset className="checkin-moods" aria-describedby={erros.humor ? 'humor-error' : undefined}><legend>Nível de humor</legend><div>{humores.map(h => <label key={h.valor} className={humor === h.valor ? 'selecionado' : ''}><input aria-label={h.rotulo} type="radio" name="humor" value={h.valor} checked={humor === h.valor} onChange={() => setHumor(h.valor)} required/><span className="mood-visual"><img src={`/assets/checkin/${h.imagem}.svg`} alt=""/><span className="mood-check" aria-hidden="true">✓</span></span><span className="mood-label">{h.rotulo}</span></label>)}</div>{erros.humor && <p className="field-error" id="humor-error">{erros.humor}</p>}</fieldset>
          <CampoFormulario id="checkin-sono" name="sono" label="Quantas horas você dormiu? (opcional)" type="text" inputMode="decimal" value={sono} onChange={e => setSono(e.target.value)} placeholder="Ex.: 7,5" hint="Use horas em número; 7,5 equivale a 7h30." error={erros.sono}/>
          <CartoesEscolha titulo="Estudou hoje?" valor={estudou} aoMudar={setEstudou}/>
          <CartoesEscolha titulo="Realizou atividade física hoje?" valor={atividade} aoMudar={setAtividade}/>
          <label className="checkin-note" htmlFor="checkin-nota">Observações (opcional)<textarea id="checkin-nota" value={nota} maxLength={280} rows={4} onChange={e => setNota(e.target.value)} placeholder="Escreva algo sobre o seu dia…" aria-describedby="nota-contador"/></label>
          <small id="nota-contador" className="checkin-counter">{nota.length}/280 caracteres</small>
          <Botao type="submit">{salvando ? 'Salvando…' : editando ? 'Salvar alterações' : 'Confirmar'}</Botao>
        </fieldset>
      </form>
    </>}
  </section>
}
