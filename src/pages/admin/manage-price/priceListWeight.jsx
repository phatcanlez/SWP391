import { Button, Form, Input, Modal, Table } from "antd";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import axios from "axios";
import api from "../../../config/axios";

function PriceListWeight() {
  const [data, setData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    try {
      const response1 = await axios.get(
        "http://103.90.227.65:8080/tracking/weight/1"
      );
      const response2 = await axios.get(
        "http://103.90.227.65:8080/tracking/weight/2"
      );
      const response3 = await axios.get(
        "http://103.90.227.65:8080/tracking/weight/3"
      );
      const response4 = await api.get("shipmethod");
      setData([
        ...response1.data.map((item) => ({
          shipMethodId: 1,
          description: response4.data.find((id) => id.shipMethodId === 1)
            .description,
          weight: item.weight,
          price: item.price,
          priceListId: item.priceListId,
        })),
        ...response2.data.map((item) => ({
          shipMethodId: 2,
          description: response4.data.find((id) => id.shipMethodId === 2)
            .description,
          weight: item.weight,
          price: item.price,
          priceListId: item.priceListId,
        })),
        ...response3.data.map((item) => ({
          shipMethodId: 3,
          description: response4.data.find((id) => id.shipMethodId === 3)
            .description,
          weight: item.weight,
          price: item.price,
          priceListId: item.priceListId,
        })),
      ]);
    } catch (err) {
      toast.error(err.response.data);
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
      title: "Weight",
      dataIndex: "weight",
      key: "weight",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
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
      const response = await api.put(`pricelistweight`, values);
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
      />

      <Modal
        open={showModal}
        onCancel={() => {
          setShowModal(false);
        }}
        title="Price weight"
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
            name="weight"
            label="Weight"
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
                pattern: new RegExp(/^\d+(\.\d+)?$/),
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

export default PriceListWeight;
