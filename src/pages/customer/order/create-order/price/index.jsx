import { CarOutlined } from "@ant-design/icons";
import { Card, Radio, Checkbox, Space, Spin, Typography } from "antd";
import { useState, useEffect } from "react";
import api from "../../../../../config/axios";

const { Title, Text } = Typography;

function Price({ fishData, addressData }) {
  const [extraServices, setExtraServices] = useState([]);
  const [shippingMethods, setShippingMethods] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedServices, setSelectedServices] = useState([]);
  const [selectedShippingMethod, setSelectedShippingMethod] = useState(null);
  const [totalPrice, setTotalPrice] = useState(0);

  // Load saved data when component mounts
  useEffect(() => {
    const savedData = localStorage.getItem("priceFormData");
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      setSelectedServices(parsedData.selectedServices || []);
      setSelectedShippingMethod(parsedData.selectedShippingMethod || null);
    }
  }, []);

  // const fetchShippingMethods = async () => {
  //   try {
  //     setLoading(true);
  //     const methodIds = [1, 2, 3];
  //     const methodPromises = methodIds.map(id => 
  //       api.get(`/shipmethod/${id}`)
  //     );
      
  //     const responses = await Promise.all(methodPromises);
  //     const methodsData = responses.map(response => response.data);
  //     setShippingMethods(methodsData);
  //   } catch (error) {
  //     console.error("Error fetching shipping methods:", error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // Save data whenever it changes
  useEffect(() => {
    const priceData = {
      selectedServices,
      selectedShippingMethod,
      totalPrice,
      extraServices,
    };
    localStorage.setItem("priceFormData", JSON.stringify(priceData));
    // Also save totalPrice separately for easy access in Payment step
    localStorage.setItem("orderTotalPrice", totalPrice.toString());
  }, [selectedServices, selectedShippingMethod, totalPrice, extraServices]);

  // Box prices
  const boxPrices = {
    small: 10,
    medium: 15,
    large: 20,
    extraLarge: 25,
  };

  useEffect(() => {
    fetchExtraServices();
  }, []);

  useEffect(() => {
    calculateTotalPrice();
  }, [fishData, addressData, selectedServices, selectedShippingMethod]);

  const fetchExtraServices = async () => {
    try {
      setLoading(true);
      const response = await api.get("extraservice");
      setExtraServices(response.data);
    } catch (error) {
      console.error("Error fetching extra services:", error);
    } finally {
      setLoading(false);
    }
  };

  const calculateTotalPrice = () => {
    let total = 0;

    // Calculate box cost
    if (fishData?.boxCounts) {
      total +=
        fishData.boxCounts.small * boxPrices.small +
        fishData.boxCounts.medium * boxPrices.medium +
        fishData.boxCounts.large * boxPrices.large +
        fishData.boxCounts.extraLarge * boxPrices.extraLarge;
    }

    // Add distance-based fee
    if (addressData?.distance) {
      const distanceFee = addressData.distance * 0.5; // $0.5 per km
      total += distanceFee;
    }

    // Add shipping method fee
    if (selectedShippingMethod) {
      const method = shippingMethods[selectedShippingMethod];
      total = total * method.rate + method.price;
    }

    // Add extra services
    const selectedServicesTotal = extraServices
      .filter((service) => selectedServices.includes(service.extraServiceId))
      .reduce((sum, service) => sum + service.price, 0);
    
    total += selectedServicesTotal;

    setTotalPrice(total);
  };

  const handleServiceChange = (serviceId, checked) => {
    if (checked) {
      setSelectedServices([...selectedServices, serviceId]);
    } else {
      setSelectedServices(selectedServices.filter((id) => id !== serviceId));
    }
  };

  const handleShippingMethodChange = (e) => {
    setSelectedShippingMethod(e.target.value);
  };

  return (
    <Card>
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h4>Shipping method</h4>
        </div>

        <Radio.Group 
          style={{ width: "100%" }} 
          onChange={handleShippingMethodChange}
          value={selectedShippingMethod}
        >
          <Space direction="vertical" style={{ width: "100%" }}>
            {shippingMethods.map((method) => (
              <Card key={method.shipMethodId}>
                <Radio value={method.shipMethodId}>
                  <Space>
                    <CarOutlined 
                      style={{ 
                        fontSize: "24px", 
                        color: method.shipMethodId === 1 ? "#ff4d4f" : 
                               method.shipMethodId === 2 ? "#1890ff" : "#52c41a" 
                      }} 
                    />
                    <div>
                      <span style={{ fontWeight: "bold" }}>
                        {method.description}
                      </span>
                      <br />
                      <span style={{ color: "rgba(0, 0, 0, 0.45)" }}>
                        {method.shipMethodId === 1 ? "Expected delivery: 3-5 days" :
                         method.shipMethodId === 2 ? "Expected delivery: 2-3 days" :
                                                   "Expected delivery: 1-2 days"}
                      </span>
                    </div>
                  </Space>
                </Radio>
              </Card>
            ))}
          </Space>
        </Radio.Group>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h4>Extra Service</h4>
        </div>

        <Spin spinning={loading}>
          <Space direction="vertical" style={{ width: "100%" }}>
            {extraServices.map((service) => (
              <div
                key={service.extraServiceId}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Checkbox
                  onChange={(e) =>
                    handleServiceChange(
                      service.extraServiceId,
                      e.target.checked
                    )
                  }
                  checked={selectedServices.includes(service.extraServiceId)}
                >
                  {service.nameService}
                </Checkbox>
                <span>{service.price}$ </span>
              </div>
            ))}
          </Space>
        </Spin>

        <Card style={{ backgroundColor: "#f5f5f5", marginTop: 16 }}>
          <Title level={4}>Price Summary</Title>
          <Space direction="vertical" style={{ width: "100%" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <Text>Box Cost:</Text>
              <Text strong>
                $
                {fishData?.boxCounts
                  ? (
                      fishData.boxCounts.small * boxPrices.small +
                 fishData.boxCounts.medium * boxPrices.medium +
                 fishData.boxCounts.large * boxPrices.large +
                      fishData.boxCounts.extraLarge * boxPrices.extraLarge
                    ).toFixed(2)
                  : "0.00"}
              </Text>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <Text>Distance Fee:</Text>
              <Text strong>
                $
                {addressData?.distance
                  ? (addressData.distance * 0.5).toFixed(2)
                  : "0.00"}
              </Text>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <Text>Shipping Fee:</Text>
              <Text strong>
                $
                {selectedShippingMethod
                  ? shippingMethods[selectedShippingMethod].price
                  : "0.00"}
              </Text>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <Text>Extra Services:</Text>
              <Text strong>
                $
                {extraServices
                  .filter((service) =>
                    selectedServices.includes(service.extraServiceId)
                  )
                  .reduce((sum, service) => sum + service.price, 0)
                  .toFixed(2)}
              </Text>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: 16,
              }}
            >
              <Title level={4}>Total:</Title>
              <Title level={4} type="danger">
                ${totalPrice.toFixed(2)}
              </Title>
            </div>
          </Space>
        </Card>
      </Space>
    </Card>
  );
}

export default Price;
