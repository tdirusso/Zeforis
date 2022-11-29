import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from 'react-router-dom';
import './index.css';
import AdminLayout from './views/admin';
import ClientLayout from './views/client';
import Login from './views/login';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="login" element={<Login />} />
        <Route path="admin/*" element={<AdminLayout />}>

        </Route>

        <Route path='home/*' element={<ClientLayout />}>

        </Route>

        <Route path="*" element={<Navigate to="login" />} />
      </Routes>
    </Router>
  </React.StrictMode>
);
