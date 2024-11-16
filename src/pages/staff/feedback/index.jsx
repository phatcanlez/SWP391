import { Button, Rate, Table } from "antd";
import { useEffect, useState } from "react";
import api from "../../../config/axios";
import { FileSyncOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

function StaffFeedback() {
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
      const response = await api.get(
        `/feedback?page=${page - 1}&size=${pageSize}`
      );
      console.log(response);
      let finalData = null;
      finalData = response.data.content;
      setTotalOrders(response.data.totalElements);
      setOrder(finalData);
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
      title: "Order ID",
      dataIndex: "orderID",
      key: "orderID",
    },
    {
      title: "Time",
      dataIndex: "time",
      key: "time",
      render: (time) => {
        return time.split(" ")[0]; // Cách đơn giản nhất, cắt chuỗi
      },
    },
    {
      title: "Rating",
      dataIndex: "rating",
      key: "rating",
      render: (fb, order) => <Rate disabled value={order?.rating} />,
    },
    {
      title: "Comment",
      dataIndex: "comment",
      key: "comment",
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

export default StaffFeedback;
