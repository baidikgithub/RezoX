'use client';

import React from 'react';
import { Typography, Row, Col, Card } from 'antd';
import { TeamOutlined, TrophyOutlined, HeartOutlined, GlobalOutlined } from '@ant-design/icons';
import MainWrapper from '../../components/layouts/MainWrapper';

const { Title, Paragraph } = Typography;

const AboutPage: React.FC = () => {
  const features = [
    {
      icon: <TeamOutlined style={{ fontSize: '48px', color: '#1890ff' }} />,
      title: 'Expert Team',
      description: 'Our experienced real estate professionals are dedicated to helping you find the perfect property.'
    },
    {
      icon: <TrophyOutlined style={{ fontSize: '48px', color: '#1890ff' }} />,
      title: 'Award Winning',
      description: 'Recognized as the leading real estate platform with multiple industry awards and certifications.'
    },
    {
      icon: <HeartOutlined style={{ fontSize: '48px', color: '#1890ff' }} />,
      title: 'Customer First',
      description: 'We prioritize our customers\' needs and provide exceptional service throughout their journey.'
    },
    {
      icon: <GlobalOutlined style={{ fontSize: '48px', color: '#1890ff' }} />,
      title: 'Global Reach',
      description: 'Serving clients worldwide with properties in major cities and emerging markets.'
    }
  ];

  return (
    <MainWrapper>
      {/* Hero Section */}
      <div style={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '80px 0',
        color: 'white',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
          <Title level={1} style={{ color: 'white', marginBottom: '16px' }}>
            About RezoX
          </Title>
          <Paragraph style={{ 
            color: 'white', 
            fontSize: '20px',
            opacity: 0.9,
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            We are revolutionizing the real estate industry with innovative technology and exceptional service.
          </Paragraph>
        </div>
      </div>

      {/* Features Section */}
      <div style={{ padding: '80px 0' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
            <Title level={2} style={{ fontSize: '36px', marginBottom: '16px' }}>
              Why Choose RezoX?
            </Title>
            <Paragraph style={{ fontSize: '18px', color: '#8c8c8c', maxWidth: '600px', margin: '0 auto' }}>
              We combine cutting-edge technology with personalized service to deliver exceptional real estate experiences.
            </Paragraph>
          </div>
          
          <Row gutter={[32, 32]}>
            {features.map((feature, index) => (
              <Col xs={24} sm={12} lg={6} key={index}>
                <Card
                  style={{
                    textAlign: 'center',
                    height: '100%',
                    borderRadius: '12px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                  }}
                  hoverable
                >
                  <div style={{ marginBottom: '24px' }}>
                    {feature.icon}
                  </div>
                  <Title level={4} style={{ marginBottom: '16px' }}>
                    {feature.title}
                  </Title>
                  <Paragraph style={{ color: '#8c8c8c' }}>
                    {feature.description}
                  </Paragraph>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </div>

      {/* Story Section */}
      <div style={{ padding: '80px 0', background: '#fafafa' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
          <Row gutter={[48, 48]} align="middle">
            <Col xs={24} lg={12}>
              <Title level={2} style={{ fontSize: '32px', marginBottom: '24px' }}>
                Our Story
              </Title>
              <Paragraph style={{ fontSize: '16px', lineHeight: '1.8', marginBottom: '24px' }}>
                Founded in 2020, RezoX began with a simple mission: to make real estate transactions 
                more transparent, efficient, and accessible for everyone. We believe that finding your 
                dream home or selling your property should be a seamless and enjoyable experience.
              </Paragraph>
              <Paragraph style={{ fontSize: '16px', lineHeight: '1.8' }}>
                Today, we serve thousands of clients worldwide, helping them navigate the complex 
                real estate market with confidence and ease. Our platform combines advanced technology 
                with human expertise to deliver results that exceed expectations.
              </Paragraph>
            </Col>
            <Col xs={24} lg={12}>
              <div style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                borderRadius: '12px',
                padding: '48px',
                color: 'white',
                textAlign: 'center'
              }}>
                <Title level={3} style={{ color: 'white', marginBottom: '16px' }}>
                  Our Mission
                </Title>
                <Paragraph style={{ color: 'white', fontSize: '18px', opacity: 0.9 }}>
                  "To revolutionize the real estate industry by providing innovative solutions 
                  that make property transactions simple, transparent, and accessible to everyone."
                </Paragraph>
              </div>
            </Col>
          </Row>
        </div>
      </div>
    </MainWrapper>
  );
};

export default AboutPage;
