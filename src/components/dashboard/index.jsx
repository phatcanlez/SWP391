import {
  MenuOutlined,
  PieChartOutlined,
  PushpinOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Breadcrumb, Layout, Menu } from "antd";
import Sider from "antd/es/layout/Sider";
import logo from "../../img/logolayout.png";
import { Link, Outlet } from "react-router-dom";
import Footer from "../../components/footer";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import api from "../../config/axios";
const { Content } = Layout;

function getItem(label, key, icon, children) {
  return {
    key,
    icon,
    children,
    // label: `${
    //   key === "sub1" || key === "sub2" ? (
    //     label
    //   ) : (
    //     <Link to={"/dashboard/key"}> {label.text} </Link>
    //   )
    // }`,
    label: (
      <Link to={`/dashboard/${key === "sub1" || key === "sub2" ? "" : key}`}>
        {label}
      </Link>
    ),
  };
}

function Dashboard() {
  const user = useSelector((store) => store.user);
  const orderView = useSelector((store) => store.order);
  const [approving, setApproving] = useState([]);

  const fetchApproveOrder = async () => {
    try {
      if (orderView != null && orderView.data != null) {
        const order = orderView.data;
        if (!user?.id) return; // kiểm tra nếu user chưa có
        const approvedResponse = await api.get(`/orders/${order.orderID}`);
        setApproving(approvedResponse.data);
      }
    } catch (err) {
      console.error(err);
    }
  };
  console.log(approving);
  useEffect(() => {
    if (user?.id && orderView?.data) {
      fetchApproveOrder();
    }
  }, [user, orderView]);

  const items = [
    getItem("Dashboard", "overview", <PieChartOutlined />),
    getItem("All Orders", "order", <MenuOutlined />, [
      getItem("Waiting", "waiting-order"),
      getItem("Rejected", "rejected-order"),
      orderView?.data
        ? getItem(
            "Approved",
            `view/${orderView.data.orderID}`,
            <PushpinOutlined />
          )
        : null,
      getItem("History", "history"),
    ]),
    getItem("Manage User", "manage-user", <PieChartOutlined />),
    getItem("Manage Service", "sub1", <MenuOutlined />, [
      getItem("Extra service", "extra-service"),
      getItem("Delivery", "delivery"),
    ]),
    getItem("Manage Price", "sub2", <MenuOutlined />, [
      getItem("Price list weight", "price-list-weight"),
      getItem("Price list distance", "price-list-distance"),
      getItem("Box price", "box"),
    ]),
    getItem("Feedback", "feedback", <PieChartOutlined />),
    getItem("Report", "report", <PieChartOutlined />),
    getItem("FAQs", "FAQ", <PieChartOutlined />),
    getItem("My Profile", "profile", <UserOutlined />),
  ];
  return (
    <div>
      <Layout>
        <Sider style={{ background: "#f5f5f5" }}>
          <Link to="/">
            <img src={logo} alt="" />
          </Link>
          <h4>KOIKICHI</h4>
          <Menu mode="inline" items={items} />
        </Sider>
        <Layout>
          <Content
            style={{
              margin: "0 16px",
            }}
          >
            <Breadcrumb
              style={{
                margin: "16px 0",
              }}
            >
              <Breadcrumb.Item></Breadcrumb.Item>
              <Breadcrumb.Item></Breadcrumb.Item>
            </Breadcrumb>

            <div>
              <Outlet />
            </div>
          </Content>
        </Layout>
      </Layout>
      <Footer />
    </div>
  );
}
export default Dashboard;
