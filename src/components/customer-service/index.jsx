import React, { useState } from "react";
import {
  ExclamationCircleOutlined,
  FormOutlined,
  HistoryOutlined,
  QuestionCircleOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Layout, Menu, theme } from "antd";
import { Link, Outlet, useNavigate } from "react-router-dom";
import logo from "../../img/logolayout.png";
import "./index.css";
const { Header, Content, Footer, Sider } = Layout;

function getItem(label, key, icon, children) {
  return {
    key,
    icon,
    children,
    label: <Link to={`/customer-service/${key}`}>{label}</Link>,
  };
}
const items = [
  getItem("Account", "account", <UserOutlined />),
  getItem("Create Order", "order", <FormOutlined />),
  getItem("Orders History", "history", <HistoryOutlined />),
  getItem("Complain", "cuscomplain", <ExclamationCircleOutlined />),
  getItem("FAQs", "cusfaq", <QuestionCircleOutlined />),
];

const CustomerService = () => {
  const [current, setCurrent] = useState("");
  const [orderData, setOrderData] = useState({
    account: {},
    fish: {},
    // Thêm các phần khác của đơn hàng nếu cần
  });
  const navigate = useNavigate();

  const onClick = (e) => {
    console.log("click ", e);
    setCurrent(e.key);
    navigate(`/customer-service/${e.key}`);
  };

  const updateOrderData = (section, data) => {
    setOrderData((prevData) => ({
      ...prevData,
      [section]: data,
    }));
  };

  return (
    <div className="menu">
      <div className="submenu" style={{ display: "flex" }}>
        <Link to="/">
          <img src={logo} alt=""/>
        </Link>
        <Menu
          onClick={onClick}
          selectedKeys={[current]}
          mode="horizontal"
          items={items} 
          style={{width: "100%"}}
        />
      </div>
      <Content
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
          <Outlet context={{ orderData, updateOrderData }} />
        </div>
      </Content>
    </div>
  );
};
export default CustomerService;
