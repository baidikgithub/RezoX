"use client";

import Link from "next/link";
import { Button, Card, Form, Input, Typography, message } from "antd";
import { apiFetch } from "../../../lib/api";

const { Title, Paragraph } = Typography;

export default function ForgotPasswordPage() {
  const [form] = Form.useForm<{ email: string }>();
  const [messageApi, contextHolder] = message.useMessage();

  async function onFinish(values: { email: string }) {
    const response = await apiFetch<{ message: string; resetUrl?: string }>("/api/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify(values)
    });
    messageApi.success(response.message);
    if (response.resetUrl) {
      messageApi.info("Development reset link generated.");
      window.location.href = response.resetUrl;
    }
  }

  return (
    <div className="fade-in auth-card">
      {contextHolder}
      <Card className="glass-card">
        <Title level={3}>Forgot Password</Title>
        <Paragraph className="muted-line">Enter your account email to generate a secure password reset session.</Paragraph>
        <Form layout="vertical" form={form} onFinish={onFinish}>
          <Form.Item name="email" label="Email" rules={[{ required: true }, { type: "email" }]}>
            <Input size="large" placeholder="you@example.com" />
          </Form.Item>
          <Button type="primary" htmlType="submit" size="large" block>Continue</Button>
        </Form>
        <Paragraph style={{ marginTop: 16, marginBottom: 0 }}>
          Remembered it? <Link href="/signin">Sign in</Link>
        </Paragraph>
      </Card>
    </div>
  );
}
