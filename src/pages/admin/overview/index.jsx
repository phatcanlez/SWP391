import { useEffect, useState } from "react";
import { Card, Col, Row, Statistic, Tooltip } from "antd";
import "./index.css";
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
import axios from "axios";

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
      // const responseRevenue = await axios.get(
      //   "https://66e55be25cc7f9b6273d1829.mockapi.io/api/v1/Status"
      // );

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
      // const testdata = await axios.get(
      //   "https://66e55be25cc7f9b6273d1829.mockapi.io/api/v1/Movie"
      // );
      // setData2(testdata.data);
      setData3(
        responseRevenue.data.monthlyRevenue.sort(
          (a, b) =>
            new Date(a.day.split("/")[1], a.day.split("/")[0] - 1) -
            new Date(b.day.split("/")[1], b.day.split("/")[0] - 1)
        )
      );
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
        <Col span={6}>
          <Card bordered={false} className="card-style" loading={loading}>
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
            className="card-style"
            style={{ alignContent: "center" }}
            loading={loading}
          >
            <p style={{ color: "red" }}>Account Details</p>
            <p>Customer : {data1?.totalCustomer}</p>
            <p>Staff : {data1?.totalStaff}</p>
            <p>Manager : {data1?.totalManager}</p>
          </Card>
        </Col>
        <Col span={7}>
          <Card bordered={false} className="card-style" loading={loading}>
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
        <Col span={6}>
          <Card
            bordered={false}
            className="card-style"
            style={{ alignContent: "center" }}
            loading={loading}
          >
            <p style={{ color: "red" }}>Feedback Details</p>
            <p>Avarage Rating : {data1?.feedbackAvarageRating}</p>
            <p>Less Than 4 : {data1?.totalFeedbackLessThan4}</p>
            <p>Greater Than 4 : {data1?.totalFeedbackGreaterThan4}</p>
          </Card>
        </Col>
      </Row>

      <div
        style={{
          marginTop: 20,
          display: "flex",
          justifyContent: "space-evenly",
        }}
      >
        <div>
          <p style={{ textAlign: "center" }}>Order Details</p>
          <LineChart
            width={450}
            height={250}
            data={data2}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="month"
              label={{
                value: "Months",
                position: "insideBottomRight",
                offset: -5,
              }}
            />
            <YAxis
              label={{
                value: "Orders",
                angle: -90,
                position: "insideLeft",
                offset: 0,
              }}
            />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="totalOrder" stroke="#8884d8" />
            <Line
              type="monotone"
              dataKey="totalOrderSuccess"
              stroke="#82ca9d"
            />
            <Line type="monotone" dataKey="totalOrderFail" stroke="red" />
          </LineChart>
        </div>
        <div>
          <p style={{ textAlign: "center" }}>Monthly Revenue</p>
          <BarChart width={450} height={250} data={data3}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="day"
              label={{
                value: "Date",
                position: "insideBottomRight",
                offset: -5,
              }}
            />
            <YAxis
              tickFormatter={(value) => {
                if (value >= 1000000) {
                  return `${(value / 1000000).toFixed(0)}M`; // Format for millions
                } else if (value >= 1000) {
                  return `${(value / 1000).toFixed(0)}K`; // Format for thousands
                }
                return value;
              }}
              label={{
                value: "VND",
                angle: -90,
                position: "insideLeft",
                offset: 0,
              }}
            />
            <Tooltip />
            <Legend />
            <Bar dataKey="totalPrice" fill="#8884d8" />
          </BarChart>
        </div>
      </div>
    </div>
  );
}

export default Overview;
