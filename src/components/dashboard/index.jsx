import { PieChartOutlined } from "@ant-design/icons";
import { Layout, Menu } from "antd";
import Sider from "antd/es/layout/Sider";
import logo from '../../img/logolayout.png'
function getItem(label, key, icon) {
    return {
        key,
        icon,
        label,
    };
}
const items = [
    getItem("Dashboard", "order", <PieChartOutlined />),
    getItem("Manage Order", "order", <PieChartOutlined />),
    getItem("Manage User", "order", <PieChartOutlined />),
    getItem("Manage Service", "order", <PieChartOutlined />),
    getItem("Feedback", "order", <PieChartOutlined />),
    getItem("FAQs", "order", <PieChartOutlined />),
    getItem("Customer Care", "order", <PieChartOutlined />)
]

function Dashboard() {
    return (
        <div>
            <div>
                <div><img src={logo} alt="" /></div>
                <h4>KOIKICHI</h4>
                <Sider>
                    <Menu items={items} />
                </Sider>
            </div>
            
        </div>
    );
};
export default Dashboard;
