type NomeIcone = 'calendario' | 'baixo' | 'esquerda' | 'direita' | 'check' | 'fechar' | 'filtro' | 'pessoa'
export function IconeInterface({ nome, tamanho = 20 }: { nome: NomeIcone; tamanho?: number }) {
  const caminhos = {
    calendario: <><rect x="3" y="5" width="18" height="16" rx="3"/><path d="M7 3v4m10-4v4M3 11h18m-13 4h.01M12 15h.01M16 15h.01"/></>,
    baixo: <path d="m6 9 6 6 6-6"/>,
    esquerda: <path d="m14 6-6 6 6 6"/>,
    direita: <path d="m10 6 6 6-6 6"/>,
    check: <path d="m5 12 4 4L19 6"/>,
    fechar: <path d="m6 6 12 12M18 6 6 18"/>,
    pessoa: <><circle cx="12" cy="8" r="4"/><path d="M4 21v-2a8 8 0 0 1 16 0v2"/></>,
    filtro: <><path d="M4 7h16M7 12h10M10 17h4"/><circle cx="8" cy="7" r="2" fill="currentColor"/></>,
  }
  return <svg aria-hidden="true" width={tamanho} height={tamanho} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{caminhos[nome]}</svg>
}
