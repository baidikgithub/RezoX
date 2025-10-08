'use client';

import React, { useState } from 'react';
import { Layout, Menu, Button, Drawer, Typography } from 'antd';
import { MenuOutlined, HomeOutlined, SearchOutlined, UserOutlined, LoginOutlined } from '@ant-design/icons';
import Link from 'next/link';

const { Header } = Layout;
const { Title } = Typography;

const Navbar: React.FC = () => {
  const [mobileMenuVisible, setMobileMenuVisible] = useState(false);

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
      label: 'About',
    },
    {
      key: 'contact',
      label: 'Contact',
    },
  ];

  const authItems = [
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
      background: '#fff',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      position: 'sticky',
      top: 0,
      zIndex: 1000
    }}>
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Title level={3} style={{ margin: 0, color: '#1890ff' }}>
          RezoX
        </Title>
      </div>

      {/* Desktop Menu */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
        <Menu
          mode="horizontal"
          items={menuItems}
          style={{ 
            flex: 1, 
            minWidth: 0, 
            border: 'none',
            background: 'transparent'
          }}
        />
        
        <div style={{ display: 'flex', gap: '8px' }}>
          {authItems.map(item => (
            <Button key={item.key} type="text" icon={item.icon}>
              {item.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Mobile Menu Button */}
      <Button
        type="text"
        icon={<MenuOutlined />}
        onClick={() => setMobileMenuVisible(true)}
        style={{ display: 'none' }}
        className="mobile-menu-btn"
      />

      {/* Mobile Drawer */}
      <Drawer
        title="Menu"
        placement="right"
        onClose={() => setMobileMenuVisible(false)}
        open={mobileMenuVisible}
        width={280}
      >
        <Menu
          mode="vertical"
          items={[...menuItems, ...authItems]}
          style={{ border: 'none' }}
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
      `}</style>
    </Header>
  );
};

export default Navbar;
