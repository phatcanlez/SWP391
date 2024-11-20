import { Button, Table, Input } from "antd";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../config/axios";
import { FileSyncOutlined } from "@ant-design/icons";


const { Search } = Input;

function StaffOrder({ path, isPaging = false }) {
  const [order, setOrder] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalOrders, setTotalOrders] = useState(0);
  const [searchId, setSearchId] = useState("");
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  });

  const navigate = useNavigate();

  const fetchOrder = async (page = 1, pageSize = 10) => {
    setLoading(true);
    try {
      // If searching by ID, use different API endpoint
      if (searchId) {
        const response = await api.get(`/orders/${searchId}`);
        setOrder([response.data]); // Wrap single order in array
        setTotalOrders(1);
      } else {
        const finalPath = isPaging
          ? `${path}?page=${page - 1}&size=${pageSize}`
          : path;
        const response = await api.get(finalPath);

        let finalData = null;
        if (isPaging) {
          finalData = response.data.content;
          setTotalOrders(response.data.totalElements);
        } else {
          finalData = response.data;
          setTotalOrders(response.data?.length);
        }
        setOrder(finalData);
      }
    } catch (e) {
      console.error("Error fetching orders:", e);
      setOrder([]);
      setTotalOrders(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder(pagination.current, pagination.pageSize);
  }, [pagination, searchId]);

  const handleSearch = (value) => {
    setSearchId(value);
    setPagination({ ...pagination, current: 1 }); // Reset to first page when searching
  };

  const handleTableChange = (pagination) => {
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
      <div
        style={{
          marginBottom: 24,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: "#fff",
          padding: "20px",
          borderRadius: "8px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        }}
      >
        <div style={{ flex: 1, maxWidth: 500 }}>
          <Search
            placeholder="Enter Order ID to search..."
            allowClear
            enterButton={
              <Button
                type="primary"
                style={{
                  backgroundColor: "#e25822",
                  borderColor: "#e25822",
                  height: "40px",
                  borderRadius: "0 6px 6px 0",
                }}
              >
                Search
              </Button>
            }
            size="large"
            onSearch={handleSearch}
            style={{
              width: "100%",
              boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
            }}
          />
        </div>

        <div
          className="note"
          style={{ marginLeft: 20, display: "flex", alignItems: "center" }}
        >
          <FileSyncOutlined
            style={{ fontSize: 20, color: "#e25822", marginRight: 8 }}
          />
          <p style={{ margin: 0 }}>
            Have{" "}
            <span className="color" style={{ fontWeight: 600 }}>
              {totalOrders} orders
            </span>{" "}
            in this list
          </p>
        </div>
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
        style={{
          backgroundColor: "#fff",
          borderRadius: "8px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        }}
      />
    </div>
  );
}

export default StaffOrder;
