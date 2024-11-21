import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from "../../../config/axios";
import { Button, Input, Pagination, Popconfirm, Select, Table } from "antd";
import { FileSyncOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const { Option } = Select;

function Test01(path) {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [totalOrders, setTotalOrders] = useState(0);
  const [searchValue, setSearchValue] = useState("");
  const [isSearch, setIsSearch] = useState(false);
  const [searchResult, setSearchResult] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1, // Current page
    pageSize: 10, // Number of items per page
  });
  const [displayPagination, setDisplayPagination] = useState(true);
  const [finalPath, setFinalPath] = useState({
    path: path.path,
    field: path.field,
  });
  const [isFilter, setIsFilter] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("");

  const navigate = useNavigate();
  const fetchData = async () => {
    try {
      setLoading(true);
      let result;
      if (finalPath.field === "All") {
        const response = await api.get(
          `orders?page=${pagination.page - 1}&size=${pagination.pageSize}`
        );
        result = response.data.content.map((order) => ({
          orderID: order.orderID,
          name: order.name,
          date: order.status.date,
          type: order.type,
          statusInfo: order.status.statusInfo,
        }));
        setTotalOrders(response.data.totalElements);
      }
      if (finalPath.field === "Status") {
        let response;
        if (isFilter) {
          response = await api.get(`/orders/status?status=${selectedStatus}`);
        } else {
          response = await api.get(path.path);
        }
        result = response.data.map((order) => ({
          orderID: order.orderID,
          name: order.name,
          date: order.status.date,
          type: order.type,
          statusInfo: order.status.statusInfo,
        }));
        setDisplayPagination(false);
        setTotalOrders(response.data.length);
      }
      setData(result);
    } catch (err) {
      toast.error(err.response.data);
    } finally {
      setLoading(false);
    }
  };

  const status = [
    "SUCCESS",
    "FAIL",
    "PENDING",
    "WAITING",
    "APPROVED",
    "REFUNDED",
    "UNREFUND",
    "WATINGFOR2NDSTAFF",
    "PENDINGJAPAN",
    "ARRIVEDVIETNAM",
  ];
  const handleStatusChange = (status) => {
    setFinalPath({
      path: path.path,
      field: "Status",
    });
    setIsFilter(true);
    setSelectedStatus(status);
  };

  useEffect(() => {
    fetchData();
  }, [pagination, finalPath, selectedStatus]);

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
      dataIndex: "date",
      key: "date",
      render: (date) =>
        new Date(date).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        }),
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      filters: [
        { text: "DOMESTIC", value: "DOMESTIC" },
        { text: "OVERSEA", value: "OVERSEA" },
      ],
      onFilter: (value, record) => record.type.includes(value),
    },
    {
      title: "Status",
      dataIndex: "statusInfo",
      key: "statusInfo",
    },
    {
      title: "Action",
      dataIndex: "note",
      key: "note",
      fixed: "right",
      render: (record, value) =>
        `${value.statusInfo}` === "UNREFUND" ? (
          <>
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
            <Button
              onClick={() => navigate(`/dashboard/view/${value.orderID}`)}
              style={{ marginLeft: 20 }}
            >
              View
            </Button>
          </>
        ) : (
          <Button onClick={() => navigate(`/dashboard/view/${value.orderID}`)}>
            View
          </Button>
        ),
    },
  ];

  const handleSearchValueChange = (e) => {
    setSearchValue(e.target.value);
  };

  const handleSearch = async () => {
    try {
      setLoading(true);
      const response = await api.get(`orders/${searchValue}`);
      let result = [
        {
          orderID: response.data.orderID,
          name: response.data.reciverName,
          date: response.data.status[response.data.status.length - 1].date,
          statusInfo:
            response.data.status[response.data.status.length - 1].statusInfo,
        },
      ];
      console.log(result);
      setIsSearch(true);
      setSearchResult(result);
    } catch (err) {
      toast.error(err.response.data);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page, pageSize) => {
    setPagination({ page: page, pageSize: pageSize });
  };

  const handleTableChange = (pagination) => {
    setPagination(pagination);
  };

  const refund = async (value) => {
    setLoading(true);
    try {
      await api.put(`orders/refund?orderId=${value}`);
      setLoading(false);
    } catch (e) {
      console.log("Error", e);
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    setSearchValue("");
    setIsSearch(false);
    setIsFilter(false);
    setFinalPath({
      path: path.path,
      field: path.field,
    });
  };

  return (
    <>
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
        <Button onClick={handleRefresh}>ReFresh</Button>
        {path.field === "All" ? (
          <div>
            Status :{" "}
            <Select
              placeholder="Select a status"
              onChange={handleStatusChange}
              style={{ width: 200 }} // Adjust styling as needed
            >
              {status.map((status) => (
                <Option key={status} value={status}>
                  {status}
                </Option>
              ))}
            </Select>
          </div>
        ) : (
          ""
        )}
      </div>
      <Table
        dataSource={isSearch !== true ? data : searchResult}
        columns={columns}
        pagination={
          displayPagination === true
            ? false
            : {
                current: pagination.current,
                pageSize: pagination.pageSize,
                showSizeChanger: true,
              }
        }
        scroll={{
          x: "max-content",
        }}
        onChange={handleTableChange}
        loading={loading}
      />
      {displayPagination !== true ? (
        ""
      ) : (
        <Pagination
          align="end"
          onChange={handlePageChange}
          total={totalOrders}
          showSizeChanger
          showQuickJumper
          style={{ display: `${isSearch !== true ? "" : "none"}` }}
        />
      )}
    </>
  );
}

export default Test01;
