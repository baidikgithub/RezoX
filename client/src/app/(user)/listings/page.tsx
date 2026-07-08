"use client";

import { useMemo, useState } from "react";
import useSWR from "swr";
import ListingCard from "../../../components/ListingCard";
import { Alert, Button, Card, Col, Empty, Input, InputNumber, Row, Select, Skeleton, Space, Tag, Typography } from "antd";
import MapView from "../../../components/MapView";
import { SaveOutlined, SearchOutlined } from "@ant-design/icons";
import { API_URL, listingQuery, type Listing } from "../../../lib/api";
import { usePropertyMemory } from "../../../lib/usePropertyMemory";

const { Title, Text } = Typography;

const fetcher = (url: string) =>
  fetch(url).then(res => {
    if (!res.ok) throw new Error("Failed to fetch listings");
    return res.json();
  });

export default function ListingsPage() {
  const [filters, setFilters] = useState<Record<string, string | number | undefined>>({ sort: "newest" });
  const query = useMemo(() => listingQuery(filters), [filters]);
  const { savedSearches, saveSearch, recent } = usePropertyMemory();
  const { data = [], error, isLoading } = useSWR<Listing[]>(`${API_URL}/api/listings?${query}`, fetcher);

  const recommended = useMemo(() => {
    const recentBhks = new Set(recent.map(item => item.bhk).filter(Boolean));
    return data.filter(item => recentBhks.size === 0 || recentBhks.has(item.bhk)).slice(0, 3);
  }, [data, recent]);

  return (
    <div className="fade-in">
      <Card className="glass-card filter-bar reveal-on-scroll">
        <Row gutter={[12, 12]} align="middle">
          <Col xs={24} lg={7}>
            <Input
              size="large"
              prefix={<SearchOutlined />}
              placeholder="Search by area, title, city"
              onChange={e => setFilters(prev => ({ ...prev, q: e.target.value }))}
            />
          </Col>
          <Col xs={12} md={6} lg={3}>
            <InputNumber size="large" min={0} placeholder="Min L" style={{ width: "100%" }} onChange={v => setFilters(prev => ({ ...prev, minPrice: Number(v || "") }))} />
          </Col>
          <Col xs={12} md={6} lg={3}>
            <InputNumber size="large" min={0} placeholder="Max L" style={{ width: "100%" }} onChange={v => setFilters(prev => ({ ...prev, maxPrice: Number(v || "") }))} />
          </Col>
          <Col xs={12} md={6} lg={3}>
            <Select size="large" placeholder="BHK" allowClear style={{ width: "100%" }} onChange={v => setFilters(prev => ({ ...prev, bhk: v }))} options={[1,2,3,4,5].map(v => ({ value: v, label: `${v} BHK` }))} />
          </Col>
          <Col xs={12} md={6} lg={4}>
            <Select size="large" value={filters.sort} style={{ width: "100%" }} onChange={v => setFilters(prev => ({ ...prev, sort: v }))} options={[
              { value: "newest", label: "Newest" },
              { value: "priceAsc", label: "Price low-high" },
              { value: "priceDesc", label: "Price high-low" }
            ]} />
          </Col>
          <Col xs={24} lg={4}>
            <Button block size="large" icon={<SaveOutlined />} onClick={() => saveSearch(query)}>
              Save Search
            </Button>
          </Col>
        </Row>
        {savedSearches.length > 0 && (
          <Space wrap style={{ marginTop: 12 }}>
            <Text className="muted-line">Saved:</Text>
            {savedSearches.map(item => <Tag key={item}>{item || "all listings"}</Tag>)}
          </Space>
        )}
      </Card>

      {error && <Alert message="Error loading listings" description="Unable to fetch listings." type="error" showIcon style={{ margin: "16px 0" }} />}

      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24} xl={18}>
          {isLoading ? (
            <Row gutter={[16, 16]}>{Array.from({ length: 6 }).map((_, i) => <Col xs={24} md={12} lg={8} key={i}><Skeleton active /></Col>)}</Row>
          ) : data.length > 0 ? (
            <Row gutter={[16, 16]}>
              {data.map((l) => (
                <Col xs={24} md={12} lg={8} key={String(l.id || l._id)}>
                  <ListingCard l={l} />
                </Col>
              ))}
            </Row>
          ) : (
            <Card className="glass-card"><Empty description="No listings match this search." /></Card>
          )}
        </Col>

        <Col xs={24} xl={6}>
          <Card title="Interactive map" className="glass-card sticky-panel">
            <MapView />
          </Card>
          <Card title="AI recommendations" className="glass-card" style={{ marginTop: 16 }}>
            <Space direction="vertical" style={{ width: "100%" }}>
              {recommended.map(item => (
                <div key={String(item.id)} className="mini-property">
                  <strong>{item.title || item.location}</strong>
                  <span>₹{item.price || "-"}L · {item.bhk || "-"} BHK</span>
                </div>
              ))}
              {recommended.length === 0 && <Text className="muted-line">Browse properties to personalize recommendations.</Text>}
            </Space>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
