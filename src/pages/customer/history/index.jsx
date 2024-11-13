import { useSelector } from "react-redux";
import api from "../../../config/axios";
import { useEffect, useState } from "react";
import {
  ArrowDownOutlined,
  EnvironmentOutlined,
  FrownOutlined,
} from "@ant-design/icons";
import { Alert, Form, Input, Modal, Rate } from "antd";
import "./index.css";
import { useForm } from "antd/es/form/Form";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
function ViewHistory() {
  const user = useSelector((store) => store.user);
  console.log(user);
  const [orderHistory, setOrderHistory] = useState([]);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [form] = useForm();
  const [reportform] = useForm();
  const [openModal, setOpenModal] = useState(false);
  const [openReportModal, setOpenReportModal] = useState(false);

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
      form.resetFields();
      setOpenModal(false);
    } catch (error) {
      console.log(error);
      toast.error("You have already feedback this order!");
      setOpenModal(false);
    }
  };

  const handleComplain = async (value) => {
    value.order = selectedOrderId;
    try {
      await api.post("report", value);
      fetchHistory();
      setSelectedOrderId(null);
      toast.success("Successfully");
      reportform.resetFields();
      setOpenReportModal(false);
    } catch (error) {
      console.log(error);
      toast.error("You have already complain this order!");
      setOpenReportModal(false);
    }
  };

  const handelCancel = () => {
    setOpenModal(false);
    setOpenReportModal(false);
    setSelectedOrderId(null);
  };

  const handleOpen = (orderId) => {
    setSelectedOrderId(orderId);
    console.log(selectedOrderId);
    setOpenModal(true);
  };

  const handleReportOpen = (orderId) => {
    setSelectedOrderId(orderId);
    console.log(selectedOrderId);
    setOpenReportModal(true);
  };

  return (
    <div>
      <div className="history-bg">
        <div className="order-list">
          {orderHistory && orderHistory.length > 0 ? (
            orderHistory.map((order) => (
              <History
                key={order.orderID}
                order={order}
                onFeedbackClick={() => handleOpen(order.orderID)}
                onReportClick={() => {
                  handleReportOpen(order.orderID);
                }}
              />
            ))
          ) : (
            <div className="order-list__item">
              <FrownOutlined style={{ color: "#00000030", fontSize: "70px" }} />
              <h2>You have not created any order</h2>
            </div>
          )}
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

      <Modal
        title="Feedback "
        open={openReportModal}
        onCancel={handelCancel}
        onOk={() => {
          reportform.submit();
        }}
      >
        <Form
          labelCol={{ span: 24 }}
          form={reportform}
          onFinish={handleComplain}
        >
          <Form.Item label="Complain" name="reportContent">
            <Input.TextArea />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

const History = ({ order, onFeedbackClick, onReportClick }) => {
  const navigate = useNavigate();
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
          <h3>OrderID: </h3>
          <p className="item">{order?.orderID}</p>
        </div>

        <Alert message={order?.status} type={getAlertType(order?.status)} />

        <div className="order__item">
          <p>Reciver name: </p>
          <p>{order?.reciverName}</p>
        </div>

        <div className="order__item">
          <ArrowDownOutlined style={{ color: "#E25822", fontSize: "20px" }} />
          <p>From: </p>
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
        <button
          onClick={() => {
            navigate(`/customer-service/view-order/${order.orderID}`);
          }}
          className=" btn-his"
          style={{ backgroundColor: "#c0aca4" }}
        >
          View Detail
        </button>

        {order?.status === "SUCCESS" && (
          <button
            onClick={onFeedbackClick}
            className=" btn-his"
            style={{ backgroundColor: "#e25822" }}
          >
            Feedback
          </button>
        )}

        <button
          onClick={onReportClick}
          className=" btn-his"
          style={{ backgroundColor: "#000" }}
        >
          Complain
        </button>
      </div>
    </div>
  );
};

export default ViewHistory;
