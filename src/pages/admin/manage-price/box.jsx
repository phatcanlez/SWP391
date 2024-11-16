import { Form, Input } from "antd";
import CRUDTemplate from "../../../components/crud-template";

function Box() {
  const columns = [
    {
      title: "ID",
      dataIndex: "boxId",
      key: "boxId",
    },
    {
      title: "Size",
      dataIndex: "boxSize",
      key: "boxSize",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
    },
    {
      title: "Surcharge",
      dataIndex: "surcharge",
      key: "surcharge",
    },
  ];

  const formItems = (
    <>
      <Form.Item name="boxId" hidden>
        <Input />
      </Form.Item>
      <Form.Item name="boxSize" label="Size">
        <Input readOnly />
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
        name="surcharge"
        label="Surcharge"
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
    </>
  );

  return (
    <CRUDTemplate
      columns={columns}
      formItems={formItems}
      path="/boxprice"
      field="box"
    />
  );
}

export default Box;
