import { PieChartOutlined } from "@ant-design/icons";
import { Breadcrumb, Layout, Menu } from "antd";
import Sider from "antd/es/layout/Sider";
import logo from "../../img/logolayout.png";
import { Link, Outlet } from "react-router-dom";
const { Header, Content, Footer } = Layout;

function getItem(label, key, icon, children) {
  return {
    key,
    icon,
    children,
    label: (
      <Link
        to={`/dashboard/${
          key === "sub1" || key === "sub2" || key === "sub3" ? "" : key
        }`}
      >
        {label}
      </Link>
    ),
  };
}
const items = [
  getItem("Dashboard", "/", <PieChartOutlined />),
  getItem("Manage Order", "sub1", <PieChartOutlined />, [
    getItem("Order", "order"),
    getItem("Order Details", "order-details"),
  ]),
  getItem("Manage User", "manage-user", <PieChartOutlined />),
  getItem("Manage Service", "sub2", <PieChartOutlined />, [
    getItem("Extra service", "extra-service"),
    getItem("Delivery", "delivery"),
  ]),
  getItem("Manage Price", "sub3", <PieChartOutlined />, [
    getItem("Price list weight", "price-list-weight"),
    getItem("Price list distance", "price-list-distance"),
    getItem("Box price", "box"),
    getItem("Payment", "payment"),
  ]),
  getItem("Feedback", "feedback", <PieChartOutlined />),
  getItem("Report", "report", <PieChartOutlined />),
  getItem("FAQs", "//", <PieChartOutlined />),
  getItem("Customer Care", "///", <PieChartOutlined />),
];

function Dashboard() {
  return (
    <Layout>
      <Sider style={{ background: "#f5f5f5" }}>
        <div>
          <img src={logo} alt="" />
        </div>
        <h4>KOIKICHI</h4>
        <Menu mode="inline" items={items} />
      </Sider>
      <Layout>
        <Content
          style={{
            paddingTop: "10%",
            margin: "0 16px",
          }}
        >
          <Breadcrumb
            style={{
              margin: "16px 0",
            }}
          >
            <Breadcrumb.Item>User</Breadcrumb.Item>
            <Breadcrumb.Item>Bill</Breadcrumb.Item>
          </Breadcrumb>
          <div>
            <Outlet />
          </div>
        </Content>
        <Footer
          style={{
            textAlign: "center",
          }}
        >
          Ant Design ©{new Date().getFullYear()} Created by Ant UED
        </Footer>
      </Layout>
    </Layout>
  );
}
export default Dashboard;
