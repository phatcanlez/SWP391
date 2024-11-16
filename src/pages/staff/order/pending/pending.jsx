import { useEffect, useState } from "react";
import {
  CheckCircleOutlined,
  DoubleRightOutlined,
  LoadingOutlined,
  SmileOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { Steps, Button, Modal, Form, Upload, Image, message } from "antd";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import api from "../../../../config/axios";
import { useForm } from "antd/es/form/Form";
import uploadFile from "../../../../config/file";
import "./index.css";
import { useNavigate } from "react-router-dom";

const InProcess = ({id}) => {
  const user = useSelector((store) => store.user);
  const navigate = useNavigate();
  const [current, setCurrent] = useState(-1);
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
  console.log(viewOrder);
  console.log(statuss);
  useEffect(() => {
    fetchOrderDetail();
    fetchStatusForOversea();
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

  const fetchStatusForOversea = () => {
    if (viewOrder?.status?.length > 0) {
      const lastStatus = viewOrder.status[viewOrder.status.length - 1];
      if (lastStatus) {
        setCurrent(getCurrentStatus(lastStatus.statusInfo));
        setStatus(lastStatus.statusInfo);
      }
    }
  };

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
  const description = "This is a description.";
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
              {/* <Button
  type="primary"
  onClick={()=>{dispatch(reset())}}
  style={{ marginTop: 20 }}
>
  RESET Step
</Button> */}
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
          <div className="bg-w" style={{ marginTop: "20px" }}>
            <Steps
              direction="vertical"
              current={1}
              items={[
                {
                  title: "Finished",
                  description,
                },
                {
                  title: "In Progress",
                  description,
                },
                {
                  title: "Waiting",
                  description,
                },
              ]}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default InProcess;
