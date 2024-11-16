import { Button, Input, Popconfirm, Table } from "antd";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../../config/axios";
import { FileSyncOutlined } from "@ant-design/icons";
import { toast } from "react-toastify";

function AdminOrder({ path, isPaging = false }) {
  const [order, setOrder] = useState([]);
  const [loading, setLoading] = useState(false); // State to handle loading status
  const [searchValue, setSearchValue] = useState("");
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
      console.log(response.data);
      let finalData = null;
      if (isPaging) {
        finalData = response.data.content;
        setTotalOrders(response.data.totalElements); // Assuming API provides total elements
      } else {
        setTotalOrders(response.data.length);
        finalData = response.data;
      }
      setOrder(finalData); // Assuming your API returns orders in 'content'
      setLoading(false);
    } catch (e) {
      console.log("Error", e);
      setLoading(false);
    }
  };

  const handleSearchValueChange = (e) => {
    setSearchValue(e.target.value);
  };

  const handleSearch = async () => {
    // Perform action with inputValue
    console.log(searchValue);
    try {
      if (!searchValue.trim()) {
        toast.error("Input OrderId cannot be empty!"); // Show error message
        return; // Prevent further action
      } else {
        if (path === "/orders/status?status=WAITING");
        const response = await api.get("/orders/status?status=WAITING");
        let result = response.data.find((o) => o.orderID === searchValue);
        console.log(result);
        if (result !== "") {
          setOrder([result]);
          toast.success("Successfull");
        } else {
          toast.error("Not Found");
        }
      }
    } catch (err) {
      toast.error(err.response.data);
    }
  };

  const refund = async (value) => {
    setLoading(true);
    console.log(value);
    try {
      await api.put(`orders/refund?orderId=${value}`);
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
      render: (record, value) =>
        `${path}` === "orders/status?status=UNREFUND" ? (
          <Popconfirm
            title="Accept Refund"
            description="Are you sure to accept this refund?"
            okText="Yes"
            cancelText="No"
            onConfirm={() => refund(value.orderID)}
            loading={loading}
          >
            <Button>Accept</Button>
          </Popconfirm>
        ) : (
          // <Popconfirm
          //   title="Accept Refund"
          //   description="Are you sure to accept this refund?"
          //   okText="Yes"
          //   cancelText="No"
          //   onConfirm={() => refund(value.orderID)}
          //   loading={loading}
          // >
          //   <Button>View</Button>
          // </Popconfirm>
          <Button onClick={() => navigate(`/dashboard/view/${value.orderID}`)}>
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
        <Input
          style={{ width: "200px" }}
          placeholder="Input OrderId"
          value={searchValue}
          onChange={handleSearchValueChange}
        />
        <Button onClick={handleSearch}>Search</Button>
        <Button
          onClick={() => {
            fetchOrder(), setSearchValue("");
          }}
        >
          ReFresh
        </Button>
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

export default AdminOrder;
