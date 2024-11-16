import { PieChartOutlined } from "@ant-design/icons";
import { Layout, Menu } from "antd";
import Sider from "antd/es/layout/Sider";
import logo from "../../img/logolayout.png";
import { useEffect } from "react";
function getItem(label, key, icon) {
  return {
    key,
    icon,
    label,
  };
}
const persistRoot = localStorage.getItem("persist:root");
let role = null;

if (persistRoot) {
  const user = JSON.parse(persistRoot).user;
  if (user) {
    const userObj = JSON.parse(user);
    role = userObj.role;
  }
}

// useEffect(() => {
//   console.log("role", role);
//   if (role === "CUSTOMER") {
//     if (!document.getElementById("tawk-script")) {
//       var Tawk_API = Tawk_API || {},
//         Tawk_LoadStart = new Date();
//       (function () {
//         const s1 = document.createElement("script"),
//           s0 = document.getElementsByTagName("script")[0];
//         s1.async = true;
//         s1.src = "https://embed.tawk.to/67375fd74304e3196ae33499/1ico4sp3d";
//         s1.charset = "UTF-8";
//         s1.setAttribute("crossorigin", "*");
//         s1.id = "tawk-script";
//         s0.parentNode.insertBefore(s1, s0);
//       })();
//     }
//   } else {
//     const existingScript = document.getElementById("tawk-script");
//     if (existingScript) {
//       existingScript.remove();
//     }
//   }
// }, [role]);

const items = [
  getItem("Dashboard", "order", <PieChartOutlined />),
  getItem("Manage Order", "order", <PieChartOutlined />),
  getItem("Manage User", "order", <PieChartOutlined />),
  getItem("Manage Service", "order", <PieChartOutlined />),
  getItem("Feedback", "order", <PieChartOutlined />),
  getItem("FAQs", "order", <PieChartOutlined />),
  getItem("Customer Care", "order", <PieChartOutlined />),
];

function Dashboard() {
  return (
    <div>
      <div>
        <div>
          <img src={logo} alt="" />
        </div>
        <h4>KOIKICHI</h4>
        <Sider>
          <Menu items={items} />
        </Sider>
      </div>
    </div>
  );
}
export default Dashboard;
