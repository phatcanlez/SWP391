import { Button, Modal, Table } from "antd";
import api from "../../../config/axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

function StaffList() {
  const [loading, setLoading] = useState(false);
  const [staff, setStaff] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);

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
  ];

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
      <Table
        dataSource={staff}
        columns={columns}
        pagination={false}
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
