import { useEffect, useRef, useState } from "react";
import userr from "../../img/user.png";
import "./index.css";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Button, Form, Input, Modal, Select, Space } from "antd";
import { logout } from "../../redux/features/userSlice";
import { toast } from "react-toastify";
import api from "../../config/axios";
import { SettingOutlined } from "@ant-design/icons";
import axios from "axios";
import { useForm } from "antd/es/form/Form";

function Profile() {
  const appRef = useRef();
  const { Option } = Select;
  const [data, setData] = useState([]);
  const [selectedCity, setSelectedCity] = useState(undefined);
  const [selectedDistrict, setSelectedDistrict] = useState(undefined);
  const [selectedWard, setSelectedWard] = useState(undefined);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [where, setWhere] = useState("");
  const [isOpen, setIsOpen] = useState(false);

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
  const [passwordForm] = Form.useForm();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    passwordForm.submit();
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const [tempSelectionsFrom, setTempSelectionsFrom] = useState("");

  const [tempSelections, setTempSelections] = useState({
    cityName: "",
    districtName: "",
    wardName: "",
  });

  useEffect(() => {
    if (selectedCity) {
      const cityData = data.find((city) => city.Id === selectedCity);
      if (cityData) {
        setDistricts(cityData.Districts || []);
      } else {
        setDistricts([]);
      }
    }
  }, [selectedCity, data]);

  useEffect(() => {
    if (selectedDistrict && selectedCity) {
      const cityData = data.find((city) => city.Id === selectedCity);
      const districtData = cityData?.Districts.find(
        (district) => district.Id === selectedDistrict
      );
      setWards(districtData ? districtData.Wards : []);
    } else {
      setWards([]); // Reset wards if district or city changes
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

  function handleShowModal(values) {
    setWhere(values.currentTarget.getAttribute("value"));
    setIsOpen(true);
  }

  // const handleCancel = () => {
  //   // Reset to the initial state
  //   setSelectedCity(undefined);
  //   setSelectedDistrict(undefined);
  //   setSelectedWard(undefined);
  //   setDistricts([]);
  //   setWards([]);
  //   setTempSelections({ cityName: "", districtName: "", wardName: "" });
  // };

  const [addressForm] = Form.useForm();
  const [form] = useForm();
  const [checkForm] = Form.useForm();
  const user = useSelector((store) => store);
  console.log(user);

  const dispatch = useDispatch();
  const [showForm1, setShowForm1] = useState(false);
  const [showForm2, setShowForm2] = useState(false);
  const [userValue, setUserValue] = useState([]);

  const toggleForm = () => {
    setShowForm1(!showForm1);
    if (!showForm1) setShowForm2(false);
  };
  const toggleForm2 = () => {
    setShowForm2(!showForm2);
    if (!showForm2) setShowForm1(false);
  };

  const checkPassword = async (values) => {
    try {
      values.username = user.user.username;
      await api.post("login", values);
      checkForm.resetFields();
      showModal();
    } catch (error) {
      console.error(error);
      toast.error("Wrong password");
    }
  };

  const handleResetPassword = async (value) => {
    try {
      await api.post("reset-password", value);
      toast.success("Your password has changed!");
      passwordForm.resetFields();
    } catch (error) {
      toast.error(error.data, "Cannot change password!");
    }
  };
  const fetchUserData = async () => {
    try {
      const response = await api.get(`account/${user.user.id}`);
      console.log(response.data);
      const value = response.data;
      setTempSelectionsFrom(value.address || "");
      form.setFieldsValue({
        name: value.name,
        username: value.username,
        email: value.email,
        phoneNumber: value.phoneNumber,
        address: value.address,
      });
      setUserValue(value);

      const locationResponse = await axios.get(
        "https://raw.githubusercontent.com/kenzouno1/DiaGioiHanhChinhVN/master/data.json"
      );
      setData(locationResponse.data);
    } catch (error) {
      console.error("Error fetching user data:", error);
      toast.error("Cannot load user data.");
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const handleResetValue = async (values) => {
    try {
      // Tạo một bản sao của values để tránh mutate trực tiếp
      const updatedValues = { ...values };

      // Nếu có địa chỉ mới được chọn từ modal
      if (tempSelectionsFrom) {
        updatedValues.address = tempSelectionsFrom;
      }

      // Thêm status từ user hiện tại
      updatedValues.status = user.user.status;

      // Gọi API để cập nhật thông tin
      const response = await api.put(`account/${user.user.id}`, updatedValues);
      console.log(response);
      // Nếu cập nhật thành công
      if (response.status === 200) {
        toast.success("Profile updated successfully!");
        fetchUserData(); // Refresh data
        setShowForm1(false); // Đóng form
      }
    } catch (error) {
      // Xử lý lỗi chi tiết hơn
      const errorMessage = error.response?.data || "Failed to update profile";
      toast.error(errorMessage);
      console.error("Update profile error:", error);
    }
  };

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

    if (tempSelectionsFrom && selectedAddress) {
      appRef.current.setLocations(tempSelectionsFrom, selectedAddress);
    }

    addressForm.resetFields();
    handleHideModal();
    fetchUserData();
  }

  function handleHideModal() {
    setSelectedCity(undefined);
    setSelectedDistrict(undefined);
    setSelectedWard(undefined);
    setDistricts([]);
    setWards([]);
    setTempSelections({ cityName: "", districtName: "", wardName: "" });
    setIsOpen(false);
  }
  return (
    <div className="profile">
      <div className="head bg-w">
        <img className="avatar" src={userr} alt="" />
        <h4>{userValue.name}</h4>
        <p>{userValue.email}</p>
      </div>
      <h6>INFORMATION</h6>
      <div className="bg-w ">
        <div className="information">
          <div className="item">
            <p>User Name: </p>
            <p>{userValue.username}</p>
          </div>
          <div className="item">
            <p>Phone Number: </p>
            <p>{userValue.phoneNumber}</p>
          </div>
          <div className="item">
            <p>Address: </p>
            <p>{userValue.address}</p>
          </div>
        </div>
      </div>

      <div className="bg-w">
        <div style={{ display: "flex" }}>
          <SettingOutlined style={{ fontSize: "28px" }} />
          <button className="user-setting" onClick={toggleForm}>
            {showForm1 ? "Cancel" : "User Setting"}
          </button>
        </div>

        {showForm1 && (
          <div>
            <div className="bg-w">
              <Form
                labelCol={{ span: 24 }}
                onFinish={handleResetValue}
                form={form}
              >
                <Form.Item label="Name" name="name">
                  <Input type="text" />
                </Form.Item>
                <Form.Item label="Email" name="email">
                  <Input type="text" />
                </Form.Item>
                <Form.Item label="Phone number" name="phoneNumber">
                  <Input type="text" />
                </Form.Item>
                <Form.Item label="Address" name="address">
                  <Form.Item>
                    <Input
                      disabled={true}
                      value={tempSelectionsFrom}
                      onChange={(e) => setTempSelectionsFrom(e.target.value)}
                      style={{ backgroundColor: '#fcfcfc' }}
                    />
                  </Form.Item>
                  <Button value="From" onClick={handleShowModal}>
                    Select Address
                  </Button>
                </Form.Item>
                <Button htmlType="submit" className="register__btn">
                  SAVE
                </Button>
              </Form>
            </div>
          </div>
        )}
      </div>

      <div className="bg-w">
        <div style={{ display: "flex" }}>
          <SettingOutlined style={{ fontSize: "28px" }} />
          <button className="user-setting" onClick={toggleForm2}>
            {showForm2 ? " Cancel change Password" : "Change Password"}
          </button>
        </div>
        {showForm2 && (
          <div className="bg-w">
            <Form
              form={checkForm}
              labelCol={{ span: 24 }}
              onFinish={checkPassword}
            >
              <Form.Item label="Enter your password" name="password">
                <Input.Password />
              </Form.Item>
              <Button htmlType="submit" className="register__btn">
                OK
              </Button>
            </Form>

            <Modal
              title="Change your password"
              open={isModalOpen}
              onOk={handleOk}
              onCancel={handleCancel}
            >
              <Form form={passwordForm} onFinish={handleResetPassword}>
                <Form.Item
                  label="New Password"
                  name="password"
                  rules={[
                    { required: true, message: "Please input your password!" },
                    {
                      min: 3,
                      message: "Password must be at least 3 characters long!",
                    },
                  ]}
                  hasFeedback
                >
                  <Input.Password placeholder="Password must be at least 6 characters long" />
                </Form.Item>

                <Form.Item
                  label="Confirm New Password"
                  name="confirmPassword"
                  dependencies={["password"]}
                  hasFeedback
                  rules={[
                    {
                      required: true,
                      message: "Please confirm your password!",
                    },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue("password") === value) {
                          return Promise.resolve();
                        }
                        return Promise.reject(
                          new Error("The two passwords do not match!")
                        );
                      },
                    }),
                  ]}
                >
                  <Input.Password />
                </Form.Item>
              </Form>
            </Modal>
          </div>
        )}
      </div>

      <Link to={"/login"}>
        <Button className="header__btn" onClick={() => dispatch(logout())}>
          LOGOUT
        </Button>
      </Link>
      <div className="estimatedshippingfee__destination">
        <Modal
          open={isOpen}
          title="Select location"
          onCancel={() => {
            setIsOpen(false);
          }}
          onOk={() => {
            addressForm.submit();
            setIsOpen(false);
          }}
        >
          <Form
            labelCol={{
              span: 6,
            }}
            form={addressForm}
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
    </div>
  );
}

export default Profile;
