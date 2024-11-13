import { Button, Form, Input, Steps } from "antd";
import "./index.css";
import ReCAPTCHA from "react-google-recaptcha";
import { toast } from "react-toastify";
import { useEffect, useRef, useState } from "react";
import api from "../../../config/axios";

function BillOfLading() {
  const [display, setDisplay] = useState("none");
  const resultRef = useRef(null);
  const [data, setData] = useState([]);
  const [orderId, setOrderId] = useState("");
  const [current, setCurrent] = useState(-1);
  const handleTracking = async (values) => {
    console.log(values);
    try {
      const response = await api.get(`orders/${values.orderId}`);
      setOrderId(values.orderId);
      setData(response.data.status);
      setCurrent(response.data.status.length - 1);
      // const lastStatus = response.data.status[response.data.status.length - 1];
      // if (lastStatus) {
      //   setCurrent(getCurrentStatus(lastStatus.statusInfo));
      // }
      setDisplay("");
      toast.success("Successfull");

      setTimeout(() => {
        if (resultRef.current) {
          resultRef.current.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    } catch (err) {
      toast.error(err.response.data.Error);
    }
  };

  // const getCurrentStatus = (statusInfo) => {
  //   switch (statusInfo) {
  //     case "WAITING":
  //       return 0;
  //     case "APPROVED":
  //       return 1;
  //     case "PENDING":
  //       return 2;
  //     case "SUCCESS":
  //       return 3;
  //     default:
  //       return -1; // No valid status
  //   }
  // };

  useEffect(() => handleTracking, []);

  return (
    <div className="billoflading">
      <div className="billoflading__tracking">
        <p>TRACKING BILL OF LADING</p>
        <Form
          className="billoflading__tracking__form"
          onFinish={handleTracking}
        >
          <Form.Item
            name="orderId"
            rules={[{ required: true, message: "Please input " }]}
          >
            <Input placeholder="Input your OrderId" />
          </Form.Item>
          <Form.Item
            name="captcha"
            rules={[{ required: true, message: "Captcha not complete" }]}
          >
            <ReCAPTCHA sitekey={import.meta.env.VITE_GOOGLE_RECAPTCHA_KEY} />
          </Form.Item>
          <Button className="billoflading__tracking__button" htmlType="submit">
            Tracking
          </Button>
        </Form>
      </div>
      <div
        className="billoflading__result"
        id="result"
        style={{ display: `${display}` }}
        ref={resultRef}
      >
        <p className="billoflading__result__title">Result</p>
        <span style={{ paddingLeft: "15%", fontSize: "20px" }}>
          OrderID : {orderId}
        </span>
        <Steps
          className="billoflading__result__step"
          progressDot
          current={current}
          direction="vertical"
          items={data.map((statusItem) => ({
            title: (
              <div className="billoflading__result__step__title">
                {statusItem.statusInfo}
              </div>
            ),
            description: (
              <div>
                <div className="billoflading__result__step__time">
                  {new Date(statusItem.date).toLocaleString()}
                </div>
                <div className="billoflading__result__step__description">
                  {statusItem.description}
                </div>
              </div>
            ),
          }))}
        />
      </div>
    </div>
  );
}

export default BillOfLading;

// StatusInfo: WAITTING, APPROVED, PENDING, SUCCESS, FAIL
