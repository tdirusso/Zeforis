import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from 'react-router-dom';
import './index.scss';
import HomePage from './pages/Home';
import LoginPage from './pages/Login';
import RegisterPage from './pages/Register';
import RegisterSuccessPage from './pages/Register/RegisterSuccess';
import AcceptInvitationPage from './pages/AcceptInvitation';
import Dashboard from './pages/Home/Dashboard';
import Settings from './pages/Home/Settings';
import FoldersPage from './pages/Home/Folders';
import TasksPage from './pages/Home/Tasks';
import ToolsPage from './pages/Home/Tools';
import AnalyticsPage from './pages/Home/Analytics';
import PasswordResetPage from './pages/PasswordReset';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import themeConfig from './theme';
import CreateOrgPage from './pages/CreateOrg';

const root = ReactDOM.createRoot(document.getElementById('root'));

function App() {
  const [theme, setTheme] = useState(createTheme(themeConfig));

  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Routes>
          <Route path="login" element={<LoginPage setTheme={setTheme} />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="register-success" element={<RegisterSuccessPage />} />
          <Route path="accept-invitation" element={<AcceptInvitationPage />} />
          <Route path="password-reset" element={<PasswordResetPage />} />
          <Route path="create-org" element={<CreateOrgPage setTheme={setTheme} />} />

          <Route path="home/*" element={<HomePage setTheme={setTheme} />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="tasks" element={<TasksPage />} />
            <Route path="folders" element={<FoldersPage />} />
            <Route path="analytics" element={<AnalyticsPage />} />
            <Route path="tools" element={<ToolsPage />} />
            <Route path="settings" element={<Settings />} />
          </Route>

          <Route path="*" element={<Navigate to="login" />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

root.render(<App />);
