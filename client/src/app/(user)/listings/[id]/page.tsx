"use client";

import { use, useEffect, useState } from "react";
import useSWR from "swr";
import { Alert, Button, Card, Carousel, Col, Form, Input, Rate, Row, Space, Tag, Typography, message } from "antd";
import { CalendarOutlined, HeartOutlined, SendOutlined } from "@ant-design/icons";
import EmiCalculator from "../../../../components/EmiCalculator";
import MapView from "../../../../components/MapView";
import { apiFetch, API_URL, type Listing } from "../../../../lib/api";
import { useAuth } from "../../../../lib/useAuth";
import { usePropertyMemory } from "../../../../lib/usePropertyMemory";

const { Title, Paragraph, Text } = Typography;
const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function ListingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { user } = useAuth();
  const { addRecent, addCompare } = usePropertyMemory();
  const [rating, setRating] = useState(5);
  const { data: listing, error } = useSWR<Listing>(`${API_URL}/api/listings/${id}`, fetcher);
  const { data: reviews = [], mutate } = useSWR<any[]>(`${API_URL}/api/listings/${id}/reviews`, fetcher);

  useEffect(() => {
    if (listing) addRecent(listing);
  }, [listing, addRecent]);

  async function favorite() {
    if (!user) return message.warning("Sign in to save favorites.");
    await apiFetch(`/api/listings/${id}/favorite`, { method: "POST" });
    message.success("Favorite updated.");
  }

  async function bookVisit() {
    if (!user) return message.warning("Sign in to book visits.");
    await apiFetch(`/api/listings/${id}/bookings`, {
      method: "POST",
      body: JSON.stringify({ visit_at: new Date(Date.now() + 86400000).toISOString(), message: "I want a guided property tour." })
    });
    message.success("Visit request created.");
  }

  async function submitReview(values: { comment: string }) {
    if (!user) return message.warning("Sign in to review.");
    await apiFetch(`/api/listings/${id}/reviews`, {
      method: "POST",
      body: JSON.stringify({ rating, comment: values.comment })
    });
    message.success("Review saved.");
    mutate();
  }

  if (error) return <Alert type="error" message="Property unavailable" />;
  if (!listing) return <Card className="glass-card">Loading property...</Card>;

  const images = listing.images?.length ? listing.images : ["https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1400&q=80"];

  return (
    <div className="fade-in">
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={15}>
          <Card className="glass-card">
            <Carousel autoplay>
              {images.map((src, idx) => <img key={src} src={src} alt={`${listing.title} ${idx + 1}`} className="detail-hero-image" />)}
            </Carousel>
          </Card>
          <Card className="glass-card" style={{ marginTop: 16 }}>
            <Space wrap style={{ marginBottom: 10 }}>
              <Tag color="green">{listing.status || "available"}</Tag>
              <Tag>{listing.property_type || "Apartment"}</Tag>
              <Tag>{listing.bhk || "-"} BHK</Tag>
              <Tag>{listing.total_sqft || "-"} sqft</Tag>
            </Space>
            <Title>{listing.title}</Title>
            <Paragraph className="muted-line">{listing.address || listing.location}</Paragraph>
            <Paragraph>{listing.description || "A premium property listed on RezoX with AI-assisted market intelligence, booking workflow, and comparison support."}</Paragraph>
            <Space wrap>
              <Button type="primary" icon={<CalendarOutlined />} onClick={bookVisit}>Book visit</Button>
              <Button icon={<HeartOutlined />} onClick={favorite}>Favorite</Button>
              <Button onClick={() => addCompare(listing)}>Compare</Button>
              <Button onClick={() => window.dispatchEvent(new Event("rezox-open-chat"))}>Ask AI</Button>
            </Space>
          </Card>
          <Card className="glass-card" title="Reviews & ratings" style={{ marginTop: 16 }}>
            <Form layout="vertical" onFinish={submitReview}>
              <Rate value={rating} onChange={setRating} />
              <Form.Item name="comment" rules={[{ required: true, message: "Write a review." }]} style={{ marginTop: 12 }}>
                <Input.TextArea rows={3} placeholder="Share your property visit or buying impression" />
              </Form.Item>
              <Button htmlType="submit" icon={<SendOutlined />}>Submit review</Button>
            </Form>
            <Space direction="vertical" style={{ marginTop: 16, width: "100%" }}>
              {reviews.map(review => (
                <div key={review.id} className="review-row">
                  <Rate disabled value={review.rating} style={{ fontSize: 14 }} />
                  <Text strong>{review.userName}</Text>
                  <Text className="muted-line">{review.comment}</Text>
                </div>
              ))}
            </Space>
          </Card>
        </Col>
        <Col xs={24} lg={9}>
          <Card className="glass-card sticky-panel">
            <Title level={2}>₹{listing.price || "-"}L</Title>
            <Text className="muted-line">Estimated rating {Number(listing.averageRating || 0).toFixed(1)} / 5</Text>
          </Card>
          <div style={{ marginTop: 16 }}><EmiCalculator defaultPrice={Number(listing.price || 85)} /></div>
          <Card className="glass-card" title="Map & neighborhood" style={{ marginTop: 16 }}>
            <MapView />
          </Card>
        </Col>
      </Row>
    </div>
  );
}
