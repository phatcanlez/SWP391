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
  const [weightPrice, setWeightPrice] = useState(0);
  //const [distancePrice, setDistancePrice] = useState(0);
  const [totalWeight, setTotalWeight] = useState(0);
  const [estimatePrice, setEstimatePrice] = useState(0);

  // Load saved data when component mounts
  useEffect(() => {
    const savedData = localStorage.getItem("priceFormData");
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      setSelectedServices(parsedData.selectedServices || []);
      setSelectedShippingMethod(parsedData.selectedShippingMethod || null);
    }
  }, []);

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

  const getTotalWeightFromStorage = () => {
    // Set cứng weight là 5kg
    return 5;

    /*
    const weightFromStorage = localStorage.getItem("totalWeight");
    console.log("Weight from direct storage:", weightFromStorage);
    
    if (weightFromStorage) {
      return parseFloat(weightFromStorage);
    }
    
    const savedFishData = JSON.parse(localStorage.getItem("fishFormData"));
    console.log("Saved fish data:", savedFishData);
    
    if (savedFishData?.totalWeight) {
      return parseFloat(savedFishData.totalWeight);
    }
    
    return 0;
    */
  };

  useEffect(() => {
    fetchExtraServices();
    fetchShippingMethods();
  }, []);

  useEffect(() => {
    calculateTotalPrice();
  }, [
    fishData,
    addressData,
    selectedServices,
    selectedShippingMethod,
    totalWeight,
  ]);

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

  const fetchShippingMethods = async () => {
    try {
      setLoading(true);
      const response = await api.get("shipmethod");
      setShippingMethods(response.data);
    } catch (error) {
      console.error("Error fetching shipping methods:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchWeightPrice = async (totalWeight, methodId) => {
    try {
      // Fetch tất cả các weight ranges từ API
      const response = await api.get("tracking/weight");
      const weightRanges = response.data;
      console.log("Weight ranges from API:", weightRanges);
      console.log("Current total weight:", totalWeight);
      console.log("Selected method ID:", methodId);

      // Tìm weight range phù hợp nhất
      const appropriateRange = weightRanges.find((range) => {
        // Kiểm tra nếu total weight nằm trong khoảng hoặc nhỏ hơn weight
        return totalWeight <= range.weight;
      });

      console.log("Selected weight range:", appropriateRange);

      let basePrice = 0;
      if (appropriateRange) {
        basePrice = appropriateRange.price;
      } else {
        // Nếu không tìm thấy range phù hợp, lấy range cao nhất
        const highestRange = weightRanges.reduce(
          (max, range) => (range.weight > max.weight ? range : max),
          weightRanges[0]
        );
        console.log("Using highest range:", highestRange);
        basePrice = highestRange.price;
      }

      // Áp dụng multiplier dựa trên shipping method
      const method = shippingMethods.find((m) => m.shipMethodId === methodId);
      const multiplier = method ? method.rate : 1;

      return {
        price: basePrice * multiplier,
        basePrice: basePrice,
        multiplier: multiplier,
      };
    } catch (error) {
      console.error("Error fetching weight price:", error);
      return null;
    }
  };

  const fetchDistancePrice = async () => {
    try {
      const response = await api.get("tracking/pricelistdistance");
      return response.data;
    } catch (error) {
      console.error("Error fetching distance price:", error);
      return null;
    }
  };

  const calculateTotalWeight = () => {
    console.log("Current total weight:", totalWeight);
    return totalWeight;
  };

  //API estimate
  const fetchEstimatePrice = async () => {
    try {
      // Lấy box counts từ localStorage
      const savedFishData = JSON.parse(localStorage.getItem("fishFormData"));
      const boxCounts = savedFishData?.boxCounts || {
        small: 0,
        medium: 0,
        large: 0,
        extraLarge: 0,
      };

      const requestBody = {
        kilometers: 100, // Fixed distance
        weight: 5, // Fixed weight
        shipMethodID: selectedShippingMethod,
        boxAmountDTO: {
          smallBox: boxCounts.small || 0,
          mediumBox: boxCounts.medium || 0,
          largeBox: boxCounts.large || 0,
          extraLargeBox: boxCounts.extraLarge || 0,
        },
      };

      console.log("Estimate request body:", requestBody);

      const response = await api.post("tracking/estimate", requestBody);
      console.log("Estimate API response:", response.data);

      // Lưu estimate price vào state
      setEstimatePrice(response.data || 0);
      return response.data;
    } catch (error) {
      console.error("Error fetching estimate:", error);
      setEstimatePrice(0);
      return null;
    }
  };

  const calculateTotalPrice = async () => {
    try {
      setLoading(true);

      if (!selectedShippingMethod) {
        console.warn("No shipping method selected");
        return;
      }

      // Lấy giá từ API estimate
      const estimateData = await fetchEstimatePrice();
      console.log("Estimate data received:", estimateData);

      if (!estimateData) {
        console.warn("No estimate data received");
        return;
      }

      // Tính tổng extra services
      const extraServicesTotal = extraServices
        .filter((service) => selectedServices.includes(service.extraServiceId))
        .reduce((sum, service) => sum + service.price, 0);
      console.log("Extra services total:", extraServicesTotal);

      // Tính tổng cuối cùng = estimate price + extra services
      const total = estimateData + extraServicesTotal;
      console.log("Final total calculation:", {
        estimateData,
        extraServicesTotal,
        total,
      });

      setTotalPrice(total);
    } catch (error) {
      console.error("Error calculating total price:", error);
      setTotalPrice(0);
    } finally {
      setLoading(false);
    }
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

  useEffect(() => {
    console.log("Setting fixed weight: 5kg");
    setTotalWeight(5);
  }, []); // Chỉ chạy một lần khi component mount

  useEffect(() => {
    if (selectedShippingMethod) {
      calculateTotalPrice();
    }
  }, [selectedShippingMethod, selectedServices]);

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

        <Spin spinning={loading}>
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
                          color:
                            method.shipMethodId === 1
                              ? "#ff4d4f"
                              : method.shipMethodId === 2
                              ? "#1890ff"
                              : "#52c41a",
                        }}
                      />
                      <div>
                        <span style={{ fontWeight: "bold" }}>
                          {method.name}
                        </span>
                        <br />
                        <span style={{ color: "rgba(0, 0, 0, 0.45)" }}>
                          {method.description}
                        </span>
                      </div>
                      <div style={{ marginLeft: "auto" }}>
                        <Text strong>${method.price}</Text>
                      </div>
                    </Space>
                  </Radio>
                </Card>
              ))}
            </Space>
          </Radio.Group>
        </Spin>

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
              <Text>Shipping Fee:</Text>
              <Text strong>${(estimatePrice || 0).toFixed(2)}</Text>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <Text>Extra Services:</Text>
              <Text strong>
                $
                {(
                  extraServices
                    .filter((service) =>
                      selectedServices.includes(service.extraServiceId)
                    )
                    .reduce((sum, service) => sum + service.price, 0) || 0
                ).toFixed(2)}
              </Text>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: 16,
                borderTop: "1px solid #f0f0f0",
                paddingTop: 16,
              }}
            >
              <Title level={4}>Total:</Title>
              <Title level={4} type="danger">
                ${(totalPrice || 0).toFixed(2)}
              </Title>
            </div>
          </Space>
        </Card>
      </Space>
    </Card>
  );
}

export default Price;
