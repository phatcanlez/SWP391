import { useParams } from "react-router-dom";
import api from "../../../../config/axios";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import { Image } from "antd";

function OrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState([]);

  const fetchOrderDetail = async (id) => {
    try {
      const response = await api.get(`orders/${id}`);

      setOrder(response.data);
      console.log(response.data);
    } catch (err) {
      toast.error("Error");
    }
  };

  useEffect(() => {
    if (id) {
      fetchOrderDetail(id); // Fetch the order details by ID
    }
  }, [id]);
  // Trigger the effect when `id` changes
  return (
    <div>
      <div>
        {/* <Image src={order.image} alt="Order image" width={200} /> */}
        <p>ID: {order.orderID}</p>
        <p>Sender Name: {order?.account?.name}</p> 
        <p>Sender Address: {order.senderAddress}</p>
        <p>Sender Phone Number: (+84){order.senderPhoneNumber}</p>
        <p>Receiver Name: {order.reciverName}</p>
        <p>Receiver Address: {order.reciverAdress}</p>
        <p>Receiver Phone Number: (+84){order.reciverPhoneNumber}</p>
        <p>Act Delivery Date: {order.actDeliveryDate}</p>
        <p>Exp Delivery Date: {order.expDeliveryDate}</p>
        <p>Payment status: {order?.payment?.status}</p>
        <p>Total price: {order.totalPrice}</p>
        <p>Description: {order?.status?.[0]?.description}</p>


        {/* <span>Price: {order.price}</span>            */}
      </div>
    </div>
  );
}

export default OrderDetail;
