import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from 'react-router-dom';
import './index.css';
import AdminPage from './pages/admin';
import HomePage from './pages/home';
import LoginPage from './pages/login';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="login" element={<LoginPage />} />
        <Route path="admin/*" element={<AdminPage />}>

        </Route>

        <Route path='home/*' element={<HomePage />}>

        </Route>

        <Route path="*" element={<Navigate to="login" />} />
      </Routes>
    </Router>
  </React.StrictMode>
);
