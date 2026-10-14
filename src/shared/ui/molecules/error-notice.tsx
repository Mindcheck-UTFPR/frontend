export function ErrorNotice({ message }: { message: string }) {
  return message ? <p className="error-notice" role="alert" tabIndex={-1}>{message}</p> : null
}
