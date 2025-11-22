'use client';

import React from 'react';
import { Typography, Card, Button, Space, Avatar, Divider } from 'antd';
import { UserOutlined, MailOutlined, LogoutOutlined } from '@ant-design/icons';
import { useAuth } from '../../hooks/useAuth';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '../../components/ProtectedRoute';
import { useTheme } from '../../contexts/ThemeContext';

const { Title, Paragraph, Text } = Typography;

export default function Profile() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const { isDarkMode } = useTheme();

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <ProtectedRoute>
      <div style={{ 
        maxWidth: '800px', 
        margin: '0 auto', 
        padding: '40px 20px',
        minHeight: '100vh'
      }}>
        <Title level={1} style={{ 
          textAlign: 'center', 
          marginBottom: '40px',
          color: isDarkMode ? '#ffffff' : '#1a1a1a'
        }}>
          User Profile
        </Title>

        <Card
          style={{
            background: isDarkMode ? '#1f1f1f' : '#ffffff',
            border: isDarkMode ? '1px solid #434343' : '1px solid #f0f0f0',
            borderRadius: '16px',
            boxShadow: isDarkMode 
              ? '0 8px 32px rgba(0,0,0,0.3)' 
              : '0 8px 32px rgba(0,0,0,0.1)'
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <Avatar
              size={120}
              src={user?.avatar || undefined}
              icon={!user?.avatar && <UserOutlined />}
              style={{ 
                backgroundColor: '#667eea',
                color: '#ffffff',
                marginBottom: '16px'
              }}
            />
            <Title level={2} style={{ 
              margin: '16px 0 8px 0',
              color: isDarkMode ? '#ffffff' : '#1a1a1a'
            }}>
              {user?.name || 'User'}
            </Title>
            <Text style={{ 
              color: isDarkMode ? '#a0a0a0' : '#666666',
              fontSize: '16px'
            }}>
              Welcome to your profile
            </Text>
          </div>

          <Divider style={{ 
            borderColor: isDarkMode ? '#434343' : '#f0f0f0'
          }} />

          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <div>
              <Text strong style={{ 
                color: isDarkMode ? '#ffffff' : '#1a1a1a',
                fontSize: '16px'
              }}>
                <MailOutlined style={{ marginRight: '8px' }} />
                Email Address
              </Text>
              <Paragraph style={{ 
                margin: '8px 0 0 0',
                color: isDarkMode ? '#a0a0a0' : '#666666',
                fontSize: '16px'
              }}>
                {user?.email || 'No email provided'}
              </Paragraph>
            </div>

            <div>
              <Text strong style={{ 
                color: isDarkMode ? '#ffffff' : '#1a1a1a',
                fontSize: '16px'
              }}>
                <UserOutlined style={{ marginRight: '8px' }} />
                User ID
              </Text>
              <Paragraph style={{ 
                margin: '8px 0 0 0',
                color: isDarkMode ? '#a0a0a0' : '#666666',
                fontSize: '14px',
                fontFamily: 'monospace'
              }}>
                {user?._id || 'No ID available'}
              </Paragraph>
            </div>
          </Space>

          <Divider style={{ 
            borderColor: isDarkMode ? '#434343' : '#f0f0f0'
          }} />

          <div style={{ textAlign: 'center' }}>
            <Button
              type="primary"
              danger
              icon={<LogoutOutlined />}
              onClick={handleLogout}
              size="large"
              style={{
                borderRadius: '8px',
                height: '48px',
                padding: '0 32px',
                fontSize: '16px',
                fontWeight: '600'
              }}
            >
              Sign Out
            </Button>
          </div>
        </Card>
      </div>
    </ProtectedRoute>
  );
}


