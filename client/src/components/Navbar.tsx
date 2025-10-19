'use client';

import React, { useState } from 'react';
import { Layout, Menu, Button, Drawer, Typography, Switch, Dropdown, Avatar, message } from 'antd';
import { MenuOutlined, HomeOutlined, SearchOutlined, UserOutlined, LoginOutlined, SunOutlined, MoonOutlined, LogoutOutlined, SettingOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../hooks/useAuth';

const { Header } = Layout;
const { Title } = Typography;

const Navbar: React.FC = () => {
  const [mobileMenuVisible, setMobileMenuVisible] = useState(false);
  const { isDarkMode, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const router = useRouter();

  const menuItems = [
    {
      key: 'home',
      label: <Link href="/">Home</Link>,
      icon: <HomeOutlined />,
    },
    {
      key: 'listings',
      label: <Link href="/listings">Properties</Link>,
      icon: <SearchOutlined />,
    },
    { 
      key: 'about',
      label: <Link href="/about">About</Link>,
    },
    {
      key: 'contact',
      label: 'Contact',
    },
  ];

  const adminMenuItems = [
    {
      key: 'admin',
      label: <Link href="/admin">Admin Dashboard</Link>,
      icon: <SettingOutlined />,
    },
  ];

  const handleLogout = async () => {
    try {
      await logout();
      message.success('Logged out successfully');
      router.push('/');
    } catch (error: any) {
      message.error('Logout failed. Please try again.');
    }
  };

  const userMenuItems = [
    {
      key: 'profile',
      label: <Link href="/profile">Profile</Link>,
      icon: <UserOutlined />,
    },
    {
      key: 'settings',
      label: 'Settings',
      icon: <SettingOutlined />,
    },
    ...(user?.email === 'admin@rezoX.com' ? adminMenuItems : []),
    {
      type: 'divider' as const,
    },
    {
      key: 'logout',
      label: 'Logout',
      icon: <LogoutOutlined />,
      onClick: handleLogout,
    },
  ];

  const authItems = user ? [] : [
    {
      key: 'login',
      label: <Link href="/login">Login</Link>,
      icon: <LoginOutlined />,
    },
    {
      key: 'signup',
      label: <Link href="/signup">Sign Up</Link>,
      icon: <UserOutlined />,
    },
  ];

  return (
    <Header style={{ 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'space-between',
      padding: '0 24px',
      background: isDarkMode ? '#1f1f1f' : '#ffffff',
      boxShadow: isDarkMode ? '0 2px 8px rgba(0,0,0,0.3)' : '0 2px 8px rgba(0,0,0,0.1)',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      borderBottom: isDarkMode ? '1px solid #434343' : 'none'
    }}>
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Title level={3} style={{ 
          margin: 0, 
          color: isDarkMode ? '#ffffff' : '#1890ff',
          fontWeight: '700'
        }}>
          RezoX
        </Title>
      </div>

      {/* Desktop Menu */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
        <Menu
          mode="horizontal"
          items={menuItems.map(item => ({
            ...item,
            icon: item.icon ? React.cloneElement(item.icon as React.ReactElement, {
              style: { color: isDarkMode ? '#d9d9d9' : '#666666' }
            } as any) : undefined
          }))}
          style={{ 
            flex: 1, 
            minWidth: 0, 
            border: 'none',
            background: 'transparent',
            color: isDarkMode ? '#ffffff' : '#000000'
          }}
        />
        
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <Switch
            checked={isDarkMode}
            onChange={toggleTheme}
            checkedChildren={<MoonOutlined style={{ color: '#ffffff' }} />}
            unCheckedChildren={<SunOutlined style={{ color: '#ffffff' }} />}
            style={{ 
              marginRight: '16px',
              backgroundColor: isDarkMode ? '#434343' : '#d9d9d9'
            }}
          />
          {user ? (
            <Dropdown
              menu={{ items: userMenuItems }}
              placement="bottomRight"
              arrow
            >
              <Button 
                type="text" 
                style={{
                  color: isDarkMode ? '#ffffff' : '#000000',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '4px 8px',
                  height: 'auto'
                }}
              >
                <Avatar 
                  size="small" 
                  src={user.avatar || undefined}
                  icon={!user.avatar && <UserOutlined />}
                  style={{ 
                    backgroundColor: '#667eea',
                    color: '#ffffff'
                  }}
                />
                <span style={{ fontSize: '14px' }}>
                  {user.name || user.email?.split('@')[0] || 'User'}
                </span>
              </Button>
            </Dropdown>
          ) : (
            authItems.map(item => (
              <Button 
                key={item.key} 
                type="text" 
                icon={React.cloneElement(item.icon as React.ReactElement, {
                  style: { color: isDarkMode ? '#d9d9d9' : '#666666' }
                } as any)}
                style={{
                  color: isDarkMode ? '#ffffff' : '#000000'
                }}
              >
                {item.label}
              </Button>
            ))
          )}
        </div>
      </div>

      {/* Mobile Menu Button */}
      <Button
        type="text"
        icon={<MenuOutlined style={{ color: isDarkMode ? '#ffffff' : '#000000' }} />}
        onClick={() => setMobileMenuVisible(true)}
        style={{ 
          display: 'none',
          color: isDarkMode ? '#ffffff' : '#000000'
        }}
        className="mobile-menu-btn"
      />

      {/* Mobile Drawer */}
      <Drawer
        title={
          <span style={{ color: isDarkMode ? '#ffffff' : '#000000' }}>
            Menu
          </span>
        }
        placement="right"
        onClose={() => setMobileMenuVisible(false)}
        open={mobileMenuVisible}
        width={280}
        style={{
          background: isDarkMode ? '#1f1f1f' : '#ffffff'
        }}
        headerStyle={{
          background: isDarkMode ? '#1f1f1f' : '#ffffff',
          borderBottom: isDarkMode ? '1px solid #434343' : '1px solid #f0f0f0'
        }}
        bodyStyle={{
          background: isDarkMode ? '#1f1f1f' : '#ffffff'
        }}
      >
        <Menu
          mode="vertical"
          items={[
            ...menuItems,
            ...authItems,
            ...(user ? userMenuItems : [])
          ].map(item => ({
            ...item,
            icon: item.icon ? React.cloneElement(item.icon as React.ReactElement, {
              style: { color: isDarkMode ? '#d9d9d9' : '#666666' }
            } as any) : undefined
          }))}
          style={{ 
            border: 'none',
            background: 'transparent',
            color: isDarkMode ? '#ffffff' : '#000000'
          }}
        />
      </Drawer>

      <style jsx>{`
        @media (max-width: 768px) {
          .mobile-menu-btn {
            display: block !important;
          }
          
          .ant-menu-horizontal {
            display: none !important;
          }
          
          .ant-btn {
            display: none !important;
          }
        }
        
        /* Dark mode styles for navbar */
        .ant-menu-item {
          color: ${isDarkMode ? '#ffffff' : '#000000'} !important;
        }
        
        .ant-menu-item:hover {
          color: ${isDarkMode ? '#1890ff' : '#1890ff'} !important;
          background: ${isDarkMode ? 'rgba(24, 144, 255, 0.1)' : 'rgba(24, 144, 255, 0.05)'} !important;
        }
        
        .ant-menu-item a {
          color: inherit !important;
        }
        
        .ant-menu-item a:hover {
          color: inherit !important;
        }
        
        .ant-btn-text:hover {
          color: ${isDarkMode ? '#1890ff' : '#1890ff'} !important;
          background: ${isDarkMode ? 'rgba(24, 144, 255, 0.1)' : 'rgba(24, 144, 255, 0.05)'} !important;
        }
        
        .ant-switch-checked {
          background-color: #1890ff !important;
        }
        
        .ant-drawer .ant-drawer-content {
          background: ${isDarkMode ? '#1f1f1f' : '#ffffff'} !important;
        }
        
        .ant-drawer .ant-drawer-header {
          background: ${isDarkMode ? '#1f1f1f' : '#ffffff'} !important;
          border-bottom: ${isDarkMode ? '1px solid #434343' : '1px solid #f0f0f0'} !important;
        }
        
        .ant-drawer .ant-drawer-title {
          color: ${isDarkMode ? '#ffffff' : '#000000'} !important;
        }
        
        .ant-drawer .ant-drawer-close {
          color: ${isDarkMode ? '#ffffff' : '#000000'} !important;
        }
        
        .ant-drawer .ant-drawer-close:hover {
          color: ${isDarkMode ? '#1890ff' : '#1890ff'} !important;
        }
      `}</style>
    </Header>
  );
};

export default Navbar;
