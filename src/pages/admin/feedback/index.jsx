import { toast } from "react-toastify";
import api from "../../../config/axios";
import { useEffect, useState } from "react";
import { Button, Pagination, Rate, Table } from "antd";
import { useNavigate } from "react-router-dom";

function Feedback() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [totalFeedback, setTotalFeedback] = useState();
  const [page, setPage] = useState(0);

  const navigate = useNavigate();
  const columns = [
    {
      title: "ID",
      dataIndex: "feedbackId",
      key: "feedbackId",
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
      fixed: "right",
      render: (record, value) => (
        <Button onClick={() => navigate(`/dashboard/view/${value.orderID}`)}>
          View
        </Button>
      ),
    },
  ];

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await api.get(`feedback?page=${page}&size=10`);
      console.log(response.data);
      setData(response.data.content);
      setTotalFeedback(response.data.totalElements);
      setLoading(false);
    } catch (err) {
      toast.error(err.response.data);
      setLoading(false);
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
        total={totalFeedback}
        onChange={handlePageChange}
        showQuickJumper
        showTotal={(total) => `Total ${total} feedback`}
      />
    </div>
  );
}

export default Feedback;
