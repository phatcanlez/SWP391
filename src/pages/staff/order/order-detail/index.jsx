import api from "../../../../config/axios";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import "./index.css";
import { DoubleRightOutlined, PhoneOutlined } from "@ant-design/icons";
import License from "../license";
import { Button, Form, Input, Modal } from "antd";
import { useSelector } from "react-redux";
import { useForm } from "antd/es/form/Form";
import { useParams } from "react-router-dom";

function OrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState([]);
  const [service, setService] = useState([]);
  const [status, setStatus] = useState("WAITING");

  const fetchOrderDetail = async (id) => {
    try {
      const response = await api.get(`orders/${id}`);
      setOrder(response.data);
      console.log(response.data);
      response.data.orderDetail.extraService;
      setService(response.data.orderDetail.extraService);
      console.log(service);

      const statusArray = response.data.status;
      console.log(statusArray);
      if (statusArray.length > 0) {
        console.log(statusArray[statusArray.length - 1]?.statusInfo);
        setStatus(statusArray[statusArray.length - 1]?.statusInfo);
      }
    } catch (err) {
      toast.error(err.response.data);
    }
  };

  useEffect(() => {
    if (id) {
      fetchOrderDetail(id);
    }
  }, []);

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
    } catch (error) {
      toast.error(error.response.data);
    } finally {
      fetchOrderDetail(id);
    }
  };

  const handleAddApprove = async () => {
    try {
      console.log(user.id);
      const emid = user.id;
      const setvalue = {
        statusInfo: "APPROVED",
        empId: emid,
        order: id,
        description: "The order is approved",
      };
      await api.post("/status", setvalue);
      toast.success("APPROVED");
    } catch (error) {
      toast.error(error.response.data);
    } finally {
      fetchOrderDetail(id);
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
              <p>{order.reciverName}</p>
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
        <div className="send-section">
          <div className="item">
            <div>
              <p>
                Payment status:{" "}
                <span
                  className="color"
                  style={{ fontWeight: "600", fontSize: "18px" }}
                >
                  {" "}
                  {order?.payment?.status}
                </span>
              </p>


              
            </div>
          </div>
        </div>
      </div>

      {status == "WAITING" ? (
        <div className="btn-wrap">
          <Button className="btn btn-r" onClick={showModal}>
            REJECT
          </Button>
          <Button
            className="btn btn-a"
            onClick={() => {
              handleAddApprove();
            }}
          >
            APPROVE
          </Button>
        </div>
      ) : (
        <div className="btn-wrap">
          <Button className="btn btn-r" onClick={showModal}>
            REJECT
          </Button>
        </div>
      )}
      {status == "FAIL" ? (
        <div className="btn-wrap">
          <Button
            className="btn btn-a"
            onClick={() => {
              handleAddApprove();
            }}
          >
            APPROVE
          </Button>
        </div>
      ) : (
        <div>
          
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
