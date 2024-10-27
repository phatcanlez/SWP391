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
  ProcessingOrder,
  WaitingOrder,
} from "./pages/staff/order/manage-order";
import StaffProfile from "./pages/staff/profile";
import FAQ from "./components/faq";

import Account from "./pages/customer/account";

import Report from "./pages/admin/manage-report";
import Order from "./pages/admin/manage-order/order";
import Overview from "./pages/admin/overview";

function App() {
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
          path: "overview",
          element: <Overview />,
        },
        {
          path: "report",
          element: <Report />,
        },
        {
          path: "order",
          element: <Order />,
        },
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
        {
          path: "FAQ",
          element: <FAQ />,
        },
      ],
    },

    {
      path: "customer-service",
      element: <CustomerService />,
      children: [
        {
          path: "account",
          element: <Account />,
        },
        {
          path: "order",
          element: <CreateOrder />,
        },
      ],
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
          path: "order",
          element: <AllOrder />,
        },
        {
          path: "waiting-order",
          element: <WaitingOrder />,
        },
        {
          path: "approved-order",
          element: <ProcessingOrder />,
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
      ],
    },
  ]);
  return <RouterProvider router={router} />;
}

export default App;
