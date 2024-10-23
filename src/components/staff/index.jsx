import { Layout, Menu } from "antd";
import { Link, Outlet } from "react-router-dom";
const { Content, Sider } = Layout;
import logo from "../../img/logolayout.png";
import "../staff/index.css";
import {
  ClockCircleOutlined,
  CommentOutlined,
  MenuOutlined,
  QuestionCircleOutlined,
  UserOutlined,
} from "@ant-design/icons";
import Footer from "../footer";
import { useEffect, useState } from "react";
import api from "../../config/axios";
import {  useSelector } from "react-redux";
function getItem(label, key, icon, children) {
  return {
    key,
    icon,
    children,
    label: <Link to={`/staff/${key}`}>{label}</Link>,
  };
}

const Staff = () => {
  
  const user = useSelector((store) => store.user);
  const [approving, setApproving] = useState([]);
  const [loading, setLoading] = useState(true);
  const orderView = useSelector((store) => store.order);
  const order = orderView.data
  console.log(order);
  
  const fetchApproveOrder = async () => {
    try {
      if (!user?.id) return; // kiểm tra nếu user chưa có
      const approvedResponse = await api.get(`/orders/${order.orderID}`);
      console.log(approvedResponse.data);
      const response = approvedResponse.data;
      setApproving(response);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  console.log(approving);
  useEffect(() => {
    fetchApproveOrder();
  }, []);
 
  const items = [
    getItem(
      "All Orders",
      "order",
      <MenuOutlined />,
      [
        getItem("Waiting", "waiting-order"),
        order ? getItem("Approved", `view/${order.orderID}`) : null, // chỉ render nếu có dữ liệu
        getItem("Rejected", "rejected-order"),
      ].filter(Boolean) // loại bỏ phần tử null
    ), // loại bỏ phần tử null
    getItem("Order History", "history", <ClockCircleOutlined />),
    getItem("FAQ", "FAQ", <QuestionCircleOutlined />),
    getItem("Feedback", "view-feedback", <CommentOutlined />),
    getItem("My Profile", "profile", <UserOutlined />),
  ];

  if (loading) {
    return <div>Loading...</div>; // render loading nếu đang fetch dữ liệu
  }

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
