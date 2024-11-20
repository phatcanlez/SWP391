import { Pagination, Table } from "antd";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from "../../../config/axios";

function Report() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [totalReport, setTotalReport] = useState();
  const [page, setPage] = useState(0);
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Time",
      dataIndex: "time",
      key: "time",
      render: (time) =>
        new Date(time).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        }),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      filters: [
        {
          text: "REPLIED",
          value: "REPLIED",
        },
        {
          text: "UNREPLIED",
          value: "UNREPLIED",
        },
      ],
      onFilter: (value, record) => record.status.indexOf(value) === 0,
    },
    {
      title: "Content",
      dataIndex: "reportContent",
      key: "reportContent",
    },
    {
      title: "employeeId",
      dataIndex: "employeeId",
      key: "employeeId",
    },
    {
      title: "empReply",
      dataIndex: "empReply",
      key: "empReply",
    },
    {
      title: "orderId",
      dataIndex: "orderId",
      key: "orderId",
    },
  ];

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await api.get(`report/page?page=${page}&size=10`);
      console.log(response.data);
      setData(response.data.content);
      setTotalReport(response.data.totalElements);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      toast.error(err.response.data);
    }
  };

  useEffect(() => {
    fetchData();
    if (page) {
      //s
    }
  }, [page]);

  const handlePageChange = (page) => {
    setPage(page - 1);
  };

  return (
    <div>
      <Table
        dataSource={data}
        columns={columns}
        pagination={false}
        scroll={{
          x: "max-content",
        }}
        loading={loading}
      />

      <Pagination
        align="end"
        total={totalReport}
        onChange={handlePageChange}
        showQuickJumper
        showTotal={(total) => `Total ${total} reports`}
      />
    </div>
  );
}

export default Report;
