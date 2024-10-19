import { Form, Input } from "antd";
import CRUDTemplate from "../../../components/crud-template";

function Delivery() {
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
  ];

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
    <CRUDTemplate columns={columns} formItems={formItems} path="/shipmethod" />
  );
}

export default Delivery;
