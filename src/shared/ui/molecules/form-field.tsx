import { useState, type InputHTMLAttributes } from 'react'
import { Button } from '../atoms/button'
type Props = InputHTMLAttributes<HTMLInputElement> & { label: string; error?: string; hint?: string }
export function FormField({ id, label, type = 'text', error, hint, ...props }: Props) {
  const [visible, setVisible] = useState(false)
  return <div className="form-field">
    <label htmlFor={id}>{label}</label>
    <div className="form-field__control">
      <input {...props} id={id} type={type === 'password' && visible ? 'text' : type}
        aria-invalid={Boolean(error)} aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined} />
      {type === 'password' && <Button type="button" className="button--subtle" aria-controls={id}
        aria-label={`${visible ? 'Ocultar' : 'Mostrar'} ${label.toLowerCase()}`} aria-pressed={visible}
        onClick={() => setVisible(!visible)}>{visible ? 'Ocultar' : 'Mostrar'}</Button>}
    </div>
    {hint && <small id={`${id}-hint`}>{hint}</small>}
    {error && <small id={`${id}-error`} className="field-error">{error}</small>}
  </div>
}
