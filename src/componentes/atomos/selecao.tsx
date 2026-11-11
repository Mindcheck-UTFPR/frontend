import { useId } from 'react'
import * as Select from '@radix-ui/react-select'
import { IconeInterface } from './iconeInterface'
import '../controles.css'

type Opcao = { valor: string; rotulo: string }
export function Selecao({ rotulo, valor, opcoes, aoMudar, desabilitado = false }: {
  rotulo: string; valor: string; opcoes: Opcao[]; aoMudar: (valor: string) => void; desabilitado?: boolean
}) {
  const id = useId()
  const vazio = '__mindcheck_sem_filtro__'
  return <div className="mc-select">
    <span id={id} className="mc-label">{rotulo}</span>
    <Select.Root value={valor || vazio} onValueChange={v => aoMudar(v === vazio ? '' : v)} disabled={desabilitado}>
      <Select.Trigger className="mc-select-trigger" aria-labelledby={id}>
        <Select.Value/><Select.Icon className="mc-select-chevron"><IconeInterface nome="baixo"/></Select.Icon>
      </Select.Trigger>
      <Select.Portal><Select.Content className="mc-select-content" position="popper" sideOffset={6} collisionPadding={12}>
        <Select.ScrollUpButton className="mc-select-scroll">↑</Select.ScrollUpButton>
        <Select.Viewport>{opcoes.map(o => <Select.Item className="mc-select-item" key={o.valor || vazio} value={o.valor || vazio} textValue={o.rotulo}>
          <Select.ItemText>{o.rotulo}</Select.ItemText><Select.ItemIndicator><IconeInterface nome="check" tamanho={18}/></Select.ItemIndicator>
        </Select.Item>)}</Select.Viewport>
        <Select.ScrollDownButton className="mc-select-scroll">↓</Select.ScrollDownButton>
      </Select.Content></Select.Portal>
    </Select.Root>
  </div>
}
