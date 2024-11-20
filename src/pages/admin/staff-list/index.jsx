import { Button, Form, Input, Modal, Popconfirm, Table } from "antd";
import api from "../../../config/axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

function StaffList() {
  const [loading, setLoading] = useState(false);
  const [staff, setStaff] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState([]);
  const [isSearch, setIsSearch] = useState(false);
  const [searchResult, setSearchResult] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [items, setItems] = useState("");
  const [form] = Form.useForm();

  const handleStatusChange = async (value) => {
    try {
      setLoading(true);
      let workingStatus = [
        "PENDING",
        "APPROVED",
        "WATINGFOR2NDSTAFF",
        "PENDINGJAPAN",
        "ARRIVEDVIETNAM",
        "PENDINGVIETNAM",
      ];
      let result = [];
      let isWorking = false;
      const response1 = workingStatus.map(async (status) => {
        const response = await api.get(
          `orders/status-emp?status=${status}&empId=${value.id}`
        );
        return response.data;
      });
      result = await Promise.all(response1);
      result.forEach((data) => {
        if (data && data.length > 0) {
          console.log(data[0].orderID);
          isWorking = true;
        }
      });
      if (!isWorking) {
        await api.patch(`account`, {
          id: value.id,
          status: !value.status,
        });
        toast.success("Successfull");
        fetchStaffData();
      } else {
        Modal.info({
          title: "Ongoing Orders",
          content: (
            <div>
              <p>There are ongoing orders in progress.</p>
            </div>
          ),
          onOk() {}, // You can define what happens when the modal is closed
        });
      }
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
      title: "Staff Details",
      dataIndex: "id",
      key: "id",
      render: (id, Item) => (
        <>
          <Button
            type="primary"
            onClick={() => {
              handleOpenModal(Item.id), setItems("details");
            }}
          >
            View
          </Button>
        </>
      ),
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
              setItems("edit");
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

  const handleSearchValueChange = (e) => {
    setSearchValue(e.target.value);
    let result = staff.filter((account) =>
      account.username.includes(e.target.value)
    );
    setIsSearch(true);
    setSearchResult(result);
  };

  const fetchStaffData = async () => {
    setLoading(true);
    try {
      const response = await api.get(`account/role?role=STAFF`);
      setStaff(response.data);
      setLoading(false);
    } catch (err) {
      toast.error(err.response.data);
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchStaffData();
  }, []);

  const handleOpenModal = async (staff) => {
    setShowModal(true);
    try {
      let workingStatus = [
        "PENDING",
        "APPROVED",
        "WATINGFOR2NDSTAFF",
        "PENDINGJAPAN",
        "ARRIVEDVIETNAM",
        "PENDINGVIETNAM",
      ];
      let result = [];
      const response1 = workingStatus.map(async (status) => {
        const response = await api.get(
          `orders/status-emp?status=${status}&empId=${staff}`
        );
        return response.data;
      });
      const response2 = await api.get(
        `orders/status-emp-total?status=SUCCESS&empId=${staff}`
      );
      let responsibility = "Not Working on any Order";
      let total = 0;
      result = await Promise.all(response1);
      console.log(result);
      result.forEach((data) => {
        if (data && data.length > 0) {
          console.log(data);
          responsibility = data[0].orderID;
        }
      });
      if (response2.data.total > 0) {
        total = response2.data.total;
      }
      setSelectedStaff({ responsibility: responsibility, total: total });
    } catch (err) {
      toast.error(err.response.data);
    }
  };
  const handelCancel = () => {
    setShowModal(false);
    setSelectedStaff([]);
    form.resetFields();
  };

  const registerStaff = (
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

  const staffDetails = (
    <>
      <p>Working on Order : {selectedStaff.responsibility}</p>
      <p>Total Completed Orders : {selectedStaff.total}</p>
    </>
  );

  const editStaff = (
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

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      console.log(values);
      if (values.id) {
        await api.patch(`account`, values);
      } else {
        await api.post(`register`, { ...values, role: "STAFF" });
      }
      toast.success("Successfull");
      fetchStaffData();
      form.resetFields();
      setShowModal(false);
    } catch (err) {
      toast.error(err.response.data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div style={{ display: "flex", gap: "20px" }}>
        <Button
          onClick={() => {
            setItems("add"), setShowModal(true);
          }}
        >
          Register new account
        </Button>
        <Input
          style={{ width: "200px" }}
          placeholder="Username"
          value={searchValue}
          onChange={handleSearchValueChange}
        />
      </div>
      <Table
        dataSource={isSearch === false ? staff : searchResult}
        columns={columns}
        pagination={true}
        loading={loading}
        scroll={{
          x: "max-content",
        }}
      />

      <Modal
        title="Staff Detail"
        open={showModal}
        onCancel={handelCancel}
        onOk={
          items === "details" ? () => setShowModal(false) : () => form.submit()
        }
        loading={loading}
      >
        {items === "details" ? (
          staffDetails
        ) : (
          <Form form={form} labelCol={{ span: 24 }} onFinish={handleSubmit}>
            {items === "add" ? registerStaff : ""}
            {items === "edit" ? editStaff : ""}
          </Form>
        )}
      </Modal>
    </div>
  );
}

export default StaffList;
