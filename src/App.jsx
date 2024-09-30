import React from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import LoginPage from './pages/login';
import RegisterPage from './pages/register';
import HomePage from './pages/home';            
import AboutUs from './pages/about';
import ManageOrder from './pages/admin/manage-order';
import Dashboard from './components/dashboard';

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <HomePage/>,
    },
    {
      path: "login",
      element: <LoginPage/>,
    },
    {
      path: "register",
      element: <RegisterPage/>,
    },
    {
      path: "about",
      element: <AboutUs/>,
    },
    {
      path: "dashboard",
      element: <Dashboard/>,
      children: [
        {
          path: "customer",
          element: <ManageOrder/>
        }
      ]
    },
  ]);
  return (
    <RouterProvider router={router}/>
  )
}

export default App