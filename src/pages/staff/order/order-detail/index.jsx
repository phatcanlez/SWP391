import { useParams } from "react-router-dom";
import api from "../../../../config/axios";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import "./index.css";
import {
  CommentOutlined,
  DoubleRightOutlined,
  MessageOutlined,
  PhoneOutlined,
} from "@ant-design/icons";

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
      {/* <Image src={order.image} alt="Order image" width={200} /> */}

      <div className="bg-w">
        <h3>
          <span className="color">Order ID: </span> {order.orderID}
        </h3>

        <div className="time-section">
          <p>
            Created Delivery Date:
            <br /> {order?.status?.[0]?.date}
          </p>
          <div className="border"></div>
          <p>
            Exp Delivery Date:
            <br /> {order.expDeliveryDate}
          </p>
          <div className="border"></div>
          <p>
            Act Delivery Date:
            <br /> {order.actDeliveryDate}
          </p>
        </div>
      </div>

      <div className="bg-w">
        <p className="title">Send and receive information</p>
        <div className="send-section">
          <div className="item">
            <div>
              <p>
                {order?.account?.name} - (+84){order.senderPhoneNumber}
              </p>
              <p>{order.senderAddress}</p>
            </div>

            <PhoneOutlined style={{ fontSize: 18, color: "#c3c3c3" }} />
          </div>

          <DoubleRightOutlined />

          <div className="item">
            <div>
              <p>
                {order.reciverName} - (+84){order.reciverPhoneNumber}
              </p>
              <p>{order.reciverName}</p>
            </div>

            <PhoneOutlined  style={{ fontSize: 18, color: "#c3c3c3" }}/>
          </div>
        </div>
      </div>

      <div className="bg-w">
        <p className="title">Delivery status</p>
        <div className="send-section">
          <div className="item">
            <div>
              <p>
                {order?.account?.name} - (+84){order.senderPhoneNumber}
              </p>
              <p>{order.senderAddress}</p>
            </div>
            <MessageOutlined />
            <PhoneOutlined />
          </div>

          <DoubleRightOutlined />

          <div className="item">
            <div>
              <p>
                {order.reciverName} - (+84){order.reciverPhoneNumber}
              </p>
              <p>{order.reciverName}</p>
            </div>
            <MessageOutlined />
            <PhoneOutlined />
          </div>
        </div>
      </div>

      <div>
        
      </div>
      {/* <div>
        
        <p>ID: {order.orderID}</p>
        <p>Sender Name: {order?.account?.name}</p> 
        <p>Sender Address: {order.senderAddress}</p>
        <p>Sender Phone Number: (+84){order.senderPhoneNumber}</p>
        <p>Receiver Name: {order.reciverName}</p>
        <p>Receiver Address: {order.reciverAdress}</p>
        <p>Receiver Phone Number: (+84){order.reciverPhoneNumber}</p>
        
        
        <p>Payment status: {order?.payment?.status}</p>
        <p>Total price: {order.totalPrice}</p>
        <p>Description: {order?.status?.[0]?.description}</p>


       
      </div> */}
      {/* <span>Price: {order.price}</span>            */}
    </div>
  );
}

export default OrderDetail;
