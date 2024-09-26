import React from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import LoginPage from './pages/login';
import RegisterPage from './pages/register';
import HomePage from './pages/home';

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
  ]);
  return (
    <RouterProvider router={router}/>
  )
}

export default App