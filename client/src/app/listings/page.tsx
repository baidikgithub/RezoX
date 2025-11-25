"use client";
import useSWR from "swr";
import ListingCard from "../../components/ListingCard";
import { Row, Col, Spin, Card, Typography, Empty, Alert } from "antd";
import MapView from "../../components/MapView";
import { HomeOutlined, SearchOutlined } from "@ant-design/icons";

const { Title, Paragraph } = Typography;

const fetcher = (url: string) => fetch(url).then(res => {
  if (!res.ok) throw new Error('Failed to fetch listings');
  return res.json();
});

export default function ListingsPage() {
  const { data, error, isLoading } = useSWR(
    `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/listings`, 
    fetcher
  );

  return (
    <div>

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
        <div style={{ textAlign: 'center', padding: '60px 0' }}>
          <Spin size="large" />
        </div>
      )}

      {!isLoading && !error && (
        <Row gutter={[24, 24]}>
          <Col xs={24} lg={18}>
            {data && data.length > 0 ? (
              <Row gutter={[16, 16]}>
                {data.map((l: any) => (
                  <Col xs={24} sm={12} lg={8} key={l._id}>
                    <ListingCard l={l} />
                  </Col>
                ))}
              </Row>
            ) : (
              <Card style={{ borderRadius: 16 }}>
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description={
                    <span>
                      <SearchOutlined style={{ fontSize: 48, color: '#ccc', marginBottom: 16 }} />
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
              className="fade-in"
              style={{ 
                borderRadius: 16,
                boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                marginBottom: 24
              }}
              bodyStyle={{ padding: 12 }}
            >
              <MapView />
            </Card>

            <Card 
              className="fade-in"
              style={{ 
                borderRadius: 16,
                boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                background: 'linear-gradient(135deg, #f5f7fa 0%, #ffffff 100%)'
              }}
              bodyStyle={{ padding: 24 }}
            >
              <Title level={4}>Search Tips</Title>
              <Paragraph>
                <ul style={{ paddingLeft: 20, color: '#666' }}>
                  <li>Use filters to narrow down your search</li>
                  <li>Check the map for location details</li>
                  <li>Click on listings for more information</li>
                  <li>Use the AI assistant for property advice</li>
                </ul>
              </Paragraph>
            </Card>
          </Col>
        </Row>
      )}
    </div>
  );
}
