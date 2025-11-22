'use client';

import React from 'react';
import { Typography, Row, Col } from 'antd';
import { useTheme } from '../../contexts/ThemeContext';
import WhatWeDoCard from '../WhatWeDoCard';
import { Feature } from '../../data/features';

const { Title, Paragraph } = Typography;

interface FeaturesSectionProps {
  title?: string;
  subtitle?: string;
  features: Feature[];
  backgroundColor?: string;
  padding?: string;
}

const FeaturesSection: React.FC<FeaturesSectionProps> = ({
  title = "What We Do",
  subtitle = "We provide comprehensive real estate services to help you find, buy, rent, or manage properties with ease.",
  features,
  backgroundColor = '#fafafa',
  padding = '80px 0'
}) => {
  const { isDarkMode } = useTheme();

  const sectionStyle = {
    padding,
    background: isDarkMode ? '#1a1a1a' : backgroundColor
  };

  const titleStyle = {
    fontSize: '36px',
    marginBottom: '16px',
    color: isDarkMode ? '#ffffff' : '#262626'
  };

  const subtitleStyle = {
    fontSize: '18px',
    color: isDarkMode ? '#d9d9d9' : '#8c8c8c',
    maxWidth: '600px',
    margin: '0 auto'
  };

  return (
    <div style={sectionStyle}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: '64px' }}>
          <Title level={2} style={titleStyle}>
            {title}
          </Title>
          <Paragraph style={subtitleStyle}>
            {subtitle}
          </Paragraph>
        </div>
        
        <Row gutter={[32, 32]}>
          {features.map((feature) => (
            <Col xs={24} sm={12} md={6} key={feature.id}>
              <WhatWeDoCard
                title={feature.title}
                description={feature.description}
                icon={feature.icon}
              />
            </Col>
          ))}
        </Row>
      </div>
    </div>
  );
};

export default FeaturesSection;

