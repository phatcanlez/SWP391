import { Button, Form, Input, Modal, Pagination, Select, Table } from "antd";
import api from "../../../config/axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
const { Option } = Select;

function ManageUser() {
  const [loading, setLoading] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [data, setData] = useState([]);
  const [form] = Form.useForm();
  const [showModal, setShowModal] = useState(false);
  const [formItems, setFormItems] = useState("");
  const [totalAccount, setTotalAccount] = useState();
  const [page, setPage] = useState(0);
  const [displayPages, setDisplayPages] = useState("");

  const handleSearchValueChange = (e) => {
    setSearchValue(e.target.value);
  };

  const handleSearch = async () => {
    // Perform action with inputValue
    console.log(searchValue);
    try {
      const response = await api.get(`account/${searchValue}`);
      if (response.data !== "") {
        setData([response.data]);
        setDisplayPages("none");
        console.log(response);
        toast.success("Successfull");
      } else {
        toast.error("Not Found");
      }
    } catch (err) {
      toast.error(err.response.data);
    }
  };

  let stt = 1;
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      render: () => <>{stt++}</>,
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      filters: [
        {
          text: "CUSTOMER",
          value: "CUSTOMER",
        },
        {
          text: "STAFF",
          value: "STAFF",
        },
        {
          text: "MANAGER",
          value: "MANAGER",
        },
      ],
      onFilter: (value, record) => record.role.indexOf(value) === 0,
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Username",
      dataIndex: "username",
      key: "username",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "PhoneNumber",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "Action",
      dataIndex: "id",
      key: "id",
      fixed: "right",
      render: (id, Item) => (
        <>
          <Button
            type="primary"
            onClick={() => {
              setFormItems("Edit");
              setShowModal(true);
              form.setFieldsValue(Item);
            }}
          >
            Edit
          </Button>
        </>
      ),
    },
  ];

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await api.get(`account?page=${page}&size=10`);
      console.log(response.data);
      setData(response.data.content);
      setTotalAccount(response.data.totalElements);
      setLoading(false);
    } catch (err) {
      toast.error(err.response.data);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    handleSearch();
    if (page) {
      //s
    }
  }, [page]);

  const handleSubmit = async (values) => {
    console.log(values);
    try {
      setLoading(true);
      if (values.id) {
        const response = await api.patch(`account`, values);
        console.log(response);
      } else {
        const response = await api.post(`register`, values);
        console.log(response);
      }

      toast.success("Successfull");
      fetchData();
      form.resetFields();
      setShowModal(false);
    } catch (err) {
      toast.error(err.response.data);
    } finally {
      setLoading(false);
    }
  };

  const formItemsRegister = (
    <>
      <Form.Item name="id" hidden>
        <Input />
      </Form.Item>
      <Form.Item name="name" label="Name" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item name="username" label="Username" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item
        label="Phone number"
        name="phoneNumber"
        rules={[
          {
            required: true,
            pattern: /^(?:\d*)$/,

            message: "Invalid phone number",
          },
          {
            required: true,
            pattern: /^[\d]{10,11}$/,
            message: "Invalid phone number",
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item label="Address" name="address" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item
        label="Password"
        name="password"
        rules={[
          { required: true, message: "Please input your password!" },
          { min: 3, message: "Password must be at least 3 characters long!" },
        ]}
        hasFeedback
      >
        <Input.Password placeholder="Password must be at least 3 characters long" />
      </Form.Item>

      <Form.Item
        label="Confirm Password"
        name="confirmPassword"
        dependencies={["password"]}
        hasFeedback
        rules={[
          { required: true, message: "Please confirm your password!" },
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
      <Form.Item
        label="Email"
        name="email"
        rules={[
          { required: true, message: "Please input your email!" },
          {
            type: "email",
            message: "Please enter a valid email!",
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="Role"
        name="role"
        rules={[{ required: true, message: "Please Select Role" }]}
      >
        <Select showSearch style={{ width: 200 }} placeholder="Select Role">
          <Option value="CUSTOMER">CUSTOMER</Option>
          <Option value="STAFF">STAFF</Option>
          <Option value="MANAGER">MANAGER</Option>
        </Select>
      </Form.Item>
    </>
  );

  const formItemsEdit = (
    <>
      <Form.Item name="id" hidden>
        <Input />
      </Form.Item>
      <Form.Item name="name" label="Name" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item
        label="Email"
        name="email"
        rules={[
          { required: true, message: "Please input your email!" },
          {
            type: "email",
            message: "Please enter a valid email!",
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="Phone number"
        name="phoneNumber"
        rules={[
          {
            required: true,
            pattern: /^(?:\d*)$/,

            message: "Invalid phone number",
          },
          {
            required: true,
            pattern: /^[\d]{10,11}$/,
            message: "Invalid phone number",
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item label="Address" name="address" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item
        label="Role"
        name="role"
        rules={[{ required: true, message: "Please Select Role" }]}
      >
        <Select showSearch style={{ width: 200 }} placeholder="Select Role">
          <Option value="CUSTOMER">CUSTOMER</Option>
          <Option value="STAFF">STAFF</Option>
          <Option value="MANAGER">MANAGER</Option>
        </Select>
      </Form.Item>
    </>
  );

  const handlePageChange = (page) => {
    setPage(page - 1);
  };

  return (
    <div style={{ gap: "30px" }}>
      <div style={{ display: "flex" }}>
        <div>
          <Button
            onClick={() => {
              setFormItems("Add"), setShowModal(true);
            }}
          >
            Register new account
          </Button>
        </div>
        <div style={{ display: "flex", gap: "20px", paddingLeft: "20px" }}>
          <Input
            style={{ width: "200px" }}
            placeholder="Input id"
            value={searchValue}
            onChange={handleSearchValueChange}
          />
          <Button onClick={handleSearch}>Search</Button>
          <Button
            onClick={() => {
              fetchData(), setDisplayPages(""), setSearchValue("");
            }}
          >
            ReFresh
          </Button>
        </div>
      </div>

      <Table
        dataSource={data}
        columns={columns}
        pagination={false}
        scroll={{
          x: "max-content",
        }}
        loading={loading}
      />

      <Pagination
        align="end"
        total={totalAccount}
        onChange={handlePageChange}
        showQuickJumper
        showTotal={(total) => `Total ${total} accounts`}
        style={{ display: `${displayPages}` }}
      />

      <Modal
        open={showModal}
        onCancel={() => {
          setShowModal(false), form.resetFields();
        }}
        title={formItems}
        onOk={() => form.submit()}
        confirmLoading={loading}
      >
        <Form form={form} labelCol={{ span: 24 }} onFinish={handleSubmit}>
          {formItems === "Add" ? formItemsRegister : ""}
          {formItems === "Edit" ? formItemsEdit : ""}
        </Form>
      </Modal>
    </div>
  );
}

export default ManageUser;
