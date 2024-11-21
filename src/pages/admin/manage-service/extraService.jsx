import { Form, Input } from "antd";
import CRUDTemplate from "../../../components/crud-template";
import TextArea from "antd/es/input/TextArea";

function ExtraService() {
  const columns = [
    {
      title: "ID",
      dataIndex: "extraServiceId",
      key: "extraServiceId",
    },
    {
      title: "Service name",
      dataIndex: "nameService",
      key: "nameService",
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
      title: "Description",
      dataIndex: "description",
      key: "description",
      width: 400,
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
        <TextArea />
      </Form.Item>
    </>
  );

  return (
    <CRUDTemplate
      columns={columns}
      formItems={formItems}
      path="/extraservice"
      field="extraservice"
    />
  );
}

export default ExtraService;
