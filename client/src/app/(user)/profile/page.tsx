"use client";

import useSWR from "swr";
import { Button, Card, Col, Form, Input, List, Row, Space, Tag, Typography, message } from "antd";
import { BellOutlined, CalendarOutlined, HeartOutlined, UserOutlined } from "@ant-design/icons";
import ListingCard from "../../../components/ListingCard";
import { apiFetch, type Listing } from "../../../lib/api";
import { useAuth } from "../../../lib/useAuth";
import { usePropertyMemory } from "../../../lib/usePropertyMemory";

const { Title, Paragraph, Text } = Typography;
const fetcher = (path: string) => apiFetch<any>(path);

export default function ProfilePage() {
  const { user, hydrate } = useAuth();
  const { recent } = usePropertyMemory();
  const { data: favorites = [] } = useSWR<Listing[]>(user ? "/api/listings/favorites/me" : null, fetcher);
  const { data: bookings = [] } = useSWR<any[]>(user ? "/api/listings/bookings/me" : null, fetcher);
  const { data: notifications = [], mutate } = useSWR<any[]>(user ? "/api/notifications" : null, fetcher);

  async function updateProfile(values: any) {
    await apiFetch("/api/users/me", { method: "PUT", body: JSON.stringify(values) });
    hydrate();
    message.success("Profile updated.");
  }

  async function readNotification(id: number) {
    await apiFetch(`/api/notifications/${id}/read`, { method: "PATCH" });
    mutate();
  }

  if (!user) {
    return (
      <Card className="glass-card auth-card">
        <Title level={3}>Sign in required</Title>
        <Paragraph>Sign in to view saved searches, favorites, bookings, and notifications.</Paragraph>
      </Card>
    );
  }

  return (
    <div className="fade-in">
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={8}>
          <Card className="glass-card" title={<><UserOutlined /> Profile</>}>
            <Form layout="vertical" initialValues={user} onFinish={updateProfile}>
              <Form.Item name="name" label="Name"><Input /></Form.Item>
              <Form.Item name="phone" label="Phone"><Input /></Form.Item>
              <Form.Item name="avatar" label="Avatar URL"><Input /></Form.Item>
              <Form.Item name="bio" label="Bio"><Input.TextArea rows={3} /></Form.Item>
              <Button htmlType="submit" type="primary">Save profile</Button>
            </Form>
            <Tag style={{ marginTop: 16 }}>{user.role}</Tag>
          </Card>
          <Card className="glass-card" title={<><BellOutlined /> Notifications</>} style={{ marginTop: 16 }}>
            <List
              dataSource={notifications}
              renderItem={(item: any) => (
                <List.Item actions={[!item.readAt ? <Button key="read" size="small" onClick={() => readNotification(item.id)}>Read</Button> : null]}>
                  <List.Item.Meta title={item.title} description={item.body || item.type} />
                </List.Item>
              )}
            />
          </Card>
        </Col>
        <Col xs={24} lg={16}>
          <Card className="glass-card" title={<><CalendarOutlined /> Property Visits</>}>
            <Space direction="vertical" style={{ width: "100%" }}>
              {bookings.map((booking: any) => (
                <div className="mini-property" key={booking.id}>
                  <strong>{booking.title}</strong>
                  <span>{booking.status} · {new Date(booking.visitAt).toLocaleString()}</span>
                </div>
              ))}
              {bookings.length === 0 && <Text className="muted-line">No visits booked yet.</Text>}
            </Space>
          </Card>
          <Card className="glass-card" title={<><HeartOutlined /> Favorites</>} style={{ marginTop: 16 }}>
            <Row gutter={[16, 16]}>
              {favorites.slice(0, 4).map(item => <Col xs={24} md={12} key={String(item.id)}><ListingCard l={item} /></Col>)}
            </Row>
            {favorites.length === 0 && <Text className="muted-line">Favorite properties from listing cards.</Text>}
          </Card>
          <Card className="glass-card" title="Recently Viewed" style={{ marginTop: 16 }}>
            <Space direction="vertical" style={{ width: "100%" }}>
              {recent.map(item => <div className="mini-property" key={String(item.id)}><strong>{item.title || item.location}</strong><span>₹{item.price || "-"}L</span></div>)}
              {recent.length === 0 && <Text className="muted-line">Your viewed properties will appear here.</Text>}
            </Space>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
