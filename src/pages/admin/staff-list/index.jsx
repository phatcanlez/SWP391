import { Button, Input, Modal, Table } from "antd";
import api from "../../../config/axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

function StaffList() {
  const [loading, setLoading] = useState(false);
  const [staff, setStaff] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [isSearch, setIsSearch] = useState(false);
  const [searchResult, setSearchResult] = useState([]);
  const [searchValue, setSearchValue] = useState("");
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
              handleOpenModal(Item.name);
            }}
          >
            View
          </Button>
        </>
      ),
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

  const handleOpenModal = (staff) => {
    setSelectedStaff(staff);
    setShowModal(true);
  };
  console.log(selectedStaff);
  const handelCancel = () => {
    setShowModal(false);
    setSelectedStaff(null);
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
      />

      <Modal
        title="Staff Detail"
        open={showModal}
        onCancel={handelCancel}
      ></Modal>
    </div>
  );
}

export default StaffList;
