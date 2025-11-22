'use client';

import React from 'react';
import { Card, Typography } from 'antd';
import { HomeOutlined, SearchOutlined, SafetyOutlined, TeamOutlined, TrophyOutlined, HeartOutlined, GlobalOutlined } from '@ant-design/icons';
import { useTheme } from '../contexts/ThemeContext';

const { Title, Paragraph } = Typography;

interface WhatWeDoCardProps {
  title: string;
  description: string;
  icon: string;
}

const WhatWeDoCard: React.FC<WhatWeDoCardProps> = ({ title, description, icon }) => {
  const { isDarkMode } = useTheme();

  const getIcon = (iconName: string) => {
    const iconStyle = { fontSize: '48px', color: '#1890ff', marginBottom: '16px' };
    
    switch (iconName) {
      case 'home':
        return <HomeOutlined style={iconStyle} />;
      case 'search':
        return <SearchOutlined style={iconStyle} />;
      case 'safety':
        return <SafetyOutlined style={iconStyle} />;
      case 'team':
        return <TeamOutlined style={iconStyle} />;
      case 'trophy':
        return <TrophyOutlined style={iconStyle} />;
      case 'heart':
        return <HeartOutlined style={iconStyle} />;
      case 'global':
        return <GlobalOutlined style={iconStyle} />;
      default:
        return <HomeOutlined style={iconStyle} />;
    }
  };

  return (
    <Card
      hoverable
      style={{
        height: '100%',
        textAlign: 'center',
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        transition: 'all 0.3s ease',
        border: 'none'
      }}
      bodyStyle={{
        padding: '32px 24px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        height: '100%'
      }}
    >
      <div style={{ marginBottom: '24px' }}>
        {getIcon(icon)}
      </div>
      
      <Title level={4} style={{ 
        marginBottom: '16px',
        color: isDarkMode ? '#ffffff' : '#262626',
        fontSize: '20px',
        fontWeight: '600'
      }}>
        {title}
      </Title>
      
      <Paragraph style={{ 
        color: isDarkMode ? '#d9d9d9' : '#8c8c8c',
        fontSize: '14px',
        lineHeight: '1.6',
        margin: 0,
        flex: 1,
        display: 'flex',
        alignItems: 'center'
      }}>
        {description}
      </Paragraph>
    </Card>
  );
};

export default WhatWeDoCard;
