'use client';

import React from 'react';
import { Typography, Row, Col, Button } from 'antd';
import { ArrowRightOutlined } from '@ant-design/icons';
import { useTheme } from '../../contexts/ThemeContext';
import PropertyCard from '../PropertyCard';
import { Property } from '../../utils/types';

const { Title, Paragraph } = Typography;

interface PropertiesSectionProps {
  title: string;
  subtitle: string;
  properties: Property[];
  buttonText?: string;
  onButtonClick?: () => void;
  onViewDetails?: (property: Property) => void;
  onFavorite?: (property: Property) => void;
  onShare?: (property: Property) => void;
  backgroundColor?: string;
  padding?: string;
  showButton?: boolean;
}

const PropertiesSection: React.FC<PropertiesSectionProps> = ({
  title,
  subtitle,
  properties,
  buttonText = "View All",
  onButtonClick,
  onViewDetails,
  onFavorite,
  onShare,
  backgroundColor = '#fafafa',
  padding = '80px 0',
  showButton = true
}) => {
  const { isDarkMode } = useTheme();

  const sectionStyle = {
    padding,
    background: isDarkMode ? '#1a1a1a' : backgroundColor
  };

  const titleStyle = {
    fontSize: '32px',
    marginBottom: '8px',
    color: isDarkMode ? '#ffffff' : '#262626'
  };

  const subtitleStyle = {
    fontSize: '16px',
    color: isDarkMode ? '#d9d9d9' : '#8c8c8c'
  };

  return (
    <div style={sectionStyle}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: '48px',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          <div>
            <Title level={2} style={titleStyle}>
              {title}
            </Title>
            <Paragraph style={subtitleStyle}>
              {subtitle}
            </Paragraph>
          </div>
          {showButton && (
            <Button 
              type="primary" 
              size="large" 
              icon={<ArrowRightOutlined />}
              onClick={onButtonClick}
            >
              {buttonText}
            </Button>
          )}
        </div>
        
        <Row gutter={[32, 32]}>
          {properties.map((property) => (
            <Col xs={24} sm={12} lg={6} key={property.id}>
              <PropertyCard
                property={property}
                onViewDetails={onViewDetails}
                onFavorite={onFavorite}
                onShare={onShare}
              />
            </Col>
          ))}
        </Row>
      </div>
    </div>
  );
};

export default PropertiesSection;

