import { Button, Table } from "antd";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../config/axios";
import { FileSyncOutlined } from "@ant-design/icons";

function StaffOrder({ path }) {
  const [order, setOrder] = useState([]);

  const navigate = useNavigate();
  const [count, setCount] = useState(0)

  const fetchOrder = async () => {
    try {
      const response = await api.get(`${path}`);
      
      setOrder(response.data);
      console.log(response.data);
      setCount(response.data.length)
      
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
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Created Date",
      key: "status.date",
      render: (record) => record.status?.date,
    },
    {
      title: "Status",
      key: "status.statusInfo",
      render: (record) => record.status?.statusInfo,
    },
    {
      title: "",
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
      <div className="note">
        <FileSyncOutlined size={100} style={{ fontSize: 23, color: "#000" }} />
        <p>Have <span className="color">{count} orders</span> in this list</p>
      </div>
      <Table dataSource={order} columns={columns} />
    </div>
  );
}

export default StaffOrder;
