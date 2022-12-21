import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from 'react-router-dom';
import './index.css';
import HomePage from './pages/Home';
import LoginPage from './pages/Login';
import RegisterPage from './pages/Register';
import RegisterSuccessPage from './pages/Register/RegisterSuccess';
import CompleteRegistrationPage from './pages/CompleteRegistration';
import Dashboard from './pages/Home/Dashboard';
import Settings from './pages/Home/Settings';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import themeConfig from './theme';

const root = ReactDOM.createRoot(document.getElementById('root'));

function App() {
  const [theme, setTheme] = useState(createTheme(themeConfig));

  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Routes>
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="register-success" element={<RegisterSuccessPage />} />
          <Route path="complete-registration" element={<CompleteRegistrationPage />} />

          <Route path="home/*" element={<HomePage setTheme={setTheme} />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="settings" element={<Settings />} />
          </Route>

          <Route path="*" element={<Navigate to="login" />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

root.render(<App />);
