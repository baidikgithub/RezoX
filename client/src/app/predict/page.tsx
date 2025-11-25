"use client";
import { useState } from "react";
import { Card, Form, Input, InputNumber, Button, Row, Col, message, Typography, Statistic, Alert } from "antd";
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
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/predict/predict-price`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          location: values.location,
          sqft: Number(values.sqft),
          bath: Number(values.bath),
          bhk: Number(values.bhk)
        })
      });
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
    <div>

      <Row gutter={[24, 24]}>
        <Col xs={24} lg={12}>
          <Card 
            className="fade-in"
            style={{ 
              borderRadius: 16,
              boxShadow: '0 8px 24px rgba(0,0,0,0.12)'
            }}
            bodyStyle={{ padding: 32 }}
          >
            <div style={{ marginBottom: 24 }}>
              <Title level={3}>Enter Property Details</Title>
              <Paragraph type="secondary">Fill in the information below to get an accurate price prediction</Paragraph>
            </div>

            <Form form={form} layout="vertical" onFinish={onFinish}>
              <Form.Item 
                name="location" 
                label={<span><HomeOutlined /> Location</span>} 
                rules={[{ required: true, message: 'Please enter the location' }]}
              >
                <Input size="large" placeholder="e.g., Koramangala, Bengaluru" />
              </Form.Item>
              
              <Form.Item 
                name="sqft" 
                label="Total Square Feet" 
                rules={[{ required: true, message: 'Please enter the square footage' }]}
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
                rules={[{ required: true, message: 'Please enter the number of bathrooms' }]}
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
                rules={[{ required: true, message: 'Please enter the number of bedrooms' }]}
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
                <Button 
                  type="primary" 
                  htmlType="submit" 
                  loading={loading}
                  size="large"
                  block
                  style={{ height: 48, fontSize: 16 }}
                >
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
                      valueStyle={{ color: '#52c41a', fontSize: 32 }}
                    />
                    <div style={{ marginTop: 8, fontSize: 14, color: '#666' }}>
                      Based on current market trends and property features
                    </div>
                  </div>
                }
                type="success"
                showIcon
                style={{ marginTop: 24, borderRadius: 12 }}
              />
            )}
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card 
            className="fade-in"
            style={{ 
              borderRadius: 16,
              boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
              marginBottom: 24
            }}
            bodyStyle={{ padding: 0 }}
          >
            <div style={{ 
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              padding: '20px',
              color: '#fff',
              borderRadius: '16px 16px 0 0'
            }}>
              <Title level={4} style={{ color: '#fff', margin: 0 }}>Location Map</Title>
            </div>
            <div style={{ padding: 12 }}>
              <MapView />
            </div>
          </Card>

          <Card 
            className="fade-in"
            style={{ 
              borderRadius: 16,
              boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
              background: 'linear-gradient(135deg, #f5f7fa 0%, #ffffff 100%)'
            }}
            bodyStyle={{ padding: 24 }}
          >
            <Title level={4}>How It Works</Title>
            <Paragraph>
              Our AI model analyzes multiple factors including location, size, and amenities to provide accurate price predictions.
            </Paragraph>
            <ul style={{ paddingLeft: 20, color: '#666' }}>
              <li>Location-based market analysis</li>
              <li>Property size and configuration</li>
              <li>Current market trends</li>
              <li>Historical price data</li>
            </ul>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
