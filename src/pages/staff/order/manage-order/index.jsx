import { Button, Input, Table } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../../../config/axios";
import { useEffect, useState } from "react";
import { RightOutlined } from "@ant-design/icons";

function StaffOrder() {
  const [order, setOrder] = useState([]);
  const navigate = useNavigate();
  const fetchOrder = async () => {
    try {
      const response = await api.get("/orders");

      setOrder(response.data);
      console.log(response.data);
    } catch (e) {
      console.log("Error", e);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, []);

  const columns = [
    {
      title: "ID",
      dataIndex: "orderID",
      key: "orderID",
    },
    {
      title: "Customer",
      key: "account.username",
      render: (record) => record.account?.username,
    },
    {
      title: "Created Date",
      key: "status.date",
      render: (record) => record.status?.[0]?.date,
    },
    {
      title: "Status",
      key: "status.statusInfo",
      render: (record) => record.status?.[0]?.statusInfo,
    },
    {
      title: "View",
      dataIndex: "note",
      key: "note",
      render: (record, value) => (
        <Button onClick={() => navigate(`/staff/view/${value.orderID}`)}>
          View
        </Button>
      ),
    },
  ];

  return (
    <div>
      <Table dataSource={order} columns={columns} />
    </div>
  );
}

export default StaffOrder;
