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
import AdminMain from './pages/Admin/Main';
import AddClient from './pages/Admin/AddCliient';
import ClientView from './pages/Admin/ClientView';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="login" element={<LoginPage />} />
        <Route path="admin/*" element={<AdminPage />}>
          <Route index element={<AdminMain />} />
          <Route path="addClient" element={<AddClient />} />
          <Route path="client/*" element={<ClientView />} />
        </Route>

        <Route path='home/*' element={<HomePage />}>

        </Route>

        <Route path="*" element={<Navigate to="login" />} />
      </Routes>
    </Router>
  </React.StrictMode>
);
