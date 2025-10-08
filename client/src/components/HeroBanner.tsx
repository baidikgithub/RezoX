'use client';

import React from 'react';
import { Card, Button, Typography, Row, Col, Input, Select } from 'antd';
import { SearchOutlined, EnvironmentOutlined, HomeOutlined, DollarOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;
const { Search } = Input;

const HeroBanner: React.FC = () => {
  const handleSearch = (value: string) => {
    console.log('Search:', value);
  };

  return (
    <div style={{
      background: 'linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url("https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1973&q=80")',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      minHeight: '70vh',
      display: 'flex',
      alignItems: 'center',
      color: 'white',
      position: 'relative'
    }}>
      <div style={{ 
        width: '100%', 
        maxWidth: '1200px', 
        margin: '0 auto', 
        padding: '0 24px',
        zIndex: 1
      }}>
        <Row justify="center" align="middle" style={{ minHeight: '60vh' }}>
          <Col xs={24} md={16} lg={12} style={{ textAlign: 'center' }}>
            <Title level={1} style={{ color: 'white', fontSize: '3.5rem', marginBottom: '24px' }}>
              Find Your Dream Home
            </Title>
            <Paragraph style={{ 
              color: 'white', 
              fontSize: '1.2rem', 
              marginBottom: '48px',
              opacity: 0.9
            }}>
              Discover the perfect property for sale or rent in your desired location
            </Paragraph>
            
            {/* Search Card */}
            <Card style={{ 
              background: 'rgba(255,255,255,0.95)', 
              borderRadius: '12px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
              marginTop: '32px'
            }}>
              <Row gutter={[16, 16]} align="middle">
                <Col xs={24} sm={8}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <EnvironmentOutlined style={{ color: '#1890ff' }} />
                    <Select
                      placeholder="Location"
                      style={{ width: '100%' }}
                      size="large"
                      bordered={false}
                    >
                      <Select.Option value="new-york">New York</Select.Option>
                      <Select.Option value="los-angeles">Los Angeles</Select.Option>
                      <Select.Option value="chicago">Chicago</Select.Option>
                      <Select.Option value="houston">Houston</Select.Option>
                    </Select>
                  </div>
                </Col>
                <Col xs={24} sm={8}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <HomeOutlined style={{ color: '#1890ff' }} />
                    <Select
                      placeholder="Property Type"
                      style={{ width: '100%' }}
                      size="large"
                      bordered={false}
                    >
                      <Select.Option value="apartment">Apartment</Select.Option>
                      <Select.Option value="house">House</Select.Option>
                      <Select.Option value="condo">Condo</Select.Option>
                      <Select.Option value="townhouse">Townhouse</Select.Option>
                    </Select>
                  </div>
                </Col>
                <Col xs={24} sm={8}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <DollarOutlined style={{ color: '#1890ff' }} />
                    <Select
                      placeholder="Price Range"
                      style={{ width: '100%' }}
                      size="large"
                      bordered={false}
                    >
                      <Select.Option value="0-500k">$0 - $500K</Select.Option>
                      <Select.Option value="500k-1m">$500K - $1M</Select.Option>
                      <Select.Option value="1m-2m">$1M - $2M</Select.Option>
                      <Select.Option value="2m+">$2M+</Select.Option>
                    </Select>
                  </div>
                </Col>
                <Col xs={24}>
                  <Button 
                    type="primary" 
                    size="large" 
                    icon={<SearchOutlined />}
                    style={{ 
                      width: '100%', 
                      height: '48px',
                      fontSize: '16px',
                      fontWeight: 'bold'
                    }}
                  >
                    Search Properties
                  </Button>
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default HeroBanner;
