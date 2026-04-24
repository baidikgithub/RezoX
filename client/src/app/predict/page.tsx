"use client";
import { useState } from "react";
import {
  Card,
  Form,
  Input,
  InputNumber,
  Button,
  Row,
  Col,
  message,
  Typography,
  Statistic,
  Alert
} from "antd";
import MapView from "../../components/MapView";
import { DollarOutlined, HomeOutlined, CalculatorOutlined } from "@ant-design/icons";

const { Title, Paragraph } = Typography;

type FormType = { location?: string; sqft?: number; bath?: number; bhk?: number };

export default function PredictPage() {
  const [form] = Form.useForm<FormType>();
  const [pred, setPred] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  async function onFinish(values: FormType) {
    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/predict/predict-price`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            location: values.location,
            sqft: Number(values.sqft),
            bath: Number(values.bath),
            bhk: Number(values.bhk)
          })
        }
      );
      const json = await res.json();
      if (res.ok && json.predicted_price) {
        setPred(json.predicted_price);
        message.success("Price prediction generated successfully!");
      } else {
        throw new Error(json.error || "Prediction failed");
      }
    } catch (err: any) {
      message.error(err.message || "Prediction failed. Please try again.");
      setPred(null);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fade-in">
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card className="surface-card">
            <div style={{ marginBottom: 18 }}>
              <Title level={3}>Enter Property Details</Title>
              <Paragraph type="secondary">
                Provide complete inputs for the most reliable prediction.
              </Paragraph>
            </div>

            <Form form={form} layout="vertical" onFinish={onFinish}>
              <Form.Item
                name="location"
                label={
                  <span>
                    <HomeOutlined /> Location
                  </span>
                }
                rules={[{ required: true, message: "Please enter the location" }]}
              >
                <Input size="large" placeholder="e.g., Koramangala, Bengaluru" />
              </Form.Item>

              <Form.Item
                name="sqft"
                label="Total Square Feet"
                rules={[{ required: true, message: "Please enter the square footage" }]}
              >
                <InputNumber
                  style={{ width: "100%" }}
                  size="large"
                  placeholder="e.g., 1500"
                  min={100}
                  max={10000}
                />
              </Form.Item>

              <Form.Item
                name="bath"
                label="Number of Bathrooms"
                rules={[{ required: true, message: "Please enter the number of bathrooms" }]}
              >
                <InputNumber
                  style={{ width: "100%" }}
                  size="large"
                  placeholder="e.g., 2"
                  min={1}
                  max={10}
                />
              </Form.Item>

              <Form.Item
                name="bhk"
                label="BHK (Bedrooms)"
                rules={[{ required: true, message: "Please enter the number of bedrooms" }]}
              >
                <InputNumber
                  style={{ width: "100%" }}
                  size="large"
                  placeholder="e.g., 3"
                  min={1}
                  max={10}
                />
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit" loading={loading} size="large" block>
                  <CalculatorOutlined /> Predict Price
                </Button>
              </Form.Item>
            </Form>

            {pred !== null && (
              <Alert
                message={
                  <div>
                    <Statistic
                      title="Predicted Price"
                      value={pred}
                      prefix={<DollarOutlined />}
                      suffix="Lakhs"
                      valueStyle={{ color: "#22c55e", fontSize: 32 }}
                    />
                    <div className="list-note" style={{ marginTop: 8 }}>
                      Based on market trends and provided property features.
                    </div>
                  </div>
                }
                type="success"
                showIcon
                style={{ marginTop: 18, borderRadius: 12 }}
              />
            )}
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card className="surface-card" title="Location Map" style={{ marginBottom: 16 }}>
            <MapView />
          </Card>

          <Card className="soft-card">
            <Title level={4}>How It Works</Title>
            <Paragraph>
              The model evaluates local trends, property size, and layout to
              estimate the expected selling range.
            </Paragraph>
            <ul className="list-note" style={{ paddingLeft: 18 }}>
              <li>Location and neighborhood effect.</li>
              <li>Size and room configuration impact.</li>
              <li>Historical and current market movement.</li>
            </ul>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
