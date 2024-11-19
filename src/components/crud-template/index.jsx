import { Button, Form, Input, Modal, Popconfirm, Table } from "antd";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from "../../config/axios";

function CRUDTemplate({ columns, formItems, path, field }) {
  const [data, setData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const tableColumn = [
    ...columns,
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
          {field === "extraservice" ? (
            <Popconfirm
              title="Delete"
              description="Do you want to delete"
              onConfirm={() => {
                handleDelete(Item.extraServiceId);
              }}
            >
              <Button type="primary" danger style={{ marginLeft: 15 }}>
                Delete
              </Button>
            </Popconfirm>
          ) : (
            ""
          )}
        </>
      ),
    },
  ];
  //get
  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await api.get(path);
      setData(response.data);
      setLoading(false);
    } catch (err) {
      toast.error(err.response.data);
      setLoading(false);
    }
  };

  //create or update
  const handleSubmit = async (values) => {
    console.log(values);
    if (field === "box") {
      values = {
        id: values.boxId,
        ...values,
      };
      delete values.boxId;
    }
    if (field === "extraservice") {
      values = {
        id: values.extraServiceId,
        ...values,
      };
      delete values.extraServiceId;
    }

    console.log(values);
    try {
      setLoading(true);
      if (values.id) {
        const response = await api.put(`${path}/${values.id}`, values);
      } else {
        const response = await api.post(path, values);
      }

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

  //delete
  const handleDelete = async (id) => {
    try {
      console.log(id);
      await api.delete(`${path}/${id}`);
      toast.success("Successful");
      fetchData();
    } catch (err) {
      toast.error(err.response.data);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      {field === "box" || field === "order" ? (
        ""
      ) : (
        <Button onClick={() => setShowModal(true)}>Add</Button>
      )}
      <Table
        dataSource={data}
        columns={tableColumn}
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
        <Form form={form} labelCol={{ span: 24 }} onFinish={handleSubmit}>
          {formItems}
        </Form>
      </Modal>
    </div>
  );
}

export default CRUDTemplate;
