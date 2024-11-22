import { useEffect, useState } from "react";
import {
  CheckCircleOutlined,
  DoubleRightOutlined,
  LoadingOutlined,
  SmileOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import {
  Steps,
  Button,
  Modal,
  Form,
  Upload,
  Image,
  message,
  Divider,
} from "antd";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import api from "../../../../config/axios";
import { useForm } from "antd/es/form/Form";
import uploadFile from "../../../../config/file";
import "./index.css";
import { useNavigate } from "react-router-dom";

const InProcess = ({ id }) => {
  const user = useSelector((store) => store.user);
  const navigate = useNavigate();
  // const [current, setCurrent] = useState(-1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const [form] = useForm();
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
  const [statuss, setStatus] = useState([]);
  const [viewOrder, setViewOrder] = useState([]);

  const fetchOrderDetail = async () => {
    try {
      console.log(id);
      const response = await api.get(`/orders/${id}`);
      console.log(response.data);
      const value = response.data;
      setViewOrder(value);
      const status = value.status[value.status.length - 1]?.statusInfo;
      setStatus(status);
    } catch (err) {
      console.error(err);
    }
  };
  console.log(statuss);
  useEffect(() => {
    fetchOrderDetail();
    // fetchStatusForOversea();
  }, []);

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
  };
  const handleChange = ({ fileList: newFileList }) => setFileList(newFileList);

  const handlePendingOrder = async () => {
    try {
      const setvalue = {
        statusInfo: "PENDING",
        empId: user.id,
        order: viewOrder.orderID,
        description: "Your order is currently in transit to you.",
      };
      await api.post("/status", setvalue);
      toast.success("PENDING");
      fetchOrderDetail();
    } catch (error) {
      toast.error(error.response.data);
    }
  };

  const handlePendingJapan = async () => {
    try {
      const setvalue = {
        statusInfo: "PENDINGJAPAN",
        empId: user.id,
        order: viewOrder.orderID,
        description: "Your order is currently in transit to you form Japan.",
      };
      await api.post("/status", setvalue);
      toast.success("The order status is changed to PENDINGJAPAN");
      fetchOrderDetail();
    } catch (error) {
      toast.error(error.response.data);
    }
  };

  const handleArrivedVietNam = async () => {
    try {
      const setvalue = {
        statusInfo: "ARRIVEDVIETNAM",
        empId: user.id,
        order: viewOrder.orderID,
        description: "Your order is arrived in Vietnam.",
      };
      await api.post("/status", setvalue);
      toast.success("The order status is changed to ARRIVEDVIETNAM");
      fetchOrderDetail();
    } catch (error) {
      toast.error(error.response.data);
    }
  };

  const handlePendingVietNam = async () => {
    try {
      const setvalue = {
        statusInfo: "PENDINGVIETNAM",
        empId: user.id,
        order: viewOrder.orderID,
        description: "Your order is currently in transit to you form Japan.",
      };
      await api.post("/status", setvalue);
      toast.success("The order status is changed to PENDINGVIETNAM");
      fetchOrderDetail();
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
          orderId: `${viewOrder.orderID}`,
          image: url,
        };
        const response = await api.put(`orders/image`, value);
        console.log(response);
        handleSuccessOrder();
        fetchOrderDetail();
      } catch (error) {
        toast.error(error);
      }
    }
  };
  const handleSuccessOrder = async () => {
    try {
      const setvalue = {
        statusInfo: "SUCCESS",
        empId: user.id,
        order: viewOrder.orderID,
        description: "Order Delivered Successfully",
      };
      await api.post("/status", setvalue);
      toast.success("SUCCESSFULL");
      fetchOrderDetail();
      navigate("/staff/success");
    } catch (error) {
      toast.error(error.response.data);
    }
  };

  const getCurrentStatus = (statuss) => {
    switch (statuss) {
      case "WAITING":
        return 0;
      case "WATINGFOR2NDSTAFF":
        return 1;
      case "APPROVEDJAPAN":
        return 2;
      case "PENDINGJAPAN":
        return 3;
      case "ARRIVEDVIETNAM":
        return 4;
      case "PENDINGVIETNAM":
        return 5;
      case "SUCCESS":
        return 6;
      default:
        return -1;
    }
  };

  // const fetchStatusForOversea = () => {
  //   setCurrent(getCurrentStatus(statuss));
  // };

  const steps = [
    {
      title: "Approved",
      status:
        statuss === "APPROVED" || statuss === "PENDING" || statuss === "SUCCESS"
          ? "finish"
          : "wait",
      icon: <CheckCircleOutlined />,
    },
    {
      title: "Preparing",
      status:
        statuss === "APPROVED" || statuss === "PENDING" || statuss === "SUCCESS"
          ? "finish"
          : "wait",
      icon: <LoadingOutlined />,
    },
    {
      title: "On delivery",
      status:
        statuss === "PENDING" || statuss === "SUCCESS" ? "finish" : "wait",
      icon: <DoubleRightOutlined />,
    },
    {
      title: "DONE",
      status: statuss === "SUCCESS" ? "finish" : "wait",
      icon: <SmileOutlined />,
    },
  ];

  return (
    <div>
      {viewOrder?.orderDetail?.type === "DOMESTIC" && (
        <>
          <Steps className="step" items={steps} />

          {statuss === "APPROVED" && (
            <>
              <button
                className="nextStep-btn btn-item"
                onClick={handlePendingOrder}
                style={{ marginTop: 20 }}
              >
                Next Step
              </button>
            </>
          )}

          {statuss === "PENDING" && (
            <>
              <div className="done">
                <button
                  className="done-btn btn-item"
                  type="primary"
                  onClick={() => {
                    setIsModalOpen(true);
                  }}
                >
                  Order Successfully Delivered
                </button>
              </div>
              <Modal
                title="Confirmation Of Successful Delivery"
                open={isModalOpen}
                onOk={() => {
                  form.submit();
                }}
                onCancel={handleCancel}
              >
                <Form onFinish={handleConfirm} form={form}>
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
                    afterOpenChange: (visible) =>
                      !visible && setPreviewImage(""),
                  }}
                  src={previewImage}
                />
              )}
            </>
          )}
        </>
      )}

      {viewOrder?.orderDetail?.type === "OVERSEA" && (
        <>
          <Divider />
          <Steps
            progressDot
            current={getCurrentStatus(statuss)}
            direction="vertical"
            items={[
              {
                title: "Waiting for Approval",
                description: "Order is pending initial staff approval.",
              },
              {
                title: "Waiting for Second Staff",
                description:
                  "Order has been approved by first staff member, awaiting second approval.",
              },
              {
                title: "Order Approved",
                description: "Order has been approved by both staff members.",
              },
              {
                title: "Processing in Japan",
                description: "Order is being processed at our Japan facility.",
              },
              {
                title: "Arrived in Vietnam",
                description:
                  "Order has arrived and is being processed in Vietnam.",
              },
              {
                title: "Processing in Vietnam",
                description: "The order is being processed in Vietnam.",
              },
              {
                title: "Order Complete",
                description:
                  "Order has been successfully processed and completed.",
              },
            ]}
          />
          {statuss === "APPROVEDJAPAN" && user?.country === "japan" && (
            <>
              <button
                className="nextStep-btn btn-item"
                onClick={handlePendingJapan}
                style={{ marginTop: 20 }}
              >
                Next Step
              </button>
            </>
          )}
          {statuss === "PENDINGJAPAN" && user?.country === "japan" && (
            <>
              <button
                className="nextStep-btn btn-item"
                onClick={handleArrivedVietNam}
                style={{ marginTop: 20 }}
              >
                Next Step
              </button>
            </>
          )}
          {statuss === "ARRIVEDVIETNAM" && user?.country === "vietnam" && (
            <>
              <button
                className="nextStep-btn btn-item"
                onClick={handlePendingVietNam}
                style={{ marginTop: 20 }}
              >
                Next Step
              </button>
            </>
          )}
          {statuss === "PENDINGVIETNAM" && user?.country === "vietnam" && (
            <>
              <div className="done">
                <button
                  className="done-btn btn-item"
                  type="primary"
                  onClick={() => {
                    setIsModalOpen(true);
                  }}
                >
                  Order Successfully Delivered
                </button>
              </div>
              <Modal
                title="Confirmation Of Successful Delivery"
                open={isModalOpen}
                onOk={() => {
                  form.submit();
                }}
                onCancel={handleCancel}
              >
                <Form onFinish={handleConfirm} form={form}>
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
                    afterOpenChange: (visible) =>
                      !visible && setPreviewImage(""),
                  }}
                  src={previewImage}
                />
              )}
            </>
          )}
        </>
      )}
    </div>
  );
};

export default InProcess;
