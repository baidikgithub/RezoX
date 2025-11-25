"use client";
import { useState } from "react";
import { Card, Form, Input, InputNumber, Button, message, Row, Col, Typography, Alert } from "antd";
import MapView from "../../components/MapView";
import { PlusOutlined, HomeOutlined, SaveOutlined } from "@ant-design/icons";

const { Title, Paragraph } = Typography;

export default function AdminPage() {
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);

  async function onFinish(values: any) {
    setSubmitting(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/listings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values)
      });
      const json = await res.json();
      if (res.ok) {
        message.success("Listing added successfully!");
        form.resetFields();
      } else {
        throw new Error(json.error || "Error adding listing");
      }
    } catch (err: any) {
      message.error(err.message || "Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>

      <Row gutter={[24, 24]}>
        <Col xs={24} lg={14}>
          <Card 
            title={
              <span>
                <PlusOutlined /> Add New Listing
              </span>
            }
            className="fade-in"
            style={{ 
              borderRadius: 16,
              boxShadow: '0 8px 24px rgba(0,0,0,0.12)'
            }}
            bodyStyle={{ padding: 32 }}
          >
            <Form form={form} layout="vertical" onFinish={onFinish}>
              <Form.Item 
                name="title" 
                label="Property Title" 
                rules={[{ required: true, message: 'Please enter a title' }]}
              > 
                <Input 
                  size="large"
                  placeholder="e.g., Beautiful 2BHK in Koramangala" 
                />
              </Form.Item>
              
              <Form.Item 
                name="location" 
                label="Location" 
                rules={[{ required: true, message: 'Please enter the location' }]}
              > 
                <Input 
                  size="large"
                  placeholder="e.g., Bengaluru, Koramangala" 
                />
              </Form.Item>
              
              <Row gutter={16}>
                <Col xs={24} sm={12}>
                  <Form.Item 
                    name="price" 
                    label="Price (Lakhs)" 
                    rules={[{ required: true, message: 'Please enter the price' }]}
                  > 
                    <InputNumber 
                      style={{ width: "100%" }} 
                      size="large"
                      placeholder="e.g., 85"
                      min={1}
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                  <Form.Item 
                    name="total_sqft" 
                    label="Total Square Feet"
                  > 
                    <InputNumber 
                      style={{ width: "100%" }} 
                      size="large"
                      placeholder="e.g., 1500"
                      min={100}
                    />
                  </Form.Item>
                </Col>
              </Row>
              
              <Row gutter={16}>
                <Col xs={24} sm={12}>
                  <Form.Item 
                    name="bhk" 
                    label="BHK (Bedrooms)"
                  > 
                    <InputNumber 
                      style={{ width: "100%" }} 
                      size="large"
                      placeholder="e.g., 2"
                      min={1}
                      max={10}
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                  <Form.Item 
                    name="bath" 
                    label="Bathrooms"
                  > 
                    <InputNumber 
                      style={{ width: "100%" }} 
                      size="large"
                      placeholder="e.g., 2"
                      min={1}
                      max={10}
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item>
                <Button 
                  type="primary" 
                  htmlType="submit" 
                  loading={submitting}
                  size="large"
                  block
                  icon={<SaveOutlined />}
                  style={{ height: 48, fontSize: 16 }}
                >
                  Add Listing
                </Button>
              </Form.Item>
            </Form>
          </Card>

          <Card 
            className="fade-in"
            style={{ 
              borderRadius: 16,
              boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
              marginTop: 24
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
        </Col>

        <Col xs={24} lg={10}>
          <Card 
            className="fade-in"
            style={{ 
              borderRadius: 16,
              boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
              background: 'linear-gradient(135deg, #f5f7fa 0%, #ffffff 100%)',
              marginBottom: 24
            }}
            bodyStyle={{ padding: 32 }}
          >
            <Title level={4}>Admin Guidelines</Title>
            <Paragraph>
              <ul style={{ paddingLeft: 20, color: '#666' }}>
                <li>Ensure all required fields are filled accurately</li>
                <li>Verify property details before submission</li>
                <li>Use clear and descriptive titles</li>
                <li>Include accurate location information</li>
                <li>Double-check pricing and square footage</li>
              </ul>
            </Paragraph>
          </Card>

          <Card 
            className="fade-in"
            style={{ 
              borderRadius: 16,
              boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
              background: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)'
            }}
            bodyStyle={{ padding: 32 }}
          >
            <Title level={4}>Quick Tips</Title>
            <Paragraph style={{ color: '#666' }}>
              <strong>Location:</strong> Use full address or area name<br />
              <strong>Price:</strong> Enter price in Lakhs (e.g., 85 for 85 Lakhs)<br />
              <strong>Square Feet:</strong> Total built-up area<br />
              <strong>BHK:</strong> Number of bedrooms<br />
              <strong>Bath:</strong> Number of bathrooms
            </Paragraph>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
