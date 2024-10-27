import { forwardRef, useImperativeHandle } from "react";
import TextArea from "antd/es/input/TextArea";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import { Button, Form, Input, Modal, Select, Space } from "antd";
//import "./index.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { Option } from "antd/es/mentions";
import api from "../../../../../config/axios";

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://raw.githubusercontent.com/kenzouno1/DiaGioiHanhChinhVN/master/data.json"
        );
        setData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
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
    if (selectedDistrict) {
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
    if (where === "From") {
      form.setFieldsValue({ senderAddress: selectedAddress });
    }
    if (where === "To") {
      form.setFieldsValue({ receiverAddress: selectedAddress });
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


  const handleAddress = () =>{
    try {
      const setvalue = {
        reciverAdress: d
      };
    } catch (error) {
      console.log(error)
    }
  }
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
    >
      <div> Sender Information</div>
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
        rules={[{ required: true, message: "Please input your address!" }]}
      >
        <Input.TextArea readOnly autoSize={{ minRows: 2, maxRows: 6 }} />
      </Form.Item>
      <Button onClick={handleShowModal} value="From">
        Select sender location
      </Button>

      <div> Receiver Information</div>
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
      <Button onClick={handleShowModal} value="To">
        Select receiver location
      </Button>

      <Form.Item label="Note" name="note">
        <TextArea rows={1} />
      </Form.Item>

      <Modal
        open={isOpen}
        title="Select location"
        onCancel={handleHideModal}
        onOk={handleOK}
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
              style={{ width: 200 }}
              onChange={handleCityChange}
              placeholder="Select City"
            >
              {data.map((city) => (
                <Option key={city.Id} value={city.Id}>
                  {city.Name}
                </Option>
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
              style={{ width: 200 }}
              onChange={handleDistrictChange}
              placeholder="Select District"
              disabled={!selectedCity}
            >
              {districts.map((district) => (
                <Option key={district.Id} value={district.Id}>
                  {district.Name}
                </Option>
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
              style={{ width: 200 }}
              onChange={handleWardChange}
              placeholder="Select Ward"
              disabled={!selectedDistrict}
            >
              {wards.map((ward) => (
                <Option key={ward.Id} value={ward.Id}>
                  {ward.Name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="Address" name="address">
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </Form>
  );
});

export default Address;
