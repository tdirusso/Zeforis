import React, { useState, lazy, Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from 'react-router-dom';
import './index.scss';
// import HomePage from './pages/Home';
// import LoginPage from './pages/Login';
// import RegisterPage from './pages/Register';
import RegisterSuccessPage from './pages/Register/RegisterSuccess';
import AcceptInvitationPage from './pages/AcceptInvitation';
import DashboardPage from './pages/Home/Dashboard';
import SettingsPage, { SettingsSection } from './pages/Home/Settings';
import FoldersPage from './pages/Home/Folders/FoldersPage';
import TasksPage from './pages/Home/Tasks';
import ToolsPage from './pages/Home/Tools';
import AnalyticsPage from './pages/Home/Analytics';
import PasswordResetPage from './pages/PasswordReset';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import themeConfig from './theme';
import CreateOrgPage from './pages/CreateOrg';
import { ErrorBoundary } from './components/core/ErrorBoundary';
import Collaborators from './components/core/settings/engagement/Collaborators';
import Tags from './components/core/settings/engagement/Tags';
import About from './components/core/settings/engagement/About';
import AboutOrg from './components/core/settings/org/About';
import Members from './components/core/settings/org/Members';
import Profile from './components/core/settings/account/Profile';
import Billing from './components/core/settings/account/Billing';
import TaskPage from './pages/Home/Tasks/Task';

const LoginPage = lazy(() => import('./pages/Login'));
const RegisterPage = lazy(() => import('./pages/Register'));
const HomePage = lazy(() => import('./pages/Home'));

const root = ReactDOM.createRoot(document.getElementById('root'));

function App() {
  const [theme, setTheme] = useState(createTheme(themeConfig));

  return (
    <ThemeProvider theme={theme}>
      <ErrorBoundary>
        <Router>
          <Routes>
            <Route path="login" element={<Suspense fallback={<>loading com</>}> <LoginPage setTheme={setTheme} /></Suspense>} />
            <Route path="register" element={<RegisterPage />} />
            <Route path="register-success" element={<RegisterSuccessPage />} />
            <Route path="accept-invitation" element={<AcceptInvitationPage />} />
            <Route path="password-reset" element={<PasswordResetPage />} />
            <Route path="create-org" element={<CreateOrgPage setTheme={setTheme} />} />

            <Route path="home/*" element={<HomePage setTheme={setTheme} />}>
              <Route path="dashboard" element={<DashboardPage />} />
              <Route path="tasks" element={<TasksPage />} />
              <Route path="tasks/:taskId" element={<TaskPage />} />
              <Route path="folders" element={<FoldersPage />} />
              <Route path="analytics" element={<AnalyticsPage />} />
              <Route path="tools" element={<ToolsPage />} />

              <Route path="settings" element={<SettingsPage />}>
                <Route path="engagement" element={<SettingsSection />}>
                  <Route path="collaborators" element={<Collaborators />} />
                  <Route path="tags" element={<Tags />} />
                  <Route path="about" element={<About />} />
                </Route>
                <Route path="organization" element={<SettingsSection />}>
                  <Route path="members" element={<Members />} />
                  <Route path="about" element={<AboutOrg />} />
                </Route>
                <Route path="account" element={<SettingsSection />}>
                  <Route path="profile" element={<Profile />} />
                  <Route path="billing" element={<Billing />} />
                </Route>
                <Route path="*" element={<Navigate to="engagement/collaborators" />} />
              </Route>

            </Route>

            <Route path="*" element={<Navigate to="login" />} />
          </Routes>
        </Router>
      </ErrorBoundary>
    </ThemeProvider>
  );
}

root.render(<App />);
