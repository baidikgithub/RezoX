'use client';

import React from 'react';
import { Typography, Card, Row, Col, Button, Select } from 'antd';
import { SearchOutlined, EnvironmentOutlined, HomeOutlined, DollarOutlined } from '@ant-design/icons';
import { useTheme } from '../../contexts/ThemeContext';
import { HERO_LOCATIONS, HERO_PROPERTY_TYPES, HERO_PRICE_RANGES } from '../../data/constants';

const { Title, Paragraph } = Typography;

interface HeroSectionProps {
  title?: string;
  subtitle?: string;
  showSearch?: boolean;
  backgroundImage?: string;
  height?: string;
}

const HeroSection: React.FC<HeroSectionProps> = ({
  title = "Find Your Dream Home",
  subtitle = "Discover the perfect property for sale or rent in your desired location",
  showSearch = true,
  backgroundImage = 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1973&q=80',
  height = '70vh'
}) => {
  const { isDarkMode } = useTheme();

  const handleSearch = (value: string) => {
    console.log('Search:', value);
  };

  return (
    <div style={{
      background: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url("${backgroundImage}")`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      minHeight: height,
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
            <Title level={1} style={{ 
              color: 'white', 
              fontSize: '3.5rem', 
              marginBottom: '24px',
              textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
            }}>
              {title}
            </Title>
            <Paragraph style={{ 
              color: 'white', 
              fontSize: '1.2rem', 
              marginBottom: '48px',
              opacity: 0.9,
              textShadow: '1px 1px 2px rgba(0,0,0,0.5)'
            }}>
              {subtitle}
            </Paragraph>
            
            {showSearch && (
              <Card style={{ 
                background: isDarkMode ? 'rgba(31,31,31,0.95)' : 'rgba(255,255,255,0.95)', 
                borderRadius: '12px',
                boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                marginTop: '32px',
                border: isDarkMode ? '1px solid #434343' : 'none'
              }}>
                <Row gutter={[16, 16]} align="middle">
                  <Col xs={24} sm={8}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <EnvironmentOutlined style={{ color: '#1890ff' }} />
                      <Select
                        placeholder="Location"
                        style={{ 
                          width: '100%',
                          color: isDarkMode ? '#ffffff' : '#000000'
                        }}
                        size="large"
                        bordered={false}
                        className={isDarkMode ? 'dark-select' : ''}
                        dropdownStyle={{
                          background: isDarkMode ? '#1f1f1f' : '#ffffff',
                          border: isDarkMode ? '1px solid #434343' : '1px solid #d9d9d9'
                        }}
                      >
                        {HERO_LOCATIONS.map(location => (
                          <Select.Option 
                            key={location.value} 
                            value={location.value}
                            style={{
                              background: isDarkMode ? '#1f1f1f' : '#ffffff',
                              color: isDarkMode ? '#ffffff' : '#000000'
                            }}
                          >
                            {location.label}
                          </Select.Option>
                        ))}
                      </Select>
                    </div>
                  </Col>
                  <Col xs={24} sm={8}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <HomeOutlined style={{ color: '#1890ff' }} />
                      <Select
                        placeholder="Property Type"
                        style={{ 
                          width: '100%',
                          color: isDarkMode ? '#ffffff' : '#000000'
                        }}
                        size="large"
                        bordered={false}
                        className={isDarkMode ? 'dark-select' : ''}
                        dropdownStyle={{
                          background: isDarkMode ? '#1f1f1f' : '#ffffff',
                          border: isDarkMode ? '1px solid #434343' : '1px solid #d9d9d9'
                        }}
                      >
                        {HERO_PROPERTY_TYPES.map(type => (
                          <Select.Option 
                            key={type.value} 
                            value={type.value}
                            style={{
                              background: isDarkMode ? '#1f1f1f' : '#ffffff',
                              color: isDarkMode ? '#ffffff' : '#000000'
                            }}
                          >
                            {type.label}
                          </Select.Option>
                        ))}
                      </Select>
                    </div>
                  </Col>
                  <Col xs={24} sm={8}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <DollarOutlined style={{ color: '#1890ff' }} />
                      <Select
                        placeholder="Price Range"
                        style={{ 
                          width: '100%',
                          color: isDarkMode ? '#ffffff' : '#000000'
                        }}
                        size="large"
                        bordered={false}
                        className={isDarkMode ? 'dark-select' : ''}
                        dropdownStyle={{
                          background: isDarkMode ? '#1f1f1f' : '#ffffff',
                          border: isDarkMode ? '1px solid #434343' : '1px solid #d9d9d9'
                        }}
                      >
                        {HERO_PRICE_RANGES.map(range => (
                          <Select.Option 
                            key={range.value} 
                            value={range.value}
                            style={{
                              background: isDarkMode ? '#1f1f1f' : '#ffffff',
                              color: isDarkMode ? '#ffffff' : '#000000'
                            }}
                          >
                            {range.label}
                          </Select.Option>
                        ))}
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
            )}
          </Col>
        </Row>
      </div>
      
      <style jsx>{`
        .dark-select .ant-select-selector {
          background: ${isDarkMode ? '#2a2a2a' : '#ffffff'} !important;
          color: ${isDarkMode ? '#ffffff' : '#000000'} !important;
        }
        .dark-select .ant-select-selection-placeholder {
          color: ${isDarkMode ? '#a0a0a0' : '#8c8c8c'} !important;
        }
        .dark-select .ant-select-selection-item {
          color: ${isDarkMode ? '#ffffff' : '#000000'} !important;
        }
        .dark-select .ant-select-arrow {
          color: ${isDarkMode ? '#ffffff' : '#000000'} !important;
        }
        .dark-select:hover .ant-select-selector {
          border-color: #1890ff !important;
        }
        .dark-select.ant-select-focused .ant-select-selector {
          border-color: #1890ff !important;
          box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2) !important;
        }
      `}</style>
    </div>
  );
};

export default HeroSection;

