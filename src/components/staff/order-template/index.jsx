import { Button, Table } from "antd";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../config/axios";
import { FileSyncOutlined } from "@ant-design/icons";

function StaffOrder({ path, isPaging = false, isWaiting = false }) {
  const [order, setOrder] = useState([]);
  const [loading, setLoading] = useState(false); // State to handle loading status
  const [totalOrders, setTotalOrders] = useState(0); // Total number of orders
  const [pagination, setPagination] = useState({
    current: 1, // Current page
    pageSize: 10, // Number of items per page
  });

  const navigate = useNavigate();

  const fetchOrder = async (page = 1, pageSize = 10) => {
    setLoading(true);
    try {
      const finalPath = isPaging
        ? `${path}?page=${page - 1}&size=${pageSize}`
        : path;
      const response = await api.get(finalPath);
      console.log(response);
      let finalData = null;
      if (isPaging) {
        finalData = response.data.content;
        setTotalOrders(response.data.totalElements); // Assuming API provides total elements
      } else {
        finalData = response.data;
        console.log(finalData);
        setTotalOrders(response.data?.length); 
      }
      setOrder(finalData); // Assuming your API returns orders in 'content'
      setLoading(false);
    } catch (e) {
      console.log("Error", e);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder(pagination.current, pagination.pageSize);
  }, [pagination]);

  const handleTableChange = (pagination) => {
    console.log(pagination);
    setPagination(pagination);
  };

  
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
      dataIndex: "status",
      key: "status.date",
      render: (status) => {
        if (!status?.date) return "-";
        return status.date.split("T")[0]; // Cắt chuỗi tại ký tự T
      },
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
        <Button onClick={() => navigate(
          isWaiting 
            ? `/staff/view/waiting-for-second-staff/${value.orderID}`
            : `/staff/view/${value.orderID}`
        )}>
          View
        </Button>
      ),
    },
  ];

  return (
    <div>
      <div className="note">
        <FileSyncOutlined size={100} style={{ fontSize: 23, color: "#000" }} />
        <p>
          Have <span className="color">{totalOrders} orders</span> in this list
        </p>
      </div>
      <Table
        dataSource={order}
        columns={columns}
        rowKey="orderID"
        loading={loading}
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: totalOrders,
          showSizeChanger: true,
        }}
        onChange={handleTableChange}
      />
    </div>
  );
}

export default StaffOrder;
