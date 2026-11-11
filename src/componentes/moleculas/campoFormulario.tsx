import { useState, type InputHTMLAttributes } from 'react'
import { Botao } from '../atomos/botao'
type Props = InputHTMLAttributes<HTMLInputElement> & {
  label: string
  error?: string
  hint?: string
}
export function CampoFormulario({ id, label, type = 'text', error, hint, ...props }: Props) {
  const [visible, setVisible] = useState(false)
  return (
    <div className="form-field">
      <label htmlFor={id}>{label}</label>
      <div className="form-field__control">
        <input
          {...props}
          id={id}
          type={type === 'password' && visible ? 'text' : type}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
        />
        {type === 'password' && (
          <Botao
            type="button"
            className="button--subtle password-toggle"
            aria-controls={id}
            aria-label={`${visible ? 'Ocultar' : 'Mostrar'} ${label.toLowerCase()}`}
            aria-pressed={visible}
            onClick={() => setVisible(!visible)}
          >
            <svg aria-hidden="true" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/>{visible && <path d="m3 3 18 18"/>}</svg>
          </Botao>
        )}
      </div>
      {hint && <small id={`${id}-hint`}>{hint}</small>}
      {error && (
        <small id={`${id}-error`} className="field-error">
          {error}
        </small>
      )}
    </div>
  )
}
