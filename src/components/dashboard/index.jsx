import { PieChartOutlined } from "@ant-design/icons";
import { Breadcrumb, Layout, Menu } from "antd";
import Sider from "antd/es/layout/Sider";
import logo from "../../img/logolayout.png";
import { Link, Outlet } from "react-router-dom";
import "../staff/index.css";
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
  getItem("Dashboard", "", <PieChartOutlined />),
  getItem("Manage Order", "order", <PieChartOutlined />),
  getItem("Manage User", "manage-user", <PieChartOutlined />),
  getItem("Manage Service", "sub2", <PieChartOutlined />, [
    getItem("Extra service", "extra-service"),
    getItem("Delivery", "delivery"),
  ]),
  getItem("Manage Price", "sub3", <PieChartOutlined />, [
    getItem("Price list weight", "price-list-weight"),
    getItem("Price list distance", "price-list-distance"),
    getItem("Box price", "box"),
  ]),
  getItem("Feedback", "feedback", <PieChartOutlined />),
  getItem("Report", "report", <PieChartOutlined />),
  getItem("FAQs", "//", <PieChartOutlined />),
  getItem("Customer Care", "///", <PieChartOutlined />),
];

function Dashboard() {
  return (
    <div style={{ marginTop: "20px" }}>
      <Layout
        style={{
          minHeight: "100vh",
        }}
      >
        <Sider className="sider">
          <div className="sider__header">
            <Link to="/">
              <img src={logo} alt="" />
            </Link>
            <h4>KOIKICHI</h4>
          </div>
          <Menu mode="inline" items={items} />
        </Sider>
        <Layout>
          <Content
            className="ctn"
            style={{
              margin: "0 16px",
            }}
          >
            <div
              style={{
                padding: 24,
                minHeight: 360,
              }}
            >
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
