import { Form, Input } from "antd";
import CRUDTemplate from "../../../components/crud-template";

function PriceListDistance() {
  const columns = [
    {
      title: "ID",
      dataIndex: "priceListId",
      key: "priceListId",
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
    },
  ];

  const formItems = (
    <>
      <Form.Item name="priceListId" hidden>
        <Input />
      </Form.Item>
      <Form.Item name="distance" label="Distance" rules={[{ required: true }]}>
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
    </>
  );

  return (
    <CRUDTemplate
      columns={columns}
      formItems={formItems}
      path="/pricelistdistance"
    />
  );
}

export default PriceListDistance;
