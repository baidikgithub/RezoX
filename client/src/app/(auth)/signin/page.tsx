"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button, Card, Form, Input, Typography, message } from "antd";

const { Title, Paragraph } = Typography;

type SignInFormValues = {
  email: string;
  password: string;
};

export default function SignInPage() {
  const [form] = Form.useForm<SignInFormValues>();
  const router = useRouter();
  const [messageApi, contextHolder] = message.useMessage();

  const onFinish = async (values: SignInFormValues) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/auth/signin`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values)
        }
      );

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.error || "Unable to sign in. Please try again.");
      }

      messageApi.success("Signed in successfully.");
      form.resetFields();
      router.push("/admin");
    } catch (err: any) {
      messageApi.error(err.message || "Sign in failed.");
    }
  };

  return (
    <div className="fade-in" style={{ maxWidth: 460, margin: "0 auto" }}>
      {contextHolder}
      <Card className="surface-card">
        <Title level={3} style={{ marginTop: 0 }}>
          Sign In
        </Title>
        <Paragraph type="secondary">
          Welcome back. Sign in to continue using RezoX.
        </Paragraph>

        <Form layout="vertical" form={form} onFinish={onFinish}>
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: "Please enter your email." },
              { type: "email", message: "Please enter a valid email address." }
            ]}
          >
            <Input size="large" placeholder="you@example.com" />
          </Form.Item>

          <Form.Item
            name="password"
            label="Password"
            rules={[
              { required: true, message: "Please enter your password." },
              { min: 6, message: "Password must be at least 6 characters." }
            ]}
          >
            <Input.Password size="large" placeholder="Enter password" />
          </Form.Item>

          <Form.Item style={{ marginBottom: 10 }}>
            <Button type="primary" htmlType="submit" size="large" block>
              Sign In
            </Button>
          </Form.Item>
        </Form>

        <Paragraph style={{ marginBottom: 0 }}>
          New user? <Link href="/signup">Create an account</Link>
        </Paragraph>
      </Card>
    </div>
  );
}
