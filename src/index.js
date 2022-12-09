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
import Dashboard from './pages/Home/Dashboard';
import ClientView from './pages/Home/ClientView';
import FolderView from './components/core/FolderView';
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

          <Route path="home/*" element={<HomePage setTheme={setTheme} />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="settings" element={<Settings />} />
            <Route exact path="client/:clientName/" element={<ClientView />}>
              <Route path='folders/*' element={<FolderView />} />
            </Route>
          </Route>
          
          <Route path="*" element={<Navigate to="login" />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

root.render(<App />);
