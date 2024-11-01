import { useEffect, useState } from "react";

import "../overview/index.css";
import { Card, Col, Row, Statistic, Tooltip } from "antd";

import { toast } from "react-toastify";
import api from "../../../config/axios";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  XAxis,
  YAxis,
} from "recharts";

function Overview() {
  const [loading, setLoading] = useState(false);
  const [data1, setData1] = useState();
  const [data2, setData2] = useState();
  const [data3, setData3] = useState();

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await api.get("dashboard");
      const responseOrder1 = await api.get("dashboard-total-order");
      const responseOrder2 = await api.get("dashboard-order-success");
      const responseOrder3 = await api.get("dashboard-order-fail");
      const responseRevenue = await api.get("dashboard-payment-revenue");

      setData1(response.data);
      setData2([
        ...responseOrder1.data.totalOrderByMonth.map((order1) => ({
          month: order1.month,
          totalOrder: order1?.count || 0,
          totalOrderSuccess:
            responseOrder2.data.totalOrderSuccess.find(
              (order2) => order2.month === order1.month
            )?.count || 0,
          totalOrderFail:
            responseOrder3.data.totalOrderFail.find(
              (order3) => order3.month === order1.month
            )?.count || 0,
        })),
      ]);
      setData3(responseRevenue.data.monthlyRevenue);
      setLoading(false);
    } catch (err) {
      toast.error(err.response);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      <Row gutter={16}>
        <Col span={7}>
          <Card bordered={false} className="custom-card" loading={loading}>
            <Statistic
              title="Total Account"
              value={data1?.totalAccount}
              valueStyle={{
                color: "#3f8600",
              }}
              suffix="Accounts"
            />
          </Card>
        </Col>
        <Col span={5}>
          <Card
            bordered={false}
            className="custom-card"
            style={{ alignContent: "center" }}
            loading={loading}
          >
            <p>Customer : {data1?.totalCustomer}</p>
            <p>Staff : {data1?.totalStaff}</p>
            <p>Manager : {data1?.totalManager}</p>
          </Card>
        </Col>
        <Col span={7}>
          <Card bordered={false} className="custom-card" loading={loading}>
            <Statistic
              title="Total Feedback"
              value={data1?.totalFeedback}
              valueStyle={{
                color: "#cf1322",
              }}
              suffix="Feedbacks"
            />
          </Card>
        </Col>
        <Col span={5}>
          <Card
            bordered={false}
            className="custom-card"
            style={{ alignContent: "center" }}
            loading={loading}
          >
            <p>Avarage Rating : {data1?.feedbackAvarageRating}</p>
            <p>Less Than 4 : {data1?.totalFeedbackLessThan4}</p>
            <p>Greater Than 4 : {data1?.totalFeedbackGreaterThan4}</p>
          </Card>
        </Col>
      </Row>
      <div
        style={{
          marginTop: 30,
          display: "flex",
          justifyContent: "space-evenly",
        }}
      >
        <LineChart
          width={500}
          height={250}
          data={data2}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="totalOrder" stroke="#8884d8" />
          <Line type="monotone" dataKey="totalOrderSuccess" stroke="#82ca9d" />
          <Line type="monotone" dataKey="totalOrderFail" stroke="red" />
        </LineChart>
        <BarChart width={500} height={250} data={data3}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="pv" fill="#8884d8" />
        </BarChart>
      </div>
    </div>
  );
}

export default Overview;
