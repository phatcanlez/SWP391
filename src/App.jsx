import React from "react";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
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
import StaffOrder from "./pages/staff/order/manage-order";
import Staff from "./components/staff";
import OrderDetail from "./pages/staff/order/order-detail";
import ManageUser from "./pages/admin/manage-user";
import Box from "./pages/admin/manage-price/box";
import ExtraService from "./pages/admin/manage-service/extraService";
import PriceListWeight from "./pages/admin/manage-price/priceListWeight";
import PriceListDistance from "./pages/admin/manage-price/priceListDistance";
import Feedback from "./pages/admin/feedback";
import Delivery from "./pages/admin/manage-service/delivery";

function App() {
  const ProtectRouteAuth = ({ children }) => {
    const user = useSelector((store) => store);
    console.log(user);
    if (user && user.user?.role === "MANAGER") {
      return children;
    } else toast.error("You are not allow");
    return <Navigate to={"/"} />;
  };

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
      element: (
        <ProtectRouteAuth>
          <Dashboard />
        </ProtectRouteAuth>
      ),
      children: [
        {
          path: "manage-user",
          element: <ManageUser />,
        },
        {
          path: "extra-service",
          element: <ExtraService />,
        },
        {
          path: "delivery",
          element: <Delivery />,
        },
        {
          path: "price-list-weight",
          element: <PriceListWeight />,
        },
        {
          path: "price-list-distance",
          element: <PriceListDistance />,
        },
        {
          path: "box",
          element: <Box />,
        },
        {
          path: "feedback",
          element: <Feedback />,
        },
      ],
    },

    {
      path: "customer-service",
      element: <CustomerService />,
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

    {
      path: "staff",
      element: <Staff />,
      children: [
        {
          path: "order",
          element: <StaffOrder />,
        },
        {
          path: "view/:id",
          element: <OrderDetail />,
        },
      ],
    },
  ]);
  return <RouterProvider router={router} />;
}

export default App;
