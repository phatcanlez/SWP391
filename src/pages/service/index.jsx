import Header from "../../components/header";
import Footer from "../../components/footer";
import Dosmetic from "./dosmetic";
import International from "./international";
//import "./index.scss";
import { useState } from "react";
import '../service/index.scss';

function Service() {
  const [service, setService] = useState(1);
  const [highlight1, isHighlighted1] = useState(false);
  const [highlight2, isHighlighted2] = useState(true);
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
        <img
          className="service__img"
          src="https://s3-alpha-sig.figma.com/img/bd82/1b57/961186e550c34dc0b857595264455f05?Expires=1728259200&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=fx5AIhGKOlq4tY62VdtbAdzqrMlkv9dXmgCOjOo0Dmfz8KBu4wgBh5ORjxxhUsA9w31xugOLBh-utjTYSro7ZB0z-pwRwgY3NmZtNPIC5-TSKewVjGdJKpLjAZgzWw-WLA2PruEJDOBgFVmur1SZH8Irxv6BMQfROzCD34-cCS5hqnfbktxJpx6-N4-WrqB96LiqiPTTEzAUkrpz~XNVz5JXblPz9cxvZCH6xR3lWeXS3DuWAOcHJWydCi1oNpTyeq6xvluxQr5d7Bav~VP8~QCnl5~juNtC7JRMf788l7F-QhGDN66mB30tB-k1OcDN7TvNRn5LGufCi7HWAIXIDQ__"
          alt=""
        />
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
