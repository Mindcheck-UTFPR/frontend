import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'

import CheckIn from './pages/checkin/checkin'
import Dashboard from './pages/dashboard/dashboard'
import DetailedResult from './pages/dashboard/detailed-result'
import CheckInDetail from './pages/history/checkin-detail'
import DetailQuest from './pages/history/detail-quest'
import History from './pages/history/history'
import HistoryCheckIns from './pages/history/history-checkins'
import QuestHistory from './pages/history/quest-history'
import Home from './pages/home/home'
import ChangePassword from './pages/profile/change-password'
import EditProfile from './pages/profile/edit-profile'
import Profile from './pages/profile/profile'
import QuestAnswers from './pages/questionnaires/quest-answers'
import QuestInstructions from './pages/questionnaires/quest-instructions'
import QuestList from './pages/questionnaires/quest-list'
import QuestResults from './pages/questionnaires/quest-results'
import QuestReview from './pages/questionnaires/quest-review'
import Login from './pages/auth/login'
import Onboarding from './pages/auth/on-boarding'
import PasswordRecovery from './pages/auth/password-recovery'
import SignUp from './pages/auth/sign-up'
import PrivateRoute from './routes/private-route'
import PublicLayout from './components/layouts/public-layout'
import PrivateLayout from './components/layouts/private-layout'

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/onboarding" replace />} />

        <Route element={<PublicLayout />}>
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/password-recovery" element={<PasswordRecovery />} />
        </Route>

        <Route element={<PrivateRoute />}>
          <Route element={<PrivateLayout />}>
            <Route path="/home" element={<Home />} />

            <Route path="/profile" element={<Profile />} />
            <Route path="/profile/edit" element={<EditProfile />} />
            <Route
              path="/profile/change-password"
              element={<ChangePassword />}
            />

            <Route path="/questionnaires" element={<QuestList />} />
            <Route
              path="/questionnaires/:questionnaireId/instructions"
              element={<QuestInstructions />}
            />
            <Route
              path="/questionnaires/:questionnaireId/answer"
              element={<QuestAnswers />}
            />
            <Route
              path="/questionnaires/:questionnaireId/review"
              element={<QuestReview />}
            />
            <Route
              path="/questionnaires/:questionnaireId/result"
              element={<QuestResults />}
            />

            <Route path="/check-in" element={<CheckIn />} />

            <Route path="/history" element={<History />} />
            <Route
              path="/history/questionnaires"
              element={<QuestHistory />}
            />
            <Route
              path="/history/questionnaires/:questionnaireId"
              element={<DetailQuest />}
            />
            <Route
              path="/history/check-ins"
              element={<HistoryCheckIns />}
            />
            <Route
              path="/history/check-ins/:checkInId"
              element={<CheckInDetail />}
            />

            <Route path="/dashboard" element={<Dashboard />} />
            <Route
              path="/dashboard/results/:resultId"
              element={<DetailedResult />}
            />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/onboarding" replace />} />
      </Routes>
    </BrowserRouter>
  )
}