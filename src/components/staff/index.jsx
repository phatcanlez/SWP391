import { Layout, Menu, theme } from "antd";
import { Link, Outlet, useLocation } from "react-router-dom";
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
import { useDispatch, useSelector } from "react-redux";
import { approve, done } from "../../redux/features/orderSlice";
function getItem(label, key, icon, children) {
  return {
    key,
    icon,
    children,
    label: <Link to={`/staff/${key}`}>{label}</Link>,
  };
}

const Staff = () => {
  const dispatch = useDispatch();
  const user = useSelector((store) => store.user);
  const [approving, setApproving] = useState([]);
  const [loading, setLoading] = useState(true);
 
  const fetchApproveOrder = async () => {
    try {
      if (!user?.id) return; // kiểm tra nếu user chưa có

      const approvedResponse = await api.get(
        `/orders/status-emp?status=APPROVED&empId=${user.id}`
      );

      if (approvedResponse.data.length > 0) {
        setApproving(approvedResponse.data);
        dispatch(approve(approvedResponse.data));
      } else {
        dispatch(done()); // không có đơn approved -> fetch đơn pending
        const pendingResponse = await api.get(
          `/orders/status-emp?status=PENDING&empId=${user.id}`
        );
        setApproving(pendingResponse.data || []);
        if (pendingResponse.data.length > 0) {
          dispatch(approve(pendingResponse.data));
        }
      }
    } catch (err) {
      console.error("Lỗi khi lấy dữ liệu:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApproveOrder();
  }, []);

  const items = [
    getItem("All Orders", "order", <MenuOutlined />, [
      getItem("Waiting", "waiting-order"),
      approving.length > 0
        ? getItem("Approved", `view/${approving[0].orderID}`)
        : null, // chỉ render nếu có dữ liệu
      getItem("Rejected", "rejected-order"),
    ].filter(Boolean)), // loại bỏ phần tử null
    getItem("Order History", "history", <ClockCircleOutlined />),
    getItem("FAQ", "FAQ", <QuestionCircleOutlined />),
    getItem("Support", "support", <CommentOutlined />),
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
            <div>
              <img src={logo} alt="" />
            </div>
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
