"use client";

import React from "react";
import { Card, Button, Row, Col, Typography, Space } from "antd";
import Link from "next/link";
import MapView from "../components/MapView";
import {
  HomeOutlined,
  DollarOutlined,
  BarChartOutlined,
  SafetyOutlined
} from "@ant-design/icons";
import AnimatedStatistic from "../components/AnimatedStatistic";

const { Title, Paragraph } = Typography;

const features = [
  {
    icon: <HomeOutlined style={{ fontSize: 30, color: "#6366f1" }} />,
    title: "Curated Listings",
    text: "Browse quality properties with clear pricing and amenities.",
    href: "/listings"
  },
  {
    icon: <DollarOutlined style={{ fontSize: 30, color: "#6366f1" }} />,
    title: "ML Price Predictions",
    text: "Estimate property value using live market-aware models.",
    href: "/predict"
  },
  {
    icon: <BarChartOutlined style={{ fontSize: 30, color: "#6366f1" }} />,
    title: "Market Insights",
    text: "Get trend-based intelligence for better buying decisions.",
    href: "/insights"
  },
  {
    icon: <SafetyOutlined style={{ fontSize: 30, color: "#6366f1" }} />,
    title: "AI Assistant",
    text: "Ask practical questions and receive instant property guidance.",
    action: "open-chat"
  }
];

export default function HomePage() {
  const openAssistant = () => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("rezox-open-chat"));
    }
  };

  return (
    <div className="fade-in">
      <section className="page-hero">
        <Title level={1} className="page-hero-title">
          Discover Better Properties With RezoX AI
        </Title>
        <Paragraph className="page-hero-subtitle">
          Explore listings, analyze locations on the map, and run machine learning
          predictions from one clean dashboard.
        </Paragraph>
        <Space wrap size={12} style={{ marginTop: 22 }}>
          <Link href="/listings">
            <Button size="large" type="primary">
              Explore Listings
            </Button>
          </Link>
          <Link href="/predict">
            <Button size="large">Predict Property Price</Button>
          </Link>
        </Space>
      </section>

      <Row gutter={[16, 16]} style={{ marginBottom: 18 }}>
        {features.map(item => (
          <Col xs={24} sm={12} lg={6} key={item.title}>
            {item.href ? (
              <Link href={item.href} style={{ display: "block" }}>
                <Card className="surface-card" hoverable style={{ height: "100%", cursor: "pointer" }}>
                  <Space direction="vertical" size={8}>
                    {item.icon}
                    <Title level={5} style={{ margin: 0 }}>
                      {item.title}
                    </Title>
                    <Paragraph type="secondary" style={{ marginBottom: 0 }}>
                      {item.text}
                    </Paragraph>
                  </Space>
                </Card>
              </Link>
            ) : (
              <Card
                className="surface-card"
                hoverable
                style={{ height: "100%", cursor: "pointer" }}
                onClick={openAssistant}
              >
                <Space direction="vertical" size={8}>
                  {item.icon}
                  <Title level={5} style={{ margin: 0 }}>
                    {item.title}
                  </Title>
                  <Paragraph type="secondary" style={{ marginBottom: 0 }}>
                    {item.text}
                  </Paragraph>
                </Space>
              </Card>
            )}
          </Col>
        ))}
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} xl={16}>
          <Card
            className="surface-card"
            title="Interactive Map"
            extra={<span className="list-note">Explore active property locations</span>}
          >
            <MapView />
          </Card>
        </Col>
        <Col xs={24} xl={8}>
          <Card className="soft-card" style={{ height: "100%" }}>
            <Title level={4} style={{ marginTop: 0 }}>
              Why Teams Choose RezoX
            </Title>
            <Space direction="vertical" size={18} style={{ width: "100%" }}>
              <AnimatedStatistic
                title="Active Listings"
                value={1250}
                prefix={<HomeOutlined />}
                valueStyle={{ color: "#6366f1" }}
              />
              <AnimatedStatistic
                title="Prediction Accuracy"
                value={98.5}
                suffix="%"
                prefix={<BarChartOutlined />}
                valueStyle={{ color: "#22c55e" }}
              />
              <AnimatedStatistic
                title="Happy Customers"
                value={5000}
                prefix={<SafetyOutlined />}
                valueStyle={{ color: "#f59e0b" }}
              />
            </Space>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
