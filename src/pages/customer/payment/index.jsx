import { Button, message } from "antd";
import api from "../../../config/axios";
import { useNavigate, useParams } from "react-router-dom";

function Payment() {
  const { id } = useParams();
  const navigate = useNavigate();
  const handlePay = async (id) => {
    try {
      const response = await api.put(`payment?orderId=${id}`);
      console.log(response);
      window.open(response.data)
    } catch (error) {
      console.log(error);
    }
  };
  const handlePayLater = () => {
    navigate("/history");
    message.info("Please make payment within 2 days ");
  };
  return (
    <div>
      <Button onClick={handlePay(id)}>Pay Now</Button>
      <Button onClick={handlePayLater}>Pay Later</Button>
    </div>
  );
}

export default Payment;
