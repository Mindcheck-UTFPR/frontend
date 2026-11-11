import type { ReactNode } from 'react'
import { MotionConfig, LazyMotion, domAnimation, m, useReducedMotion } from 'motion/react'

export function Experiencia({ children }: { children: ReactNode }) {
  return <LazyMotion features={domAnimation} strict><MotionConfig reducedMotion="user" transition={{duration:0.22,ease:[0.22,1,0.36,1]}}>{children}</MotionConfig></LazyMotion>
}
export function EntradaSuave({ children, className }: { children: ReactNode; className?: string }) {
  const reduzir = useReducedMotion()
  return <m.div className={className} initial={{opacity:0,y:reduzir ? 0 : 8}} animate={{opacity:1,y:0}} transition={{duration:reduzir ? 0 : 0.24}}>{children}</m.div>
}
