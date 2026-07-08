"use client";

import Link from "next/link";
import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button, Card, Form, Input, Typography, message } from "antd";
import { apiFetch } from "../../../lib/api";

const { Title, Paragraph } = Typography;

function ResetPasswordPageContent() {
  const [form] = Form.useForm<{ token: string; password: string; confirmPassword: string }>();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [messageApi, contextHolder] = message.useMessage();

  async function onFinish(values: { token: string; password: string }) {
    await apiFetch("/api/auth/reset-password", {
      method: "POST",
      body: JSON.stringify({ token: values.token, password: values.password })
    });
    messageApi.success("Password reset successfully.");
    router.push("/signin");
  }

  return (
    <div className="fade-in auth-card">
      {contextHolder}
      <Card className="glass-card">
        <Title level={3}>Reset Password</Title>
        <Paragraph className="muted-line">Create a new password with at least 8 characters.</Paragraph>
        <Form layout="vertical" form={form} onFinish={onFinish} initialValues={{ token: searchParams.get("token") || "" }}>
          <Form.Item name="token" label="Reset Token" rules={[{ required: true, message: "Reset token is required." }]}>
            <Input size="large" />
          </Form.Item>
          <Form.Item name="password" label="New Password" rules={[{ required: true }, { min: 8 }]}>
            <Input.Password size="large" />
          </Form.Item>
          <Form.Item
            name="confirmPassword"
            label="Confirm Password"
            dependencies={["password"]}
            rules={[
              { required: true },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  return !value || getFieldValue("password") === value
                    ? Promise.resolve()
                    : Promise.reject(new Error("Passwords do not match."));
                }
              })
            ]}
          >
            <Input.Password size="large" />
          </Form.Item>
          <Button type="primary" htmlType="submit" size="large" block>Reset Password</Button>
        </Form>
        <Paragraph style={{ marginTop: 16, marginBottom: 0 }}>
          Back to <Link href="/signin">Sign in</Link>
        </Paragraph>
      </Card>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<Card className="glass-card auth-card">Loading reset session...</Card>}>
      <ResetPasswordPageContent />
    </Suspense>
  );
}
