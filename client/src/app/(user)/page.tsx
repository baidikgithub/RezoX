"use client";

import Link from "next/link";
import { Button, Card, Col, Row, Space, Typography } from "antd";
import {
  BarChartOutlined,
  HomeOutlined,
  RobotOutlined,
  SafetyOutlined
} from "@ant-design/icons";

const { Title, Paragraph } = Typography;

const featureCards = [
  {
    title: "Smart Listings",
    description: "Browse and compare curated property listings with essential details.",
    icon: <HomeOutlined style={{ fontSize: 24, color: "#6366f1" }} />
  },
  {
    title: "AI Price Prediction",
    description: "Estimate property value quickly with data-driven ML predictions.",
    icon: <BarChartOutlined style={{ fontSize: 24, color: "#22c55e" }} />
  },
  {
    title: "Secure Account Access",
    description: "Sign up and sign in with secure password handling and JWT-based auth.",
    icon: <SafetyOutlined style={{ fontSize: 24, color: "#f59e0b" }} />
  }
];

export default function HomePage() {
  return (
    <div className="fade-in">
      <Card className="surface-card" style={{ marginBottom: 16 }}>
        <Row gutter={[24, 24]} align="middle">
          <Col xs={24} lg={15}>
            <Space direction="vertical" size={12}>
              <Title level={1} style={{ margin: 0 }}>
                Welcome to RezoX
              </Title>
              <Paragraph type="secondary" style={{ fontSize: 16, margin: 0 }}>
                A modern real estate platform to explore listings, predict prices, and
                manage properties with confidence.
              </Paragraph>
              <Space wrap>
                <Link href="/signup">
                  <Button type="primary" size="large">
                    Get Started
                  </Button>
                </Link>
                <Link href="/signin">
                  <Button size="large">Sign In</Button>
                </Link>
                <Link href="/listings">
                  <Button size="large">Browse Listings</Button>
                </Link>
              </Space>
            </Space>
          </Col>
          <Col xs={24} lg={9}>
            <Card className="soft-card">
              <Space direction="vertical" size={6}>
                <RobotOutlined style={{ fontSize: 30, color: "#6366f1" }} />
                <Title level={4} style={{ margin: 0 }}>
                  AI-Powered Property Experience
                </Title>
                <Paragraph className="list-note" style={{ marginBottom: 0 }}>
                  Search better, estimate faster, and make smarter buying decisions.
                </Paragraph>
              </Space>
            </Card>
          </Col>
        </Row>
      </Card>

      <Row gutter={[16, 16]}>
        {featureCards.map((item) => (
          <Col xs={24} md={8} key={item.title}>
            <Card className="surface-card" style={{ height: "100%" }}>
              <Space direction="vertical" size={10}>
                {item.icon}
                <Title level={4} style={{ margin: 0 }}>
                  {item.title}
                </Title>
                <Paragraph type="secondary" style={{ marginBottom: 0 }}>
                  {item.description}
                </Paragraph>
              </Space>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
}
