// eslint-disable-next-line no-unused-vars
import {
  Button,
  Form,
  Image,
  Input,
  InputNumber,
  Modal,
  Popconfirm,
  Table,
} from "antd";
import { useForm } from "antd/es/form/Form";
import Upload from "antd/es/upload/Upload";
import axios from "axios";
import { useEffect, useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
import { toast } from "react-toastify";
import api from "../../../config/axios";

function ManageOrder() {
  const [order, setOrder] = useState([]);

  const fetchOrder = async () => {
    const response = await axios.get(api);
    setOrder(response.data);
  };

  useEffect(() => {
    fetchOrder();
  }, []);
  const [fileList, setFileList] = useState([]);

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },

    {
      title: "Sender Name",
      dataIndex: "senderName",
      key: "senderName",
    },

    {
      title: "Receiver Name",
      dataIndex: "receiverName",
      key: "receiverName",
    },

    {
      title: "Quantity",
      dataIndex: "Quantity",
      key: "Quantity",
    },

    {
      title: "Weight",
      dataIndex: "weight",
      key: "weight",
    },
    {
      title: "Image",
      dataIndex: "img",
      key: "img",
      render: (img) => {
        return <img src={img} alt="" width={100} />;
      },
    },

    {
      title: "Action",
      dataIndex: "id",
      key: "id",
      render: (id) => {
        return (
          <>
            <Popconfirm
              title="Delete"
              description="Do u want to delete?"
              onConfirm={() => handleDeteleOrder(id)}
            >
              <Button type="primary" danger>
                Delete
              </Button>
            </Popconfirm>
          </>
        );
      },
    },
  ];
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    formVariable.submit();
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const [formVariable] = useForm();

  const getBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  const [submit, setSubmit] = useState(false);

  const handleSubmit = async (order) => {
    try {
      setSubmit(true);
      const response = axios.post("category", order);
      toast.success("Successful");
      setIsModalOpen(false);
      formVariable.resetFields();
      fetchOrder();
    } catch (err) {
      toast.error(err);
    } finally {
      setSubmit(false);
    }
  };

  const handleDeteleOrder = async (orderID) => {
    try {
      await axios.delete(`${api}/${orderID}`);
      toast.success("Deleted!");
      fetchOrder();
    } catch (ex) {
      toast.error("Failed to delete");
    }
  };

  return (
    <div>
      <h1>Orders</h1>
      <Button type="primary" onClick={showModal}>
        Add order
      </Button>
      <Table dataSource={order} columns={columns} />;
      <Modal
        confirmLoading={submit}
        title="Add order form"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form onFinish={handleSubmit} form={formVariable}>
          <Form.Item
            name={"id"}
            label={"ID: "}
            rules={[
              {
                required: true,
                message: "Please input",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name={"senderName"}
            label={"Sender name: "}
            rules={[
              {
                required: true,
                message: "Please input",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name={"receiverName"}
            label={"Receiver name: "}
            rules={[
              {
                required: true,
                message: "Please input",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name={"Quantity"}
            label={"Quantity: "}
            rules={[
              {
                required: true,
                message: "Please input",
              },
            ]}
          >
            <InputNumber step={1} />
          </Form.Item>

          <Form.Item
            name={"weight"}
            label={"Weight:"}
            rules={[
              {
                required: true,
                message: "Please input",
              },
            ]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default ManageOrder;
