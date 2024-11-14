import { CarOutlined } from "@ant-design/icons";
import { Card, Radio, Checkbox, Space, Spin, Typography, message } from "antd";
import { useState, useEffect, useImperativeHandle, forwardRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../../../config/axios";
import { useSelector } from "react-redux";

const { Title, Text } = Typography;

const Price = forwardRef((props, ref) => {
  const [extraServices, setExtraServices] = useState([]);
  const [shippingMethods, setShippingMethods] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedServices, setSelectedServices] = useState([]);
  const [selectedShippingMethod, setSelectedShippingMethod] = useState(null);
  const [totalPrice, setTotalPrice] = useState(0);
  const [estimatePrice, setEstimatePrice] = useState(0);
  const [totalWeight, setTotalWeight] = useState(0);
  const navigate = useNavigate();

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
    try {
      const savedFishData = JSON.parse(localStorage.getItem("fishFormData"));
      if (savedFishData?.totalWeight) {
        return parseFloat(savedFishData.totalWeight);
      }
      return 0;
    } catch (error) {
      console.error("Error getting total weight:", error);
      return 0;
    }
  };

  useEffect(() => {
    fetchExtraServices();
    fetchShippingMethods();
  }, []);

  useEffect(() => {
    calculateTotalPrice();
  }, [selectedServices, selectedShippingMethod, totalWeight]);

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
      const savedFishData = JSON.parse(localStorage.getItem("fishFormData"));
      const distance = parseFloat(localStorage.getItem("orderDistance"));

      if (!distance && distance !== 0) {
        console.warn("No distance found in localStorage");
      }

      const boxCounts = savedFishData?.boxCounts || {
        small: 0,
        medium: 0,
        large: 0,
        extraLarge: 0,
      };

      const requestBody = {
        kilometers: distance || 0,
        weight: getTotalWeightFromStorage(),
        shipMethodID: selectedShippingMethod,
        boxAmountDTO: {
          smallBox: boxCounts.small || 0,
          mediumBox: boxCounts.medium || 0,
          largeBox: boxCounts.large || 0,
          extraLargeBox: boxCounts.extraLarge || 0,
        },
      };

      console.log("Estimate request:", requestBody);
      const response = await api.post("tracking/estimate", requestBody);
      console.log("Estimate response:", response.data);

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

      const shippingFee = await fetchEstimatePrice();

      if (!shippingFee) {
        setEstimatePrice(0);
        setTotalPrice(0);
        return;
      }

      setEstimatePrice(shippingFee);

      const extraServicesTotal = selectedServices.reduce((total, serviceId) => {
        const service = extraServices.find(
          (s) => s.extraServiceId === serviceId
        );
        return total + (service ? service.price : 0);
      }, 0);

      // Get distance from localStorage
      const distance = parseFloat(localStorage.getItem("orderDistance")) || 0;
      console.log("Using distance for calculation:", distance);

      console.log("Price calculation:", {
        shippingFee,
        extraServicesTotal,
        distance,
        total: shippingFee + extraServicesTotal,
      });

      const finalTotal = shippingFee + extraServicesTotal;
      setTotalPrice(finalTotal);

      const priceData = {
        selectedServices,
        selectedShippingMethod,
        totalPrice: finalTotal,
        estimatePrice: shippingFee,
        distance: distance ? parseFloat(distance) : 0,
      };
      localStorage.setItem("priceFormData", JSON.stringify(priceData));
      localStorage.setItem("orderTotalPrice", finalTotal.toString());
    } catch (error) {
      console.error("Error calculating total price:", error);
      setEstimatePrice(0);
      setTotalPrice(0);
    } finally {
      setLoading(false);
    }
  };

  const handleServiceChange = (serviceId, checked) => {
    const newSelectedServices = checked
      ? [...selectedServices, serviceId]
      : selectedServices.filter((id) => id !== serviceId);

    setSelectedServices(newSelectedServices);

    if (selectedShippingMethod) {
      calculateTotalPrice();
    }
  };

  const handleShippingMethodChange = (e) => {
    setSelectedShippingMethod(e.target.value);
    calculateTotalPrice();
  };

  useEffect(() => {
    const weight = getTotalWeightFromStorage();
    setTotalWeight(weight);
  }, []);

  useEffect(() => {
    if (selectedShippingMethod) {
      calculateTotalPrice();
    }
  }, [selectedShippingMethod, selectedServices, extraServices]);
  const user = useSelector((store) => store.user);
  useImperativeHandle(ref, () => ({
    validateFields: () => {
      // Kiểm tra shipping method
      if (!selectedShippingMethod) {
        message.error("Please select a shipping method");
        throw new Error("Please select a shipping method");
      }

      // Kiểm tra giá trị
      if (!totalPrice || totalPrice <= 0) {
        message.error("Invalid total price");
        throw new Error("Invalid total price");
      }

      // Kiểm tra estimate price
      if (!estimatePrice || estimatePrice <= 0) {
        message.error("Invalid shipping fee");
        throw new Error("Invalid shipping fee");
      }

      return Promise.resolve(true);
    },
    submitOrder: async () => {
      try {
        const fishData = JSON.parse(localStorage.getItem("fishFormData"));
        const addressData = JSON.parse(localStorage.getItem("orderFormData"));

        // Submit order với type từ addressData
        const orderData = {
          reciverAdress: addressData.receiverAddress,
          senderAddress: addressData.senderAddress,
          senderPhoneNumber: addressData.senderPhoneNumber,
          expDeliveryDate: new Date().toISOString(),
          orderPrice: parseFloat(fishData.totalPrice || 0),
          note: addressData.note || "",
          reciverPhoneNumber: addressData.receiverPhoneNumber,
          reciverName: addressData.receiverName,
          totalPrice: parseFloat(totalPrice || 0),
          smallBox: parseInt(fishData.boxCounts?.small || 0),
          mediumBox: parseInt(fishData.boxCounts?.medium || 0),
          largeBox: parseInt(fishData.boxCounts?.large || 0),
          extraLargeBox: parseInt(fishData.boxCounts?.extraLarge || 0),
          kilometer: parseFloat(addressData.kilometer || 0),
          totalWeight: parseFloat(getTotalWeightFromStorage() || 0),
          quantity: parseInt(fishData.fishDetails?.length || 0),
          type: addressData.shippingType.toUpperCase() || "DOMESTIC",
          shipMethod: parseInt(selectedShippingMethod),
          extraService: selectedServices.map((id) => parseInt(id)),
          username: user.username,
        };

        console.log("Submitting order with type:", orderData.type);
        const orderResponse = await api.post("orders", orderData);
        console.log("Order created successfully:", orderResponse.data);

        if (orderResponse.data) {
          // Submit license for each fish
          if (
            fishData.fishDetails &&
            fishData.fishImages &&
            fishData.licenseImages
          ) {
            for (const [index, fish] of fishData.fishDetails.entries()) {
              const licenseData = {
                name: `Fish ${index + 1}`,
                imgLicense: fishData.licenseImages[index]?.base64 || "",
                imgKoi: fishData.fishImages[index]?.base64 || "",
                priceOfKoi: parseFloat(fish.price) || 0,
                weight: parseFloat(fish.weight) || 0,
                size: parseFloat(fish.size) || 0,
                description: fish.note || "",
                order: orderResponse.data.orderID,
              };

              console.log(
                `Submitting license for fish ${index + 1}:`,
                licenseData
              );
              try {
                await api.post("licence", licenseData);
                console.log(`License ${index + 1} submitted successfully`);
              } catch (licenseError) {
                console.error(
                  `Error submitting license ${index + 1}:`,
                  licenseError
                );
                throw licenseError;
              }
            }
          }

          message.success("Order created successfully!");

          // Clear localStorage
          localStorage.removeItem("fishFormData");
          localStorage.removeItem("addressFormData");
          localStorage.removeItem("priceFormData");
          localStorage.removeItem("savedDistance");
          localStorage.removeItem("orderTotalPrice");
          localStorage.removeItem("orderFormData");
          localStorage.removeItem("orderDistance");

          // Navigate to order detail page
          navigate(
            `/customer-service/view-order/${orderResponse.data.orderID}`
          );
          return orderResponse.data.orderID;
        } else {
          throw new Error("No order ID received from server");
        }
      } catch (error) {
        console.error("Error creating order:", error);
        message.error(
          error.response?.data?.message ||
            error.message ||
            "Failed to create order"
        );
        throw error;
      }
    },
  }));

  return (
    <Card>
      <Space direction="vertical" style={{ width: "100%" }}>
        <Title level={4} style={{ marginBottom: 24, color: "#e25822" }}>
          Shipping Method
        </Title>

        <Spin spinning={loading}>
          <Radio.Group
            onChange={handleShippingMethodChange}
            value={selectedShippingMethod}
            style={{ width: "100%" }}
          >
            <Space direction="vertical" style={{ width: "100%" }}>
              {shippingMethods.map((method) => (
                <Card
                  key={method.shipMethodId}
                  style={{
                    width: "100%",
                    cursor: "pointer",
                    border:
                      selectedShippingMethod === method.shipMethodId
                        ? "2px solid #2c2c2c"
                        : "1px solid #d9d9d9",
                  }}
                  onClick={() => setSelectedShippingMethod(method.shipMethodId)}
                >
                  <Radio value={method.shipMethodId}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        width: "100%",
                        gap: "16px",
                      }}
                    >
                      <CarOutlined
                        style={{
                          fontSize: "24px",
                          color:
                            method.shipMethodId === selectedShippingMethod
                              ? "#2c2c2c"
                              : "#666",
                        }}
                      />
                      <div style={{ flex: 1 }}>
                        <Text
                          strong
                          style={{ fontSize: "16px", display: "block" }}
                        >
                          {method.name}
                        </Text>
                        <Text type="secondary" style={{ fontSize: "14px" }}>
                          {method.description}
                        </Text>
                      </div>
                    </div>
                  </Radio>
                </Card>
              ))}
            </Space>
          </Radio.Group>
        </Spin>

        <Title level={4} style={{ margin: "24px 0 16px", color: "#e25822" }}>
          Extra Services
        </Title>

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
                <span>{service.price}</span>
              </div>
            ))}
          </Space>
        </Spin>

        <Card style={{ backgroundColor: "#f5f5f5", marginTop: 16 }}>
          <Title level={4} style={{ color: "#e25822" }}>
            Price Summary
          </Title>
          <Space direction="vertical" style={{ width: "100%" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <Text>Shipping Fee:</Text>
              <Text strong>{(estimatePrice || 0).toFixed(2)}</Text>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <Text>Extra Services:</Text>
              <Text strong>
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
              <Title level={4} style={{ color: "#e25822" }}>
                Total:
              </Title>
              <Title level={4} type="danger">
                {(totalPrice || 0).toFixed(2)}
              </Title>
            </div>
          </Space>
        </Card>
      </Space>
    </Card>
  );
});

Price.displayName = "Price";

export default Price;
