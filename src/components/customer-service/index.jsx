import React, { useState } from "react";
import { FormOutlined, UserOutlined } from "@ant-design/icons";
import { Layout, Menu, theme } from "antd";
import { Link, Outlet } from "react-router-dom";
const { Header, Content, Footer, Sider } = Layout;

function getItem(label, key, icon, children) {
    return {
        key,
        icon,
        children,
        label: <Link to={`/customer-service/${key}`}>{label}</Link>
    };
}
const items = [
    getItem("Account", "account", <UserOutlined />),
    //getItem("View Order", "order", <UnorderedListOutlined />),
    getItem("Create Order", "order", <FormOutlined />),
    //getItem("Account", "account", <UserOutlined />),
    //getItem("Account", "account", <UserOutlined />),

]
  
const CustomerService = () => {
    const [current, setCurrent] = useState(false);
    const onClick = (e) => {
    console.log('click ', e);
    setCurrent(e.key);
  };

  return (
    <div>
        <Menu onClick={onClick} selectedKeys={[current]} mode="horizontal" items={items} />
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
                        <Outlet />
                    </div>
                </Content>
    </div>
  );
};
export default CustomerService;
