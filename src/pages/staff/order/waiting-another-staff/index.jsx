import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import {
  DoubleRightOutlined,
  LoadingOutlined,
  MessageOutlined,
  PhoneOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import License from "../license";
import {
  Alert,
  Button,
  Form,
  Image,
  Input,
  message,
  Modal,
  Upload,
} from "antd";
import { useSelector } from "react-redux";
import { useForm } from "antd/es/form/Form";
import { useNavigate, useParams } from "react-router-dom";
import { format, parseISO } from "date-fns";
import InProcess from "../pending/pending";
import api from "../../../../config/axios";
import uploadFile from "../../../../config/file";
import StaffList from "./staff-list";

function WaitingAnotherStaff() {
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
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const [description, setDescription] = useState("");

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

  console.log(order);
  const getBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [fileList, setFileList] = useState([]);
  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
  };
  const handleChange = ({ fileList: newFileList }) => setFileList(newFileList);
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
        handleSuccessOrder();
      } catch (error) {
        toast.error(error);
      }
    }
  };

  const handleSuccessOrder = async () => {
    try {
      const setvalue = {
        statusInfo: "FAIL",
        empId: user.id,
        order: order?.orderID,
        description: "Your order has failed",
      };
      await api.post("/status", setvalue);
      toast.success("This order has been rejected!");
      fetchOrderDetail();
      navigate("/staff/reject");
    } catch (error) {
      toast.error(error.response.data);
    }
  };

  const handleRoomChat = async (customerID) => {
    try {
      const room = await api.get(`/chat/room/${user?.id}/${customerID}`);

      console.log(room.data);
      navigate(`/staff/chat/${room.data?.roomID}`);
    } catch (error) {
      toast.error(error);
    }
  };

  const handleApproveJapan = async () => {
    try {
      const approveJapan = await api.get(
        `/orders/status-emp?status=APPROVEDJAPAN&empId=${user.id}`
      );
      const processingOrder = await api.get(
        `/orders/status-emp?status=PENDING&empId=${user.id}`
      );
      const vietnam = await api.get(
        `/orders/status-emp?status=PENDINGVIETNAM&empId=${user.id}`
      );
      const arrive = await api.get(
        `/orders/status-emp?status=ARRIVEDVIETNAM&empId=${user.id}`
      );

      if (
        approveJapan.data?.length === 0 &&
        processingOrder.data?.length === 0 &&
        vietnam.data?.length === 0 &&
        arrive.data?.length === 0
      ) {
        console.log(user.id);
        const emid = user.id;
        const setvalue = await api.post("/status", {
          statusInfo: "APPROVEDJAPAN",
          empId: emid,
          order: id,
          description: "The order from Japan is approved ",
        });
        console.log(setvalue);
        toast.success("APPROVEDJAPAN");
      } else {
        toast.error("Please check if you have any order from Japan in process");
      }
    } catch (error) {
      console.log(error);
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
              <span className="color">Order ID: </span> {order?.orderID}
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
                      <p>{service.nameService}</p>
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
          <h5 className="title">Staff Information</h5>

          <div className="bg-w">
            <StaffList id={order?.orderID} />
          </div>

          <h5 className="title">Delivery status</h5>

          <div className="bg-w">
            <InProcess id={order?.orderID} />

            {user?.country === "japan" && (
              <button className="btn-item fail-btn" onClick={showModal}>
                Delivery Failure
              </button>
            )}
            {user?.country === "vietnam" && status === "WATINGFOR2NDSTAFF" && (
              <button
                className="btn-item"
                onClick={handleApproveJapan}
                style={{ background: "#e25822" }}
              >
                Approve
              </button>
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

export default WaitingAnotherStaff;
