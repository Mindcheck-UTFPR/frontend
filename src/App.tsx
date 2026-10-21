import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { useEffect } from 'react'
import { sessionStore } from './features/auth/session'
import { LogoutButton } from './features/auth/logout-button'

import { CheckinDiario } from './pages/checkin/checkinDiario'
import { Painel } from './pages/dashboard/painel'
import { ResultadoDetalhado } from './pages/dashboard/resultadoDetalhado'
import { DetalheCheckin } from './pages/history/detalheCheckin'
import { DetalheQuestionario } from './pages/history/detalheQuestionario'
import { Historico } from './pages/history/historico'
import { HistoricoCheckins } from './pages/history/historicoCheckins'
import { HistoricoQuestionarios } from './pages/history/historicoQuestionarios'
import { Inicio } from './pages/home/inicio'
import { AlterarSenha } from './pages/profile/alterarSenha'
import { EditarPerfil } from './pages/profile/editarPerfil'
import { Perfil } from './pages/profile/perfil'
import { RespostasQuestionario } from './pages/questionnaires/respostasQuestionario'
import { InstrucoesQuestionario } from './pages/questionnaires/instrucoesQuestionario'
import { ListaQuestionarios } from './pages/questionnaires/listaQuestionarios'
import { ResultadoQuestionario } from './pages/questionnaires/resultadoQuestionario'
import { RevisaoQuestionario } from './pages/questionnaires/revisaoQuestionario'
import { Login } from './pages/auth/login'
import { BoasVindas } from './pages/auth/boasVindas'
import { RecuperacaoSenha } from './pages/auth/recuperacaoSenha'
import { Cadastro } from './pages/auth/cadastro'
import { RotaPrivada } from './routes/rotaPrivada'
import { LayoutPublico } from './componentes/modelos/layoutPublico'
import { LayoutPrivado } from './componentes/modelos/layoutPrivado'

export function App() {
  useEffect(() => {
    void sessionStore.restore()
    const verify = () => {
      if (document.visibilityState === 'visible') void sessionStore.verify()
    }
    const interval = window.setInterval(verify, 60_000)
    window.addEventListener('focus', verify)
    document.addEventListener('visibilitychange', verify)
    return () => {
      window.clearInterval(interval)
      window.removeEventListener('focus', verify)
      document.removeEventListener('visibilitychange', verify)
    }
  }, [])
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/onboarding" replace />} />

        <Route element={<LayoutPublico />}>
          <Route path="/onboarding" element={<BoasVindas />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Cadastro />} />
          <Route path="/password-recovery" element={<RecuperacaoSenha />} />
        </Route>

        <Route element={<RotaPrivada />}>
          <Route element={<LayoutPrivado acaoConta={<LogoutButton />} />}>
            <Route path="/home" element={<Inicio />} />

            <Route path="/profile" element={<Perfil />} />
            <Route path="/profile/edit" element={<EditarPerfil />} />
            <Route path="/profile/change-password" element={<AlterarSenha />} />

            <Route path="/questionnaires" element={<ListaQuestionarios />} />
            <Route
              path="/questionnaires/:questionnaireId/instructions"
              element={<InstrucoesQuestionario />}
            />
            <Route
              path="/questionnaires/:questionnaireId/answer"
              element={<RespostasQuestionario />}
            />
            <Route
              path="/questionnaires/:questionnaireId/review"
              element={<RevisaoQuestionario />}
            />
            <Route
              path="/questionnaires/:questionnaireId/result"
              element={<ResultadoQuestionario />}
            />

            <Route path="/check-in" element={<CheckinDiario />} />

            <Route path="/history" element={<Historico />} />
            <Route path="/history/questionnaires" element={<HistoricoQuestionarios />} />
            <Route
              path="/history/questionnaires/:questionnaireId"
              element={<DetalheQuestionario />}
            />
            <Route path="/history/check-ins" element={<HistoricoCheckins />} />
            <Route path="/history/check-ins/:checkInId" element={<DetalheCheckin />} />

            <Route path="/dashboard" element={<Painel />} />
            <Route path="/dashboard/results/:resultId" element={<ResultadoDetalhado />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/onboarding" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
