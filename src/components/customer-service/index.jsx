import React, { useState } from "react";
import { FormOutlined, PieChartOutlined, UnorderedListOutlined, UserOutlined } from "@ant-design/icons";
import { Breadcrumb, Layout, Menu, theme } from "antd";
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
    const [collapsed, setCollapsed] = useState(false);
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();
    return (
        <Layout
            style={{
                minHeight: "100vh",
            }}
        >
            <Sider
                collapsible
                collapsed={collapsed}
                onCollapse={(value) => setCollapsed(value)}
            >
                <div className="demo-logo-vertical" />
                <Menu
                    theme="dark"
                    defaultSelectedKeys={["1"]}
                    mode="inline"
                    items={items}
                />
            </Sider>
            <Layout>
                <Header
                    style={{
                        padding: 0,
                        background: colorBgContainer,
                    }}
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
                            background: colorBgContainer,
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
export default CustomerService;
