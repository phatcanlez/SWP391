import Header from "../../components/header";
import Footer from "../../components/footer";
import { useState, useEffect } from "react";
import "../service/index.css";
import serviceImg from "../../img/feeding-fish.png";
import api from "../../config/axios";
import { Card, Row, Col } from "antd";
import International from "./international";
import Dosmetic from "./dosmetic";

const formatCurrency = (value) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
};

function Service() {
  const [service, setService] = useState(1);
  const [highlight1, isHighlighted1] = useState(true);
  const [highlight2, isHighlighted2] = useState(false);
  const [extraServices, setExtraServices] = useState([]);

  const buttonStyle1 = isHighlighted1
    ? { backgroundColor: "#111", color: "#fff" }
    : {};
  const buttonStyle2 = isHighlighted2
    ? { backgroundColor: "#111", color: "#fff" }
    : {};

  // Fetch extra services
  useEffect(() => {
    const fetchExtraServices = async () => {
      try {
        const response = await api.get("/extraservice");
        setExtraServices(response.data);
      } catch (error) {
        console.error("Error fetching extra services:", error);
      }
    };
    fetchExtraServices();
  }, []);

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
        <img className="service__img" src={serviceImg} alt="Service" />
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
            Domestic transportation
          </button>
        </div>

        {/* Extra Services Section */}
        <div style={{ padding: "40px 20px" }}>
          <h2 style={{ 
            textAlign: "center", 
            marginBottom: "30px",
            color: "#e25822",
            fontSize: "28px",
            fontWeight: "bold"
          }}>
            Extra Services
          </h2>
          <Row gutter={[24, 24]} justify="center">
            {extraServices.map((service) => (
              <Col xs={24} sm={12} md={8} key={service.extraServiceId}>
                <Card
                  hoverable
                  style={{
                    height: '100%',
                    borderRadius: '8px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                  }}
                >
                  <h3 style={{ 
                    color: '#2c2c2c',
                    marginBottom: '16px',
                    fontSize: '18px',
                    fontWeight: 'bold'
                  }}>
                    {service.nameService}
                  </h3>
                  <p style={{ 
                    color: '#e25822',
                    fontSize: '20px',
                    fontWeight: '600',
                    marginBottom: '16px'
                  }}>
                    {formatCurrency(service.price)}
                  </p>
                  <p style={{ 
                    color: '#666',
                    fontSize: '14px',
                    lineHeight: '1.5'
                  }}>
                    {service.description}
                  </p>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </div>

      {service === 1 && <International />}
      {service === 2 && <Dosmetic />}
      <Footer />
    </div>
  );
}

export default Service;
