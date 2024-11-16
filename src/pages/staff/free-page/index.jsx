import { CoffeeOutlined, MehOutlined } from "@ant-design/icons";
import { Result } from "antd";
const Free = () => (
  <Result
    icon={<CoffeeOutlined />}
    title="You have not approved any order yet!"
  />
);
export default Free;
