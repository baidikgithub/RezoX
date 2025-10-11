'use client';

import React from 'react';
import { Typography, Row, Col } from 'antd';
import { useTheme } from '../../contexts/ThemeContext';

const { Title, Paragraph } = Typography;

interface StorySectionProps {
  title?: string;
  story?: string;
  mission?: string;
  backgroundColor?: string;
  padding?: string;
}

const StorySection: React.FC<StorySectionProps> = ({
  title = "Our Story",
  story = "Founded in 2020, RezoX began with a simple mission: to make real estate transactions more transparent, efficient, and accessible for everyone. We believe that finding your dream home or selling your property should be a seamless and enjoyable experience.\n\nToday, we serve thousands of clients worldwide, helping them navigate the complex real estate market with confidence and ease. Our platform combines advanced technology with human expertise to deliver results that exceed expectations.",
  mission = "To revolutionize the real estate industry by providing innovative solutions that make property transactions simple, transparent, and accessible to everyone.",
  backgroundColor = '#fafafa',
  padding = '80px 0'
}) => {
  const { isDarkMode } = useTheme();

  const sectionStyle = {
    padding,
    background: isDarkMode ? '#1a1a1a' : backgroundColor
  };

  const titleStyle = {
    fontSize: '32px',
    marginBottom: '24px',
    color: isDarkMode ? '#ffffff' : '#262626'
  };

  const paragraphStyle = {
    fontSize: '16px',
    lineHeight: '1.8',
    marginBottom: '24px',
    color: isDarkMode ? '#d9d9d9' : '#262626'
  };

  const missionCardStyle = {
    background: isDarkMode 
      ? 'linear-gradient(135deg, #2a2a2a 0%, #1a1a1a 100%)' 
      : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    borderRadius: '12px',
    padding: '48px',
    color: 'white',
    textAlign: 'center' as const,
    border: isDarkMode ? '1px solid #434343' : 'none'
  };

  const missionTitleStyle = {
    color: 'white',
    marginBottom: '16px',
    textShadow: '1px 1px 2px rgba(0,0,0,0.3)'
  };

  const missionTextStyle = {
    color: 'white',
    fontSize: '18px',
    opacity: 0.9,
    textShadow: '1px 1px 2px rgba(0,0,0,0.3)'
  };

  return (
    <div style={sectionStyle}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
        <Row gutter={[48, 48]} align="middle">
          <Col xs={24} lg={12}>
            <Title level={2} style={titleStyle}>
              {title}
            </Title>
            <Paragraph style={paragraphStyle}>
              {story.split('\n\n')[0]}
            </Paragraph>
            <Paragraph style={paragraphStyle}>
              {story.split('\n\n')[1]}
            </Paragraph>
          </Col>
          <Col xs={24} lg={12}>
            <div style={missionCardStyle}>
              <Title level={3} style={missionTitleStyle}>
                Our Mission
              </Title>
              <Paragraph style={missionTextStyle}>
                "{mission}"
              </Paragraph>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default StorySection;

