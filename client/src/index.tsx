import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import SignIn from './routes/signin/SignIn';
import SignUp from './routes/signup/SignUp';
import Dashboard from './routes/dashboard/Dashboard';
import Portfolio from './routes/portfolio/Portfolio';
import Trading from './routes/trading/Trading';
import AdminPanel from './routes/adminpanel/AdminPanel';

import UserContext, { UserProvider } from './contexts/UserContext'

import reportWebVitals from './reportWebVitals';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ProtectedRoute from './components/protectedroute/ProtectedRoute';
import { AuthProvider } from './contexts/AuthContext';
import PageWrapper from './components/pagewrapper/PageWrapper';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode> 
      <Router>
        <AuthProvider>
          <UserProvider>
            <PageWrapper>
              <Routes>
                <Route path="/" element={<SignIn />} />
                <Route path="/signin" element={<SignIn />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                <Route path="/portfolio" element={<ProtectedRoute><Portfolio /></ProtectedRoute>} />
                <Route path="/trading" element={<ProtectedRoute><Trading /></ProtectedRoute>} />
                <Route path="/admin" element={<ProtectedRoute><AdminPanel /></ProtectedRoute>} />
              </Routes>
            </PageWrapper>
          </UserProvider>
        </AuthProvider>
      </Router>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
