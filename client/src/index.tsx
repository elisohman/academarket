import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import SignIn from './routes/signin/SignIn';
import SignUp from './routes/signup/SignUp';
import Dashboard from './routes/dashboard/Dashboard';
import Portfolio from './routes/portfolio/Portfolio';
import Trading from './routes/trading/Trading';
import AdminPanel from './routes/adminpanel/AdminPanel';

import { BalanceProvider } from './components/topbar/useBalanceContext'

import reportWebVitals from './reportWebVitals';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

const router = createBrowserRouter([
  {
    path: '/',
    element: <SignIn />
  },
  {
    path: '/signin',
    element: <SignIn />
  },
  {
    path: '/signup',
    element: <SignUp />
  },
  {
    path: '/dashboard',
    element: <Dashboard />
  },
  {
    path: '/portfolio',
    element: <Portfolio />
  },
  {
    path: '/trading',
    element: <Trading />
  },
  {
    path: '/admin',
    element: <AdminPanel />
  }
]);

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <BalanceProvider> 
    <RouterProvider router={router} />
    </BalanceProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
