import { Form, Input } from "antd";
import "./index.css";
import ReCAPTCHA from "react-google-recaptcha";

function BillOfLading() {
  const handleTracking = async (values) => {
    const response = await values;
  };
  return (
    <div className="billoflading">
      <div className="billoflading__tracking">
        <p>TRACKING BILL OF LADING</p>
        <Form
          className="billoflading__tracking__form"
          onFinish={handleTracking}
        >
          <Form.Item rules={[{ require: true, message: "Please input " }]}>
            <Input placeholder="EX: 0123456789" />
          </Form.Item>
          <button type="submit">Tracking</button>
        </Form>
      </div>
      <div className="billoflading__result">
        <p className="billoflading__result__title">Result</p>
        <ul>
          <li>
            <p className="billoflading__result__name">
              Order created successfully
            </p>
            <p className="billoflading__result__time">September 2, 2024</p>
            <p className="billoflading__result__description">
              Order created successfully
            </p>
          </li>
          <li>
            <p className="billoflading__result__name">
              Order has been approved
            </p>
            <p className="billoflading__result__time">September 2, 2024</p>
            <p className="billoflading__result__description">
              Order has been approved
            </p>
          </li>
          <li>
            <p className="billoflading__result__name">
              The shipping unit has successfully picked up the goods
            </p>
            <p className="billoflading__result__time">September 2, 2024</p>
            <p className="billoflading__result__description">
              The shipping unit has successfully picked up the goods
            </p>
          </li>
          <li>
            <p className="billoflading__result__name">
              The order has arrived at the post office 1
            </p>
            <p className="billoflading__result__time">September 2, 2024</p>
            <p className="billoflading__result__description">
              The order has arrived at the post office 1
            </p>
          </li>
          <li>
            <p className="billoflading__result__name">
              The order has left at the post office 1
            </p>
            <p className="billoflading__result__time">September 2, 2024</p>
            <p className="billoflading__result__description">
              The order has left at the post office 1
            </p>
          </li>
          <li>
            <p className="billoflading__result__name">
              The order has arrived at the post office 2
            </p>
            <p className="billoflading__result__time">September 2, 2024</p>
            <p className="billoflading__result__description">
              The order has arrived at the post office 2
            </p>
          </li>
          <li>
            <p className="billoflading__result__name">
              The order has left at the post office 2
            </p>
            <p className="billoflading__result__time">September 2, 2024</p>
            <p className="billoflading__result__description">
              The order has left at the post office 2
            </p>
          </li>
          <li>
            <p className="billoflading__result__name">
              Order is being delivered
            </p>
            <p className="billoflading__result__time">September 2, 2024</p>
            <p className="billoflading__result__description">
              Orders are being delivered, please pay attention to your phone
            </p>
          </li>
          <li>
            <p className="billoflading__result__name">
              The order has been delivered successfully
            </p>
            <p className="billoflading__result__time">September 2, 2024</p>
            <p className="billoflading__result__description">
              The order has been delivered successfully
            </p>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default BillOfLading;
//<ReCAPTCHA sitekey = {process.env.REACT_APP_SITE_KEY}/>
//REACT_APP_SECRET_KEY = "6LduEFcqAAAAALROUg7Occw7kEn0vLV_CR59nZjX"
//REACT_APP_SITE_KEY = "6LduEFcqAAAAAErK_kQv5VGSIgAedz6l_2g1Q5QO"
