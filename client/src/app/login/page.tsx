'use client';

import React, { useState } from 'react';
import { Layout, Typography, Form, Input, Button, Card, Divider, message } from 'antd';
import { UserOutlined, LockOutlined, GoogleOutlined, FacebookOutlined } from '@ant-design/icons';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { LoginForm } from '../../utils/types';

const { Content } = Layout;
const { Title, Paragraph, Text } = Typography;

export default function Login() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: LoginForm) => {
    setLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('Login values:', values);
      message.success('Login successful!');
      
      // In a real app, you would:
      // 1. Send credentials to your API
      // 2. Store the token in localStorage/cookies
      // 3. Redirect to dashboard or home page
      
    } catch (error) {
      message.error('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    message.info('Google login integration coming soon!');
  };

  const handleFacebookLogin = () => {
    message.info('Facebook login integration coming soon!');
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Navbar />
      
      <Content style={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '80px 0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
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
                Welcome Back
              </Title>
              <Paragraph style={{ color: '#8c8c8c', margin: 0 }}>
                Sign in to your account to continue
              </Paragraph>
            </div>

            <Form
              form={form}
              name="login"
              onFinish={onFinish}
              layout="vertical"
              size="large"
            >
              <Form.Item
                name="email"
                label="Email Address"
                rules={[
                  { required: true, message: 'Please input your email!' },
                  { type: 'email', message: 'Please enter a valid email!' }
                ]}
              >
                <Input
                  prefix={<UserOutlined style={{ color: '#8c8c8c' }} />}
                  placeholder="Enter your email"
                />
              </Form.Item>

              <Form.Item
                name="password"
                label="Password"
                rules={[
                  { required: true, message: 'Please input your password!' },
                  { min: 6, message: 'Password must be at least 6 characters!' }
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined style={{ color: '#8c8c8c' }} />}
                  placeholder="Enter your password"
                />
              </Form.Item>

              <Form.Item>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  marginBottom: '24px'
                }}>
                  <label style={{ cursor: 'pointer' }}>
                    <input type="checkbox" style={{ marginRight: '8px' }} />
                    <Text style={{ fontSize: '14px' }}>Remember me</Text>
                  </label>
                  <Link href="/forgot-password" style={{ color: '#1890ff', fontSize: '14px' }}>
                    Forgot password?
                  </Link>
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
                  Sign In
                </Button>
              </Form.Item>
            </Form>

            <Divider style={{ margin: '24px 0' }}>
              <Text style={{ color: '#8c8c8c' }}>Or continue with</Text>
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
                onClick={handleGoogleLogin}
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
                onClick={handleFacebookLogin}
              >
                Facebook
              </Button>
            </div>

            <div style={{ textAlign: 'center' }}>
              <Text style={{ color: '#8c8c8c' }}>
                Don't have an account?{' '}
                <Link href="/signup" style={{ color: '#1890ff', fontWeight: 'bold' }}>
                  Sign up here
                </Link>
              </Text>
            </div>
          </Card>
        </div>
      </Content>
      
      <Footer />
    </Layout>
  );
}
