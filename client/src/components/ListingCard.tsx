"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button, Card, Carousel, Modal, Rate, Space, Tag, Tooltip, Typography, message } from "antd";
import { CalendarOutlined, EnvironmentOutlined, EyeOutlined, HeartOutlined, PlusOutlined, StarOutlined } from "@ant-design/icons";
import { apiFetch, type Listing } from "../lib/api";
import { useAuth } from "../lib/useAuth";
import { usePropertyMemory } from "../lib/usePropertyMemory";

const { Text } = Typography;

export default function ListingCard({ l }: { l: Listing }) {
  const [isGalleryOpen, setIsGalleryOpen] = React.useState(false);
  const [bookingOpen, setBookingOpen] = React.useState(false);
  const { user } = useAuth();
  const { addCompare, addRecent } = usePropertyMemory();
  const fallbackImage = `https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80`;
  const imageList = l.images && l.images.length > 0 ? l.images : [fallbackImage];
  const id = l.id || l._id;

  async function favorite() {
    if (!user) return message.warning("Sign in to save favorites.");
    await apiFetch(`/api/listings/${id}/favorite`, { method: "POST" });
    message.success("Favorites updated.");
  }

  async function bookVisit() {
    if (!user) return message.warning("Sign in to book a visit.");
    const tomorrow = new Date(Date.now() + 86400000).toISOString();
    await apiFetch(`/api/listings/${id}/bookings`, {
      method: "POST",
      body: JSON.stringify({ visit_at: tomorrow, message: "I would like to schedule a property tour." })
    });
    setBookingOpen(false);
    message.success("Visit request sent.");
  }

  return (
    <motion.div
      className="listing-motion-card"
      whileHover={{ y: -8, scale: 1.015 }}
      transition={{ type: "spring", stiffness: 280, damping: 22 }}
      onMouseEnter={() => addRecent(l)}
    >
      <Card
        className="property-card glass-card"
        cover={
          <div className="property-image-wrap" onClick={() => setIsGalleryOpen(true)}>
            <img alt={l.title || "Listing image"} src={imageList[0]} className="property-image" loading="lazy" />
            <div className="property-price">₹{l.price ?? "-"}L</div>
            <div className="property-glow" />
          </div>
        }
      >
        <Space direction="vertical" size={10} style={{ width: "100%" }}>
          <Link href={`/listings/${id}`} className="property-title">
            {l.title || `${l.bhk || "-"} BHK in ${l.location || "Premium Location"}`}
          </Link>
          <Text className="muted-line"><EnvironmentOutlined /> {l.location || l.city || "Location available on request"}</Text>
          <Space wrap>
            <Tag>{l.bhk ?? "-"} BHK</Tag>
            <Tag>{l.bath ?? "-"} Bath</Tag>
            <Tag>{l.total_sqft ?? "-"} sqft</Tag>
            <Tag color={l.status === "sold" ? "red" : "green"}>{l.status || "available"}</Tag>
          </Space>
          <Space style={{ justifyContent: "space-between", width: "100%" }}>
            <Rate disabled allowHalf value={Number(l.averageRating || 0)} style={{ fontSize: 14 }} />
            <Text className="muted-line"><StarOutlined /> {l.reviewsCount || 0}</Text>
          </Space>
          <Space wrap>
            <Tooltip title="View gallery">
              <Button icon={<EyeOutlined />} onClick={() => setIsGalleryOpen(true)} />
            </Tooltip>
            <Tooltip title="Save favorite">
              <Button icon={<HeartOutlined />} onClick={favorite} />
            </Tooltip>
            <Tooltip title="Compare">
              <Button icon={<PlusOutlined />} onClick={() => addCompare(l)} />
            </Tooltip>
            <Tooltip title="Book a visit">
              <Button icon={<CalendarOutlined />} onClick={() => setBookingOpen(true)} />
            </Tooltip>
          </Space>
        </Space>
      </Card>

      <Modal open={isGalleryOpen} footer={null} onCancel={() => setIsGalleryOpen(false)} title={l.title} width={860}>
        <Carousel dots>
          {imageList.map((image, idx) => (
            <img key={`${id}-${idx}`} src={image} alt={`${l.title || "Listing"} ${idx + 1}`} className="gallery-image" />
          ))}
        </Carousel>
      </Modal>

      <Modal open={bookingOpen} onCancel={() => setBookingOpen(false)} onOk={bookVisit} title="Book property visit">
        <p>Send a visit request for {l.title || l.location}. The agent/admin can confirm it from the workspace.</p>
      </Modal>
    </motion.div>
  );
}
