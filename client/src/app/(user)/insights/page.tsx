"use client";

import useSWR from "swr";
import { Alert, Card, Col, Empty, Row, Spin, Statistic } from "antd";
import {
  Area,
  AreaChart,
  BarChart,
  Bar,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";

type Listing = {
  _id: string;
  location?: string;
  price?: number;
  bhk?: number;
};

const COLORS = ["#6366f1", "#22c55e", "#f59e0b", "#ef4444", "#06b6d4", "#8b5cf6"];

const fetcher = async (url: string): Promise<Listing[]> => {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch listing insights");
  return res.json();
};

function bucketByPriceRange(listings: Listing[]) {
  const ranges = [
    { name: "0-50L", min: 0, max: 50, value: 0 },
    { name: "50-100L", min: 50, max: 100, value: 0 },
    { name: "100-150L", min: 100, max: 150, value: 0 },
    { name: "150L+", min: 150, max: Number.POSITIVE_INFINITY, value: 0 }
  ];

  listings.forEach(listing => {
    const price = Number(listing.price || 0);
    const bucket = ranges.find(range => price >= range.min && price < range.max);
    if (bucket) bucket.value += 1;
  });

  return ranges;
}

function topLocationsByAveragePrice(listings: Listing[]) {
  const map = new Map<string, { total: number; count: number }>();

  listings.forEach(listing => {
    const location = (listing.location || "Unknown").trim();
    const price = Number(listing.price || 0);
    const current = map.get(location) || { total: 0, count: 0 };
    current.total += price;
    current.count += 1;
    map.set(location, current);
  });

  return Array.from(map.entries())
    .map(([location, stats]) => ({
      location,
      avgPrice: Number((stats.total / stats.count).toFixed(2))
    }))
    .sort((a, b) => b.avgPrice - a.avgPrice)
    .slice(0, 8);
}

function bhkDistribution(listings: Listing[]) {
  const map = new Map<string, number>();

  listings.forEach(listing => {
    const bhk = listing.bhk ? `${listing.bhk} BHK` : "Unknown";
    map.set(bhk, (map.get(bhk) || 0) + 1);
  });

  return Array.from(map.entries())
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);
}

function topLocationsByCount(listings: Listing[]) {
  const map = new Map<string, number>();

  listings.forEach(listing => {
    const location = (listing.location || "Unknown").trim();
    map.set(location, (map.get(location) || 0) + 1);
  });

  return Array.from(map.entries())
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 6);
}

function averagePriceByBhk(listings: Listing[]) {
  const map = new Map<string, { total: number; count: number; order: number }>();

  listings.forEach(listing => {
    const key = listing.bhk ? `${listing.bhk} BHK` : "Unknown";
    const order = listing.bhk ?? Number.POSITIVE_INFINITY;
    const price = Number(listing.price || 0);
    const current = map.get(key) || { total: 0, count: 0, order };
    current.total += price;
    current.count += 1;
    map.set(key, current);
  });

  return Array.from(map.entries())
    .map(([name, stats]) => ({
      name,
      avgPrice: Number((stats.total / stats.count).toFixed(2)),
      order: stats.order
    }))
    .sort((a, b) => a.order - b.order);
}

export default function InsightsPage() {
  const { data, error, isLoading } = useSWR(
    `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/listings`,
    fetcher
  );

  const listings = data || [];
  const avgPrice =
    listings.length > 0
      ? listings.reduce((sum, item) => sum + Number(item.price || 0), 0) / listings.length
      : 0;

  const priceRanges = bucketByPriceRange(listings);
  const locationAvgPrice = topLocationsByAveragePrice(listings);
  const bhkSplit = bhkDistribution(listings);
  const locationShare = topLocationsByCount(listings);
  const bhkAvgPrice = averagePriceByBhk(listings);

  return (
    <div className="fade-in">
      {error && (
        <Alert
          message="Insights unavailable"
          description="Could not load listing data for analytics. Please try again."
          type="error"
          showIcon
          style={{ marginBottom: 16, borderRadius: 12 }}
        />
      )}

      {isLoading ? (
        <div style={{ textAlign: "center", padding: "64px 0" }}>
          <Spin size="large" />
        </div>
      ) : listings.length === 0 ? (
        <Card className="surface-card">
          <Empty description="No listing data found for insights." />
        </Card>
      ) : (
        <>
          <Row gutter={[16, 16]} style={{ marginBottom: 4 }}>
            <Col xs={24} md={8}>
              <Card className="soft-card">
                <Statistic title="Total Listings" value={listings.length} />
              </Card>
            </Col>
            <Col xs={24} md={8}>
              <Card className="soft-card">
                <Statistic title="Average Price" value={Number(avgPrice.toFixed(2))} suffix="L" />
              </Card>
            </Col>
            <Col xs={24} md={8}>
              <Card className="soft-card">
                <Statistic title="Locations Covered" value={new Set(listings.map(item => item.location || "Unknown")).size} />
              </Card>
            </Col>
          </Row>

          <Row gutter={[16, 16]}>
            <Col xs={24} xl={14}>
              <Card className="surface-card" title="Average Price by Location">
                <div style={{ width: "100%", height: 360 }}>
                  <ResponsiveContainer>
                    <BarChart data={locationAvgPrice}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="location" tick={{ fontSize: 12 }} interval={0} angle={-20} textAnchor="end" height={70} />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="avgPrice" name="Avg Price (L)" fill="#6366f1" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </Col>

            <Col xs={24} xl={10}>
              <Card className="surface-card" title="BHK Distribution (Pie)">
                <div style={{ width: "100%", height: 360 }}>
                  <ResponsiveContainer>
                    <PieChart>
                      <Pie data={bhkSplit} dataKey="value" nameKey="name" outerRadius={120} label>
                        {bhkSplit.map((entry, index) => (
                          <Cell key={`${entry.name}-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </Col>
          </Row>

          <Row gutter={[16, 16]} style={{ marginTop: 2 }}>
            <Col span={24}>
              <Card className="surface-card" title="Listings by Price Range">
                <div style={{ width: "100%", height: 320 }}>
                  <ResponsiveContainer>
                    <LineChart data={priceRanges}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="value" name="Number of Listings" stroke="#22c55e" strokeWidth={3} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </Col>
          </Row>

          <Row gutter={[16, 16]} style={{ marginTop: 2 }}>
            <Col xs={24} xl={10}>
              <Card className="surface-card" title="Top Location Share (Donut)">
                <div style={{ width: "100%", height: 340 }}>
                  <ResponsiveContainer>
                    <PieChart>
                      <Pie
                        data={locationShare}
                        dataKey="value"
                        nameKey="name"
                        innerRadius={70}
                        outerRadius={120}
                        label
                      >
                        {locationShare.map((entry, index) => (
                          <Cell key={`${entry.name}-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </Col>

            <Col xs={24} xl={14}>
              <Card className="surface-card" title="Average Price Trend by BHK">
                <div style={{ width: "100%", height: 340 }}>
                  <ResponsiveContainer>
                    <AreaChart data={bhkAvgPrice}>
                      <defs>
                        <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.1} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Area
                        type="monotone"
                        dataKey="avgPrice"
                        name="Avg Price (L)"
                        stroke="#06b6d4"
                        fillOpacity={1}
                        fill="url(#priceGradient)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </Col>
          </Row>
        </>
      )}
    </div>
  );
}
