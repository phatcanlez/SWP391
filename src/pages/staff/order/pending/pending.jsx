import { useState } from "react";
import {
  CheckCircleOutlined,
  DoubleRightOutlined,
  LoadingOutlined,
  PlusOutlined,
  SmileOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { Steps, Button, Modal, Form, Upload, Image, message } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import api from "../../../../config/axios";
import { increase } from "../../../../redux/features/countSlice";
import { useForm } from "antd/es/form/Form";
import uploadFile from "../../../../config/file";

const InProcess = () => {
  const approvingorder = useSelector((store) => store.order);
  const user = useSelector((store) => store.user);
  const currentStep = useSelector((store) => store.count.value);
  const dispatch = useDispatch();
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
        order: approvingorder?.[0]?.orderID,
        description: "Your order is currently in transit to you.",
      };
      await api.post("/status", setvalue);
      toast.success("PENDING");
      handleNextStep();
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
          orderId: `${approvingorder?.[0]?.orderID}`,
          image: url,
        };
        const response = await api.put(`orders/image`,value);
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
        order: approvingorder?.[0]?.orderID,
        description: "Order Delivered Successfully",
      };
      await api.post("/status", setvalue);
      toast.success("SUCCESSFULL");
      handleNextStep();
    } catch (error) {
      toast.error(error.response.data);
    }
  };

  

  const steps = [
    {
      title: "Approved",
      status: "finish", // Trạng thái 'finish' nếu đã qua bước này
      icon: <CheckCircleOutlined />,
    },
    {
      title: "Preparing",
      status:
        currentStep > 1 ? "finish" : currentStep === 1 ? "process" : "wait", // 'process' nếu đang ở bước này, 'finish' nếu đã qua
      icon: <LoadingOutlined />,
    },
    {
      title: "On delivery",
      status:
        currentStep > 2 ? "finish" : currentStep === 2 ? "process" : "wait", // 'process' nếu đang ở bước này, 'finish' nếu đã qua
      icon: <DoubleRightOutlined />,
    },
    {
      title: "DONE",
      status:
        currentStep > 3 ? "finish" : currentStep === 3 ? "process" : "wait",
      icon: <SmileOutlined />,
    },
  ];

  const handleNextStep = () => {
    dispatch(increase());
  };

  return (
    <div>
      <Steps items={steps} />
      <span>{currentStep}</span>

      {approvingorder?.[0]?.status.statusInfo === "APPROVED" && (
        <>
          <Button
            type="primary"
            onClick={handlePendingOrder}
            style={{ marginTop: 20 }}
          >
            Next Step
          </Button>
          {/* <Button
        type="primary"
        onClick={()=>{dispatch(reset())}}
        style={{ marginTop: 20 }}
      >
        RESET Step
      </Button> */}
        </>
      )}
      {approvingorder?.[0]?.status.statusInfo === "PENDING" && (
        <>
          <Button
            type="primary"
            onClick={() => {
              setIsModalOpen(true);
            }}
            style={{ marginTop: 20 }}
          >
            DONE
          </Button>
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
                afterOpenChange: (visible) => !visible && setPreviewImage(""),
              }}
              src={previewImage}
            />
          )}
        </>
      )}
    </div>
  );
};

export default InProcess;
