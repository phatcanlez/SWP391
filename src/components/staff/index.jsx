import { Layout, Menu, theme } from "antd";
import { Link, Outlet } from "react-router-dom";
const { Content, Sider } = Layout;
import logo from "../../img/logolayout.png";
import "../staff/index.css";
import { ClockCircleOutlined, CommentOutlined, MenuOutlined, QuestionCircleOutlined, UserOutlined } from "@ant-design/icons";
function getItem(label, key, icon, children) {
  return {
    key,
    icon,
    children,
    label: <Link to={`/staff/${key}`}>{label}</Link>,
  };
}
const items = [
  getItem("All Orders", "order", <MenuOutlined />, [
    getItem("Waiting", "waiting-order"),
    getItem("Processing", "processing-order"),
  ]),
  getItem("Order History", "history", <ClockCircleOutlined />,),
  getItem("FAQ", "FAQ", <QuestionCircleOutlined />),
  getItem("Support", "support", <CommentOutlined />),
  getItem("My Profile", "profile", <UserOutlined />),
];

const Staff = () => {
  const {
    token: { borderRadiusLG },
  } = theme.useToken();
  return (
    
    <Layout
      className="sider"
      style={{
        minHeight: "100vh",
      }}
    >
      <Sider>
        <div>
          <img src={logo} alt="" />
        </div>
        <h4>KOIKICHI</h4>
        <Menu mode="inline" items={items} />
      </Sider>
      <Layout>
        
        <Content
          style={{
            margin: "0 16px",
          }}
        >
          <div
            style={{
              padding: 24,
              minHeight: 360,
              borderRadius: borderRadiusLG,
            }}
          >
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};
export default Staff;
