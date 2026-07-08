"use client";

import { Button, Drawer, Empty, Table } from "antd";
import { BarChartOutlined } from "@ant-design/icons";
import { useState } from "react";
import { usePropertyMemory } from "../lib/usePropertyMemory";

export default function PropertyCompareDrawer() {
  const [open, setOpen] = useState(false);
  const { compare, removeCompare } = usePropertyMemory();

  const rows = [
    { metric: "Price", ...Object.fromEntries(compare.map(item => [item.title || item.location || item.id, `₹${item.price || "-"}L`])) },
    { metric: "Size", ...Object.fromEntries(compare.map(item => [item.title || item.location || item.id, `${item.total_sqft || "-"} sqft`])) },
    { metric: "Rooms", ...Object.fromEntries(compare.map(item => [item.title || item.location || item.id, `${item.bhk || "-"} BHK / ${item.bath || "-"} Bath`])) },
    { metric: "Rating", ...Object.fromEntries(compare.map(item => [item.title || item.location || item.id, `${item.averageRating || 0}/5`])) }
  ];

  const columns = [
    { title: "Metric", dataIndex: "metric", key: "metric", fixed: "left" as const },
    ...compare.map(item => ({
      title: item.title || item.location || `Property ${item.id}`,
      dataIndex: item.title || item.location || item.id,
      key: String(item.id),
      render: (value: string) => value
    }))
  ];

  return (
    <>
      <Button className="magnetic-btn" icon={<BarChartOutlined />} onClick={() => setOpen(true)}>
        Compare ({compare.length})
      </Button>
      <Drawer open={open} onClose={() => setOpen(false)} title="Smart Property Comparison" width={760}>
        {compare.length === 0 ? (
          <Empty description="Add properties to compare from the listing cards." />
        ) : (
          <>
            <Table rowKey="metric" pagination={false} dataSource={rows} columns={columns} scroll={{ x: true }} />
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 16 }}>
              {compare.map(item => (
                <Button key={String(item.id)} onClick={() => removeCompare(item.id || item._id)}>
                  Remove {item.title || item.location}
                </Button>
              ))}
            </div>
          </>
        )}
      </Drawer>
    </>
  );
}
