"use client";
import { useEffect, useState, Suspense } from "react";
import { Card, Form, Input, InputNumber, Button, message, Row, Col, Typography, Upload, Image } from "antd";
import type { UploadFile } from "antd";
import MapView from "../../../components/MapView";
import { PlusOutlined, SaveOutlined } from "@ant-design/icons";
import { useSearchParams } from "next/navigation";
import useSWR from "swr";
import { apiFetch, API_URL, getToken } from "../../../lib/api";
import { useAuth } from "../../../lib/useAuth";

const { Title, Paragraph } = Typography;
const fetcher = (path: string) => apiFetch<any>(path);

function AdminPageContent() {
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);
  const [imageFiles, setImageFiles] = useState<UploadFile[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const searchParams = useSearchParams();
  const editId = searchParams.get("edit");
  const { user } = useAuth();
  const { data: analytics } = useSWR(user && user.role !== "buyer" ? "/api/analytics" : null, fetcher);
  const { data: bookings } = useSWR(user && user.role !== "buyer" ? "/api/listings/bookings/me" : null, fetcher);

  useEffect(() => {
    if (!editId) return;

    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
    const loadListing = async () => {
      try {
        const res = await fetch(`${baseUrl}/api/listings/${editId}`);
        const json = await res.json();
        if (!res.ok) {
          throw new Error(json.error || "Unable to load listing");
        }
        form.setFieldsValue({
          title: json.title || "",
          location: json.location || "",
          price: json.price,
          total_sqft: json.total_sqft,
          bhk: json.bhk,
          bath: json.bath
        });
        setExistingImages(Array.isArray(json.images) ? json.images : []);
      } catch (err: any) {
        message.error(err.message || "Unable to load listing details.");
      }
    };

    loadListing();
  }, [editId, form]);

  async function onFinish(values: any) {
    setSubmitting(true);
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const endpoint = editId
        ? `${baseUrl}/api/listings/${editId}`
        : `${baseUrl}/api/listings`;

      const formData = new FormData();
      Object.entries(values).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          formData.append(key, String(value));
        }
      });

      formData.append("existingImages", JSON.stringify(existingImages));
      imageFiles.forEach(file => {
        if (file.originFileObj) {
          formData.append("images", file.originFileObj);
        }
      });

      const res = await fetch(endpoint, {
        method: editId ? "PUT" : "POST",
        headers: getToken() ? { Authorization: `Bearer ${getToken()}` } : undefined,
        body: formData
      });
      const json = await res.json();
      if (res.ok) {
        message.success(editId ? "Listing updated successfully!" : "Listing added successfully!");
        if (!editId) {
          form.resetFields();
          setImageFiles([]);
          setExistingImages([]);
        }
      } else {
        throw new Error(json.error || (editId ? "Error updating listing" : "Error adding listing"));
      }
    } catch (err: any) {
      message.error(err.message || "Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fade-in">
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Row gutter={[16, 16]}>
            {[
              ["Listings", analytics?.summary?.listings || 0],
              ["Users", analytics?.summary?.users || 0],
              ["Bookings", analytics?.summary?.bookings || 0],
              ["Avg Price", Math.round(analytics?.summary?.avgPrice || 0)]
            ].map(([label, value]) => (
              <Col xs={12} lg={6} key={String(label)}>
                <Card className="glass-card animated-card">
                  <Title level={4} style={{ margin: 0 }}>{value}</Title>
                  <Paragraph className="muted-line" style={{ margin: 0 }}>{label}</Paragraph>
                </Card>
              </Col>
            ))}
          </Row>
        </Col>
        <Col xs={24} lg={14}>
          <Card
            title={
              <span>
                <PlusOutlined /> {editId ? "Update Listing" : "Add New Listing"}
              </span>
            }
            className="glass-card"
          >
            <Form form={form} layout="vertical" onFinish={onFinish}>
              <Form.Item
                name="title"
                label="Property Title"
                rules={[{ required: true, message: "Please enter a title" }]}
              >
                <Input size="large" placeholder="e.g., Beautiful 2BHK in Koramangala" />
              </Form.Item>

              <Form.Item name="description" label="Description">
                <Input.TextArea rows={4} placeholder="Premium details, view, furnishing, ownership, and neighborhood highlights" />
              </Form.Item>

              <Form.Item
                name="location"
                label="Location"
                rules={[{ required: true, message: "Please enter the location" }]}
              >
                <Input size="large" placeholder="e.g., Bengaluru, Koramangala" />
              </Form.Item>

              <Row gutter={12}>
                <Col xs={24} sm={12}>
                  <Form.Item name="city" label="City">
                    <Input size="large" placeholder="Bengaluru" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                  <Form.Item name="property_type" label="Property Type">
                    <Input size="large" placeholder="Apartment, Villa, Penthouse" />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={12}>
                <Col xs={24} sm={12}>
                  <Form.Item
                    name="price"
                    label="Price (Lakhs)"
                    rules={[{ required: true, message: "Please enter the price" }]}
                  >
                    <InputNumber style={{ width: "100%" }} size="large" placeholder="e.g., 85" min={1} />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                  <Form.Item name="total_sqft" label="Total Square Feet">
                    <InputNumber
                      style={{ width: "100%" }}
                      size="large"
                      placeholder="e.g., 1500"
                      min={100}
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={12}>
                <Col xs={24} sm={12}>
                  <Form.Item name="bhk" label="BHK (Bedrooms)">
                    <InputNumber style={{ width: "100%" }} size="large" placeholder="e.g., 2" min={1} max={10} />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                  <Form.Item name="bath" label="Bathrooms">
                    <InputNumber style={{ width: "100%" }} size="large" placeholder="e.g., 2" min={1} max={10} />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item name="images" label="Property Images (Upload Multiple)">
                <Upload
                  multiple
                  listType="picture"
                  beforeUpload={(file) => {
                    setImageFiles(prev => [...prev, file as UploadFile]);
                    return false;
                  }}
                  onRemove={(file) => {
                    setImageFiles(prev => prev.filter(f => f.uid !== file.uid));
                  }}
                  fileList={imageFiles}
                >
                  <Button>Select Image Files</Button>
                </Upload>
              </Form.Item>

              {editId && existingImages.length > 0 && (
                <Form.Item label="Existing Images">
                  <Image.PreviewGroup>
                    <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                      {existingImages.map((src, idx) => (
                        <Image
                          key={`${src}-${idx}`}
                          src={src}
                          alt={`Existing ${idx + 1}`}
                          width={90}
                          height={70}
                          style={{ objectFit: "cover", borderRadius: 8 }}
                        />
                      ))}
                    </div>
                  </Image.PreviewGroup>
                </Form.Item>
              )}

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={submitting}
                  size="large"
                  block
                  icon={<SaveOutlined />}
                >
                  {editId ? "Update Listing" : "Add Listing"}
                </Button>
              </Form.Item>
            </Form>
          </Card>

          <Card className="glass-card" title="Location Map" style={{ marginTop: 16 }}>
            <MapView />
          </Card>
        </Col>

        <Col xs={24} lg={10}>
          <Card className="glass-card" style={{ marginBottom: 16 }} title="Visit Requests">
            {(bookings || []).slice(0, 8).map((booking: any) => (
              <div className="mini-property" key={booking.id}>
                <strong>{booking.title}</strong>
                <span>{booking.buyerName} · {booking.status}</span>
              </div>
            ))}
          </Card>

          <Card className="glass-card">
            <Title level={4}>Quick Input Reference</Title>
            <Paragraph className="list-note">
              <strong>Location:</strong> Enter full area or neighborhood name.
              <br />
              <strong>Price:</strong> Use lakhs (example: 85 = 85 Lakhs).
              <br />
              <strong>Square Feet:</strong> Total built-up area.
              <br />
              <strong>BHK/Bath:</strong> Number of bedrooms and bathrooms.
            </Paragraph>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default function AdminPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AdminPageContent />
    </Suspense>
  );
}
