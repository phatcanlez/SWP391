import { Button, Form, Input, Modal, Popconfirm, Table } from "antd";
import api from "../../../config/axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

function ManageCustomers() {
  const [loading, setLoading] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [data, setData] = useState([]);
  const [searchResult, setSearchResult] = useState([]);
  const [form] = Form.useForm();
  const [showModal, setShowModal] = useState(false);
  const [formItems, setFormItems] = useState("");
  const [totalAccount, setTotalAccount] = useState();
  const [pagination, setPagination] = useState({
    current: 1, // Current page
    pageSize: 10, // Number of items per page
  });
  const [isSearch, setIsSearch] = useState(false);

  const handleSearchValueChange = (e) => {
    setSearchValue(e.target.value);
    let result = data.filter((account) =>
      account.username.includes(e.target.value)
    );
    setIsSearch(true);
    setSearchResult(result);
  };

  const handleStatusChange = async (value) => {
    console.log(!value.status);
    try {
      setLoading(true);
      await api.patch(`account`, {
        id: value.id,
        status: !value.status,
      });
      toast.success("Successfull");
      fetchData();
    } catch (err) {
      toast.error(err.response.data);
    } finally {
      setLoading(false);
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
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => <>{status === true ? "Active" : "InActive"}</>,
      filters: [
        {
          text: "Active",
          value: true,
        },
        {
          text: "InActive",
          value: false,
        },
      ],
      onFilter: (value, record) => record.status === value,
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
          <Popconfirm
            title={
              Item.status === true
                ? "Are you sure you want to ban this Account?"
                : "Are you sure you want to activate this Account?"
            }
            onConfirm={() => handleStatusChange(Item)} // Call the status change function on confirmation
            okText="Yes"
            cancelText="No"
          >
            <Button
              style={{ backgroundColor: "red", marginLeft: 10, color: "#fff" }}
            >
              {Item.status === true ? "Ban" : "Active"}
            </Button>
          </Popconfirm>
        </>
      ),
    },
  ];

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await api.get("account/role?role=CUSTOMER");
      console.log(response.data);
      setData(response.data);
      setTotalAccount(response.data.length);
      setLoading(false);
    } catch (err) {
      toast.error(err.response.data);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (values) => {
    console.log(values);
    try {
      setLoading(true);
      if (values.id) {
        await api.patch(`account`, values);
      } else {
        await api.post(`register`, values);
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
    </>
  );

  const handleTableChange = (pagination) => {
    setPagination(pagination);
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
            placeholder="Username"
            value={searchValue}
            onChange={handleSearchValueChange}
          />
        </div>
      </div>

      <Table
        dataSource={isSearch === false ? data : searchResult}
        columns={columns}
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: totalAccount,
          showSizeChanger: true,
        }}
        scroll={{
          x: "max-content",
        }}
        onChange={handleTableChange}
        loading={loading}
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

export default ManageCustomers;
