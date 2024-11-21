import { Form, Input, Modal } from "antd";
import CRUDTemplate from "../../../components/crud-template";
import { useState } from "react";

function ExtraService() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedDescription, setSelectedDescription] = useState("");

  const showDescriptionModal = (description) => {
    setSelectedDescription(description);
    setIsModalVisible(true);
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "extraServiceId",
      key: "extraServiceId",
      width: "10%",
    },
    {
      title: "Service name",
      dataIndex: "nameService",
      key: "nameService",
      width: "20%",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (text) => {
        return text
          ? text.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " VND"
          : "";
      },
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      width: "50%",
      render: (text) => (
        <a
          onClick={() => showDescriptionModal(text)}
          style={{
            cursor: "pointer",
            color: "#2c2c2c",
            fontWeight: 400,
          }}
        >
          {text.length > 50 ? text.substring(0, 50) + "..." : text}
        </a>
      ),
    },
  ];

  const formItems = (
    <>
      <Form.Item name="extraServiceId" hidden>
        <Input />
      </Form.Item>
      <Form.Item
        name="nameService"
        label="Service Name"
        rules={[{ required: true }]}
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
      <Form.Item
        name="description"
        label="Description"
        rules={[{ required: true }]}
      >
        <Input.TextArea rows={4} />
      </Form.Item>
    </>
  );

  return (
    <>
      <CRUDTemplate
        columns={columns}
        formItems={formItems}
        path="/extraservice"
        field="extraservice"
        scroll={{ x: 800 }}
      />

      <Modal
        title="Service Description"
        open={isModalVisible}
        onOk={() => setIsModalVisible(false)}
        onCancel={() => setIsModalVisible(false)}
        width={600}
        okText="Close"
        cancelButtonProps={{ style: { display: "none" } }}
        okButtonProps={{
          style: {
            backgroundColor: "#e25822",
            borderColor: "#e25822",
          },
        }}
      >
        <div
          style={{
            padding: "20px",
            backgroundColor: "#f5f5f5",
            borderRadius: "8px",
            minHeight: "100px",
            whiteSpace: "pre-wrap",
          }}
        >
          {selectedDescription}
        </div>
      </Modal>
    </>
  );
}

export default ExtraService;
