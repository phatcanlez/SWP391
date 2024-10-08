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
import CustomerService from "./components/customer-service";
import CreateOrder from "./pages/customer/order/create-order";
import DeliveryMethod from "./pages/customer/order/delivery-method";

function App() {


  const ProtectRouteAuth = ({ children }) => {
    const user = useSelector((store) => store);
    console.log(user)
    if (user && user?.role === "MANAGER") {
      return children;
    }
    else
      toast.error("You are not allow");
    return <Navigate to={"/"} />
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
      </ProtectRouteAuth>
      ,
      children: [
        {
          path: "order",
          element: <ManageOrder />,
        },
      ],
    },

    {
      path: "customer-service",
      element:
        <CustomerService />
      ,
      children: [
        {
          path: "order",
          element: <CreateOrder />,
        },
        {
          path: "delivery-method",
          element: <DeliveryMethod />,
        },
      ],
    },



  ]);
  return <RouterProvider router={router} />;
}

export default App;
