import React from "react";
import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";
import LoginPage from "./pages/login";
import RegisterPage from "./pages/register";
import HomePage from "./pages/home";
import Service from "./pages/service";
import Tracking from "./pages/tracking";
import AboutUs from "./pages/about";
import Dashboard from "./components/dashboard";
import ManageOrder from "./pages/admin/manage-order";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

function App() {


  const ProtectRouteAuth = ({ children }) => {
    const user = useSelector((store) => store);
    console.log(user)
    if (user && user?.role === "MANAGER") {
      return children;
    }
    toast.error("You are not allow");
    return <Navigate to={"/login"} />
  }


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
      path: "about",
      element: <AboutUs />,
    },
    {
      path: "service",
      element: <Service />,
    },
    {
      path: "tracking",
      element: <Tracking />,
    },
    {
      path: "dashboard",
      element: <ProtectRouteAuth>
        <Dashboard />
      </ProtectRouteAuth>,
      children: [
        {
          path: "customer",
          element: <ManageOrder />,
        },
      ],
    },
  ]);
  return <RouterProvider router={router} />;
}

export default App;
