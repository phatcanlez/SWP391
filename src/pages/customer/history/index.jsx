import { useSelector } from "react-redux";
import api from "../../../config/axios";
import { useEffect, useState } from "react";
import { ArrowDownOutlined, EnvironmentOutlined } from "@ant-design/icons";
import { Alert, Form, Input, Modal, Rate } from "antd";
import "./index.css";
import { useForm } from "antd/es/form/Form";
import { toast } from "react-toastify";
function ViewHistory() {
  const user = useSelector((store) => store.user);
  console.log(user);
  const [orderHistory, setOrderHistory] = useState([]);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [form] = useForm();
  const [openModal, setOpenModal] = useState(false);

  const fetchHistory = async () => {
    try {
      const response = await api.get(
        `orders/account?username=${user.username}`
      );
      setOrderHistory(response.data);
      console.log(orderHistory);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleFeedback = async (value) => {
    value.orderID = selectedOrderId;
    try {
      await api.post("feedback", value);
      fetchHistory();
      setSelectedOrderId(null);
      toast.success("Successfully");
      setOpenModal(false);
    } catch (error) {
      console.log(error);
      toast.error("You have already feedback this order!");
    }
  };

  const handelCancel = () => {
    setOpenModal(false);
    setSelectedOrderId(null);
  };

  const handleOpen = (orderId) => {
    setSelectedOrderId(orderId);
    setOpenModal(true);
  };

  return (
    <div>
      <div className="history-bg">
        <div className="order-list">
          {orderHistory.map((order) => (
            <History
              key={order.orderID}
              order={order}
              onFeedbackClick={() => {
                handleOpen(order.orderID);
              }}
            />
          ))}
        </div>
      </div>

      <Modal
        title="Feedback "
        open={openModal}
        onCancel={handelCancel}
        onOk={() => {
          form.submit();
        }}
      >
        <Form labelCol={{ span: 24 }} form={form} onFinish={handleFeedback}>
          <Form.Item label="Rating" name="rating">
            <Rate />
          </Form.Item>
          <Form.Item label="Feedback" name="comment">
            <Input.TextArea />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

const History = ({ order, onFeedbackClick }) => {
  const getAlertType = (status) => {
    switch (status) {
      case "WAITING":
        return "info";
      case "SUCCESS":
        return "success";
      case "PENDING":
        return "warning";
      case "FAIL":
        return "error";
      default:
        return "info";
    }
  };
  return (
    <div className="bg-w order">
      <div className="order__wrapper">
        <div className="order__item">
          <h3>orderID: </h3>
          <p className="item">{order?.orderID}</p>
        </div>
        <Alert message={order?.status} type={getAlertType(order?.status)} />

        <div className="order__item">
          <p>Reciver name: </p>
          <p>{order?.reciverName}</p>
        </div>

        <div className="order__item">
          <ArrowDownOutlined style={{ color: "#E25822", fontSize: "20px" }} />
          <p>Form: </p>
          <p>{order?.senderAddress}</p>
        </div>

        <div className="order__item">
          <EnvironmentOutlined style={{ color: "#E25822", fontSize: "20px" }} />
          <p>Send to: </p>
          <p>{order?.reciverAdress}</p>
        </div>

        <div className="order__item">
          <p>Total Price: </p>
          <h5>{order?.totalPrice}</h5>
        </div>
      </div>
      <div className="btn-wrapper">
        <button className=" btn-his" style={{ backgroundColor: "#c0aca4" }}>
          View Detail
        </button>
        <button
          onClick={onFeedbackClick}
          className=" btn-his"
          style={{ backgroundColor: "#e25822" }}
        >
          Feedback
        </button>
      </div>
    </div>
  );
};

export default ViewHistory;
