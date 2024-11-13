import { MehOutlined } from "@ant-design/icons";
import { Result } from "antd";
const Reject = () => (
  <Result
    icon={<MehOutlined />}
    title="Oh no, this order has been rejected!"
  />
);
export default Reject;
