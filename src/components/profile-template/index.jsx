import { useEffect, useState } from "react";
import userr from "../../img/user.png";
import "./index.css";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Button, Form, Input, Modal } from "antd";
import { logout } from "../../redux/features/userSlice";
import { toast } from "react-toastify";
import api from "../../config/axios";
import { SettingOutlined } from "@ant-design/icons";
function Profile() {
  const [form] = Form.useForm();
  const [checkForm] = Form.useForm();
  const user = useSelector((store) => store);
  console.log(user);

  const dispatch = useDispatch();
  const [showForm1, setShowForm1] = useState("fasle");
  const [showForm2, setShowForm2] = useState("fasle");
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
      form.setFieldsValue({
        name: value.name,
        username: value.username,
        email: value.email,
        phoneNumber: value.phoneNumber,
        address: value.address,
      });
      setUserValue(value);
    } catch (error) {
      toast.error(error.data, "Không thể tải dữ liệu người dùng.");
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const handleResetValue = async (value) => {
    try {
      value.status = user.user.status;
      await api.put(`account/${user.user.id}`, value);
      fetchUserData();
    } catch (error) {
      toast.error(error.response.data);
    }
  };
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
                  <Input type="text" />
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
    </div>
  );
}

export default Profile;
