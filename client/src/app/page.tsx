'use client';

import React from 'react';
import { Layout, Typography, Row, Col, Button } from 'antd';
import { ArrowRightOutlined } from '@ant-design/icons';
import Navbar from '../components/Navbar';
import HeroBanner from '../components/HeroBanner';
import WhatWeDoCard from '../components/WhatWeDoCard';
import PropertyCard from '../components/PropertyCard';
import Newsletter from '../components/Newsletter';
import Footer from '../components/Footer';
import { Property } from '../utils/types';

const { Content } = Layout;
const { Title, Paragraph } = Typography;

// Mock data
const whatWeDoData = [
  {
    id: '1',
    title: 'Find Properties',
    description: 'Browse through thousands of properties for sale and rent in your desired location.',
    icon: 'search'
  },
  {
    id: '2',
    title: 'Expert Guidance',
    description: 'Get professional advice from our experienced real estate agents and consultants.',
    icon: 'team'
  },
  {
    id: '3',
    title: 'Secure Transactions',
    description: 'Enjoy safe and secure property transactions with our verified processes.',
    icon: 'safety'
  },
  {
    id: '4',
    title: 'Property Management',
    description: 'Comprehensive property management services for landlords and property owners.',
    icon: 'home'
  }
];

const featuredProperties: Property[] = [
  {
    id: '1',
    title: 'Modern Downtown Apartment',
    price: 450000,
    location: 'Downtown, New York',
    bedrooms: 2,
    bathrooms: 2,
    area: 1200,
    type: 'sale',
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    description: 'Beautiful modern apartment in the heart of downtown'
  },
  {
    id: '2',
    title: 'Luxury Family Home',
    price: 850000,
    location: 'Suburbs, California',
    bedrooms: 4,
    bathrooms: 3,
    area: 2500,
    type: 'sale',
    image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    description: 'Spacious family home with modern amenities'
  },
  {
    id: '3',
    title: 'Cozy Studio Apartment',
    price: 1800,
    location: 'Midtown, Chicago',
    bedrooms: 1,
    bathrooms: 1,
    area: 600,
    type: 'rent',
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    description: 'Perfect for young professionals'
  },
  {
    id: '4',
    title: 'Penthouse with City View',
    price: 1200000,
    location: 'Financial District, New York',
    bedrooms: 3,
    bathrooms: 3,
    area: 2000,
    type: 'sale',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    description: 'Luxurious penthouse with stunning city views'
  }
];

const saleProperties = featuredProperties.filter(p => p.type === 'sale');
const rentProperties = featuredProperties.filter(p => p.type === 'rent');

export default function Home() {
  const handleViewDetails = (property: Property) => {
    console.log('View details for:', property.title);
  };

  const handleFavorite = (property: Property) => {
    console.log('Add to favorites:', property.title);
  };

  const handleShare = (property: Property) => {
    console.log('Share property:', property.title);
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Navbar />
      
      <Content>
        {/* Hero Section */}
        <HeroBanner />

        {/* What We Do Section */}
        <div style={{ padding: '80px 0', background: '#fafafa' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
            <div style={{ textAlign: 'center', marginBottom: '64px' }}>
              <Title level={2} style={{ fontSize: '36px', marginBottom: '16px' }}>
                What We Do
              </Title>
              <Paragraph style={{ fontSize: '18px', color: '#8c8c8c', maxWidth: '600px', margin: '0 auto' }}>
                We provide comprehensive real estate services to help you find, buy, rent, or manage properties with ease.
              </Paragraph>
            </div>
            
            <Row gutter={[32, 32]}>
              {whatWeDoData.map((item) => (
                <Col xs={24} sm={12} md={6} key={item.id}>
                  <WhatWeDoCard
                    title={item.title}
                    description={item.description}
                    icon={item.icon}
                  />
                </Col>
              ))}
            </Row>
          </div>
        </div>

        {/* Featured Properties Section */}
        <div style={{ padding: '80px 0' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
            <div style={{ textAlign: 'center', marginBottom: '64px' }}>
              <Title level={2} style={{ fontSize: '36px', marginBottom: '16px' }}>
                Featured Properties
              </Title>
              <Paragraph style={{ fontSize: '18px', color: '#8c8c8c', maxWidth: '600px', margin: '0 auto' }}>
                Discover our handpicked selection of premium properties
              </Paragraph>
            </div>
            
            <Row gutter={[32, 32]}>
              {featuredProperties.map((property) => (
                <Col xs={24} sm={12} lg={6} key={property.id}>
                  <PropertyCard
                    property={property}
                    onViewDetails={handleViewDetails}
                    onFavorite={handleFavorite}
                    onShare={handleShare}
                  />
                </Col>
              ))}
            </Row>
          </div>
        </div>

        {/* Properties for Sale Section */}
        <div style={{ padding: '80px 0', background: '#fafafa' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '48px' }}>
              <div>
                <Title level={2} style={{ fontSize: '32px', marginBottom: '8px' }}>
                  Properties for Sale
                </Title>
                <Paragraph style={{ fontSize: '16px', color: '#8c8c8c' }}>
                  Find your dream home from our exclusive collection
                </Paragraph>
              </div>
              <Button type="primary" size="large" icon={<ArrowRightOutlined />}>
                View All Sales
              </Button>
            </div>
            
            <Row gutter={[32, 32]}>
              {saleProperties.map((property) => (
                <Col xs={24} sm={12} lg={6} key={property.id}>
                  <PropertyCard
                    property={property}
                    onViewDetails={handleViewDetails}
                    onFavorite={handleFavorite}
                    onShare={handleShare}
                  />
                </Col>
              ))}
            </Row>
          </div>
        </div>

        {/* Properties for Rent Section */}
        <div style={{ padding: '80px 0' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '48px' }}>
              <div>
                <Title level={2} style={{ fontSize: '32px', marginBottom: '8px' }}>
                  Properties for Rent
                </Title>
                <Paragraph style={{ fontSize: '16px', color: '#8c8c8c' }}>
                  Discover rental properties that suit your lifestyle
                </Paragraph>
              </div>
              <Button type="primary" size="large" icon={<ArrowRightOutlined />}>
                View All Rentals
              </Button>
            </div>
            
            <Row gutter={[32, 32]}>
              {rentProperties.map((property) => (
                <Col xs={24} sm={12} lg={6} key={property.id}>
                  <PropertyCard
                    property={property}
                    onViewDetails={handleViewDetails}
                    onFavorite={handleFavorite}
                    onShare={handleShare}
                  />
                </Col>
              ))}
            </Row>
          </div>
        </div>

        {/* Newsletter Section */}
        <Newsletter />
      </Content>
      
      <Footer />
    </Layout>
  );
}
