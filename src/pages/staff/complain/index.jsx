import { useEffect, useState } from "react";
import api from "../../../config/axios";
import { useSelector } from "react-redux";
import { useForm } from "antd/es/form/Form";
import { Alert, Form, Input, Modal } from "antd";
import { HeartOutlined } from "@ant-design/icons";
import { toast } from "react-toastify";

function Complain() {
  const [orderReport, setOrderReport] = useState([]);
  const user = useSelector((store) => store.user);
  console.log(user);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [form] = useForm();
  const [openModal, setOpenModal] = useState(false);

  const fetchOrderReport = async () => {
    try {
      const response = await api.get(`report`);
      setOrderReport(response.data);
      console.log(orderReport);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    fetchOrderReport();
  }, []);

  const handleOpen = (orderId) => {
    console.log(orderId);
    setSelectedOrderId(orderId);
    setOpenModal(true);
  };
  const handelCancel = () => {
    setOpenModal(false);
    setSelectedOrderId(null);
  };

  const handleComplain = async (value) => {
    value.orderId = selectedOrderId;
    try {
      const response = await api.put("report", value);
      console.log(response);
      fetchOrderReport();
      setSelectedOrderId(null);
      form.resetFields();
      toast.success("Successfully");
      setOpenModal(false);
    } catch (error) {
      console.log(error);
      toast.error("Cannot reply this order!");
    }
  };
  return (
    <div>
      <div className="history-bg">
        <div className="order-list">
          {orderReport && orderReport.length > 0 ? (
            orderReport.map((order) => (
              <ComplainDetail
                key={order.orderId}
                order={order}
                onReportClick={() => handleOpen(order.orderId)}
              />
            ))
          ) : (
            <div className="order-list__item">
              <HeartOutlined style={{ color: "#00000030", fontSize: "70px" }} />
              <h2>Do not have any complain</h2>
            </div>
          )}
        </div>
      </div>
      <Modal
        title="Reply to customer"
        open={openModal}
        onCancel={handelCancel}
        onOk={() => {
          form.submit();
        }}
      >
        <Form labelCol={{ span: 24 }} form={form} onFinish={handleComplain}>
          <Form.Item name="empReply">
            <Input.TextArea />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

const ComplainDetail = ({ order, onReportClick }) => {
  const getAlertType = (status) => {
    switch (status) {
      case "UNREPLIED":
        return "warning";
      default:
        return "info";
    }
  };
  return (
    <div className="bg-w order">
      <div className="order__wrapper">
        <div className="order__item">
          <h3>OrderID: </h3>
          <p className="item">{order?.orderId}</p>
        </div>

        <div className="order__item">
          <p style={{ color: "#727272" }}>Desciption: </p>
          <p style={{ color: "#727272", fontSize: "16px" }}>
            {order?.reportContent}
          </p>
        </div>
      </div>
      <div className="btn-wrapper">
        <Alert message={order?.status} type={getAlertType(order?.status)} />
        <button
          onClick={onReportClick}
          className=" btn-his"
          style={{ backgroundColor: "#e25822" }}
        >
          REPLY
        </button>
      </div>
    </div>
  );
};

export default Complain;
