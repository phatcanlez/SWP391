import "./index.css";
import { useState } from "react";
import EstimatedShippingFee from "./estimatedShippingFee";
import BillOfLading from "./billOfLading";
import Header from "../../components/header";
import Footer from "../../components/footer";

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
        <img
          className="tracking__img"
          src="https://s3-alpha-sig.figma.com/img/36d4/e871/b7828cadafff3234386d389ff164f904?Expires=1728864000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=fGETIGOuA8~mlJsaZnlU6Z0NIuwTJhliPZYSoCcp14MZ0hd9N~pzCJfHwtCeJDDRTEo3s0puBgMMWbKBHbVSeIZXEctT08Wq9QJsKFvXhyKTbk1mGf1tsQiL82mAfUG~aOPFmv~PeYn~Hcpv-ggG6eqtgLdvzyJs3FJJNSSE3aWIQhcpUWWLcHvX8QXBcxNRZoQFvk211TXKQ66fBLcBKgZvEi821ZQGp-yzvrdYTdbhPFVDrc8T4YLu6P2yskfZFPH0QR958Ho4ZTjYGX9udWnzOuV2HCIEnq3~Gzc~Tyg95ZWs0h9DRDaDVA6TdX~70H-PJ9EunPgrSe-YVvuf6w__"
          alt=""
        />
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
