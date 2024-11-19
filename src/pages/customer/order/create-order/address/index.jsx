import { forwardRef, useImperativeHandle, useRef } from "react";
import TextArea from "antd/es/input/TextArea";
import {
  GoogleMap,
  LoadScript,
  Marker,
  DirectionsService,
  DirectionsRenderer,
} from "@react-google-maps/api";
import { Button, Form, Input, Modal, Select, Space, Spin } from "antd";
//import "./index.css";
import { useEffect, useState } from "react";
import axios from "axios";
import api from "../../../../../config/axios";
import App from "../../../../tracking/estimatedShippingFee/google";
// Import thêm thư viện để tính khoảng cách
import { Loader } from "@googlemaps/js-api-loader";

// eslint-disable-next-line react/display-name
const Address = forwardRef((props, ref) => {
  const [form] = Form.useForm();
  const [data, setData] = useState([]);
  const [where, setWhere] = useState("");
  const [selectedCity, setSelectedCity] = useState(undefined);
  const [selectedDistrict, setSelectedDistrict] = useState(undefined);
  const [selectedWard, setSelectedWard] = useState(undefined);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [tempSelectionsFrom, setTempSelectionsFrom] = useState("");
  const [tempSelectionsTo, setTempSelectionsTo] = useState("");
  const [orderAddress, setOrderAddress] = useState([]);

  //const [form] = useForm();
  const [isOpen, setIsOpen] = useState(false);

  const [tempSelections, setTempSelections] = useState({
    cityName: "",
    districtName: "",
    wardName: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [distance, setDistance] = useState(0);
  const [directions, setDirections] = useState(null);
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");

  const appRef = useRef();

  // Thêm state để lưu loại shipping
  const [shippingType, setShippingType] = useState("domestic"); // 'domestic' hoặc 'oversea'

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          "https://raw.githubusercontent.com/kenzouno1/DiaGioiHanhChinhVN/master/data.json"
        );
        setData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load location data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (selectedCity) {
      const cityData = data.find((city) => city.Id === selectedCity);
      setDistricts(cityData ? cityData.Districts : []);
    }
  }, [selectedCity, data]);

  useEffect(() => {
    if (selectedDistrict && selectedCity && data) {
      const cityData = data.find((city) => city.Id === selectedCity);
      const districtData = cityData?.Districts.find(
        (district) => district.Id === selectedDistrict
      );
      setWards(districtData ? districtData.Wards : []);
    }
  }, [selectedDistrict, selectedCity, data]);

  const handleCityChange = (value, option) => {
    setSelectedCity(value);
    setSelectedDistrict(undefined);
    setSelectedWard(undefined);
    setDistricts([]);
    setWards([]);
    setTempSelections((prev) => ({
      ...prev,
      cityName: option.children,
      districtName: "",
      wardName: "",
    }));
  };

  const handleDistrictChange = (value, option) => {
    setSelectedDistrict(value);
    setSelectedWard(undefined);
    setTempSelections((prev) => ({
      ...prev,
      districtName: option.children,
      wardName: "",
    }));
  };

  const handleWardChange = (value, option) => {
    setSelectedWard(value);
    setTempSelections((prev) => ({ ...prev, wardName: option.children }));
  };

  const handleConfirm = () => {
    // Here you can perform any action with the confirmed selections
    console.log("Confirmed selections:", tempSelections);
  };

  const handleCancel = () => {
    // Reset to the initial state
    setSelectedCity(undefined);
    setSelectedDistrict(undefined);
    setSelectedWard(undefined);
    setDistricts([]);
    setWards([]);
    setTempSelections({ cityName: "", districtName: "", wardName: "" });
  };

  useImperativeHandle(ref, () => ({
    validateFields: () => form.validateFields(),
    getFieldsValue: () => form.getFieldsValue(),
    setFieldsValue: (values) => form.setFieldsValue(values),
  }));

  const [selectedLocation, setSelectedLocation] = useState(null);

  const handleMapClick = (event) => {
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();
    setSelectedLocation({ lat, lng });
    form.setFieldsValue({
      senderAddress: `Lat: ${lat}, Lng: ${lng}`,
    });
  };

  const [modalForm] = Form.useForm();

  function handleShowModal(values) {
    setWhere(values.currentTarget.getAttribute("value"));
    setIsOpen(true);
  }

  function handleHideModal() {
    modalForm.resetFields();
    setSelectedCity(undefined);
    setSelectedDistrict(undefined);
    setSelectedWard(undefined);
    setDistricts([]);
    setWards([]);
    setTempSelections({ cityName: "", districtName: "", wardName: "" });
    setIsOpen(false);
  }

  // Thêm hàm tính khoảng cách
  const calculateDistance = async (origin, destination) => {
    try {
      const loader = new Loader({
        apiKey: "YOUR_GOOGLE_MAPS_API_KEY",
        version: "weekly",
        libraries: ["places", "geometry"],
      });

      const google = await loader.load();
      const service = new google.maps.DistanceMatrixService();

      const response = await service.getDistanceMatrix({
        origins: [origin],
        destinations: [destination],
        travelMode: google.maps.TravelMode.DRIVING,
        unitSystem: google.maps.UnitSystem.METRIC,
      });

      if (response.rows[0].elements[0].status === "OK") {
        const distanceInKm = response.rows[0].elements[0].distance.value / 1000;
        return distanceInKm;
      }
      return 0;
    } catch (error) {
      console.error("Error calculating distance:", error);
      return 0;
    }
  };

  function handleSubmit(values) {
    let selectedAddress = "";
    if (values.address) {
      selectedAddress =
        values.address +
        ", " +
        tempSelections.wardName +
        ", " +
        tempSelections.districtName +
        ", " +
        tempSelections.cityName;
    } else {
      selectedAddress =
        tempSelections.wardName +
        ", " +
        tempSelections.districtName +
        ", " +
        tempSelections.cityName;
    }

    // Get current form values
    const currentFormValues = form.getFieldsValue();
    const existingData = JSON.parse(
      localStorage.getItem("orderFormData") || "{}"
    );

    if (where === "From") {
      // Update form
      form.setFieldsValue({ senderAddress: selectedAddress });
      setTempSelectionsFrom(selectedAddress);

      // Update localStorage
      const updatedData = {
        ...existingData,
        ...currentFormValues,
        senderAddress: selectedAddress,
        type: shippingType === "oversea" ? "OVERSEA" : "DOMESTIC",
      };
      localStorage.setItem("orderFormData", JSON.stringify(updatedData));
    }

    if (where === "To") {
      // Update form
      form.setFieldsValue({ receiverAddress: selectedAddress });
      setTempSelectionsTo(selectedAddress);

      // Update localStorage
      const updatedData = {
        ...existingData,
        ...currentFormValues,
        receiverAddress: selectedAddress,
        type: shippingType === "oversea" ? "OVERSEA" : "DOMESTIC",
      };
      localStorage.setItem("orderFormData", JSON.stringify(updatedData));
    }

    // Update map if both addresses are available
    const updatedSenderAddr =
      where === "From" ? selectedAddress : tempSelectionsFrom;
    const updatedReceiverAddr =
      where === "To" ? selectedAddress : tempSelectionsTo;

    if (updatedSenderAddr && updatedReceiverAddr) {
      appRef.current.setLocations(updatedSenderAddr, updatedReceiverAddr);
    }

    handleHideModal();
  }

  function handleOK() {
    modalForm
      .validateFields()
      .then((values) => {
        handleSubmit(values);
      })
      .catch((info) => {
        console.log("Validate Failed:", info);
      });
  }

  useEffect(() => {
    // if (tempSelectionsFrom) {
    //   console.log("All locations selected:", tempSelectionsLocation);
    // }
    console.log(tempSelectionsFrom);
  }, [tempSelectionsFrom]);

  useEffect(() => {
    if (tempSelectionsTo) {
      console.log("All locations selected:", tempSelectionsTo);
    }
    console.log(tempSelectionsTo);
  }, [tempSelectionsTo]);

  const handleAddress = () => {
    try {
      const setvalue = {
        reciverAdress: d,
      };
    } catch (error) {
      console.log(error);
    }
  };

  const handleGetDistance = (newDistance) => {
    if (newDistance && newDistance > 0) {
      const roundedDistance = Math.round(newDistance * 100) / 100;

      // Update form and localStorage with the distance
      form.setFieldsValue({ kilometer: roundedDistance });
      localStorage.setItem("orderDistance", roundedDistance.toString());

      // Update existing orderFormData with new distance
      const existingData = JSON.parse(
        localStorage.getItem("orderFormData") || "{}"
      );
      localStorage.setItem(
        "orderFormData",
        JSON.stringify({
          ...existingData,
          kilometer: roundedDistance,
        })
      );

      console.log("Distance saved:", roundedDistance);
    }
  };

  useEffect(() => {
    const savedData = JSON.parse(localStorage.getItem("orderFormData") || "{}");
    if (savedData) {
      form.setFieldsValue(savedData);

      if (savedData.kilometer) {
        setDistance(savedData.kilometer);
      }
      if (savedData.senderAddress) {
        setTempSelectionsFrom(savedData.senderAddress);
      }
      if (savedData.receiverAddress) {
        setTempSelectionsTo(savedData.receiverAddress);
      }
      if (savedData.shippingType) {
        setShippingType(savedData.shippingType);
      }

      console.log("Loaded saved data:", savedData);
    }
  }, []);

  const handleFormValuesChange = (changedValues, allValues) => {
    const existingData = JSON.parse(
      localStorage.getItem("orderFormData") || "{}"
    );

    // For oversea shipping sender address
    if (shippingType === "oversea" && changedValues.senderAddress) {
      setTempSelectionsFrom(changedValues.senderAddress);
    }

    const updatedData = {
      ...existingData,
      ...allValues,
      kilometer: allValues.kilometer || existingData.kilometer,
      senderAddress: allValues.senderAddress || existingData.senderAddress,
      receiverAddress:
        allValues.receiverAddress || existingData.receiverAddress,
      shippingType: allValues.shippingType || existingData.shippingType,
      type: allValues.shippingType === "oversea" ? "OVERSEA" : "DOMESTIC",
    };

    localStorage.setItem("orderFormData", JSON.stringify(updatedData));

    // Update map if both addresses are available
    if (updatedData.senderAddress && updatedData.receiverAddress) {
      appRef.current.setLocations(
        updatedData.senderAddress,
        updatedData.receiverAddress
      );
    }
  };

  return (
    <Form
      form={form}
      labelCol={{
        span: 10,
      }}
      wrapperCol={{
        span: 14,
      }}
      layout="horizontal"
      style={{
        maxWidth: 1000,
      }}
      onValuesChange={handleFormValuesChange}
    >
      <Form.Item
        label="Shipping Type"
        name="shippingType"
        rules={[{ required: true, message: "Please select shipping type!" }]}
        initialValue="domestic"
      >
        <Select
          onChange={(value) => {
            setShippingType(value);

            // Reset receiver address khi chuyển đổi shipping type
            form.setFieldsValue({
              receiverAddress: "",
            });

            // Cập nhật localStorage với type
            const existingData = JSON.parse(
              localStorage.getItem("orderFormData") || "{}"
            );

            const updatedData = {
              ...existingData,
              shippingType: value,
              receiverAddress: "", // Reset receiver address trong localStorage
              type: value === "oversea" ? "OVERSEA" : "DOMESTIC",
            };

            localStorage.setItem("orderFormData", JSON.stringify(updatedData));

            // Reset các state liên quan nếu chuyển từ domestic sang oversea
            if (value === "oversea") {
              setTempSelectionsTo("");
            }
          }}
          style={{
            width: "100%",
          }}
          dropdownStyle={{
            borderRadius: "6px",
          }}
          className="shipping-type-select"
        >
          <Select.Option value="domestic">
            <div style={{ display: "flex", alignItems: "center" }}>
              <span style={{ marginLeft: 8 }}>Domestic</span>
            </div>
          </Select.Option>
          <Select.Option value="oversea">
            <div style={{ display: "flex", alignItems: "center" }}>
              <span style={{ marginLeft: 8 }}>Oversea</span>
            </div>
          </Select.Option>
        </Select>
      </Form.Item>
      <div>Sender Information</div>
      <Form.Item
        label="Phone Number"
        name="senderPhoneNumber"
        rules={[{ required: true, message: "Please input your phone number!" }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Address"
        name="senderAddress"
        rules={[{ required: true, message: "Please input sender's address!" }]}
      >
        {shippingType === "domestic" ? (
          <Input.TextArea readOnly autoSize={{ minRows: 2, maxRows: 6 }} />
        ) : (
          <Input.TextArea
            placeholder="Enter JAPAN address"
            autoSize={{ minRows: 2, maxRows: 6 }}
            onBlur={(e) => {
              const overseaAddress = e.target.value;
              if (overseaAddress) {
                // Cập nhật form và localStorage
                form.setFieldsValue({ senderAddress: overseaAddress });
                setTempSelectionsTo(overseaAddress);

                const existingData = JSON.parse(
                  localStorage.getItem("orderFormData") || "{}"
                );

                localStorage.setItem(
                  "orderFormData",
                  JSON.stringify({
                    ...existingData,
                    senderAddress: overseaAddress,
                  })
                );

                // Tính toán distance với địa chỉ mới
                if (tempSelectionsFrom && appRef.current) {
                  appRef.current.setLocations(
                    tempSelectionsFrom,
                    overseaAddress
                  );
                }
              }
            }}
          />
        )}
      </Form.Item>

      {shippingType === "domestic" && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: "20px",
          }}
        >
          <Button
            type="primary"
            onClick={(e) => {
              e.preventDefault();
              handleShowModal(e);
            }}
            value="From"
            style={{
              width: "200px",
              backgroundColor: "#e25822",
              borderColor: "#e25822",
              height: "40px",
              borderRadius: "6px",
              boxShadow: "0 2px 0 rgba(226, 88, 34, 0.1)",
              "&:hover": {
                backgroundColor: "#d14812",
                borderColor: "#d14812",
              },
            }}
          >
            Select sender location
          </Button>
        </div>
      )}

      <div>Receiver Information</div>

      <Form.Item
        label="Receiver's Name"
        name="receiverName"
        rules={[{ required: true, message: "Please input receiver's name!" }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Phone Number"
        name="receiverPhoneNumber"
        rules={[
          { required: true, message: "Please input receiver's phone number!" },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Address"
        name="receiverAddress"
        rules={[
          { required: true, message: "Please input receiver's address!" },
        ]}
      >
        <Input.TextArea readOnly autoSize={{ minRows: 2, maxRows: 6 }} />
      </Form.Item>

      {/* Always show select button for receiver address */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginBottom: "20px",
        }}
      >
        <Button
          type="primary"
          onClick={(e) => {
            e.preventDefault();
            handleShowModal(e);
          }}
          value="To"
          style={{
            width: "200px",
            backgroundColor: "#e25822",
            borderColor: "#e25822",
            height: "40px",
            borderRadius: "6px",
            boxShadow: "0 2px 0 rgba(226, 88, 34, 0.1)",
          }}
        >
          Select receiver location
        </Button>
      </div>

      <Form.Item label="Note" name="note">
        <TextArea rows={1} />
      </Form.Item>

      {/* <div style={{ marginBottom: '20px' }}>
        <Button 
          onClick={() => {
            const formData = form.getFieldsValue();
            console.log("Current distance:", {
              formValue: formData.kilometer,
              stateValue: distance,
              storedValue: JSON.parse(localStorage.getItem("orderFormData"))?.kilometer
            });
          }}
          style={{ marginRight: '10px' }}
        >
          Check Distance
        </Button>
        <span>Current Distance: {distance} km</span>
      </div> */}

      <div className="estimatedshippingfee__map">
        <App ref={appRef} getDistance={handleGetDistance} />
      </div>

      <Modal
        open={isOpen}
        title="Select location"
        onCancel={handleHideModal}
        onOk={handleOK}
        okButtonProps={{
          style: {
            backgroundColor: "#e25822",
            borderColor: "#e25822",
          },
        }}
      >
        <Form
          form={modalForm}
          labelCol={{
            span: 6,
          }}
        >
          <Form.Item
            label="Province / City"
            name="province_city"
            rules={[
              { required: true, message: "Please select a province/city" },
            ]}
          >
            <Select
              showSearch
              style={{ width: "100%" }}
              onChange={handleCityChange}
              placeholder="Select City"
              optionFilterProp="children"
            >
              {data.map((city) => (
                <Select.Option key={city.Id} value={city.Id}>
                  {city.Name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="District"
            name="district"
            rules={[{ required: true, message: "Please select a district" }]}
          >
            <Select
              showSearch
              style={{ width: "100%" }}
              onChange={handleDistrictChange}
              placeholder="Select District"
              disabled={!selectedCity}
            >
              {districts.map((district) => (
                <Select.Option key={district.Id} value={district.Id}>
                  {district.Name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="Ward"
            name="ward"
            rules={[{ required: true, message: "Please select a ward" }]}
          >
            <Select
              showSearch
              style={{ width: "100%" }}
              onChange={handleWardChange}
              placeholder="Select Ward"
              disabled={!selectedDistrict}
            >
              {wards.map((ward) => (
                <Select.Option key={ward.Id} value={ward.Id}>
                  {ward.Name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="Address"
            name="address"
            rules={[
              { required: true, message: "Please enter specific address" },
            ]}
          >
            <Input placeholder="Enter house number, street name..." />
          </Form.Item>
        </Form>
      </Modal>
    </Form>
  );
});

export default Address;
