'use client';

import React, { useState } from 'react';
import { Typography, Form, Input, Button, Card, Divider, message } from 'antd';
import { UserOutlined, MailOutlined, LockOutlined, GoogleOutlined, FacebookOutlined } from '@ant-design/icons';
import Link from 'next/link';
import AuthLayout from '../../components/layouts/AuthLayout';
import { SignupForm } from '../../utils/types';
const { Title, Paragraph, Text } = Typography;

export default function Signup() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: SignupForm) => {
    setLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('Signup values:', values);
      message.success('Account created successfully!');
      
      // In a real app, you would:
      // 1. Send user data to your API
      // 2. Store the token in localStorage/cookies
      // 3. Redirect to dashboard or home page
      
    } catch (error) {
      message.error('Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = () => {
    message.info('Google signup integration coming soon!');
  };

  const handleFacebookSignup = () => {
    message.info('Facebook signup integration coming soon!');
  };

  return (
    <AuthLayout>
      <div style={{ maxWidth: '400px', width: '100%', padding: '0 24px' }}>
        <Card
          style={{
            borderRadius: '16px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
            border: 'none'
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <Title level={2} style={{ marginBottom: '8px', color: '#262626' }}>
              Create Account
            </Title>
            <Paragraph style={{ color: '#8c8c8c', margin: 0 }}>
              Join us today and start your real estate journey
            </Paragraph>
          </div>

          <Form
            form={form}
            name="signup"
            onFinish={onFinish}
            layout="vertical"
            size="large"
          >
            <Form.Item
              name="name"
              label="Full Name"
              rules={[
                { required: true, message: 'Please input your full name!' },
                { min: 2, message: 'Name must be at least 2 characters!' }
              ]}
            >
              <Input
                prefix={<UserOutlined style={{ color: '#8c8c8c' }} />}
                placeholder="Enter your full name"
              />
            </Form.Item>

            <Form.Item
              name="email"
              label="Email Address"
              rules={[
                { required: true, message: 'Please input your email!' },
                { type: 'email', message: 'Please enter a valid email!' }
              ]}
            >
              <Input
                prefix={<MailOutlined style={{ color: '#8c8c8c' }} />}
                placeholder="Enter your email"
              />
            </Form.Item>

            <Form.Item
              name="password"
              label="Password"
              rules={[
                { required: true, message: 'Please input your password!' },
                { min: 8, message: 'Password must be at least 8 characters!' },
                { 
                  pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                  message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number!'
                }
              ]}
            >
              <Input.Password
                prefix={<LockOutlined style={{ color: '#8c8c8c' }} />}
                placeholder="Create a strong password"
              />
            </Form.Item>

            <Form.Item
              name="confirmPassword"
              label="Confirm Password"
              dependencies={['password']}
              rules={[
                { required: true, message: 'Please confirm your password!' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('Passwords do not match!'));
                  },
                }),
              ]}
            >
              <Input.Password
                prefix={<LockOutlined style={{ color: '#8c8c8c' }} />}
                placeholder="Confirm your password"
              />
            </Form.Item>

            <Form.Item>
              <div style={{ marginBottom: '24px' }}>
                <label style={{ cursor: 'pointer', display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                  <input type="checkbox" style={{ marginTop: '2px' }} required />
                  <Text style={{ fontSize: '14px', lineHeight: '1.4' }}>
                    I agree to the{' '}
                    <Link href="/terms" style={{ color: '#1890ff' }}>
                      Terms of Service
                    </Link>{' '}
                    and{' '}
                    <Link href="/privacy" style={{ color: '#1890ff' }}>
                      Privacy Policy
                    </Link>
                  </Text>
                </label>
              </div>
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                style={{
                  width: '100%',
                  height: '48px',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  borderRadius: '8px'
                }}
              >
                Create Account
              </Button>
            </Form.Item>
          </Form>

          <Divider style={{ margin: '24px 0' }}>
            <Text style={{ color: '#8c8c8c' }}>Or sign up with</Text>
          </Divider>

          <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
            <Button
              icon={<GoogleOutlined />}
              style={{
                flex: 1,
                height: '48px',
                borderRadius: '8px',
                border: '1px solid #d9d9d9'
              }}
              onClick={handleGoogleSignup}
            >
              Google
            </Button>
            <Button
              icon={<FacebookOutlined />}
              style={{
                flex: 1,
                height: '48px',
                borderRadius: '8px',
                border: '1px solid #d9d9d9'
              }}
              onClick={handleFacebookSignup}
            >
              Facebook
            </Button>
          </div>

          <div style={{ textAlign: 'center' }}>
            <Text style={{ color: '#8c8c8c' }}>
              Already have an account?{' '}
              <Link href="/login" style={{ color: '#1890ff', fontWeight: 'bold' }}>
                Sign in here
              </Link>
            </Text>
          </div>
        </Card>
      </div>
    </AuthLayout>
  );
}
