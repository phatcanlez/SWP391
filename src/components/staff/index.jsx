import { Layout, Menu } from "antd";
import { Link, Outlet } from "react-router-dom";
const { Content, Sider } = Layout;
import logo from "../../img/logolayout.png";
import "../staff/index.css";
import {
  ClockCircleOutlined,
  CloseOutlined,
  ExclamationOutlined,
  FrownOutlined,
  GlobalOutlined,
  MessageOutlined,
  PushpinOutlined,
  QuestionCircleOutlined,
  StarOutlined,
  UsergroupAddOutlined,
  UserOutlined,
} from "@ant-design/icons";
import Footer from "../footer";
import { useSelector } from "react-redux";
function getItem(label, key, icon, children) {
  return {
    key,
    icon,
    children,
    label: <Link to={`/staff/${key}`}>{label}</Link>,
  };
}

function Staff() {
  const user = useSelector((store) => store.user);

  const items = [
    user?.country === "vietnam"
      ? getItem(
          "Domestic - Waiting",
          "waiting-domestic",
          <ExclamationOutlined />
        )
      : null,
    getItem("Oversea", "", <GlobalOutlined />, [
      getItem("Waiting", "waiting-oversea"),
      getItem("A staff approved", "waiting-2nd-staff"),
    ]),

    getItem(
      "Waiting another staff",
      "wait-for-staff",
      <UsergroupAddOutlined />
    ),
    getItem("Approved", "approved", <PushpinOutlined />),
    getItem("Fail", "rejected-order", <CloseOutlined />),
    getItem("History", "history", <ClockCircleOutlined />),
    getItem("FAQ", "FAQ", <QuestionCircleOutlined />),
    getItem("Feedback", "view-feedback", <StarOutlined />),
    getItem("Complain", "view-complain", <FrownOutlined />),
    getItem("Message", "chat", <MessageOutlined />),
    getItem("My Profile", "profile", <UserOutlined />),
  ].filter(Boolean);

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
export default Staff;
