"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button, Card, Form, Input, Typography, message } from "antd";
import { useAuth } from "../../../lib/useAuth";
import { dashboardPath } from "../../../lib/api";

const { Title, Paragraph } = Typography;

type SignUpFormValues = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export default function SignUpPage() {
  const [form] = Form.useForm<SignUpFormValues>();
  const router = useRouter();
  const [messageApi, contextHolder] = message.useMessage();
  const signup = useAuth(state => state.signup);

  const onFinish = async (values: SignUpFormValues) => {
    try {
      const payload = {
        name: values.name,
        email: values.email,
        password: values.password
      };

      const user = await signup(payload);
      messageApi.success("Account created successfully.");
      form.resetFields();
      router.push(dashboardPath(user.role));
    } catch (err: any) {
      messageApi.error(err.message || "Sign up failed.");
    }
  };

  return (
    <div className="fade-in" style={{ maxWidth: 460, margin: "0 auto" }}>
      {contextHolder}
      <Card className="glass-card auth-card">
        <Title level={3} style={{ marginTop: 0 }}>
          Sign Up
        </Title>
        <Paragraph type="secondary">
          Create your RezoX account to manage and explore properties.
        </Paragraph>

        <Form layout="vertical" form={form} onFinish={onFinish}>
          <Form.Item
            name="name"
            label="Full Name"
            rules={[{ required: true, message: "Please enter your full name." }]}
          >
            <Input size="large" placeholder="Your name" />
          </Form.Item>

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
              { required: true, message: "Please create a password." },
              { min: 8, message: "Password must be at least 8 characters." }
            ]}
          >
            <Input.Password size="large" placeholder="Create password" />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            label="Confirm Password"
            dependencies={["password"]}
            rules={[
              { required: true, message: "Please confirm your password." },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("Passwords do not match."));
                }
              })
            ]}
          >
            <Input.Password size="large" placeholder="Confirm password" />
          </Form.Item>

          <Form.Item style={{ marginBottom: 10 }}>
            <Button type="primary" htmlType="submit" size="large" block>
              Create Account
            </Button>
          </Form.Item>
        </Form>

        <Paragraph style={{ marginBottom: 0 }}>
          Already have an account? <Link href="/signin">Sign in</Link>
        </Paragraph>
      </Card>
    </div>
  );
}
