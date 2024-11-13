import { Button, Result } from "antd";
import { useNavigate } from "react-router-dom";
function PaymentFail() {
  const navigate = useNavigate();
  return (
    <Result
      status="error"
      title="Submission Failed"
      subTitle="Please check and modify the following information before resubmitting."
      extra={[
        <Button
          key="buy"
          onClick={() => {
            navigate("/customer-service/history");
          }}
        >
          Buy Again
        </Button>,
      ]}
    ></Result>
  );
}
export default PaymentFail;
