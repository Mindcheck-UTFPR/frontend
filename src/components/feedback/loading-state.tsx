type LoadingStateProps = {
    message?: string;
}

const LoadingState = ({ message = "Carregando..." }: LoadingStateProps) => {
    return (
        <section aria-live="polite" role="status">
            <p>{message}</p>
        </section>
    )
}

export default LoadingState
