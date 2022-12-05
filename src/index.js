import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from 'react-router-dom';
import './index.css';
import AdminPage from './pages/Admin';
import HomePage from './pages/Home';
import LoginPage from './pages/Login';
import AdminDashboard from './pages/Admin/Dashboard';
import AddClient from './pages/Admin/AddCliient';
import ClientView from './pages/Admin/ClientView';
import FolderView from './components/core/FolderView';
import AdminSettings from './pages/Admin/Settings';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#267ffd'
    }
  },
  typography: {
    fontSize: 16,
  },
  components: {
    MuiButton: {
      defaultProps: {
        disableRipple: true
      },
      styleOverrides: {
        root: {
          textTransform: 'none',
          boxShadow: 'none',
          fontWeight: 400,
          borderRadius: '6px',
          transitionDuration: '0s',
          '&:hover': {
            boxShadow: 'none'
          }
        }
      }
    },
    MuiTextField: {
      defaultProps: {
        InputLabelProps: {
          sx: {
            fontWeight: 300
          }
        },
        inputProps: {
          sx: {
            fontWeight: 300
          }
        }
      },
    },
    MuiAlertTitle: {
      defaultProps: {
        sx: {
          fontWeight: 300
        }
      }
    }
  }
});

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <Router>
        <Routes>
          <Route path="login" element={<LoginPage />} />
          <Route path="admin/*" element={<AdminPage />}>
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="settings" element={<AdminSettings />} />
            <Route path="addClient" element={<AddClient />} />

            <Route exact path="client/:clientName/" element={<ClientView />}>
              <Route path='folders/*' element={<FolderView />} />
            </Route>

          </Route>

          <Route path='home/*' element={<HomePage />}>

          </Route>

          <Route path="*" element={<Navigate to="login" />} />
        </Routes>
      </Router>
    </ThemeProvider>
  </React.StrictMode>
);
