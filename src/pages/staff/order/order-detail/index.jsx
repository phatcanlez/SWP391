import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import "./index.css";
import {
  CheckCircleOutlined,
  DoubleRightOutlined,
  LoadingOutlined,
  PhoneOutlined,
  SmileOutlined,
} from "@ant-design/icons";
import License from "../license";
import { Alert, Button, Form, Input, Modal, Rate, Steps } from "antd";
import { useSelector } from "react-redux";
import { useForm } from "antd/es/form/Form";
import { useNavigate, useParams } from "react-router-dom";
import { format, parseISO } from "date-fns";
import InProcess from "../pending/pending";
import api from "../../../../config/axios";

function OrderDetail() {
  const { id } = useParams();
  const user = useSelector((store) => store.user);
  const [order, setOrder] = useState([]);
  const [service, setService] = useState([]);
  const [status, setStatus] = useState("WAITING");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchOrderDetail = async (id) => {
    setLoading(true);
    try {
      const response = await api.get(`orders/${id}`);
      setOrder(response.data);
      setService(response.data.orderDetail.extraService);
      console.log(response.data.orderDetail.extraService);
      if (response.data.status.length > 0) {
        setStatus(
          response.data.status[response.data.status.length - 1]?.statusInfo
        );
      }
      handleViewFeedBack();
    } catch (err) {
      toast.error(err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchOrderDetail(id);
  }, [id, status]);
  /////////////////////////////

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

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
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

  const handleAddApprove = async () => {
    try {
      const response = await api.get(
        `/orders/status-emp?status=APPROVED&empId=${user.id}`
      );
      const processingOrder = await api.get(
        `/orders/status-emp?status=PENDING&empId=${user.id}`
      );
      const waiting = await api.get(
        `/orders/status-emp?status=WATINGFOR2NDSTAFF&empId=${user.id}`
      );
      console.log(waiting.data);

      if (response.data?.length === 0 && processingOrder.data?.length === 0 && (waiting.data?.length === 0)) {
        console.log(user.id);
        const emid = user.id;
        const setvalue = await api.post("/status", {
          statusInfo: "APPROVED",
          empId: emid,
          order: id,
          description: "The order is approved",
        });
        console.log(setvalue);
        toast.success("APPROVED");
      } else {
        toast.error("You have an order in processing");
      }
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
  return (
    <div className="order-detail">
      {/* <Image src={order.image} alt="Order image" width={200} /> */}

      <div className="bg-w">
        <h3 style={{ marginBottom: "50px" }}>
          <span className="color">Order ID: </span> {order.orderID}
        </h3>
        <Alert message={order?.orderDetail?.type} />
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
                {order.senderPhoneNumber}
              </p>
              <p>{order.senderAddress}</p>
            </div>

            <PhoneOutlined style={{ fontSize: 18, color: "#c3c3c3" }} />
          </div>

          <DoubleRightOutlined style={{ fontSize: 18, color: "#e25822" }} />

          <div className="item">
            <div>
              <p>
                <span className="color">{order.reciverName} </span>- (+84)
                {order.reciverPhoneNumber}
              </p>
              <p>{order.reciverAdress}</p>
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
              <span className="color">{order?.orderDetail?.totalWeight}</span>
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
                  <p>{formatCurrency(service.price)}</p>
                </div>
              ))}
            </div>
          </div>

          <p>
            Total price:{" "}
            <span className="color" style={{ fontWeight: "600" }}>
              {formatCurrency(order.orderPrice)}
            </span>
          </p>
        </div>
      </div>

      <h5 className="title">Delivery status</h5>

      <div className="bg-w">
        <div className="">
          <p>Payment's status: </p>
          <p>{order?.payment?.status}</p>
        </div>
        {(status === "APPROVED" || status === "PENDING") && (
          <>
            <InProcess />
            {(status === "APPROVED" || status === "PENDING") && (
              <>
                <button className="btn-item fail-btn" onClick={showModal}>
                  Delivery Failure
                </button>
              </>
            )}
          </>
        )}
        {status === "SUCCESS" && (
          <>
            <Steps
              className="step"
              items={[
                {
                  title: "Approved",
                  status: "finish",
                  icon: <CheckCircleOutlined />,
                },
                {
                  title: "Preparing",
                  status: "finish",
                  icon: <LoadingOutlined />,
                },
                {
                  title: "On delivery",
                  status: "finish",
                  icon: <DoubleRightOutlined />,
                },
                {
                  title: "DONE",
                  status: "finish",
                  icon: <SmileOutlined />,
                },
              ]}
            />
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
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="btn-wrap">
          {}
          {status === "WAITING" && (
            <>
              <Button className="btn btn-r" onClick={showModal}>
                REJECT
              </Button>
              <Button className="btn btn-a" onClick={handleAddApprove}>
                APPROVE
              </Button>
            </>
          )}
          {status === "WATINGFOR2NDSTAFF" && (
            <>
              <Button className="btn btn-a" onClick={handleAddApprove}>
                APPROVE
              </Button>
            </>
          )}
        </div>
      )}

      {/* <span>Price: {order.price}</span>*/}

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
  );
}

export default OrderDetail;
