import { Button, Form, Input, Modal, Select, Table, Space } from "antd";
import "./index.css";
import { useForm } from "antd/es/form/Form";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import App from "./google";
import api from "../../../config/axios";
import box from "../../../img/box.png";
import airplane from "../../../img/airplane.png";
import delivery from "../../../img/delivery.png";

const { Option } = Select;

function EstimatedShippingFee() {
  const appRef = useRef();
  const resultRef = useRef(null);
  const [shippingCost, setShippingCost] = useState(0);
  const [smallBox, setSmallBox] = useState(0);
  const [mediumBox, setMediumBox] = useState(0);
  const [largeBox, setLargeBox] = useState(0);
  const [extraLargeBox, setExtraLargeBox] = useState(0);
  const [data, setData] = useState([]);
  const [selectedCity, setSelectedCity] = useState(undefined);
  const [selectedDistrict, setSelectedDistrict] = useState(undefined);
  const [selectedWard, setSelectedWard] = useState(undefined);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [where, setWhere] = useState("");

  // const [tempSelectionsFrom, setTempSelectionsFrom] = useState({
  //   cityName: "",
  //   districtName: "",
  //   wardName: "",
  //   address: "",
  // });
  // const [tempSelectionsTo, setTempSelectionsTo] = useState({
  //   cityName: "",
  //   districtName: "",
  //   wardName: "",
  //   address: "",
  // });

  const [tempSelectionsFrom, setTempSelectionsFrom] = useState("");
  const [tempSelectionsTo, setTempSelectionsTo] = useState("");

  const [tempSelections, setTempSelections] = useState({
    cityName: "",
    districtName: "",
    wardName: "",
  });

  const [shipMethods, setShipMethods] = useState([]);
  const [selectedMethod, setSelectedMethod] = useState(undefined);
  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const response = await api.get("shipmethod");
  //       setShipMethods(response.data);
  //     } catch (error) {
  //       console.error("Error fetching data:", error);
  //     }
  //   };
  //   fetchData();
  // }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://raw.githubusercontent.com/kenzouno1/DiaGioiHanhChinhVN/master/data.json"
        );
        setData(response.data);
        setShipMethods([
          { shipMethodId: 1, description: "Economy shipping" },

          { shipMethodId: 2, description: "Fast shipping" },

          { shipMethodId: 3, description: "Express shipping" },
        ]);
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

  let pointsArray = [
    "1.25",
    "2",
    "2.5",
    "3",
    "5",
    "7.5",
    "9",
    "14",
    "12",
    "14",
    "16",
    "18",
  ];
  let smallBoxPoints = 9;

  let mediumBoxPoints = 15;

  const calculatePoints = async () => {
    let totalPoints = 0;
    let smallBox = 0,
      mediumBox = 0,
      largeBox = 0,
      extraLargeBox = 0;

    for (let i = 0; i < pointsArray.length - 2; i++) {
      let points =
        parseFloat(document.getElementById("KOIQuantity" + i).value) || 0;
      totalPoints += points * parseFloat(pointsArray[i]);
    }

    let remainingPoints = 0;

    let largeBoxesIndex = Number(pointsArray.length - 2);

    largeBox =
      parseFloat(
        document.getElementById("KOIQuantity" + largeBoxesIndex).value
      ) || 0;

    let extraLargeBoxesIndex = Number(pointsArray.length - 1);
    extraLargeBox =
      parseFloat(
        document.getElementById("KOIQuantity" + extraLargeBoxesIndex).value
      ) || 0;

    if (totalPoints % smallBoxPoints == 0) {
      smallBox = totalPoints / smallBoxPoints;
      remainingPoints = 0;
    } else if (totalPoints % mediumBoxPoints == 0) {
      mediumBox = totalPoints / mediumBoxPoints;
      remainingPoints = 0;
    } else {
      if (totalPoints < mediumBoxPoints && totalPoints < smallBoxPoints) {
        smallBox = 1;
        remainingPoints = smallBoxPoints - totalPoints;
      } else if (
        totalPoints <= mediumBoxPoints &&
        totalPoints > smallBoxPoints
      ) {
        mediumBox = 1;
        remainingPoints = mediumBoxPoints - totalPoints;
      } else {
        mediumBox = totalPoints / mediumBoxPoints;
        remainingPoints = Math.abs(
          Math.floor(mediumBox) * mediumBoxPoints - totalPoints
        );
        if (remainingPoints <= 9) {
          smallBox++;
          remainingPoints = smallBoxPoints - remainingPoints;
        } else if (remainingPoints > 9 && remainingPoints <= 15) {
          smallBox += 2;
          remainingPoints = smallBoxPoints * smallBox - remainingPoints;
        }
      }
    }

    setSmallBox(smallBox);
    setMediumBox(mediumBox);
    setLargeBox(largeBox);
    setExtraLargeBox(extraLargeBox);
    let values = {
      kilometers: parseFloat(distance),
      shipMethodID: selectedMethod,
      weight: weight,
      boxAmountDTO: {
        smallBox: smallBox,
        mediumBox: Math.floor(mediumBox),
        largeBox: largeBox,
        extraLargeBox: extraLargeBox,
      },
    };

    console.log(values);

    try {
      const response = await api.post("tracking/estimate", values);
      setShippingCost(response.data);
      setTimeout(() => {
        if (resultRef.current) {
          resultRef.current.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    } catch (err) {
      console.error("Fetching error: ", err);
    }
  };

  useEffect(() => {
    calculatePoints();
  }, []);

  const [form] = useForm();
  const [isOpen, setIsOpen] = useState(false);

  const dataFish = [
    {
      sizeInCM: "-19.9",
      sizeInInch: "7.86",
    },
    {
      sizeInCM: "20-25",
      sizeInInch: "7.87 - 9.84",
    },
    {
      sizeInCM: "25.1 - 30",
      sizeInInch: "9.85 - 11.81",
    },
    {
      sizeInCM: "30.1 - 40",
      sizeInInch: "11.82 - 15.75",
    },
    {
      sizeInCM: "40.1 - 44",
      sizeInInch: "15.76 - 17.32",
    },
    {
      sizeInCM: "44.1 - 50",
      sizeInInch: "17.33 - 19.6",
    },
    {
      sizeInCM: "50.1 - 55",
      sizeInInch: "19.7 - 21.6",
    },
    {
      sizeInCM: "55.1 - 65",
      sizeInInch: "21.7 - 25.5",
    },
    {
      sizeInCM: "50 - 60 Hirenaga (Butterfly)",
      sizeInInch: "19.7 - 23.4",
    },
    {
      sizeInCM: "60.1 - 65 Hirenaga (Butterfly)",
      sizeInInch: "23.5 - 25.5",
    },
    {
      sizeInCM: "65.1 - 73",
      sizeInInch: "25.6 - 28.7",
    },
    {
      sizeInCM: "73.1 - 83",
      sizeInInch: "28.8 - 32.6",
    },
  ];

  let count = 0;

  const columns = [
    { title: "Size in CM", dataIndex: "sizeInCM", key: "sizeInCM" },
    { title: "Size in Inch", dataIndex: "sizeInInch", key: "sizeInInch" },
    {
      title: "# of KOI",
      key: "InputVolumn",
      render: () => (
        <Form.Item style={{ height: 20 }} name={"KOIQuantity" + count++}>
          <Input type="number" style={{ width: 75, border: "solid" }} />
        </Form.Item>
      ),
    },
  ];

  function handleShowModal(values) {
    setWhere(values.currentTarget.getAttribute("value"));
    setIsOpen(true);
  }
  useEffect(() => {
    if (where !== "") {
      console.log("Where:", where);
    }
  }, [where]);

  function handleHideModal() {
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
    if (values.address !== undefined) {
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
      setTempSelectionsFrom(selectedAddress);
    }
    if (where === "To") {
      setTempSelectionsTo(selectedAddress);
    }

    if (
      (tempSelectionsFrom && selectedAddress) ||
      (selectedAddress && tempSelectionsTo)
    ) {
      appRef.current.setLocations(tempSelectionsFrom, selectedAddress);
    }

    form.resetFields();
    handleHideModal();
  }

  useEffect(() => {
    if (tempSelectionsFrom) {
      //console.log("All locations selected:", tempSelectionsLocation);
    }
    console.log(tempSelectionsFrom);
  }, [tempSelectionsFrom]);

  useEffect(() => {
    if (tempSelectionsTo) {
      //console.log("All locations selected:", tempSelectionsTo);
    }
    console.log(tempSelectionsTo);
  }, [tempSelectionsTo]);

  function handleOK() {
    form.submit();
  }

  const handleShippingMethodChange = (value) => {
    setSelectedMethod(value);
    console.log(selectedMethod);
  };
  const [distance, setDistance] = useState();
  const handleGetDistance = (newDistance) => {
    setDistance(newDistance);
  };

  useEffect(() => {
    if (distance) {
      console.log(distance);
    }
  }, [distance]);

  useEffect(() => {
    if (selectedMethod) {
      console.log(selectedMethod);
    }
  }, [selectedMethod]);

  const [weight, setWeight] = useState(0);
  return (
    <div className="estimatedshippingfee">
      <div className="estimatedshippingfee__title">ESTIMATED SHIPPING FEE</div>
      <div className="estimatedshippingfee__products">
        <div className="estimatedshippingfee__products__left">
          <p className="estimatedshippingfee__products__left__title">
            Start by entering the amount of koi in each size category that you
            wish to ship. Click ‘get estimate’ to update box and shipping
            estimate.
          </p>
          <Form>
            <Table columns={columns} dataSource={dataFish} pagination={false} />
          </Form>
        </div>
        <div className="estimatedshippingfee__products__right">
          <div className="estimatedshippingfee__products__right__rectangle">
            <img src={box} />
            <div>Number of box you need</div>
            <div id="boxesNeeded"></div>
            <div style={{ color: "red", paddingTop: 50 }}>
              {smallBox + mediumBox + largeBox + extraLargeBox === 0
                ? "_ boxes"
                : smallBox +
                  " small boxes , " +
                  Math.floor(mediumBox) +
                  " medium boxes, " +
                  largeBox +
                  " large boxes and " +
                  extraLargeBox +
                  " extra large boxes"}
            </div>
          </div>
          <div
            className="estimatedshippingfee__products__right__rectangle"
            id="estimate"
            ref={resultRef}
          >
            <img src={airplane} />
            <div>Total shipping cost</div>
            <div style={{ color: "red", paddingTop: 50 }}>
              {shippingCost === 0 ? "~ VND" : Math.ceil(shippingCost) + " VND"}
            </div>
          </div>
          <div className="estimatedshippingfee__products__right__rectangle">
            <img src={delivery} />
            <div style={{ textAlign: "center", paddingBottom: "20px" }}>
              Shipping method
            </div>
            <Select
              style={{ width: 200 }}
              value={selectedMethod}
              onChange={handleShippingMethodChange}
              placeholder="Select"
            >
              {shipMethods.map((method) => (
                <Option key={method.shipMethodId} value={method.shipMethodId}>
                  {method.description}
                </Option>
              ))}
            </Select>
          </div>
        </div>
      </div>
      <div className="estimatedshippingfee__destination">
        <div className="estimatedshippingfee__destination__from">
          <ul>
            <li>
              <p className="estimatedshippingfee__destination__title">From</p>
              <Button onClick={handleShowModal} value="From">
                Select location
              </Button>
            </li>
            <li>
              <p>Your selection: {tempSelectionsFrom}</p>
            </li>
          </ul>
        </div>
        <div className="estimatedshippingfee__destination__to">
          <ul>
            <li>
              <p className="estimatedshippingfee__destination__title">TO</p>
              <Button onClick={handleShowModal} value="To">
                Select location
              </Button>
            </li>

            <li>
              <p>Your selection: {tempSelectionsTo}</p>
            </li>
          </ul>
        </div>

        <Modal
          open={isOpen}
          title="Select location"
          onCancel={handleHideModal}
          onOk={handleOK}
        >
          <Form
            labelCol={{
              span: 6,
            }}
            form={form}
            onFinish={handleSubmit}
          >
            <Form.Item
              label="Province / City"
              name={"province_city"}
              rules={[{ require: true }]}
            >
              <Space>
                <Select
                  showSearch
                  style={{ width: 200 }}
                  value={selectedCity}
                  onChange={handleCityChange}
                  placeholder="Select City"
                >
                  {data.map((city) => (
                    <Option key={city.Id} value={city.Id}>
                      {city.Name}
                    </Option>
                  ))}
                </Select>
              </Space>
            </Form.Item>
            <Form.Item
              label="District"
              name={"district"}
              rules={[{ require: true }]}
            >
              <Space>
                <Select
                  showSearch
                  style={{ width: 200 }}
                  value={selectedDistrict}
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
              </Space>
            </Form.Item>
            <Form.Item label="Ward" name={"ward"} rules={[{ require: true }]}>
              <Space>
                <Select
                  showSearch
                  style={{ width: 200 }}
                  value={selectedWard}
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
              </Space>
            </Form.Item>
            <Form.Item
              label="Address"
              name={"address"}
              rules={[{ require: true }]}
            >
              <Input />
            </Form.Item>
          </Form>
        </Modal>
      </div>
      <div className="estimatedshippingfee__map">
        <App ref={appRef} getDistance={handleGetDistance} />
      </div>
      <div className="estimatedshippingfee__calculating">
        Weight :{" "}
        <Input
          name="weight"
          style={{ width: 200 }}
          type="number"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
        />
        <br />
        <br />
        <button onClick={calculatePoints}>
          {/* <a href="#estimate" style={{ textDecoration: "none", color: "#fff" }}>
            Tracking
          </a> */}
          Tracking
        </button>
      </div>
    </div>
  );
}

export default EstimatedShippingFee;
