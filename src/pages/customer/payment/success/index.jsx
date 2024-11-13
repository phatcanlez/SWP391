import { Button, Result } from "antd";
import { toast } from "react-toastify";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useGetParams from "../../../../hooks/useGetParams";
import api from "../../../../config/axios";

function SuccessPage() {
  const params = useGetParams();
  console.log(params);
  const orderID = params("orderId");
  console.log(orderID);
  const vnp = params("vnp_TransactionStatus");
  console.log(vnp);
  const navigate = useNavigate();

  const postOrderID = async () => {
    try {
      const response = await api.put(`payment-status?orderId=${orderID}`);
      console.log(orderID);
      if (response.status === 200) {
        toast.success("Payment processed successfully");
      }
    } catch (error) {
      toast.error("Error updating payment status");
      console.error(error);
    }
  };

  useEffect(() => {
    if (vnp === "00") {
      postOrderID();
    } else {
      navigate("/pay-fail");
    }
  }, [vnp, orderID]);

  return (
    <div>
      <Result
        status="success"
        title="Payment Successfully!"
        subTitle="Cloud server configuration takes 1-5 minutes, please wait."
        extra={[
          <Button
            type="primary"
            key="console"
            onClick={() => {
              navigate(`/customer-service/history`);
            }}
          >
            Go Order History
          </Button>,
        ]}
      />
    </div>
  );
}

export default SuccessPage;
