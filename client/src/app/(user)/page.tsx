"use client";

import Link from "next/link";
import useSWR from "swr";
import { motion } from "framer-motion";
import { Button, Card, Col, Row, Space, Statistic, Typography } from "antd";
import { ArrowRightOutlined, BarChartOutlined, HomeOutlined, RobotOutlined, ThunderboltOutlined } from "@ant-design/icons";
import PremiumHeroScene from "../../components/PremiumHeroScene";
import ListingCard from "../../components/ListingCard";
import EmiCalculator from "../../components/EmiCalculator";
import { API_URL, type Listing } from "../../lib/api";

const { Title, Paragraph, Text } = Typography;

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function HomePage() {
  const { data = [] } = useSWR<Listing[]>(`${API_URL}/api/listings?sort=priceDesc`, fetcher, {
    revalidateOnFocus: false
  });
  const featured = data.slice(0, 3);

  return (
    <div className="premium-page">
      <section className="luxury-hero">
        <div className="hero-copy">
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65 }}>
            <Text className="eyebrow">Enterprise AI real estate intelligence</Text>
            <Title className="hero-title">RezoX AI</Title>
            <Paragraph className="hero-subtitle">
              Discover, compare, tour, finance, and predict premium properties through one intelligent command center.
            </Paragraph>
            <Space wrap size={12}>
              <Link href="/listings">
                <Button type="primary" size="large" className="magnetic-btn">
                  Explore Properties <ArrowRightOutlined />
                </Button>
              </Link>
              <Button
                size="large"
                className="magnetic-btn"
                onClick={() => window.dispatchEvent(new Event("rezox-open-chat"))}
              >
                Ask AI Assistant
              </Button>
            </Space>
          </motion.div>
        </div>
        <div className="hero-scene" aria-label="Interactive 3D city showcase">
          <PremiumHeroScene />
        </div>
      </section>

      <Row gutter={[16, 16]} className="reveal-on-scroll stat-row">
        {[
          ["Listings", data.length, <HomeOutlined key="home" />],
          ["AI recommendations", featured.length, <RobotOutlined key="ai" />],
          ["Avg market price", Math.round(data.reduce((sum, item) => sum + Number(item.price || 0), 0) / Math.max(data.length, 1)), <BarChartOutlined key="chart" />],
          ["Fast search filters", 12, <ThunderboltOutlined key="fast" />]
        ].map(([label, value, icon]) => (
          <Col xs={12} lg={6} key={String(label)}>
            <Card className="glass-card animated-card">
              <Statistic title={<span>{icon} {label}</span>} value={Number(value)} suffix={label === "Avg market price" ? "L" : undefined} />
            </Card>
          </Col>
        ))}
      </Row>

      <section className="section-block reveal-on-scroll">
        <div className="section-heading">
          <div>
            <Text className="eyebrow">AI powered recommendations</Text>
            <Title level={2}>Featured properties</Title>
          </div>
          <Link href="/listings"><Button>View all</Button></Link>
        </div>
        <Row gutter={[16, 16]}>
          {featured.map(item => (
            <Col xs={24} md={8} key={String(item.id || item._id)}>
              <ListingCard l={item} />
            </Col>
          ))}
        </Row>
      </section>

      <section className="section-block reveal-on-scroll">
        <Row gutter={[16, 16]} align="stretch">
          <Col xs={24} lg={12}>
            <Card className="glass-card feature-panel">
              <Text className="eyebrow">Virtual touring</Text>
              <Title level={2}>Immersive property decisions</Title>
              <Paragraph>
                RezoX combines interactive galleries, map context, AI chat history, price predictions,
                smart comparison, recently viewed memory, and visit booking into one responsive workflow.
              </Paragraph>
              <Link href="/predict">
                <Button type="primary" className="magnetic-btn">Run price prediction</Button>
              </Link>
            </Card>
          </Col>
          <Col xs={24} lg={12}>
            <EmiCalculator />
          </Col>
        </Row>
      </section>
    </div>
  );
}
