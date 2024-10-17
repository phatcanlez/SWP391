import {
  CheckCircleOutlined,
  DoubleRightOutlined,
  LoadingOutlined,
  SmileOutlined,
} from "@ant-design/icons";
import { Steps } from "antd";
const InProcess = () => (
  <Steps
    items={[
      {
        title: "Approved",
        status: "finish",
        icon: <CheckCircleOutlined />,
      },
      {
        title: "Preparing",
        status: "process",
        icon: <LoadingOutlined />,
      },
      {
        title: "On delivery",
        status: "process",
        icon: <DoubleRightOutlined />,
      },
      {
        title: "Done",
        status: "wait",
        icon: <SmileOutlined />,
      },
    ]}
  />
);
export default InProcess;
