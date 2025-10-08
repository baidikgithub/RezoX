'use client';

import React, { useState } from 'react';
import { Card, Typography, Input, Button, message } from 'antd';
import { MailOutlined, SendOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;
const { Search } = Input;

const Newsletter: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (value: string) => {
    if (!value) {
      message.error('Please enter your email address');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      message.error('Please enter a valid email address');
      return;
    }

    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setEmail('');
      message.success('Successfully subscribed to our newsletter!');
    }, 1000);
  };

  return (
    <div style={{
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '80px 0',
      margin: '80px 0'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 24px'
      }}>
        <Card style={{
          background: 'rgba(255,255,255,0.95)',
          borderRadius: '16px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
          border: 'none',
          textAlign: 'center'
        }}>
          <div style={{ padding: '48px 24px' }}>
            <div style={{ marginBottom: '32px' }}>
              <MailOutlined style={{ 
                fontSize: '64px', 
                color: '#1890ff',
                marginBottom: '24px'
              }} />
              <Title level={2} style={{ 
                marginBottom: '16px',
                color: '#262626',
                fontSize: '32px',
                fontWeight: 'bold'
              }}>
                Stay Updated
              </Title>
              <Paragraph style={{
                fontSize: '18px',
                color: '#8c8c8c',
                maxWidth: '600px',
                margin: '0 auto',
                lineHeight: '1.6'
              }}>
                Get the latest property listings, market insights, and exclusive offers delivered directly to your inbox.
              </Paragraph>
            </div>

            <div style={{ maxWidth: '500px', margin: '0 auto' }}>
              <Search
                placeholder="Enter your email address"
                enterButton={
                  <Button 
                    type="primary" 
                    icon={<SendOutlined />}
                    loading={loading}
                    style={{
                      height: '48px',
                      paddingLeft: '24px',
                      paddingRight: '24px',
                      fontSize: '16px',
                      fontWeight: 'bold'
                    }}
                  >
                    Subscribe
                  </Button>
                }
                size="large"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onSearch={handleSubscribe}
                style={{
                  borderRadius: '8px',
                  overflow: 'hidden'
                }}
                inputStyle={{
                  height: '48px',
                  fontSize: '16px',
                  border: '2px solid #d9d9d9',
                  borderRadius: '8px 0 0 8px'
                }}
              />
              
              <Paragraph style={{
                fontSize: '14px',
                color: '#8c8c8c',
                marginTop: '16px',
                marginBottom: 0
              }}>
                We respect your privacy. Unsubscribe at any time.
              </Paragraph>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Newsletter;
