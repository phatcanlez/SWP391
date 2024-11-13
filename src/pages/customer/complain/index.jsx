import React, { useState, useEffect } from "react";
import { Table, Card, Tag, Typography, Space, Modal } from "antd";
import { useSelector } from "react-redux";
import api from "../../../config/axios";
import { toast } from "react-toastify";

const { Title, Text } = Typography;

function CustomerComplain() {
  const [complains, setComplains] = useState([]);
  const [loading, setLoading] = useState(false);
  const user = useSelector((store) => store.user);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState({
    title: "",
    content: "",
  });

  const showModal = (title, content) => {
    setModalContent({
      title,
      content,
    });
    setModalVisible(true);
  };

  const fetchCustomerComplains = async () => {
    setLoading(true);
    try {
      const response = await api.get(`report/customer?customerId=${user.id}`);
      setComplains(response.data);
    } catch (error) {
      toast.error("Failed to load complains");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) {
      fetchCustomerComplains();
    }
  }, [user?.id]);

  const columns = [
    {
      title: "Order ID",
      dataIndex: "orderId",
      key: "orderId",
      width: 250,
    },
    {
      title: "Report Date",
      dataIndex: "time",
      key: "time",
      width: 150,
      render: (time) => new Date(time).toLocaleString(),
    },
    {
      title: "Content",
      dataIndex: "reportContent",
      key: "reportContent",
      ellipsis: true,
      width: 350,
      render: (text) => (
        <Text
          style={{ cursor: "pointer", color: "#000000" }}
          onClick={() => showModal("Report Content", text)}
        >
          {text}
        </Text>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 100,
      render: (status) => (
        <Tag color={status === "REPLIED" ? "green" : "orange"}>{status}</Tag>
      ),
    },
    {
      title: "Staff Response",
      dataIndex: "empReply",
      key: "empReply",
      ellipsis: true,
      render: (text) => (
        <Text
          style={{ cursor: "pointer", color: "#000000" }}
          onClick={() => showModal("Staff Response", text || "No response yet")}
        >
          {text || "No response yet"}
        </Text>
      ),
    },
  ];

  return (
    <div style={{ padding: "24px" }}>
      <Card>
        <Space direction="vertical" style={{ width: "100%" }}>
          <Title level={3} style={{ color: "#E25822" }}>
            My Complains
          </Title>

          <Table
            columns={columns}
            dataSource={complains}
            loading={loading}
            rowKey={(record) => record.id}
            pagination={{
              defaultPageSize: 10,
              showSizeChanger: true,
              showTotal: (total) => `Total ${total} complains`,
            }}
          />
        </Space>
      </Card>

      <Modal
        title={modalContent.title}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
      >
        <div
          style={{
            maxHeight: "60vh",
            overflowY: "auto",
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
          }}
        >
          {modalContent.content}
        </div>
      </Modal>
    </div>
  );
}

export default CustomerComplain;
