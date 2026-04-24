"use client";

import useSWR from "swr";
import ListingCard from "../../components/ListingCard";
import { Row, Col, Spin, Card, Typography, Empty, Alert } from "antd";
import MapView from "../../components/MapView";
import { HomeOutlined, SearchOutlined } from "@ant-design/icons";

const { Title, Paragraph } = Typography;

const fetcher = (url: string) =>
  fetch(url).then(res => {
    if (!res.ok) throw new Error("Failed to fetch listings");
    return res.json();
  });

export default function ListingsPage() {
  const { data, error, isLoading } = useSWR(
    `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/listings`,
    fetcher
  );

  return (
    <div className="fade-in">
      {error && (
        <Alert
          message="Error Loading Listings"
          description="Unable to fetch listings. Please check your connection and try again."
          type="error"
          showIcon
          style={{ marginBottom: 24, borderRadius: 12 }}
        />
      )}

      {isLoading && (
        <div style={{ textAlign: "center", padding: "60px 0" }}>
          <Spin size="large" />
        </div>
      )}

      {!isLoading && !error && (
        <Row gutter={[16, 16]}>
          <Col xs={24} lg={18}>
            {data && data.length > 0 ? (
              <Row gutter={[14, 14]}>
                {data.map((l: any) => (
                  <Col xs={24} md={12} xl={8} key={l._id}>
                    <ListingCard l={l} />
                  </Col>
                ))}
              </Row>
            ) : (
              <Card className="surface-card">
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description={
                    <span>
                      <SearchOutlined style={{ fontSize: 42, color: "#94a3b8", marginBottom: 10 }} />
                      <div>No listings found</div>
                    </span>
                  }
                />
              </Card>
            )}
          </Col>

          <Col xs={24} lg={6}>
            <Card
              title={
                <span>
                  <HomeOutlined /> Map Preview
                </span>
              }
              className="surface-card"
              style={{ marginBottom: 16 }}
            >
              <MapView />
            </Card>

            <Card className="soft-card">
              <Title level={4}>Search Tips</Title>
              <ul className="list-note" style={{ paddingLeft: 18 }}>
                <li>Use location and configuration filters to narrow results.</li>
                <li>Open the map card to compare areas more easily.</li>
                <li>Use AI assistant to ask about specific neighborhoods.</li>
              </ul>
            </Card>
          </Col>
        </Row>
      )}
    </div>
  );
}
