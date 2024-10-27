import { Pagination, Table } from "antd";
import CRUDTemplate from "../../../components/crud-template";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from "../../../config/axios";

function Report() {
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
  ];

  const fetchData = async () => {
    try {
      const response = await api.get(`report?page=${page}&size=10`);
      console.log(response.data);
      setData(response.data.content);
      setTotalReport(response.data.totalElements);
    } catch (err) {
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
      />

      <Pagination
        align="end"
        total={totalReport}
        onChange={handlePageChange}
        showQuickJumper
        showTotal={(total) => `Total ${total} feedback`}
      />
    </div>
  );
}

export default Report;
