'use client';

import React from 'react';
import { Card, Typography, Tag, Button, Row, Col } from 'antd';
import { 
  HomeOutlined, 
  EnvironmentOutlined, 
  UserOutlined, 
  SettingOutlined, 
  ArrowsAltOutlined,
  HeartOutlined,
  ShareAltOutlined
} from '@ant-design/icons';
import { Property } from '../utils/types';
import { useTheme } from '../contexts/ThemeContext';

const { Title, Paragraph, Text } = Typography;

interface PropertyCardProps {
  property: Property;
  onViewDetails?: (property: Property) => void;
  onFavorite?: (property: Property) => void;
  onShare?: (property: Property) => void;
  isFavorite?: boolean;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ 
  property, 
  onViewDetails, 
  onFavorite, 
  onShare,
  isFavorite = false
}) => {
  const { isDarkMode } = useTheme();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const getTypeColor = (type: string) => {
    return type === 'house' ? '#52c41a' : '#1890ff';
  };

  return (
    <Card
      hoverable
      style={{
        borderRadius: '12px',
        overflow: 'hidden',
        boxShadow: isDarkMode ? '0 4px 12px rgba(0,0,0,0.3)' : '0 4px 12px rgba(0,0,0,0.1)',
        transition: 'all 0.3s ease',
        border: 'none',
        height: '100%',
        background: isDarkMode ? '#1f1f1f' : '#ffffff'
      }}
      cover={
        <div style={{ position: 'relative', height: '200px', overflow: 'hidden' }}>
          <img
            alt={property.title}
            src={property.images?.[0]?.url || '/placeholder-property.jpg'}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transition: 'transform 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.05)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
            }}
          />
          <div style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            display: 'flex',
            gap: '8px'
          }}>
            <Button
              type="text"
              shape="circle"
              icon={<HeartOutlined />}
              style={{
                background: 'rgba(255,255,255,0.9)',
                border: 'none',
                color: isFavorite ? '#ff4d4f' : '#8c8c8c'
              }}
              onClick={() => onFavorite?.(property)}
            />
            <Button
              type="text"
              shape="circle"
              icon={<ShareAltOutlined />}
              style={{
                background: 'rgba(255,255,255,0.9)',
                border: 'none',
                color: '#1890ff'
              }}
              onClick={() => onShare?.(property)}
            />
          </div>
          <Tag
            color={getTypeColor(property.propertyType)}
            style={{
              position: 'absolute',
              top: '12px',
              left: '12px',
              textTransform: 'uppercase',
              fontWeight: 'bold',
              borderRadius: '6px'
            }}
          >
            {property.propertyType}
          </Tag>
        </div>
      }
      actions={[
        <Button
          type="primary"
          icon={<ArrowsAltOutlined />}
          onClick={() => onViewDetails?.(property)}
          style={{ width: '100%', borderRadius: '6px' }}
        >
          View Details
        </Button>
      ]}
    >
      <div style={{ padding: '0 4px' }}>
        <Title level={4} style={{ 
          marginBottom: '8px',
          color: isDarkMode ? '#ffffff' : '#262626',
          fontSize: '18px',
          fontWeight: '600'
        }}>
          {property.title}
        </Title>
        
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
          <EnvironmentOutlined style={{ color: isDarkMode ? '#a0a0a0' : '#8c8c8c', marginRight: '4px' }} />
          <Text type="secondary" style={{ 
            fontSize: '14px',
            color: isDarkMode ? '#a0a0a0' : '#8c8c8c'
          }}>
            {property.location?.address}, {property.location?.city}
          </Text>
        </div>

        <Row gutter={[16, 8]} style={{ marginBottom: '16px' }}>
          <Col span={8}>
            <div style={{ textAlign: 'center' }}>
              <UserOutlined style={{ color: isDarkMode ? '#a0a0a0' : '#8c8c8c', fontSize: '16px' }} />
              <div style={{ 
                fontSize: '12px', 
                color: isDarkMode ? '#a0a0a0' : '#8c8c8c', 
                marginTop: '2px' 
              }}>
                {property.bedrooms} Beds
              </div>
            </div>
          </Col>
          <Col span={8}>
            <div style={{ textAlign: 'center' }}>
              <SettingOutlined style={{ color: isDarkMode ? '#a0a0a0' : '#8c8c8c', fontSize: '16px' }} />
              <div style={{ 
                fontSize: '12px', 
                color: isDarkMode ? '#a0a0a0' : '#8c8c8c', 
                marginTop: '2px' 
              }}>
                {property.bathrooms} Baths
              </div>
            </div>
          </Col>
          <Col span={8}>
            <div style={{ textAlign: 'center' }}>
              <ArrowsAltOutlined style={{ color: isDarkMode ? '#a0a0a0' : '#8c8c8c', fontSize: '16px' }} />
              <div style={{ 
                fontSize: '12px', 
                color: isDarkMode ? '#a0a0a0' : '#8c8c8c', 
                marginTop: '2px' 
              }}>
                {property.area} sqft
              </div>
            </div>
          </Col>
        </Row>

        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingTop: '12px',
          borderTop: `1px solid ${isDarkMode ? '#434343' : '#f0f0f0'}`
        }}>
          <Title level={3} style={{ 
            margin: 0,
            color: '#1890ff',
            fontSize: '24px',
            fontWeight: 'bold'
          }}>
            {formatPrice(property.price)}
          </Title>
          <Text type="secondary" style={{ 
            fontSize: '12px',
            color: isDarkMode ? '#a0a0a0' : '#8c8c8c'
          }}>
            {property.propertyType === 'apartment' ? '/month' : ''}
          </Text>
        </div>
      </div>
    </Card>
  );
};

export default PropertyCard;
