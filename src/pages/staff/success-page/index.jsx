import { Result } from "antd";

const OrderSuccess = () => (
  <div style={{ position: "relative", height: "100vh" }}>
    {/* Hiển thị thông báo thành công */}
    <Result
      status="success"
      title="Great! You have completed the delivery excellently. "
    />
  </div>
);

export default OrderSuccess;
