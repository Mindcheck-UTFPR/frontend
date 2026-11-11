import { useId } from 'react'
import * as ToggleGroup from '@radix-ui/react-toggle-group'
import { m, useReducedMotion } from 'motion/react'
import { IconeInterface } from '../atomos/iconeInterface'
import '../controles.css'

export function CartoesEscolha({ titulo, valor, aoMudar }: { titulo: string; valor: string; aoMudar: (valor: string) => void }) {
  const id = useId()
  const reduzir = useReducedMotion()
  return <div className="mc-choice">
    <p className="mc-label" id={id}>{titulo} <span className="mc-optional">Opcional</span></p>
    <ToggleGroup.Root type="single" value={valor} onValueChange={aoMudar} className="mc-choice-group" aria-labelledby={id} aria-describedby={`${id}-ajuda`}>
      {[{valor:'true',rotulo:'Sim'}, {valor:'false',rotulo:'Não'}].map(opcao => <ToggleGroup.Item key={opcao.valor} value={opcao.valor} className="mc-choice-item">
        {valor === opcao.valor && <m.span className="mc-choice-background" initial={{opacity:0,scale:reduzir?1:0.97}} animate={{opacity:1,scale:1}} transition={reduzir ? {duration:0} : {type:'spring',stiffness:420,damping:34}}/>}
        <span className="mc-choice-text">{opcao.rotulo}</span>
        <span className="mc-choice-check" aria-hidden="true"><IconeInterface nome="check" tamanho={16}/></span>
      </ToggleGroup.Item>)}
    </ToggleGroup.Root>
    <span className="mc-sr-only" id={`${id}-ajuda`}>Toque novamente na opção marcada para desmarcar.</span>
  </div>
}
