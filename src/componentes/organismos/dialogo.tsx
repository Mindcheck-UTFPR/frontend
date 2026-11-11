import type { ReactElement, ReactNode } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import '../controles.css'

export function Dialogo({ aberto, aoMudar, titulo, descricao, travado = false, children, className = '' }: {
  aberto: boolean; aoMudar: (aberto: boolean) => void; titulo: string; descricao: string
  travado?: boolean; children: ReactNode; className?: string
}) {
  return <Dialog.Root open={aberto} onOpenChange={v => { if (!travado) aoMudar(v) }}>
    <Dialog.Portal><Dialog.Overlay className="mc-dialog-overlay"/><Dialog.Content className={`mc-dialog ${className}`} onEscapeKeyDown={e => { if (travado) e.preventDefault() }} onPointerDownOutside={e => { if (travado) e.preventDefault() }}>
      <Dialog.Title>{titulo}</Dialog.Title><Dialog.Description>{descricao}</Dialog.Description>{children}
    </Dialog.Content></Dialog.Portal>
  </Dialog.Root>
}
export function FecharDialogo({ children }: { children: ReactElement }) {
  return <Dialog.Close asChild>{children}</Dialog.Close>
}
