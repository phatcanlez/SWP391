import { Button, Input, Modal, Popconfirm, Table } from "antd";
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

  const handleStatusChange = async (value) => {
    console.log(!value.status);
    try {
      setLoading(true);
      await api.patch(`account`, {
        id: value.id,
        status: !value.status,
      });
      toast.success("Successfull");
      fetchStaffData();
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
              handleOpenModal(Item.id);
            }}
          >
            View
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
    // setSelectedStaff(staff);
    setShowModal(true);
    try {
      const response1 = await api.get(
        `orders/status-emp?status=PENDING&empId=${staff}`
      );
      const response2 = await api.get(
        `orders/status-emp-total?status=SUCCESS&empId=${staff}`
      );
      let responsibility = "Not Working on any Order";
      let total = 0;
      if (response1.data.length > 0) {
        responsibility = response1.data[0].orderID;
      }
      if (response2.data.total > 0) {
        total = response2.data.total;
      }
      console.log(response1.data);
      console.log(response2.data);
      console.log(responsibility);
      setSelectedStaff({ responsibility: responsibility, total: total });
    } catch (err) {
      toast.error(err.response.data);
    }
  };
  console.log(selectedStaff);
  const handelCancel = () => {
    setShowModal(false);
    setSelectedStaff([]);
  };

  return (
    <div>
      <div style={{ display: "flex", gap: "20px", paddingLeft: "20px" }}>
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
        onOk={() => setShowModal(false)}
      >
        <p>Working on Order : {selectedStaff.responsibility}</p>
        <p>Total Completed Orders : {selectedStaff.total}</p>
      </Modal>
    </div>
  );
}

export default StaffList;
