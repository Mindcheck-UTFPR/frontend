type EmptyStateProps = {
  title: string
  message?: string
}

const EmptyState = ({ title, message }: EmptyStateProps) => {
  return (
    <section className="empty-state">
      <h2>{title}</h2>
      {message && <p>{message}</p>}
    </section>
  )
}

export default EmptyState