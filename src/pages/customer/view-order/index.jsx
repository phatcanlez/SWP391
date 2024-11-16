import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../../config/axios";
import { toast } from "react-toastify";
import { DoubleRightOutlined, PhoneOutlined } from "@ant-design/icons";
import License from "../../staff/order/license";
import { format, parseISO } from "date-fns";

import { Button, Steps } from "antd";
import { useSelector } from "react-redux";

const formatCurrency = (value) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

const sizeOptions = [
  { 
    minSize: 1,
    maxSize: 19.9,
    sizeInCM: "1-19.9", 
    sizeInInch: "7.86", 
    points: 1.25,
    description: "Extra Small"
  },
  { 
    minSize: 20,
    maxSize: 25,
    sizeInCM: "20-25", 
    sizeInInch: "7.87 - 9.84", 
    points: 2,
    description: "Small"
  },
  { 
    minSize: 25.1,
    maxSize: 30,
    sizeInCM: "25.1-30", 
    sizeInInch: "9.85 - 11.81", 
    points: 2.5,
    description: "Small-Medium"
  },
  { 
    minSize: 30.1,
    maxSize: 40,
    sizeInCM: "30.1-40", 
    sizeInInch: "11.82 - 15.75", 
    points: 3,
    description: "Medium"
  },
  { 
    minSize: 40.1,
    maxSize: 44,
    sizeInCM: "40.1-44", 
    sizeInInch: "15.76 - 17.32", 
    points: 5,
    description: "Medium-Large"
  },
  { 
    minSize: 44.1,
    maxSize: 50,
    sizeInCM: "44.1-50", 
    sizeInInch: "17.33 - 19.6", 
    points: 7.5,
    description: "Large"
  },
  { 
    minSize: 50.1,
    maxSize: 55,
    sizeInCM: "50.1-55", 
    sizeInInch: "19.7 - 21.6", 
    points: 9,
    description: "Extra Large"
  },
  { 
    minSize: 55.1,
    maxSize: 65,
    sizeInCM: "55.1-65", 
    sizeInInch: "21.7 - 25.5", 
    points: 14,
    description: "Jumbo"
  },
  {
    minSize: 50,
    maxSize: 60,
    sizeInCM: "50-60 Hirenaga (Butterfly)",
    sizeInInch: "19.7 - 23.4",
    points: 12,
    description: "Butterfly Large"
  },
  {
    minSize: 60.1,
    maxSize: 65,
    sizeInCM: "60.1-65 Hirenaga (Butterfly)",
    sizeInInch: "23.5 - 25.5",
    points: 14,
    description: "Butterfly Extra Large"
  },
  { 
    minSize: 65.1,
    maxSize: 73,
    sizeInCM: "65.1-73",
    sizeInInch: "25.6 - 28.7",
    points: 16,
    description: "Super Jumbo"
  },
  { 
    minSize: 73.1,
    maxSize: 83,
    sizeInCM: "73.1-83",
    sizeInInch: "28.8 - 32.6",
    points: 18,
    description: "Ultra Jumbo"
  }
];

const getSizeDetails = (size) => {
  if (!size) return null;
  
  try {
    if (size.includes('Hirenaga')) {
      return sizeOptions.find(option => option.sizeInCM.includes('Hirenaga'));
    }

    const firstNumber = parseFloat(size.match(/\d+\.?\d*/)?.[0]);
    if (!firstNumber) return null;

    return sizeOptions.find(option => 
      firstNumber >= option.minSize && firstNumber <= option.maxSize
    );
  } catch (error) {
    console.error('Error parsing size:', error);
    return null;
  }
};

function ViewOrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState([]);
  const [service, setService] = useState([]);
  const [status, setStatus] = useState("WAITING");
  const [loading, setLoading] = useState(false);
  const [display, setDisplay] = useState("none");
  const resultRef = useRef(null);
  const [data, setData] = useState([]);
  const [orderId, setOrderId] = useState("");
  const [staffInfo, setStaffInfo] = useState("");
  const [current, setCurrent] = useState(-1);
  const [staffDetail, setStaffDetail] = useState(null);
  const user = useSelector((store) => store.user);

  // const [isPaid, setIsPaid] = useState(false);

  const fetchOrderDetail = async (id) => {
    setLoading(true);
    try {
      const response = await api.get(`orders/${id}`);
      setOrder(response.data);
      setService(response.data.orderDetail.extraService);

      // setIsPaid(response.data.isPaid || false);

      if (response.data.status.length > 0) {
        const lastStatus =
          response.data.status[response.data.status.length - 1];
        setStatus(lastStatus.statusInfo);
        setStaffInfo(lastStatus.empId);

        if (lastStatus.empId) {
          try {
            const staffResponse = await api.get(`account/${lastStatus.empId}`);
            setStaffDetail(staffResponse.data);
            console.log("Staff detail:", staffResponse.data);
          } catch (staffError) {
            console.error("Error fetching staff detail:", staffError);
          }
        }
      }
    } catch (err) {
      toast.error(err.response.data);
    } finally {
      setLoading(false);
    }
  };
  console.log(order);
  const getCurrentStatus = (statusInfo) => {
    switch (statusInfo) {
      case "WAITING":
        return 0;
      case "APPROVED":
        return 1;
      case "PENDING":
        return 2;
      case "SUCCESS":
        return 3;
      default:
        return -1;
    }
  };
  const handleTracking = async (values) => {
    console.log(values);
    try {
      const response = await api.get(`orders/${values.orderId}`);
      setOrderId(values.orderId);
      setData(response.data.status);
      const lastStatus = response.data.status[response.data.status.length - 1];
      if (lastStatus) {
        setCurrent(getCurrentStatus(lastStatus.statusInfo));
      }
      setDisplay("");
      toast.success("Successfull");

      setTimeout(() => {
        if (resultRef.current) {
          resultRef.current.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    } catch (err) {
      toast.error(err.response.data.Error);
    }
  };
  useEffect(() => {
    fetchOrderDetail(id);
  }, [id]);

  useEffect(() => {
    if (order?.status?.length > 0) {
      const lastStatus = order.status[order.status.length - 1];
      if (lastStatus) {
        setCurrent(getCurrentStatus(lastStatus.statusInfo));
        setStatus(lastStatus.statusInfo);
      }
    }
  }, [order]);

  const formatDate = (isoString) => {
    if (!isoString) return "Không có dữ liệu"; // Trả về chuỗi mặc định nếu không có ngày
    try {
      return format(parseISO(isoString), "dd/MM/yyyy"); // Định dạng ngày hợp lệ
    } catch (error) {
      console.error("Định dạng ngày không hợp lệ:", error);
      return "Ngày không hợp lệ"; // Xử lý lỗi khi parse thất bại
    }
  };

  const handleBuy = async () => {
    try {
      const response = await api.put(`payment?orderId=${id}`);
      console.log(response.data);
      window.open(response.data);
      fetchOrderDetail();
    } catch (err) {
      console.log(err);
    }
  };

  const isOversea = () => order?.orderDetail?.type?.toUpperCase() === "OVERSEA";

  return (
    <div className="order-detail" style={{ padding: "50px" }}>
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
        <div style={{ marginBottom: "20px" }}>
          <h6 style={{ display: "inline-block", marginRight: "10px" }}>
            Shipping Type:
          </h6>
          <span
            className="color"
            style={{
              textTransform: "capitalize",
              fontWeight: "bold",
              backgroundColor: isOversea() ? "#ffeee8" : "#e8f5ff",
              padding: "4px 12px",
              borderRadius: "4px",
            }}
          >
            {order?.orderDetail?.type?.toLowerCase() || "Domestic"}
          </span>
        </div>

        <div className="send-section">
          <div className="item">
            <div>
              <p>
                <span className="color">{user?.name}</span> - (+84)
                {order.senderPhoneNumber}
              </p>
              <p>{order.senderAddress}</p>
            </div>

            <PhoneOutlined style={{ fontSize: 18, color: "#c3c3c3" }} />
          </div>

          <DoubleRightOutlined
            style={{
              fontSize: 18,
              color: isOversea() ? "#ff6b35" : "#e25822",
            }}
          />

          <div className="item">
            <div>
              <p>
                <span className="color">{order.reciverName} </span>- (+84)
                {order.reciverPhoneNumber}
              </p>
              <p
                style={{
                  color: isOversea() ? "#ff6b35" : "inherit",
                  fontStyle: isOversea() ? "italic" : "normal",
                }}
              >
                {order.reciverAdress}
                {isOversea() && " (Overseas Address)"}
              </p>
            </div>
            <PhoneOutlined style={{ fontSize: 18, color: "#c3c3c3" }} />
          </div>
        </div>
        {!isOversea() && (
          <h6 style={{ marginTop: "30px", marginBottom: "0px" }}>
            Distance: {order?.orderDetail?.kilometer} km
          </h6>
        )}
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
                {order?.orderDetail?.totalWeight} kg
              </span>
            </h6>
            <h6></h6>
            {isOversea() && (
              <h6>
                Distance:{" "}
                <span
                  className="color"
                  style={{
                    textTransform: "capitalize",
                    backgroundColor: isOversea() ? "#ffeee8" : "#e8f5ff",
                    padding: "2px 8px",
                    borderRadius: "4px",
                  }}
                >
                  {order?.orderDetail?.kilometer} km
                </span>
              </h6>
            )}
            {!isOversea() && (
              <h6>
                Distance:{" "}
                <span className="color">
                  {order?.orderDetail?.kilometer} km
                </span>
              </h6>
            )}
          </div>
          <License id={id} />
          <>
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
          </>

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
            Total fish price:{" "}
            <span className="color" style={{ fontWeight: "600" }}>
              {formatCurrency(order.orderPrice)}
            </span>
          </p>
        </div>
      </div>

      <h5 className="title" style={{ marginBottom: "20px" }}>
        Order History
      </h5>
      <div className="bg-w" style={{ marginTop: "20px" }}>
        <Steps
          className="billoflading__result__step"
          progressDot
          current={current}
          direction="vertical"
          items={
            order?.status?.map((statusItem) => ({
              title: (
                <div
                  className="billoflading__result__step__title"
                  style={{
                    color: "#e25822",
                    fontWeight: "bold",
                    fontSize: "16px",
                  }}
                >
                  {statusItem.statusInfo}
                </div>
              ),
              description: (
                <div style={{ padding: "10px 0" }}>
                  <div
                    className="billoflading__result__step__time"
                    style={{
                      color: "#666",
                      marginBottom: "5px",
                    }}
                  >
                    {new Date(statusItem.date).toLocaleString()}
                  </div>
                  <div
                    className="billoflading__result__step__description"
                    style={{
                      color: "#333",
                      fontSize: "14px",
                    }}
                  >
                    {statusItem.description}
                  </div>
                </div>
              ),
            })) || []
          }
          style={{
            "--ant-primary-color": "#e25822",
            "--ant-primary-5": "#e25822",
          }}
        />
      </div>

      <h5 className="title" style={{ marginBottom: "20px" }}>
        Staff Info
      </h5>
      <div className="bg-w" style={{ marginTop: "20px", padding: "20px" }}>
        {staffDetail ? (
          <div className="staff-info">
            <div className="item">
              <p>
                <span className="color">Staff Name:</span> {staffDetail.name}
              </p>
            </div>
            <div className="item">
              <p>
                <span className="color">Phone:</span> {staffDetail.phoneNumber}
              </p>
            </div>
            <div className="item">
              <p>
                <span className="color">Email:</span> {staffDetail.email}
              </p>
            </div>
          </div>
        ) : (
          <p>No staff information available</p>
        )}
      </div>

      {order?.payment?.status === "UNPAYED" && (
        <div style={{ marginTop: "20px", textAlign: "center" }}>
          <Button
            type="primary"
            onClick={handleBuy}
            style={{
              backgroundColor: "#e25822",
              borderColor: "#e25822",
            }}
          >
            Proceed to Payment
          </Button>
        </div>
      )}
    </div>
  );
}

export default ViewOrderDetail;
