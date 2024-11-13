import { Layout, Menu } from "antd";
import { Link, Outlet } from "react-router-dom";
const { Content, Sider } = Layout;
import logo from "../../img/logolayout.png";
import "../staff/index.css";
import {
  ClockCircleOutlined,
  CommentOutlined,
  FrownOutlined,
  MenuOutlined,
  PushpinOutlined,
  QuestionCircleOutlined,
  UserOutlined,
} from "@ant-design/icons";
import Footer from "../footer";
function getItem(label, key, icon, children) {
  return {
    key,
    icon,
    children,
    label: <Link to={`/staff/${key}`}>{label}</Link>,
  };
}

const Staff = () => {
  const items = [
    getItem("All Orders", "order", <MenuOutlined />, [
      getItem("Waiting", "waiting-order"),
      getItem("Rejected", "rejected-order"),
    ]),
    getItem("Approved", "approved", <PushpinOutlined />),
    getItem("History", "history", <ClockCircleOutlined />),
    getItem("FAQ", "FAQ", <QuestionCircleOutlined />),
    getItem("Feedback", "view-feedback", <CommentOutlined />),
    getItem("Complain", "view-complain", <FrownOutlined />),
    getItem("My Profile", "profile", <UserOutlined />),
  ].filter(Boolean); // filter out null items

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
};
export default Staff;
