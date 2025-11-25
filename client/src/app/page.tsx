"use client";

import React from "react";
import { Card, Button, Row, Col, Typography } from "antd";
import Link from "next/link";
import MapView from "../components/MapView";
import {
  HomeOutlined,
  DollarOutlined,
  BarChartOutlined,
  SafetyOutlined,
} from "@ant-design/icons";
import AnimatedStatistic from "../components/AnimatedStatistic";

const { Title, Paragraph } = Typography;

export default function HomePage() {
  return (
    <div className="fade-in">
      {/* Hero Section */}
      <div
        style={{
          backgroundImage: `
  linear-gradient(
    rgba(0, 0, 0, 0.55), 
    rgba(0, 0, 0, 0.55)
  ),
  url('/realEstate.jpeg')
`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          borderRadius: 20,
          padding: "60px 40px",
          marginBottom: 40,
          color: "#fff",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -50,
            right: -50,
            width: 200,
            height: 200,
            background: "rgba(255,255,255,0.1)",
            borderRadius: "50%",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -30,
            left: -30,
            width: 150,
            height: 150,
            background: "rgba(255,255,255,0.1)",
            borderRadius: "50%",
          }}
        />
        <Title
          level={1}
          style={{
            color: "#fff",
            marginBottom: 16,
            fontSize: 48,
            position: "relative",
            zIndex: 1,
          }}
        >
          Welcome to RezoX AI
        </Title>
        <Paragraph
          style={{
            color: "rgba(255,255,255,0.9)",
            fontSize: 18,
            maxWidth: 600,
            margin: "0 auto 32px",
            position: "relative",
            zIndex: 1,
          }}
        >
          Smart real estate listings with ML-driven price predictions and
          interactive maps. Find your dream property with AI-powered insights.
        </Paragraph>

        <div
          style={{
            display: "flex",
            gap: 16,
            justifyContent: "center",
            flexWrap: "wrap",
            position: "relative",
            zIndex: 1,
          }}
        >
          <Link href="/listings">
            <Button
              type="primary"
              size="large"
              style={{
                height: 48,
                padding: "0 32px",
                fontSize: 16,
                background: "#fff",
                color: "#667eea",
                border: "none",
              }}
            >
              Explore Listings
            </Button>
          </Link>

          <Link href="/predict">
            <Button
              size="large"
              style={{
                height: 48,
                padding: "0 32px",
                fontSize: 16,
                background: "rgba(255,255,255,0.2)",
                color: "#fff",
                border: "1px solid rgba(255,255,255,0.3)",
              }}
            >
              Predict Price
            </Button>
          </Link>
        </div>
      </div>

      {/* Features Section */}
      <Row gutter={[24, 24]} style={{ marginBottom: 40 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card
            hoverable
            style={{
              borderRadius: 16,
              textAlign: "center",
              height: "100%",
              background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
            }}
            bodyStyle={{ padding: 32 }}
          >
            <HomeOutlined style={{ fontSize: 48, color: "#667eea" }} />
            <Title level={4}>Smart Listings</Title>
            <Paragraph>
              Browse curated real estate listings with detailed information.
            </Paragraph>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card
            hoverable
            style={{
              borderRadius: 16,
              textAlign: "center",
              height: "100%",
              background: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
            }}
            bodyStyle={{ padding: 32 }}
          >
            <DollarOutlined style={{ fontSize: 48, color: "#667eea" }} />
            <Title level={4}>Price Prediction</Title>
            <Paragraph>Get accurate price predictions using ML models.</Paragraph>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card
            hoverable
            style={{
              borderRadius: 16,
              textAlign: "center",
              height: "100%",
              background: "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)",
            }}
            bodyStyle={{ padding: 32 }}
          >
            <BarChartOutlined style={{ fontSize: 48, color: "#667eea" }} />
            <Title level={4}>Market Insights</Title>
            <Paragraph>Access real-time market trends and analytics.</Paragraph>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card
            hoverable
            style={{
              borderRadius: 16,
              textAlign: "center",
              height: "100%",
              background: "linear-gradient(135deg, #d299c2 0%, #fef9d7 100%)",
            }}
            bodyStyle={{ padding: 32 }}
          >
            <SafetyOutlined style={{ fontSize: 48, color: "#667eea" }} />
            <Title level={4}>AI Assistant</Title>
            <Paragraph>Get instant answers from our AI-powered assistant.</Paragraph>
          </Card>
        </Col>
      </Row>

      {/* Map + Stats Section */}
      <Row gutter={24}>
        <Col xs={24} lg={16}>
          <Card
            bordered={false}
            style={{
              borderRadius: 16,
              boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
            }}
            bodyStyle={{ padding: 0 }}
          >
            <div
              style={{
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                padding: 24,
                color: "#fff",
                borderRadius: "16px 16px 0 0",
              }}
            >
              <Title level={3} style={{ margin: 0, color: "#fff" }}>
                Interactive Map
              </Title>
              <Paragraph style={{ color: "rgba(255,255,255,0.8)" }}>
                Explore properties on our interactive map.
              </Paragraph>
            </div>
            <div style={{ padding: 12 }}>
              <MapView />
            </div>
          </Card>
        </Col>

        {/* Stats Section with Animation */}
        <Col xs={24} lg={8}>
          <Card
            bordered={false}
            style={{
              borderRadius: 16,
              boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
              height: "100%",
              background: "linear-gradient(135deg, #f5f7fa 0%, #ffffff 100%)",
            }}
            bodyStyle={{ padding: 32 }}
          >
            <Title level={3} style={{ marginBottom: 24 }}>
              Why Choose RezoX?
            </Title>

            <div style={{ marginBottom: 20 }}>
              <AnimatedStatistic
                title="Active Listings"
                value={1250}
                prefix={<HomeOutlined />}
                valueStyle={{ color: "#667eea" }}
              />
            </div>

            <div style={{ marginBottom: 20 }}>
              <AnimatedStatistic
                title="Price Predictions"
                value={98.5}
                suffix="% Accuracy"
                prefix={<BarChartOutlined />}
                valueStyle={{ color: "#52c41a" }}
              />
            </div>

            <div>
              <AnimatedStatistic
                title="Happy Customers"
                value={5000}
                prefix={<SafetyOutlined />}
                valueStyle={{ color: "#faad14" }}
              />
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
