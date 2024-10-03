import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LoginPage from "./pages/login";
import RegisterPage from "./pages/register";
import HomePage from "./pages/home";
import Service from "./pages/service";
import Tracking from "./pages/tracking";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <HomePage />,
    },
    {
      path: "login",
      element: <LoginPage />,
    },
    {
      path: "register",
      element: <RegisterPage />,
    },
    {
      path: "/service",
      element: <Service />,
    },
    {
      path: "/tracking",
      element: <Tracking />,
    },
  ]);
  return <RouterProvider router={router} />;
}

export default App;
