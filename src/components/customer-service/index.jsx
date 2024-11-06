import React, { useState } from "react";
import { FormOutlined, UserOutlined } from "@ant-design/icons";
import { Layout, Menu, theme } from "antd";
import { Link, Outlet, useNavigate } from "react-router-dom";
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
  getItem("Orders History", "history", <FormOutlined />),
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
    <div>
      <Menu
        onClick={onClick}
        selectedKeys={[current]}
        mode="horizontal"
        items={items}
      />
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
