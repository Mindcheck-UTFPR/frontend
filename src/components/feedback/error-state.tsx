type ErrorStateProps = {
    title?: string;
    message?: string;
    onRetry?: () => void;
}

const ErrorState = ({
    title = "Não foi possível carregar os dados",
    message = "Tente novamente em alguns instantes.",
    onRetry,
}: ErrorStateProps) => {
    return (
        <section role="alert">
            <h2>{title}</h2>
            <p>{message}</p>

            {onRetry && (
                <button type="button" onClick={onRetry}>
                    Tentar novamente
                </button>
            )}
        </section>
    )
}

export default ErrorState