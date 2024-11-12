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
      const distance = parseFloat(localStorage.getItem("savedDistance"));

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

      console.log("Price calculation:", {
        shippingFee,
        extraServicesTotal,
        total: shippingFee + extraServicesTotal,
      });

      const finalTotal = shippingFee + extraServicesTotal;
      setTotalPrice(finalTotal);

      const priceData = {
        selectedServices,
        selectedShippingMethod,
        totalPrice: finalTotal,
        estimatePrice: shippingFee,
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
      if (!selectedShippingMethod) {
        throw new Error("Please select a shipping method");
      }
      return Promise.resolve(true);
    },
    submitOrder: async () => {
      try {
        const fishData = JSON.parse(localStorage.getItem("fishFormData"));
        const addressData = JSON.parse(localStorage.getItem("orderFormData"));
        const distance = parseFloat(localStorage.getItem("savedDistance"));

        // Format orderData theo đúng API spec
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
          kilometer: parseFloat(distance || 0),
          totalWeight: parseFloat(getTotalWeightFromStorage() || 0),
          quantity: parseInt(fishData.fishDetails?.length || 0),
          type: "OVERSEA",
          shipMethod: parseInt(selectedShippingMethod),
          extraService: selectedServices.map((id) => parseInt(id)),
          username: user.username,
        };

        console.log("Submitting order:", orderData);
        const orderResponse = await api.post("orders", orderData);
        console.log("Order created successfully:", orderResponse.data);

        // // Sau khi tạo order thành công, submit license cho từng con cá
        // const orderId = orderResponse.data.id; // Lấy order ID từ response

        // // Submit license cho từng con cá
        // for (let i = 0; i < fishData.fishDetails.length; i++) {
        //   const fish = fishData.fishDetails[i];
        //   const licenseData = {
        //     order: orderId,
        //     name: "koi",
        //     imgKoi: fishData.fishImages[i]?.base64 || "",
        //     imgLicense: fishData.licenseImages[i]?.base64 || "",
        //     priceOfKoi: parseFloat(fish.price),
        //     weight: parseFloat(fish.weight),
        //     size: fish.size,
        //     description: fish.note || "",
        //   };

        //   await api.post("license", licenseData);
        // }

        message.success("Order created successfully!");

        // Clear localStorage sau khi submit thành công
        localStorage.removeItem("fishFormData");
        localStorage.removeItem("addressFormData");
        localStorage.removeItem("priceFormData");
        localStorage.removeItem("savedDistance");
        localStorage.removeItem("orderTotalPrice");
        localStorage.removeItem("orderFormData");

        navigate("/customer/orders");
        return orderResponse.data;

      } catch (error) {
        console.error("Error creating order:", error);
        message.error(
          error.response?.data?.message || error.message || "Failed to create order"
        );
        throw error;
      }
    }
  }));

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
});

Price.displayName = "Price";

export default Price;
