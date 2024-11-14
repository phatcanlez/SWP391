import { Button, Form, Input, Modal, Table } from "antd";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import api from "../../../config/axios";

function PriceListDistance() {
  const [data, setData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response1 = await api.get("tracking/1");
      const response2 = await api.get("tracking/2");
      const response3 = await api.get("tracking/3");
      const response4 = await api.get("shipmethod");
      setData([
        ...response1.data.map((item) => ({
          shipMethodId: 1,
          description: response4.data.find((id) => id.shipMethodId === 1)
            .description,
          distance: item.distance,
          price: item.price,
          priceListId: item.priceListId,
        })),
        ...response2.data.map((item) => ({
          shipMethodId: 2,
          description: response4.data.find((id) => id.shipMethodId === 2)
            .description,
          distance: item.distance,
          price: item.price,
          priceListId: item.priceListId,
        })),
        ...response3.data.map((item) => ({
          shipMethodId: 3,
          description: response4.data.find((id) => id.shipMethodId === 3)
            .description,
          distance: item.distance,
          price: item.price,
          priceListId: item.priceListId,
        })),
      ]);
      setLoading(false);
    } catch (err) {
      toast.error(err.response.data);
      setLoading(false);
    }
  };

  const columns = [
    {
      title: "Ship Method",
      dataIndex: "description",
      key: "description",
      filters: [
        {
          text: "Economy shipping",
          value: "Economy shipping",
        },
        {
          text: "Fast shipping",
          value: "Fast shipping",
        },
        {
          text: "Express shipping",
          value: "Express shipping",
        },
      ],
      onFilter: (value, record) => record.description.indexOf(value) === 0,
    },
    {
      title: "Distance",
      dataIndex: "distance",
      key: "distance",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (text) => {
        // Format the price with spaces every three digits
        return text
          ? text.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")
          : "";
      },
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

  const handleSubmit = async (values) => {
    console.log(values);
    try {
      setLoading(true);
      const response = await api.put(`pricelistdistance`, values);
      toast.success("Successfull");
      fetchData();
      form.resetFields();
      setShowModal(false);
    } catch (err) {
      toast.error(err.response.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    console.log(data);
  }, []);

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
          setShowModal(false);
        }}
        title="Category"
        onOk={() => form.submit()}
        confirmLoading={loading}
      >
        <Form form={form} labelCol={{ span: 24 }} onFinish={handleSubmit}>
          <Form.Item name="priceListId" hidden>
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Ship method">
            <Input disabled />
          </Form.Item>
          <Form.Item
            name="distance"
            label="Distance"
            rules={[
              {
                pattern: new RegExp(/^[0-9]+$/),
                required: true,
                message: "Wrong number",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="price"
            label="Price"
            rules={[
              {
                pattern: new RegExp(/^[0-9]+$/),
                required: true,
                message: "Wrong number",
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

export default PriceListDistance;
