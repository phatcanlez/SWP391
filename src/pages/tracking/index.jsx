import Header from "../../components/header";
import Footer from "../../components/footer";

import "../tracking/index.css";
import { useState } from "react";
import EstimatedShippingFee from "./estimatedShippingFee";
import BillOfLading from "./billOfLading";
import trackingImg from "../../img/tracking.png";

function Tracking() {
  const [tracking, setTracking] = useState(1);
  const [highlight1, isHighlighted1] = useState(true);
  const [highlight2, isHighlighted2] = useState(false);
  const buttonStyle1 = isHighlighted1 ? { backgroundColor: "#fff" } : {};
  const buttonStyle2 = isHighlighted2 ? { backgroundColor: "#fff" } : {};
  function handleButton1() {
    setTracking(1);
    isHighlighted1(true);
    isHighlighted2(false);
  }
  function handleButton2() {
    setTracking(2);
    isHighlighted2(true);
    isHighlighted1(false);
  }
  return (
    <div>
      <Header />
      <div className="tracking">
        <img className="tracking__img" src={trackingImg} />
        <div className="tracking__text1">TRACKING</div>
        <div className="tracking__text2">KOIKICHI LOGISTIC</div>
        <div className="tracking__button">
          <button
            className="tracking__button__1"
            onClick={handleButton1}
            style={highlight1 ? buttonStyle1 : {}}
          >
            Tracking Bill of Lading
          </button>
          <button
            className="tracking__button__2"
            onClick={handleButton2}
            style={highlight2 ? buttonStyle2 : {}}
          >
            Estimated shipping fee
          </button>
        </div>
      </div>
      {tracking === 1 ? <BillOfLading /> : ""}
      {tracking === 2 ? <EstimatedShippingFee /> : ""}
      <Footer />
    </div>
  );
}

export default Tracking;
