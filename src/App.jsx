import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
  useLocation,
} from "react-router-dom";
import LoginPage from "./pages/login";
import RegisterPage from "./pages/register";
import HomePage from "./pages/home";
import Service from "./pages/service";
import Tracking from "./pages/tracking";
import AboutUs from "./pages/about";
import Dashboard from "./components/dashboard";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import CustomerService from "./components/customer-service";
import CreateOrder from "./pages/customer/order/create-order";
import Staff from "./components/staff";
import OrderDetail from "./pages/staff/order/order-detail";
import ManageUser from "./pages/admin/manage-user";
import Box from "./pages/admin/manage-price/box";
import ExtraService from "./pages/admin/manage-service/extraService";
import PriceListWeight from "./pages/admin/manage-price/priceListWeight";
import PriceListDistance from "./pages/admin/manage-price/priceListDistance";
import Feedback from "./pages/admin/feedback";
import Delivery from "./pages/admin/manage-service/delivery";
import AllOrder, {
  FailOrder,
  History,
  WaitingOrder,
} from "./pages/staff/order/manage-order";
import StaffProfile from "./pages/staff/profile";
import AdminProfile from "./pages/admin/profile";
import FAQ from "./components/faq";

import Account from "./pages/customer/account";

import Report from "./pages/admin/manage-report";

import FAQHome from "./pages/FAQ";
import StaffFeedback from "./pages/staff/feedback";
import ViewHistory from "./pages/customer/history";
import ViewOrderDetail from "./pages/customer/view-order";
import Overview from "./pages/admin/overview";
import AllOrder_AD, {
  FailOrder_AD,
  History_AD,
  WaitingOrder_AD,
} from "./pages/admin/manage-order";
import OrderDetail_AD from "./pages/admin/manage-order/order-detail";
import ApproveOrder from "./pages/staff/order/approve-order";
import Reject from "./pages/staff/reject-page";
import OrderSuccess from "./pages/staff/success-page";
import SuccessPage from "./pages/customer/payment/success";
import PaymentFail from "./pages/customer/payment/fail";
import Complain from "./pages/staff/complain";
import CustomerComplain from "./pages/customer/complain";
import CustomerFaqs from "./pages/customer/faqs";
import { useEffect } from "react";
import requestPermissions from "./config/notification";

import StaffList from "./pages/admin/staff-list";

import ManageCustomers from "./pages/admin/manage-user/customer";
import RoomChat from "./components/roomChat";
import ChatDetail from "./components/chat-detail";
import Free from "./pages/staff/free-page";

function App() {
  useEffect(() => {
    requestPermissions();
  }, []);

  const ProtectRouteAuth = ({ children }) => {
    const location = useLocation();
    const user = useSelector((store) => store);
    console.log(user);
    if (
      user &&
      user.user?.role === "MANAGER" &&
      location.pathname.startsWith("/dashboard")
    ) {
      return children;
    }
    if (
      user &&
      user.user?.role === "STAFF" &&
      location.pathname.startsWith("/staff")
    ) {
      return children;
    }
    if (
      user &&
      user.user?.role === "CUSTOMER" &&
      location.pathname.startsWith("/customer-service")
    ) {
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
      path: "FAQ",
      element: <FAQHome />,
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
          path: "overview",
          element: <Overview />,
        },
        {
          path: "order",
          element: <AllOrder_AD />,
        },
        {
          path: "waiting-order",
          element: <WaitingOrder_AD />,
        },
        {
          path: "rejected-order",
          element: <FailOrder_AD />,
        },
        {
          path: "view/:id",
          element: <OrderDetail_AD />,
        },
        {
          path: "history",
          element: <History_AD />,
        },
        {
          path: "report",
          element: <Report />,
        },
        {
          path: "manage-user",
          element: <ManageUser />,
        },
        {
          path: "manage-customer",
          element: <ManageCustomers />,
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
        {
          path: "FAQ",
          element: <FAQ />,
        },
        {
          path: "profile",
          element: <AdminProfile />,
        },
        {
          path: "staff",
          element: <StaffList />,
        },
      ],
    },

    {
      path: "customer-service",
      element: <CustomerService />,
      children: [
        {
          path: "chat",
          element: <RoomChat />,
          children: [
            {
              path: "/customer-service/chat/:id",
              element: <ChatDetail />,
            },
          ],
        },
        {
          path: "account",
          element: <Account />,
        },
        {
          path: "order",
          element: <CreateOrder />,
        },
        {
          path: "history",
          element: <ViewHistory />,
        },
        {
          path: "view-order/:id",
          element: <ViewOrderDetail />,
        },
        // {
        //   path: "payment/:id",
        //   element: <Payment />,
        // },
        {
          path: "cuscomplain",
          element: <CustomerComplain />,
        },
        {
          path: "cusfaq",
          element: <CustomerFaqs />,
        },
      ],
    },

    {
      path: "pay-success",
      element: <SuccessPage />,
    },
    {
      path: "pay-fail",
      element: <PaymentFail />,
    },

    {
      path: "staff",
      element: (
        <ProtectRouteAuth>
          <Staff />
        </ProtectRouteAuth>
      ),
      children: [
        {
          path: "chat",
          element: <RoomChat />,
          children: [
            {
              path: "/staff/chat/:id",
              element: <ChatDetail />,
            },
          ],
        },
        {
          path: "order",
          element: <AllOrder />,
        },
        {
          path: "waiting-order",
          element: <WaitingOrder />,
        },
        {
          path: "rejected-order",
          element: <FailOrder />,
        },
        {
          path: "view/:id",
          element: <OrderDetail />,
        },
        {
          path: "history",
          element: <History />,
        },
        {
          path: "profile",
          element: <StaffProfile />,
        },
        {
          path: "FAQ",
          element: <FAQ />,
        },
        {
          path: "view-feedback",
          element: <StaffFeedback />,
        },
        {
          path: "view-complain",
          element: <Complain />,
        },
        {
          path: "approved",
          element: <ApproveOrder />,
        },
        {
          path: "reject",
          element: <Reject />,
        },
        {
          path: "success",
          element: <OrderSuccess />,
        },
        {
          path: "empty",
          element: <Free />,
        },
      ],
    },
  ]);
  return <RouterProvider router={router} />;
}

export default App;
