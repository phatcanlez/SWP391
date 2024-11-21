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
  UploadOutlined,
} from "@ant-design/icons";
import License from "../license";
import InProcess from "../pending/pending";
import {
  Alert,
  Button,
  Form,
  Image,
  Input,
  message,
  Modal,
  Rate,
  Upload,
} from "antd";
import uploadFile from "../../../../config/file";

function ApproveOrder() {
  const user = useSelector((store) => store.user);
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState([]);
  const [service, setService] = useState([]);
  const [status, setStatus] = useState("");
  const navigate = useNavigate();
  const [id, setId] = useState("");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [fileList, setFileList] = useState([]);

  const getBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

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

      handleViewFeedBack();
    } catch (error) {
      console.error("Error fetching order details:", error);
    } finally {
      setLoading(false);
    }
  };

  const checkApprove = async () => {
    try {
      const approvedOrders = await fetchOrdersByStatus("APPROVED");
      console.log(approvedOrders);
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
      console.log(pendingJapanOrders);
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
  }, []);

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

  const handleSubmitReject = async () => {
    try {
      const setvalue = {
        statusInfo: "FAIL",
        empId: user.id,
        order: order.orderID,
        description: description,
      };
      await api.post("/status", setvalue);
      toast.success("The order has failed");
      fetchOrderDetail();
      navigate("/staff/reject");
    } catch (error) {
      toast.error(error.response.data);
    }
  };

  const handleConfirm = async () => {
    if (fileList.length === 0) {
      message.error("Please upload your picture");
    }
    if (fileList.length > 0) {
      const file = fileList[0];
      console.log(file);
      try {
        const url = await uploadFile(file.originFileObj);
        console.log(url);
        const value = {
          orderId: `${order?.orderID}`,
          image: url,
        };
        const response = await api.put(`orders/image`, value);
        console.log(response);
        handleSubmitReject();
      } catch (error) {
        toast.error(error);
      }
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
  const formatCurrency = (value) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
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

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
  };
  const handleChange = ({ fileList: newFileList }) => setFileList(newFileList);
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
                    <span className="color">{order?.senderName}</span> -
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
                    <span className="color">{order?.reciverName} </span> -
                    {order?.reciverPhoneNumber}
                  </p>
                  <p>{order?.reciverAdress}</p>
                </div>

                <PhoneOutlined style={{ fontSize: 18, color: "#c3c3c3" }} />
              </div>
            </div>
            <h6 style={{ marginTop: "30px", marginBottom: "0px" }}>
              Distance: {order?.orderDetail?.kilometer} km
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
              <div className="shipmethod">
                <h6 style={{ marginTop: "40px" }}>Ship Method</h6>
                <p>{order?.orderDetail?.shipMethod?.description}</p>
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
                      <p>{service?.nameService}</p>
                      <p>{formatCurrency(service.price)}</p>
                    </div>
                  ))}
                </div>
              </div>

              <p>
                Total price:{" "}
                <span className="color" style={{ fontWeight: "600" }}>
                  {formatCurrency(order?.totalPrice)}
                </span>
              </p>
              <p style={{ marginTop: "20px" }}>
                <span style={{ color: "#e25822" }}>Note:</span> {order?.note}
              </p>
            </div>
          </div>

          <h5 className="title">Delivery status</h5>

          <div className="bg-w">
            <InProcess id={order?.orderID} />
            {(((status === "PENDINGJAPAN" || status === "APPROVEDJAPAN") &&
              user?.country === "japan") ||
              ((status === "ARRIVEDVIETNAM" ||
                status === "PENDINGVIETNAM" ||
                status === "APPROVED" ||
                status === "PENDING") &&
                user?.country === "vietnam")) && (
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
            <Form onFinish={handleConfirm} form={form}>
              <Form.Item name="description">
                <Input
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </Form.Item>
              <Upload
                listType="picture"
                fileList={fileList}
                onPreview={handlePreview}
                onChange={handleChange}
              >
                <Button icon={<UploadOutlined />}>Upload </Button>
              </Upload>
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
          {previewImage && (
            <Image
              wrapperStyle={{
                display: "none",
              }}
              preview={{
                visible: previewOpen,
                onVisibleChange: (visible) => setPreviewOpen(visible),
                afterOpenChange: (visible) => !visible && setPreviewImage(""),
              }}
              src={previewImage}
            />
          )}
        </div>
      )}
    </div>
  );
}

export default ApproveOrder;
