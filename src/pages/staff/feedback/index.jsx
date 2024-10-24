import { Table } from "antd";
import { useState } from "react";
import api from "../../../config/axios";

function StaffFeedback() {
  const [feedback, setFeedback] = useState([]);
  const fetchFeedback = async () => {
    try {
      const response = await api.get("")
      setFeedback(response.data)
    } catch (error) {
      console.error(error)
    }
  };
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Age",
      dataIndex: "age",
      key: "age",
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
    },
  ];
  return (
    <div>
      <Table dataSource={feedback} columns={columns} />;
    </div>
  );
}

export default StaffFeedback;
