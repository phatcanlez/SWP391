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
import ManageOrder from "./pages/admin/manage-order";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import CustomerService from "./components/customer-service";
import CreateOrder from "./pages/customer/order/create-order";
import Staff from "./components/staff";
import OrderDetail from "./pages/staff/order/order-detail";
import AllOrder, {
  FailOrder,
  History,
  WaitingOrder,
} from "./pages/staff/order/manage-order";
import StaffProfile from "./pages/staff/profile";
import FAQ from "./components/faq";
import FAQHome from "./pages/FAQ";
import Feedback from "./pages/staff/feedback";

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
          path: "order",
          element: <ManageOrder />,
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
          element: <Feedback />,
        },
      ],
    },
  ]);
  return <RouterProvider router={router} />;
}

export default App;
