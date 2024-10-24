import { CarOutlined } from "@ant-design/icons";
import { Card, Radio, Checkbox, Space } from "antd";

function Price() {
  return (
    <Card>
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h4>Shipping method</h4>
        </div>

        <Radio.Group style={{ width: "100%" }}>
          <Space direction="vertical" style={{ width: "100%" }}>
            <Card>
              <Radio value="option1">
                <Space>
                  <CarOutlined style={{ fontSize: "24px", color: "#ff4d4f" }} />
                  <div>
                    <span style={{ fontWeight: "bold" }}>
                      Economical Delivery
                    </span>
                    <br />
                    <span style={{ color: "rgba(0, 0, 0, 0.45)" }}>
                      Expected delivery within 2 days
                    </span>
                  </div>
                </Space>
              </Radio>
              <span style={{ color: "red", float: "right" }}>123$</span>
            </Card>

            <Card>
              <Radio value="option2">
                <Space>
                  <CarOutlined style={{ fontSize: "24px", color: "#1890ff" }} />
                  <div>
                    <span style={{ fontWeight: "bold" }}>
                      Standard Delivery
                    </span>
                    <br />
                    <span style={{ color: "rgba(0, 0, 0, 0.45)" }}>
                      Expected delivery within 2 days
                    </span>
                  </div>
                </Space>
              </Radio>
              <span style={{ color: "red", float: "right" }}>123$</span>
            </Card>

            <Card>
              <Radio value="option3">
                <Space>
                  <CarOutlined style={{ fontSize: "24px", color: "#52c41a" }} />
                  <div>
                    <span style={{ fontWeight: "bold" }}>Express Delivery</span>
                    <br />
                    <span style={{ color: "rgba(0, 0, 0, 0.45)" }}>
                      Expected delivery within 2 days
                    </span>
                  </div>
                </Space>
              </Radio>
              <span style={{ color: "red", float: "right" }}>123$</span>
            </Card>
          </Space>
        </Radio.Group>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h4>Extra Service</h4>
        </div>

        <Space direction="vertical" style={{ width: "100%" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Checkbox>Health check</Checkbox>
            <span>20$ </span>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Checkbox>Standard insurance</Checkbox>
            <span>30$ </span>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Checkbox>Advanced insurance</Checkbox>
            <span>100$ </span>
          </div>
        </Space>
      </Space>
    </Card>
  );
}
export default Price;
