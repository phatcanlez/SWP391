import { Button, Form, Input, Modal, Table } from "antd";
import { toast } from "react-toastify";
import api from "../../../config/axios";
import { useEffect, useState } from "react";

function Delivery11() {
  const [data, setData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await api.get("shipmethod");
      setData(response.data);
      setLoading(false);
    } catch (err) {
      toast.error(err.response.data);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const columns = [
    {
      title: "ID",
      dataIndex: "shipMethodId",
      key: "shipMethodId",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Price Details",
      dataIndex: "shipMethodId",
      key: "shipMethodId",
      render: (id) => (
        <>
          <Button onClick={() => handleViewPriceDetails(id)}>View</Button>
        </>
      ),
    },
    {
      title: "Action",
      dataIndex: "id",
      key: "id",
      fixed: "right",
      render: (id, Item) => (
        <>
          <Button
            type="primary"
            onClick={() => {
              setShowModal(true);
              form.setFieldsValue(Item);
            }}
          >
            Edit
          </Button>
        </>
      ),
    },
  ];

  const priceColums = [
    {
      title: "Distance",
      dataIndex: "distance",
      key: "distance",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
    },
    {
      title: "Weight",
      dataIndex: "weight",
      key: "weight",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
    },
  ];

  const handleViewPriceDetails = async (id) => {
    console.log(id);
    try {
      setLoading(true);
      const response1 = await api.get(`tracking/${id}`);
      const response2 = await api.get(`tracking/weight/${id}`);

      setLoading(false);
    } catch (err) {
      toast.error(err.response.data);
      setLoading(false);
    }
  };

  const formItems = (
    <>
      <Form.Item name="shipMethodId" hidden>
        <Input />
      </Form.Item>
      <Form.Item
        name="description"
        label="Description"
        rules={[{ required: true }]}
      >
        <Input />
      </Form.Item>
    </>
  );

  return (
    <div>
      <Table
        dataSource={data}
        columns={columns}
        scroll={{
          x: "max-content",
        }}
        loading={loading}
      />

      <Modal
        open={showModal}
        onCancel={() => {
          setShowModal(false), form.resetFields();
        }}
        title="Category"
        onOk={() => form.submit()}
        confirmLoading={loading}
      >
        {/* <Form form={form} labelCol={{ span: 24 }} onFinish={handleSubmit}>
          {formItems}
        </Form> */}
      </Modal>
    </div>
  );
}

export default Delivery11;
