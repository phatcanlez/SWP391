import { Button, Form, Input, Modal, Select, Table, Space } from "antd";
import "./index.css";
import { useForm } from "antd/es/form/Form";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import App from "./google";
import api from "../../../config/axios";
import box from "../../../img/box.png";
import airplane from "../../../img/airplane.png";

const { Option } = Select;

function EstimatedShippingFee() {
  const appRef = useRef();
  const [shippingCost, setShippingCost] = useState(0);
  const [mediumBoxNeeded, setMediumBoxNeeded] = useState(0);
  const [noOfBoxesLarge, setNoOfBoxesLarge] = useState(0);
  const [extraLargeBoxesQuantity, setExtraLargeBoxesQuantity] = useState(0);
  const [specialLargeBoxesQuantity, setSpecialLargeBoxesQuantity] = useState(0);
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
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get("shipmethod");
        setShipMethods(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

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

  let sizeInCM = [
    "-19.9",
    "20-25",
    "25.1 - 30",
    "30.1 - 40",
    "40.1 - 44",
    "44.1 - 50",
    "50.1 - 55",
    "55.1 - 65",
    "50 - 60 Hirenaga (Butterfly)",
    "60.1 - 65 Hirenaga (Butterfly)",
    "65.1 - 73",
    "73.1 - 83",
  ];
  let sizeInInch = [
    "7.86",
    "7.87 - 9.84",
    "9.85 - 11.81",
    "11.82 - 15.75",
    "15.76 - 17.32",
    "17.33 - 19.6",
    "19.7 - 21.6",
    "21.7 - 25.5",
    "19.7 - 23.4",
    "23.5 - 25.5",
    "25.6 - 28.7",
    "28.8 - 32.6",
  ];
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
  let mediumBoxPoints = 9;
  let UPSChargesMedium = 190; //140;
  let surchargePerBoxMedium = 25; //20;

  let largeBoxPoints = 15;
  let UPSChargesLarge = 210; //179;
  let surchargePerBoxLarge = 25;

  let extraLargeBoxPoints = 16;
  let UPSChargesExtraLarge = 260; //259;
  let surchargePerBoxExtraLarge = 50;

  let specialLargeBoxPoints = 18;
  let UPSChargesSpecialLarge = 339;
  let surchargePerBoxSpecialLarge = 70;

  async function calculatePoints() {
    let totalPoints = 0;
    let mediumBoxNeeded = 0,
      noOfBoxesLarge = 0,
      extraLargeBoxesQuantity = 0,
      specialLargeBoxesQuantity = 0;

    for (let i = 0; i < pointsArray.length - 2; i++) {
      let points =
        parseFloat(document.getElementById("KOIQuantity" + i).value) || 0;
      totalPoints += points * parseFloat(pointsArray[i]);
    }

    let remainingPoints = 0;

    let extraLargeBoxesIndex = Number(pointsArray.length - 2);

    extraLargeBoxesQuantity =
      parseFloat(
        document.getElementById("KOIQuantity" + extraLargeBoxesIndex).value
      ) || 0;

    let specialLargeBoxesIndex = Number(pointsArray.length - 1);
    specialLargeBoxesQuantity =
      parseFloat(
        document.getElementById("KOIQuantity" + specialLargeBoxesIndex).value
      ) || 0;

    if (totalPoints % mediumBoxPoints == 0) {
      mediumBoxNeeded = totalPoints / mediumBoxPoints;
      remainingPoints = 0;
    } else if (totalPoints % largeBoxPoints == 0) {
      noOfBoxesLarge = totalPoints / largeBoxPoints;
      remainingPoints = 0;
    } else {
      if (totalPoints < largeBoxPoints && totalPoints < mediumBoxPoints) {
        mediumBoxNeeded = 1;
        remainingPoints = mediumBoxPoints - totalPoints;
      } else if (
        totalPoints <= largeBoxPoints &&
        totalPoints > mediumBoxPoints
      ) {
        noOfBoxesLarge = 1;
        remainingPoints = largeBoxPoints - totalPoints;
      } else {
        noOfBoxesLarge = totalPoints / largeBoxPoints;
        remainingPoints = Math.abs(
          Math.floor(noOfBoxesLarge) * largeBoxPoints - totalPoints
        );
        if (remainingPoints <= 9) {
          mediumBoxNeeded++;
          remainingPoints = mediumBoxPoints - remainingPoints;
        } else if (remainingPoints > 9 && remainingPoints <= 15) {
          mediumBoxNeeded += 2;
          remainingPoints = mediumBoxPoints * mediumBoxNeeded - remainingPoints;
        }
      }
    }

    let shippingCostLargeBox =
      Math.floor(noOfBoxesLarge) * (UPSChargesLarge + surchargePerBoxLarge);
    let shippingCostMediumBox =
      mediumBoxNeeded * (UPSChargesMedium + surchargePerBoxMedium);
    let shippingCostExtraLargeBox =
      extraLargeBoxesQuantity *
      (UPSChargesExtraLarge + surchargePerBoxExtraLarge);
    let shippingCostSpecialLargeBox =
      specialLargeBoxesQuantity *
      (UPSChargesSpecialLarge + surchargePerBoxSpecialLarge);
    let shippingCost =
      shippingCostLargeBox +
      shippingCostMediumBox +
      shippingCostExtraLargeBox +
      shippingCostSpecialLargeBox;
    setMediumBoxNeeded(mediumBoxNeeded);
    setNoOfBoxesLarge(noOfBoxesLarge);
    setExtraLargeBoxesQuantity(extraLargeBoxesQuantity);
    setSpecialLargeBoxesQuantity(specialLargeBoxesQuantity);
    setShippingCost(shippingCost);
    let values = {
      kilometers: parseFloat(distance),
      shipMethodID: selectedMethod,
      boxAmountDTO: {
        smallBox: mediumBoxNeeded,
        mediumBox: Math.floor(noOfBoxesLarge),
        largeBox: extraLargeBoxesQuantity,
        extraLargeBox: specialLargeBoxesQuantity,
      },
    };

    console.log(values);

    try {
      const response = await axios.post(
        "http://103.90.227.65:8080/tracking/estimate",
        values
      );
      console.log(response.data);
    } catch (err) {
      console.error("Fetching error: ", err);
    }
  }

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
    if (tempSelectionsFrom && tempSelectionsTo) {
      appRef.current.setLocations(tempSelectionsFrom, tempSelectionsTo);
    } else if (tempSelectionsFrom && selectedAddress) {
      appRef.current.setLocations(tempSelectionsFrom, selectedAddress);
    } else if (selectedAddress && tempSelectionsTo) {
      appRef.current.setLocations(selectedAddress, tempSelectionsTo);
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
              {mediumBoxNeeded +
                noOfBoxesLarge +
                extraLargeBoxesQuantity +
                specialLargeBoxesQuantity ===
              0
                ? "_ boxes"
                : mediumBoxNeeded +
                  " small boxes , " +
                  Math.floor(noOfBoxesLarge) +
                  " medium boxes, " +
                  extraLargeBoxesQuantity +
                  " large boxes and " +
                  specialLargeBoxesQuantity +
                  " extra large boxes"}
            </div>
          </div>
          <div className="estimatedshippingfee__products__right__rectangle">
            <img src={airplane} />
            <div>Total shipping cost</div>
            <div style={{ color: "red", paddingTop: 50 }}>
              {shippingCost === 0 ? "$-" : "~$ " + shippingCost}
            </div>
          </div>
          <div className="estimatedshippingfee__products__right__rectangle">
            <img src="https://s3-alpha-sig.figma.com/img/ed02/bcc5/30ddd63ae6720e8c9ec6e688a3198b6d?Expires=1728864000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=pg-CK1fnvGhSrgBv0Wdo4AfFb1sst6hpKO5oUCodVAyUmg~-IzlW~MyqtA-fL7DqOj~8l5swvVtLRfHQ~QgeSQrPd2QpECl-iNnCsPciWnMKqSXcTD5Hz6nuCGRs9FZ9gC~b3~ZrgJeL4hFOS0J7rEEKDMFHXnT6oESN5qZr~C8cal6yNBQPZqk8AHg-K6a8hPdXYbhCEwvFuModH-XaNPzAsw4IK57wNftjBUCQR7I9-FnYXw9DyY18JgZjlmZwG9SZB1dPnbqfGg-UKXpP3v6np2zRaMQucOMdnqDIcful~YMc~SZIgIMlM23SCdzT3MjSAKr~ZROyT30IWltW1A__" />
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
        <button onClick={calculatePoints}>Tracking</button>
      </div>
    </div>
  );
}

export default EstimatedShippingFee;
