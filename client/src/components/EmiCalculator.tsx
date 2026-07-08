"use client";

import { useMemo, useState } from "react";
import { Card, Col, InputNumber, Row, Slider, Statistic } from "antd";

export default function EmiCalculator({ defaultPrice = 85 }: { defaultPrice?: number }) {
  const [principal, setPrincipal] = useState(defaultPrice * 100000);
  const [rate, setRate] = useState(8.5);
  const [years, setYears] = useState(20);

  const emi = useMemo(() => {
    const monthlyRate = rate / 12 / 100;
    const months = years * 12;
    if (!monthlyRate) return principal / months;
    return (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
  }, [principal, rate, years]);

  return (
    <Card className="glass-card" title="Mortgage & EMI Calculator">
      <Row gutter={[14, 14]}>
        <Col span={24}>
          <span className="field-label">Loan amount</span>
          <InputNumber value={principal} onChange={v => setPrincipal(Number(v || 0))} prefix="₹" style={{ width: "100%" }} />
          <Slider min={500000} max={50000000} step={100000} value={principal} onChange={setPrincipal} />
        </Col>
        <Col xs={24} md={12}>
          <span className="field-label">Interest rate</span>
          <InputNumber value={rate} onChange={v => setRate(Number(v || 0))} suffix="%" style={{ width: "100%" }} />
        </Col>
        <Col xs={24} md={12}>
          <span className="field-label">Tenure</span>
          <InputNumber value={years} onChange={v => setYears(Number(v || 1))} suffix="years" style={{ width: "100%" }} />
        </Col>
        <Col span={24}>
          <Statistic title="Estimated monthly EMI" value={Math.round(emi)} prefix="₹" />
        </Col>
      </Row>
    </Card>
  );
}
