'use client';

import React from 'react';
import { Typography } from 'antd';
import { useTheme } from '../../contexts/ThemeContext';

const { Title, Paragraph } = Typography;

interface AboutHeroSectionProps {
  title?: string;
  subtitle?: string;
  backgroundGradient?: string;
  padding?: string;
}

const AboutHeroSection: React.FC<AboutHeroSectionProps> = ({
  title = "About RezoX",
  subtitle = "We are revolutionizing the real estate industry with innovative technology and exceptional service.",
  backgroundGradient = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  padding = '80px 0'
}) => {
  const { isDarkMode } = useTheme();

  const sectionStyle = {
    background: isDarkMode ? 'linear-gradient(135deg, #2a2a2a 0%, #1a1a1a 100%)' : backgroundGradient,
    padding,
    color: 'white',
    textAlign: 'center' as const
  };

  const titleStyle = {
    color: 'white',
    marginBottom: '16px',
    textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
  };

  const subtitleStyle = {
    color: 'white',
    fontSize: '20px',
    opacity: 0.9,
    maxWidth: '600px',
    margin: '0 auto',
    textShadow: '1px 1px 2px rgba(0,0,0,0.3)'
  };

  return (
    <div style={sectionStyle}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
        <Title level={1} style={titleStyle}>
          {title}
        </Title>
        <Paragraph style={subtitleStyle}>
          {subtitle}
        </Paragraph>
      </div>
    </div>
  );
};

export default AboutHeroSection;

