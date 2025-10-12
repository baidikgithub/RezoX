'use client';

import React, { useState } from 'react';
import { Typography, Form, Input, Button, message, Space, Divider } from 'antd';
import { UserOutlined, LockOutlined, GoogleOutlined, FacebookOutlined, EyeInvisibleOutlined, EyeTwoTone, ArrowRightOutlined } from '@ant-design/icons';
import Link from 'next/link';
import AuthLayout from '../../components/layouts/AuthLayout';
import { LoginForm } from '../../utils/types';
import { useTheme } from '../../contexts/ThemeContext';
const { Title, Paragraph, Text } = Typography;

export default function Login() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const { isDarkMode } = useTheme();

  const onFinish = async (values: LoginForm) => {
    setLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Login values:', values);
      message.success('Welcome back! Redirecting...');
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
    <AuthLayout>
      <div className="auth-container" style={{
        display: 'flex',
        width: '100%',
        maxWidth: '1400px',
        minHeight: '700px',
        borderRadius: '24px',
        overflow: 'hidden',
        boxShadow: isDarkMode 
          ? '0 32px 80px rgba(0,0,0,0.6)' 
          : '0 32px 80px rgba(0,0,0,0.12)',
        background: isDarkMode ? '#0f0f0f' : '#ffffff',
        position: 'relative',
        zIndex: 1,
        margin: '20px'
      }}>
        {/* Left Side - Form */}
        <div className="auth-form" style={{
          flex: '0 0 50%',
          padding: '80px 60px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          background: isDarkMode ? '#0f0f0f' : '#ffffff',
          position: 'relative'
        }}>
          {/* Header */}
          <div style={{ 
            marginBottom: '48px',
            animation: 'slideInUp 0.8s ease-out'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '24px'
            }}>
              <div style={{
                width: '48px',
                height: '48px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px',
                color: '#ffffff',
                fontWeight: 'bold',
                marginRight: '16px'
              }}>
                R
              </div>
              <Title level={2} style={{ 
                margin: 0,
                color: isDarkMode ? '#ffffff' : '#1a1a1a',
                fontSize: '32px',
                fontWeight: '700',
                letterSpacing: '-0.02em'
              }}>
                RezoX
              </Title>
            </div>
            <Title level={1} style={{ 
              marginBottom: '12px', 
              color: isDarkMode ? '#ffffff' : '#1a1a1a',
              fontSize: '40px',
              fontWeight: '800',
              lineHeight: '1.1',
              letterSpacing: '-0.02em'
            }}>
              Welcome back
            </Title>
            <Paragraph style={{ 
              color: isDarkMode ? '#a0a0a0' : '#666666', 
              margin: 0,
              fontSize: '18px',
              lineHeight: '1.5'
            }}>
              Sign in to continue your real estate journey
            </Paragraph>
          </div>

          <div style={{ animation: 'slideInUp 0.8s ease-out 0.2s both' }}>
            <Form
              form={form}
              name="login"
              onFinish={onFinish}
              layout="vertical"
              size="large"
              style={{ marginBottom: '32px' }}
            >
              <Form.Item
                name="email"
                rules={[
                  { required: true, message: 'Please enter your email address' },
                  { type: 'email', message: 'Please enter a valid email address' }
                ]}
              >
                <Input
                  prefix={<UserOutlined style={{ color: isDarkMode ? '#666666' : '#999999' }} />}
                  placeholder="Enter your email"
                  style={{
                    height: '56px',
                    borderRadius: '16px',
                    border: `2px solid ${isDarkMode ? '#2a2a2a' : '#e5e5e5'}`,
                    background: isDarkMode ? '#1a1a1a' : '#fafafa',
                    color: isDarkMode ? '#ffffff' : '#1a1a1a',
                    fontSize: '16px',
                    padding: '0 20px',
                    transition: 'all 0.3s ease'
                  }}
                />
              </Form.Item>

              <Form.Item
                name="password"
                rules={[
                  { required: true, message: 'Please enter your password' },
                  { min: 6, message: 'Password must be at least 6 characters' }
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined style={{ color: isDarkMode ? '#666666' : '#999999' }} />}
                  placeholder="Enter your password"
                  iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                  style={{
                    height: '56px',
                    borderRadius: '16px',
                    border: `2px solid ${isDarkMode ? '#2a2a2a' : '#e5e5e5'}`,
                    background: isDarkMode ? '#1a1a1a' : '#fafafa',
                    color: isDarkMode ? '#ffffff' : '#1a1a1a',
                    fontSize: '16px',
                    padding: '0 20px',
                    transition: 'all 0.3s ease'
                  }}
                />
              </Form.Item>

              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                marginBottom: '32px'
              }}>
                <label style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                  <input 
                    type="checkbox" 
                    style={{ 
                      marginRight: '12px',
                      accentColor: '#667eea',
                      transform: 'scale(1.2)'
                    }} 
                  />
                  <Text style={{ 
                    fontSize: '15px',
                    color: isDarkMode ? '#a0a0a0' : '#666666',
                    fontWeight: '500'
                  }}>
                    Remember me
                  </Text>
                </label>
                <Link 
                  href="/forgot-password" 
                  style={{ 
                    color: '#667eea', 
                    fontSize: '15px',
                    fontWeight: '600',
                    textDecoration: 'none',
                    transition: 'color 0.3s ease'
                  }}
                >
                  Forgot password?
                </Link>
              </div>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  style={{
                    width: '100%',
                    height: '56px',
                    fontSize: '18px',
                    fontWeight: '600',
                    borderRadius: '16px',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    border: 'none',
                    boxShadow: '0 8px 32px rgba(102, 126, 234, 0.3)',
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 12px 40px rgba(102, 126, 234, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 8px 32px rgba(102, 126, 234, 0.3)';
                  }}
                >
                  Sign In
                  <ArrowRightOutlined />
                </Button>
              </Form.Item>
            </Form>

            <Divider style={{ 
              margin: '32px 0',
              borderColor: isDarkMode ? '#2a2a2a' : '#e5e5e5'
            }}>
              <Text style={{ 
                color: isDarkMode ? '#666666' : '#999999',
                fontSize: '14px',
                fontWeight: '500',
                padding: '0 20px',
                background: isDarkMode ? '#0f0f0f' : '#ffffff'
              }}>
                Or continue with
              </Text>
            </Divider>

            <Space direction="vertical" size="middle" style={{ width: '100%', marginBottom: '32px' }}>
              <Button
                icon={<GoogleOutlined style={{ color: '#4285f4', fontSize: '20px' }} />}
                style={{
                  width: '100%',
                  height: '56px',
                  borderRadius: '16px',
                  border: `2px solid ${isDarkMode ? '#2a2a2a' : '#e5e5e5'}`,
                  background: isDarkMode ? '#1a1a1a' : '#ffffff',
                  color: isDarkMode ? '#ffffff' : '#1a1a1a',
                  fontSize: '16px',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '12px',
                  transition: 'all 0.3s ease'
                }}
                onClick={handleGoogleLogin}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#4285f4';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = isDarkMode ? '#2a2a2a' : '#e5e5e5';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                Continue with Google
              </Button>
              
              <Button
                icon={<FacebookOutlined style={{ color: '#1877f2', fontSize: '20px' }} />}
                style={{
                  width: '100%',
                  height: '56px',
                  borderRadius: '16px',
                  border: `2px solid ${isDarkMode ? '#2a2a2a' : '#e5e5e5'}`,
                  background: isDarkMode ? '#1a1a1a' : '#ffffff',
                  color: isDarkMode ? '#ffffff' : '#1a1a1a',
                  fontSize: '16px',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '12px',
                  transition: 'all 0.3s ease'
                }}
                onClick={handleFacebookLogin}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#1877f2';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = isDarkMode ? '#2a2a2a' : '#e5e5e5';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                Continue with Facebook
              </Button>
            </Space>

            <div style={{ 
              textAlign: 'center',
              animation: 'slideInUp 0.8s ease-out 0.4s both'
            }}>
              <Text style={{ 
                color: isDarkMode ? '#666666' : '#999999',
                fontSize: '16px'
              }}>
                Don't have an account?{' '}
                <Link 
                  href="/signup" 
                  style={{ 
                    color: '#667eea', 
                    fontWeight: '700',
                    textDecoration: 'none',
                    fontSize: '16px',
                    transition: 'color 0.3s ease'
                  }}
                >
                  Create one now
                </Link>
              </Text>
            </div>
          </div>
        </div>

        {/* Right Side - Visual */}
        <div className="auth-visual" style={{
          flex: '0 0 50%',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '80px 60px',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Background Pattern */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `
              radial-gradient(circle at 20% 80%, rgba(255,255,255,0.1) 0%, transparent 50%),
              radial-gradient(circle at 80% 20%, rgba(255,255,255,0.08) 0%, transparent 50%),
              radial-gradient(circle at 40% 40%, rgba(255,255,255,0.05) 0%, transparent 50%)
            `,
            opacity: 0.6
          }} />
          
          {/* Content */}
          <div style={{
            textAlign: 'center',
            color: '#ffffff',
            zIndex: 2,
            animation: 'slideInRight 0.8s ease-out'
          }}>
            <div style={{
              fontSize: '140px',
              marginBottom: '32px',
              opacity: 0.9,
              filter: 'drop-shadow(0 8px 32px rgba(0,0,0,0.2))'
            }}>
              🏡
            </div>
            <Title level={1} style={{ 
              color: '#ffffff', 
              marginBottom: '24px',
              fontSize: '48px',
              fontWeight: '800',
              lineHeight: '1.1',
              letterSpacing: '-0.02em'
            }}>
              Find Your Dream Home
            </Title>
            <Paragraph style={{ 
              color: 'rgba(255, 255, 255, 0.9)', 
              fontSize: '20px',
              lineHeight: '1.6',
              maxWidth: '400px',
              margin: '0 auto',
              fontWeight: '400'
            }}>
              Discover amazing properties, connect with trusted agents, and make your real estate dreams come true
            </Paragraph>
          </div>

          {/* Floating Elements */}
          <div style={{
            position: 'absolute',
            top: '20%',
            right: '10%',
            width: '80px',
            height: '80px',
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '50%',
            animation: 'float 6s ease-in-out infinite'
          }} />
          <div style={{
            position: 'absolute',
            bottom: '20%',
            left: '10%',
            width: '60px',
            height: '60px',
            background: 'rgba(255, 255, 255, 0.08)',
            borderRadius: '50%',
            animation: 'float 8s ease-in-out infinite reverse'
          }} />
        </div>
      </div>

      <style jsx>{`
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(40px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        
        .auth-container input:focus {
          border-color: #667eea !important;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1) !important;
          background: ${isDarkMode ? '#1a1a1a' : '#ffffff'} !important;
        }
        
        @media (max-width: 1024px) {
          .auth-container {
            flex-direction: column !important;
            max-width: 100% !important;
            margin: 10px !important;
            min-height: auto !important;
          }
          
          .auth-form {
            flex: none !important;
            padding: 60px 40px !important;
          }
          
          .auth-visual {
            flex: none !important;
            padding: 60px 40px !important;
            min-height: 400px !important;
          }
        }
        
        @media (max-width: 768px) {
          .auth-form {
            padding: 40px 30px !important;
          }
          
          .auth-visual {
            padding: 40px 30px !important;
            min-height: 300px !important;
          }
          
          .auth-visual h1 {
            font-size: 36px !important;
          }
          
          .auth-visual p {
            font-size: 16px !important;
          }
        }
      `}</style>
    </AuthLayout>
  );
}
