import { afterEach, expect, it, vi } from 'vitest'
import { criarSessaoExecucao, limparSessoesQuestionario, obterSessaoExecucao } from './sessaoExecucao'
import type { Execucao, ServicoExecucao } from './servicoExecucao'
afterEach(limparSessoesQuestionario)
const execucao: Execucao={id:'q1',avaliacaoId:'a1',versaoId:'v-publicada-1',nome:'Questionário de teste',perguntas:[{id:'p1',texto:'Pergunta fictícia para teste',tipo:'escolha_unica',obrigatoria:true,opcoes:[{id:'o1',texto:'Opção de teste'}]},{id:'p2',texto:'Comentário fictício',tipo:'aberta',obrigatoria:false,opcoes:[]}],respostas:{}}
function servico():ServicoExecucao{return{carregar:async()=>execucao,salvarRascunho:vi.fn().mockResolvedValue(undefined),concluir:vi.fn().mockResolvedValue({resultadoId:'r1'})}}
it('bloqueia conclusão incompleta e preserva versão/avaliação no envio',async()=>{
  const api=servico(),sessao=criarSessaoExecucao('q1',api)
  await sessao.carregar()
  await expect(sessao.concluir()).rejects.toThrow('obrigatórias')
  expect(api.concluir).not.toHaveBeenCalled()
  sessao.responder('p1','o1')
  await sessao.concluir()
  expect(api.concluir).toHaveBeenCalledExactlyOnceWith({avaliacaoId:'a1',versaoId:'v-publicada-1',respostas:{p1:'o1'}})
  expect(sessao.getSnapshot().resultadoId).toBe('r1')
})
it('serializa gravações para que resposta antiga não sobrescreva a nova',async()=>{
  let liberar!:()=>void
  const api=servico()
  const salvar=vi.fn().mockImplementationOnce(()=>new Promise<void>(r=>{liberar=r})).mockResolvedValue(undefined)
  api.salvarRascunho=salvar
  const sessao=criarSessaoExecucao('q1',api);await sessao.carregar()
  sessao.responder('p2','primeira resposta fictícia')
  const primeira=sessao.salvar()
  await Promise.resolve();await Promise.resolve()
  sessao.responder('p2','resposta fictícia mais recente')
  const segunda=sessao.salvar()
  expect(salvar).toHaveBeenCalledTimes(1)
  liberar();await primeira;await segunda
  expect(salvar).toHaveBeenCalledTimes(2)
  expect(salvar).toHaveBeenLastCalledWith(expect.objectContaining({respostas:{p2:'resposta fictícia mais recente'}}))
  expect(sessao.getSnapshot().revisaoSalva).toBe(sessao.getSnapshot().revisao)
})
it('mantém respostas e permite tentar salvar novamente após falha',async()=>{
  const api=servico();api.salvarRascunho=vi.fn().mockRejectedValueOnce(new Error('offline')).mockResolvedValue(undefined)
  const sessao=criarSessaoExecucao('q1',api);await sessao.carregar();sessao.responder('p1','o1')
  await expect(sessao.salvar()).rejects.toThrow('offline')
  expect(sessao.getSnapshot().respostas).toEqual({p1:'o1'})
  expect(sessao.getSnapshot().revisaoSalva).toBe(0)
  await sessao.salvar()
  expect(sessao.getSnapshot().revisaoSalva).toBe(1)
})
it('impede conclusão duplicada enquanto o servidor está respondendo',async()=>{
  let liberar!:(v:{resultadoId:string})=>void
  const api=servico();api.concluir=vi.fn(()=>new Promise<{resultadoId:string}>(r=>{liberar=r}))
  const sessao=criarSessaoExecucao('q1',api);await sessao.carregar();sessao.responder('p1','o1');await sessao.salvar()
  const primeira=sessao.concluir()
  await expect(sessao.concluir()).rejects.toThrow('andamento')
  await Promise.resolve()
  liberar({resultadoId:'r1'});await primeira
  expect(api.concluir).toHaveBeenCalledTimes(1)
})
it('isola rascunhos por pessoa e descarta resultados tardios ao limpar a sessão',async()=>{
  const api=servico(),a=obterSessaoExecucao(1,'q1',api),b=obterSessaoExecucao(2,'q1',api)
  await a.carregar();await b.carregar();a.responder('p1','o1')
  expect(b.getSnapshot().respostas).toEqual({})
  limparSessoesQuestionario()
  expect(a.getSnapshot().respostas).toEqual({})
  expect(a.getSnapshot().execucao).toBeNull()
})
