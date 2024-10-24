import Header from "../../components/header";
import Footer from "../../components/footer";
import Dosmetic from "./dosmetic";
import International from "./international";
//import "./index.scss";
import { useState } from "react";
import "../service/index.css";
import serviceImg from "../../img/feeding-fish.png";

function Service() {
  const [service, setService] = useState(1);
  const [highlight1, isHighlighted1] = useState(true);
  const [highlight2, isHighlighted2] = useState(false);
  const buttonStyle1 = isHighlighted1
    ? { backgroundColor: "#111", color: "#fff" }
    : {};
  const buttonStyle2 = isHighlighted2
    ? { backgroundColor: "#111", color: "#fff" }
    : {};
  function handleButton1() {
    setService(1);
    isHighlighted1(true);
    isHighlighted2(false);
  }
  function handleButton2() {
    setService(2);
    isHighlighted2(true);
    isHighlighted1(false);
  }
  return (
    <div>
      <Header />
      <div className="service">
        <img className="service__img" src={serviceImg} />
        <div className="service__text1">SERVICE</div>
        <div className="service__text2">KOIKICHI LOGISTIC</div>
        <div className="service__button">
          <button
            className="service__button__1"
            onClick={handleButton1}
            style={highlight1 ? buttonStyle1 : {}}
          >
            International transportation
          </button>
          <button
            className="service__button__2"
            onClick={handleButton2}
            style={highlight2 ? buttonStyle2 : {}}
          >
            Dosmetic transportation
          </button>
        </div>
      </div>
      {service === 1 ? <International /> : ""}
      {service === 2 ? <Dosmetic /> : ""}
      <Footer />
    </div>
  );
}

export default Service;
