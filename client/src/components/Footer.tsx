'use client';

import React from 'react';
import { Layout, Typography, Row, Col, Space, Divider } from 'antd';
import { 
  HomeOutlined, 
  PhoneOutlined, 
  MailOutlined, 
  EnvironmentOutlined,
  FacebookOutlined,
  TwitterOutlined,
  InstagramOutlined,
  LinkedinOutlined
} from '@ant-design/icons';
import Link from 'next/link';

const { Footer: AntFooter } = Layout;
const { Title, Paragraph, Text } = Typography;

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    company: [
      { label: 'About Us', href: '/about' },
      { label: 'Our Team', href: '/team' },
      { label: 'Careers', href: '/careers' },
      { label: 'Press', href: '/press' },
    ],
    services: [
      { label: 'Buy Properties', href: '/listings?type=sale' },
      { label: 'Rent Properties', href: '/listings?type=rent' },
      { label: 'Property Management', href: '/services/management' },
      { label: 'Investment', href: '/services/investment' },
    ],
    support: [
      { label: 'Help Center', href: '/help' },
      { label: 'Contact Us', href: '/contact' },
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms of Service', href: '/terms' },
    ],
  };

  const socialLinks = [
    { icon: <FacebookOutlined />, href: '#', color: '#1877f2' },
    { icon: <TwitterOutlined />, href: '#', color: '#1da1f2' },
    { icon: <InstagramOutlined />, href: '#', color: '#e4405f' },
    { icon: <LinkedinOutlined />, href: '#', color: '#0077b5' },
  ];

  return (
    <AntFooter style={{
      background: '#001529',
      color: 'white',
      padding: '64px 0 24px',
      marginTop: '80px'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
        <Row gutter={[48, 48]}>
          {/* Company Info */}
          <Col xs={24} sm={12} md={6}>
            <div style={{ marginBottom: '24px' }}>
              <Title level={3} style={{ color: 'white', marginBottom: '16px' }}>
                <HomeOutlined style={{ marginRight: '8px', color: '#1890ff' }} />
                RezoX
              </Title>
              <Paragraph style={{ color: '#8c8c8c', fontSize: '14px', lineHeight: '1.6' }}>
                Your trusted partner in finding the perfect property. We make real estate simple, 
                transparent, and accessible for everyone.
              </Paragraph>
            </div>
            
            <Space direction="vertical" size="small">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <PhoneOutlined style={{ color: '#1890ff' }} />
                <Text style={{ color: '#8c8c8c' }}>+1 (555) 123-4567</Text>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <MailOutlined style={{ color: '#1890ff' }} />
                <Text style={{ color: '#8c8c8c' }}>info@rezoX.com</Text>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <EnvironmentOutlined style={{ color: '#1890ff' }} />
                <Text style={{ color: '#8c8c8c' }}>123 Real Estate Ave, City, State 12345</Text>
              </div>
            </Space>
          </Col>

          {/* Company Links */}
          <Col xs={24} sm={12} md={6}>
            <Title level={4} style={{ color: 'white', marginBottom: '24px' }}>
              Company
            </Title>
            <Space direction="vertical" size="small">
              {footerLinks.company.map((link, index) => (
                <Link key={index} href={link.href} style={{ color: '#8c8c8c', fontSize: '14px' }}>
                  {link.label}
                </Link>
              ))}
            </Space>
          </Col>

          {/* Services Links */}
          <Col xs={24} sm={12} md={6}>
            <Title level={4} style={{ color: 'white', marginBottom: '24px' }}>
              Services
            </Title>
            <Space direction="vertical" size="small">
              {footerLinks.services.map((link, index) => (
                <Link key={index} href={link.href} style={{ color: '#8c8c8c', fontSize: '14px' }}>
                  {link.label}
                </Link>
              ))}
            </Space>
          </Col>

          {/* Support Links */}
          <Col xs={24} sm={12} md={6}>
            <Title level={4} style={{ color: 'white', marginBottom: '24px' }}>
              Support
            </Title>
            <Space direction="vertical" size="small">
              {footerLinks.support.map((link, index) => (
                <Link key={index} href={link.href} style={{ color: '#8c8c8c', fontSize: '14px' }}>
                  {link.label}
                </Link>
              ))}
            </Space>
          </Col>
        </Row>

        <Divider style={{ borderColor: '#434343', margin: '48px 0 24px' }} />

        {/* Bottom Section */}
        <Row justify="space-between" align="middle">
          <Col xs={24} sm={12}>
            <Text style={{ color: '#8c8c8c', fontSize: '14px' }}>
              © {currentYear} RezoX. All rights reserved.
            </Text>
          </Col>
          <Col xs={24} sm={12}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'flex-end', 
              gap: '16px',
              marginTop: '16px'
            }}>
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  style={{
                    color: social.color,
                    fontSize: '20px',
                    transition: 'transform 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.2)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </Col>
        </Row>
      </div>
    </AntFooter>
  );
};

export default Footer;
