import { useLocation, useNavigate } from 'react-router-dom'

import { hasInternalNavigationState } from '../../routes/navigation-state'

type BackButtonProps = {
  fallbackPath: string
  label?: string
}

function BackButton({ fallbackPath, label = 'Voltar' }: BackButtonProps) {
  const navigate = useNavigate()
  const location = useLocation()

  const handleBack = () => {
    if (hasInternalNavigationState(location.state)) {
      navigate(-1)
      return
    }

    navigate(fallbackPath, { replace: true })
  }

  return (
    <button
      type="button"
      className="back-button"
      aria-label={label}
      onClick={handleBack}
    >
      {label}
    </button>
  )
}

export default BackButton