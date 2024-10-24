import api from "../../../../config/axios";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import "./index.css";
import { DoubleRightOutlined, PhoneOutlined } from "@ant-design/icons";
import License from "../license";
import { Button, Form, Input, Modal } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "antd/es/form/Form";
import { useNavigate, useParams } from "react-router-dom";
import { format, parseISO } from "date-fns";
import InProcess from "../pending/pending";
import { approve } from "../../../../redux/features/orderSlice";

function OrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState([]);
  const [service, setService] = useState([]);
  const [status, setStatus] = useState("WAITING");
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchOrderDetail = async (id) => {
    setLoading(true);
    try {
      const response = await api.get(`orders/${id}`);
      setOrder(response.data);
      setService(response.data.orderDetail.extraService);
      if (response.data.status.length > 0) {
        setStatus(
          response.data.status[response.data.status.length - 1]?.statusInfo
        );
      }
    } catch (err) {
      toast.error(err.response.data);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchOrderDetail(id);
  }, [id]);
  /////////////////////////////

  const [form] = useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const user = useSelector((store) => store.user);
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
      navigate("/staff/rejected-order");
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
      if (response.data.length === 0 && processingOrder.data.length === 0) {
        console.log(user.id);
        const emid = user.id;
        const setvalue = await api.post("/status", {
          statusInfo: "APPROVED",
          empId: emid,
          order: id,
          description: "The order is approved",
        });
        dispatch(approve(setvalue));
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

  return (
    <div className="order-detail">
      {/* <Image src={order.image} alt="Order image" width={200} /> */}

      <div className="bg-w">
        <h3 style={{ marginBottom: "50px" }}>
          <span className="color">Order ID: </span> {order.orderID}
        </h3>

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
                <span className="color">{order?.account?.name}</span> - (+84)
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
            <InProcess />
            {(status === "APPROVED" ||
          status === "PENDING") && (
          <>
            <Button className="btn btn-r" onClick={showModal}>
              REJECT
            </Button>
          </>
        )}
            <Button className="fb-btn" >
              View Feedback
            </Button>
          </>
        )}

        <div className="send-section">
          <div className="item">
            <p>
              Payment status:{" "}
              <span
                className="color"
                style={{ fontWeight: "600", fontSize: "18px" }}
              >
                {order?.payment?.status}
              </span>
            </p>
          </div>
        </div>
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="btn-wrap">
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

          {status === "FAIL" && (
            <Button className="btn btn-a" onClick={handleAddApprove}>
              APPROVE
            </Button>
          )}
        </div>
      )}

      {/* <span>Price: {order.price}</span>            */}

      <Modal
        title="Are you really want to reject this order?"
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
    </div>
  );
}

export default OrderDetail;
