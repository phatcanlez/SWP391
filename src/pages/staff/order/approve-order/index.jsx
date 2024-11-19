import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import api from "../../../../config/axios";
import { useNavigate } from "react-router-dom";
import { useForm } from "antd/es/form/Form";
import { toast } from "react-toastify";
import { format, parseISO } from "date-fns";
import {
  DoubleRightOutlined,
  LoadingOutlined,
  MessageOutlined,
  PhoneOutlined,
} from "@ant-design/icons";
import License from "../license";
import InProcess from "../pending/pending";
import { Alert, Button, Form, Input, message, Modal, Rate } from "antd";

function ApproveOrder() {
  const user = useSelector((store) => store.user);
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState([]);
  const [service, setService] = useState([]);
  const [status, setStatus] = useState("");
  const navigate = useNavigate();
  const [id, setId] = useState("");

  const fetchOrdersByStatus = async (status) => {
    try {
      const response = await api.get(
        `/orders/status-emp?status=${status}&empId=${user.id}`
      );
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.error(`Error fetching ${status} orders:`, error);
      return [];
    }
  };
  const getOrderId = (orders) => {
    return orders?.orderID || orders[0]?.orderID;
  };

  const fetchOrderDetail = async (id) => {
    setLoading(true);
    try {
      const response = await api.get(`orders/${id}`);
      const orderData = response.data;
      setOrder(orderData);
      setService(orderData.orderDetail.extraService);
      console.log(orderData.orderDetail.extraService);

      const status = orderData.status[orderData.status?.length - 1]?.statusInfo;
      setStatus(status);
      console.log(status);

      handleViewFeedBack();
    } catch (error) {
      console.error("Error fetching order details:", error);
      message.error("Failed to fetch order details.");
    } finally {
      setLoading(false);
    }
  };

  const checkApprove = async () => {
    try {
      const approvedOrders = await fetchOrdersByStatus("APPROVED");
      if (approvedOrders.length > 0) {
        const orderId = getOrderId(approvedOrders);
        setId(orderId);
        await fetchOrderDetail(orderId);
        return;
      }

      const pendingOrders = await fetchOrdersByStatus("PENDING");
      if (pendingOrders.length > 0) {
        const orderId = getOrderId(pendingOrders);
        setId(orderId);
        await fetchOrderDetail(orderId);
        return;
      }

      const pendingJapanOrders = await fetchOrdersByStatus("PENDINGJAPAN");
      if (pendingJapanOrders.length > 0) {
        const orderId = getOrderId(pendingJapanOrders);
        setId(orderId);
        await fetchOrderDetail(orderId);
        return;
      }

      const pendingVietnamOrders = await fetchOrdersByStatus("PENDINGVIETNAM");
      if (pendingVietnamOrders.length > 0) {
        const orderId = getOrderId(pendingVietnamOrders);
        setId(orderId);
        await fetchOrderDetail(orderId);
        return;
      }

      const arrivedVietnamOrders = await fetchOrdersByStatus("ARRIVEDVIETNAM");
      if (arrivedVietnamOrders.length > 0) {
        const orderId = getOrderId(arrivedVietnamOrders);
        setId(orderId);
        await fetchOrderDetail(orderId);
        return;
      }

      navigate("/staff/empty");
    } catch (error) {
      console.error("Error checking orders:", error);
    }
  };

  useEffect(() => {
    checkApprove();
  }, [id, status]);

  console.log(status);

  const [form] = useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fbModalOpen, setFBModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
    setFBModalOpen(false);
  };
  const showFBModal = () => {
    setFBModalOpen(true);
  };

  const [description, setDescription] = useState("");

  const handleSubmitReject = async (values) => {
    try {
      const emid = user.id;
      values.statusInfo = "FAIL";
      values.empId = emid;
      values.description = description;
      values.order = id;
      await api.post("/status", values);
      setIsModalOpen(false);
      toast.success("REJECTED");
      navigate("/staff/reject");
    } catch (error) {
      toast.error(error.response.data);
    } finally {
      fetchOrderDetail(id);
    }
  };

  const formatDate = (isoString) => {
    if (!isoString) return "Không có dữ liệu"; // Trả về chuỗi mặc định nếu không có ngày
    try {
      return format(parseISO(isoString), "dd/MM/yyyy"); // Định dạng ngày hợp lệ
    } catch (error) {
      console.error("Định dạng ngày không hợp lệ:", error);
      return "Ngày không hợp lệ"; // Xử lý lỗi khi parse thất bại
    }
  };

  const [feedback, setFeedback] = useState([]);
  const handleViewFeedBack = async () => {
    try {
      const response = await api.get(`feedback/${id}`);
      console.log(response.data);
      setFeedback(response.data);
    } catch (error) {
      toast.error(error);
    }
  };
  console.log(order);

  const handleRoomChat = async (customerID) => {
    try {
      const room = await api.get(`/chat/room/${user?.id}/${customerID}`);

      console.log(room.data);
      navigate(`/staff/chat/${room.data?.roomID}`);
    } catch (error) {
      toast.error(error);
    }
  };
  return (
    <div>
      {loading ? (
        <div className="spinner-container">
          <LoadingOutlined />
        </div>
      ) : (
        <div className="order-detail">
          {/* <Image src={order.image} alt="Order image" width={200} /> */}

          <div className="bg-w">
            <h3 style={{ marginBottom: "50px" }}>
              <span className="color">Order ID: </span> {order.orderID}
            </h3>
            <Alert message={order?.orderDetail?.type} />
            vb
            <div className="time-section">
              <p>
                Created Delivery Date:
                <br /> {formatDate(order?.status?.[0]?.date)}
              </p>
              <div className="border"></div>
              <p>
                Exp Delivery Date:
                <br /> {formatDate(order?.expDeliveryDate)}
              </p>
              {/* <div className="border"></div>
        <p>
          Act Delivery Date:
          <br /> {order.actDeliveryDate}
        </p> */}
            </div>
          </div>

          <h5 className="title">Send and receive information</h5>
          <div className="bg-w">
            <div className="send-section">
              <div className="item">
                <div>
                  <p>
                    <span className="color">{order?.senderName}</span> - (+84)
                    {order?.senderPhoneNumber}
                  </p>
                  <p>{order?.senderAddress}</p>
                </div>

                <PhoneOutlined style={{ fontSize: 18, color: "#c3c3c3" }} />
                <MessageOutlined
                  onClick={() => handleRoomChat(order?.accountId)}
                  style={{ fontSize: 18, color: "#c3c3c3" }}
                />
              </div>

              <DoubleRightOutlined style={{ fontSize: 18, color: "#e25822" }} />

              <div className="item">
                <div>
                  <p>
                    <span className="color">{order?.reciverName} </span>- (+84)
                    {order?.reciverPhoneNumber}
                  </p>
                  <p>{order?.reciverAdress}</p>
                </div>

                <PhoneOutlined style={{ fontSize: 18, color: "#c3c3c3" }} />
              </div>
            </div>
            <h6 style={{ marginTop: "30px", marginBottom: "0px" }}>
              Distance: {order?.orderDetail?.kilometer}
            </h6>
          </div>

          <h5 className="title">Order information detail</h5>
          <div className="bg-w">
            <div>
              <div className="detail">
                <h6>
                  Quantity:{" "}
                  <span className="color">{order?.orderDetail?.quantity}</span>
                </h6>
                <h6>
                  Total Weight:{" "}
                  <span className="color">
                    {order?.orderDetail?.totalWeight}
                  </span>
                </h6>
              </div>
              <License id={id} />
              <h6 style={{ marginTop: "40px" }}>Box Quantity</h6>
              <div className="box">
                <div className="box__item">
                  <p>Small Box</p>
                  <p>{order?.orderDetail?.smallBox}</p>
                </div>
                <div className="border"></div>
                <div className="box__item">
                  <p>Medium Box</p>
                  <p>{order?.orderDetail?.mediumBox}</p>
                </div>
                <div className="border"></div>
                <div className="box__item">
                  <p>Large Box</p>
                  <p>{order?.orderDetail?.largeBox}</p>
                </div>
                <div className="border"></div>
                <div className="box__item">
                  <p>Extra Large Box</p>
                  <p>{order?.orderDetail?.extraLargeBox}</p>
                </div>
              </div>
              <div className="s-method">
                <h6>Service Method</h6>
                <div className="item">
                  <p>No.</p>
                  <p>Service Name</p>
                  <p>Service Price</p>
                </div>
                <div className="border-width"></div>
                <div>
                  {service.map((service, index) => (
                    <div key={service.id} className="item item-cnt">
                      <p className="color">{index + 1}</p>
                      <p>{service.nameService}</p>
                      <p>{service.price}</p>
                    </div>
                  ))}
                </div>
              </div>

              <p>
                Total price:{" "}
                <span className="color" style={{ fontWeight: "600" }}>
                  {order.orderPrice}
                </span>
              </p>
            </div>
          </div>

          <h5 className="title">Delivery status</h5>

          <div className="bg-w">
            {(status === "APPROVED" ||
              status === "PENDING" ||
              status === "SUCCESS") && (
              <>
                <InProcess id={order?.orderID} />
                {(status != "SUCCESS" || status != "FAIL") && (
                  <>
                    <button className="btn-item fail-btn" onClick={showModal}>
                      Delivery Failure
                    </button>
                  </>
                )}
                {status === "SUCCESS" && (
                  <div style={{ display: "flex", justifyContent: "flex-end" }}>
                    <button className="fb-btn btn-item" onClick={showFBModal}>
                      View Feedback
                    </button>
                  </div>
                )}
              </>
            )}
            {status === "FAIL" && (
              <div style={{ textAlign: "center", fontSize: "20px" }}>
                This order has been rejected!
              </div>
            )}
          </div>

          {/* <span>Price: {order.price}</span>            */}

          <Modal
            title="Failed Report "
            open={isModalOpen}
            onOk={() => form.submit()}
            onCancel={handleCancel}
          >
            <Form form={form} onFinish={handleSubmitReject}>
              <Form.Item name="description">
                <Input
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </Form.Item>
              {/* Hiển thị description */}
            </Form>
          </Modal>

          <Modal
            title="FeedBack "
            open={fbModalOpen}
            onCancel={handleCancel}
            footer={<Button onClick={handleCancel}>Cancel</Button>}
          >
            {feedback === null ? (
              <p>Customer has not feedback any thing</p>
            ) : (
              <>
                <p>Time:</p> {feedback?.time}
                <p>Rating: </p>
                <Rate disabled value={feedback?.rating} />
                <p>Comment: </p>
                {feedback?.comment}
              </>
            )}
          </Modal>
        </div>
      )}
    </div>
  );
}

export default ApproveOrder;
