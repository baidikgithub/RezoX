import React from "react";
import { Card, Tag, Typography } from "antd";
import { HomeOutlined, EnvironmentOutlined } from "@ant-design/icons";

const { Text } = Typography;

type Listing = {
  _id: string;
  title?: string;
  location: string;
  price: number;
  total_sqft?: number;
  bhk?: number;
  bath?: number;
};

export default function ListingCard({ l }: { l: Listing }) {
  const imgSrc = `https://source.unsplash.com/600x400/?house,${encodeURIComponent(
    l.location || "home"
  )}`;

  return (
    <div 
      className="fade-in"
      style={{
        transition: "transform 0.2s ease, box-shadow 0.2s ease"
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-4px) scale(1.02)";
        e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.15)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0) scale(1)";
        e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.1)";
      }}
    >
      <Card
        hoverable
        cover={
          <div style={{ position: "relative", overflow: "hidden", borderRadius: "12px 12px 0 0" }}>
            <img 
              alt={l.title || "Listing image"} 
              src={imgSrc} 
              style={{ 
                height: 200, 
                width: "100%",
                objectFit: "cover",
                transition: "transform 0.3s ease"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.05)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
              }}
            />
            <div style={{
              position: "absolute",
              top: 12,
              right: 12,
              background: "rgba(102, 126, 234, 0.9)",
              color: "#fff",
              padding: "4px 12px",
              borderRadius: 20,
              fontSize: 12,
              fontWeight: 600
            }}>
              ₹{l.price}L
            </div>
          </div>
        }
        style={{ 
          borderRadius: 16,
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          overflow: "hidden"
        }}
        bodyStyle={{ padding: 20 }}
      >
        <div style={{ marginBottom: 12 }}>
          <Text strong style={{ fontSize: 18, display: "block", marginBottom: 4 }}>
            {l.title ?? `${l.bhk} BHK in ${l.location}`}
          </Text>
          <Text type="secondary" style={{ fontSize: 14, display: "flex", alignItems: "center", gap: 4 }}>
            <EnvironmentOutlined /> {l.location}
          </Text>
        </div>

        <div style={{ 
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "center",
          paddingTop: 12,
          borderTop: "1px solid #f0f0f0"
        }}>
          <div>
            <div style={{ fontSize: 12, color: "#888", marginBottom: 4 }}>
              <HomeOutlined /> {l.total_sqft ?? '-'} sqft
            </div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <Tag color="blue" style={{ margin: 0, borderRadius: 8, padding: "2px 8px" }}>
              {l.bhk ?? '-'} BHK
            </Tag>
            <Tag color="green" style={{ margin: 0, borderRadius: 8, padding: "2px 8px" }}>
              {l.bath ?? '-'} Bath
            </Tag>
          </div>
        </div>
      </Card>
    </div>
  );
}
