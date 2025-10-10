'use client';

import React, { useState, useEffect } from 'react';
import { Typography, Row, Col, Select, Input, Button, Card, Tag, Space, Pagination } from 'antd';
import { SearchOutlined, FilterOutlined, SortAscendingOutlined } from '@ant-design/icons';
import MainWrapper from '../../components/layouts/MainWrapper';
import PropertyCard from '../../components/PropertyCard';
import { Property } from '../../utils/types';
const { Title, Paragraph } = Typography;
const { Search } = Input;

// Mock data - in a real app, this would come from an API
const allProperties: Property[] = [
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
  },
  {
    id: '5',
    title: 'Charming Townhouse',
    price: 2200,
    location: 'Brooklyn, New York',
    bedrooms: 3,
    bathrooms: 2,
    area: 1800,
    type: 'rent',
    image: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    description: 'Historic townhouse with modern updates'
  },
  {
    id: '6',
    title: 'Luxury Condo',
    price: 750000,
    location: 'Miami, Florida',
    bedrooms: 2,
    bathrooms: 2,
    area: 1500,
    type: 'sale',
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    description: 'Oceanfront luxury condo with amazing views'
  },
  {
    id: '7',
    title: 'Modern Loft',
    price: 3200,
    location: 'SoHo, New York',
    bedrooms: 1,
    bathrooms: 1,
    area: 1000,
    type: 'rent',
    image: 'https://images.unsplash.com/photo-1505843513577-35bb1d430e1a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    description: 'Industrial-style loft in trendy SoHo'
  },
  {
    id: '8',
    title: 'Suburban Villa',
    price: 950000,
    location: 'Austin, Texas',
    bedrooms: 5,
    bathrooms: 4,
    area: 3000,
    type: 'sale',
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    description: 'Spacious suburban villa with pool and garden'
  }
];

export default function Listings() {
  const [properties, setProperties] = useState<Property[]>(allProperties);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>(allProperties);
  const [propertyType, setPropertyType] = useState<string>('all');
  const [location, setLocation] = useState<string>('all');
  const [priceRange, setPriceRange] = useState<string>('all');
  const [bedrooms, setBedrooms] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('newest');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize] = useState<number>(8);

  // Filter and search properties
  useEffect(() => {
    let filtered = [...properties];

    // Filter by property type
    if (propertyType !== 'all') {
      filtered = filtered.filter(prop => prop.type === propertyType);
    }

    // Filter by location
    if (location !== 'all') {
      filtered = filtered.filter(prop => 
        prop.location.toLowerCase().includes(location.toLowerCase())
      );
    }

    // Filter by price range
    if (priceRange !== 'all') {
      filtered = filtered.filter(prop => {
        const price = prop.price;
        switch (priceRange) {
          case '0-500k':
            return price <= 500000;
          case '500k-1m':
            return price > 500000 && price <= 1000000;
          case '1m-2m':
            return price > 1000000 && price <= 2000000;
          case '2m+':
            return price > 2000000;
          default:
            return true;
        }
      });
    }

    // Filter by bedrooms
    if (bedrooms !== 'all') {
      filtered = filtered.filter(prop => prop.bedrooms === parseInt(bedrooms));
    }

    // Search by title or location
    if (searchTerm) {
      filtered = filtered.filter(prop =>
        prop.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prop.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort properties
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'newest':
          return b.id.localeCompare(a.id);
        case 'oldest':
          return a.id.localeCompare(b.id);
        default:
          return 0;
      }
    });

    setFilteredProperties(filtered);
    setCurrentPage(1);
  }, [properties, propertyType, location, priceRange, bedrooms, searchTerm, sortBy]);

  // Get paginated properties
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedProperties = filteredProperties.slice(startIndex, endIndex);

  const handleViewDetails = (property: Property) => {
    console.log('View details for:', property.title);
  };

  const handleFavorite = (property: Property) => {
    console.log('Add to favorites:', property.title);
  };

  const handleShare = (property: Property) => {
    console.log('Share property:', property.title);
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };

  return (
    <MainWrapper>
      {/* Header Section */}
      <div style={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '60px 0',
        color: 'white'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
          <Title level={1} style={{ color: 'white', textAlign: 'center', marginBottom: '16px' }}>
            Property Listings
          </Title>
          <Paragraph style={{ 
            color: 'white', 
            textAlign: 'center', 
            fontSize: '18px',
            opacity: 0.9,
            marginBottom: '32px'
          }}>
            Find your perfect property from our extensive collection
          </Paragraph>
        </div>
      </div>

      {/* Filters Section */}
      <div style={{ 
        background: 'white', 
        padding: '32px 0',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        position: 'sticky',
        top: '64px',
        zIndex: 100
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
          <Row gutter={[16, 16]} align="middle">
            <Col xs={24} sm={12} md={6}>
              <Search
                placeholder="Search properties..."
                allowClear
                enterButton={<SearchOutlined />}
                size="large"
                onSearch={handleSearch}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </Col>
            
            <Col xs={12} sm={6} md={3}>
              <Select
                placeholder="Type"
                value={propertyType}
                onChange={setPropertyType}
                style={{ width: '100%' }}
                size="large"
              >
                <Select.Option value="all">All Types</Select.Option>
                <Select.Option value="sale">For Sale</Select.Option>
                <Select.Option value="rent">For Rent</Select.Option>
              </Select>
            </Col>

            <Col xs={12} sm={6} md={3}>
              <Select
                placeholder="Location"
                value={location}
                onChange={setLocation}
                style={{ width: '100%' }}
                size="large"
              >
                <Select.Option value="all">All Locations</Select.Option>
                <Select.Option value="new york">New York</Select.Option>
                <Select.Option value="california">California</Select.Option>
                <Select.Option value="chicago">Chicago</Select.Option>
                <Select.Option value="miami">Miami</Select.Option>
                <Select.Option value="austin">Austin</Select.Option>
              </Select>
            </Col>

            <Col xs={12} sm={6} md={3}>
              <Select
                placeholder="Price Range"
                value={priceRange}
                onChange={setPriceRange}
                style={{ width: '100%' }}
                size="large"
              >
                <Select.Option value="all">All Prices</Select.Option>
                <Select.Option value="0-500k">$0 - $500K</Select.Option>
                <Select.Option value="500k-1m">$500K - $1M</Select.Option>
                <Select.Option value="1m-2m">$1M - $2M</Select.Option>
                <Select.Option value="2m+">$2M+</Select.Option>
              </Select>
            </Col>

            <Col xs={12} sm={6} md={3}>
              <Select
                placeholder="Bedrooms"
                value={bedrooms}
                onChange={setBedrooms}
                style={{ width: '100%' }}
                size="large"
              >
                <Select.Option value="all">All Bedrooms</Select.Option>
                <Select.Option value="1">1 Bedroom</Select.Option>
                <Select.Option value="2">2 Bedrooms</Select.Option>
                <Select.Option value="3">3 Bedrooms</Select.Option>
                <Select.Option value="4">4+ Bedrooms</Select.Option>
              </Select>
            </Col>

            <Col xs={12} sm={6} md={3}>
              <Select
                placeholder="Sort By"
                value={sortBy}
                onChange={setSortBy}
                style={{ width: '100%' }}
                size="large"
                suffixIcon={<SortAscendingOutlined />}
              >
                <Select.Option value="newest">Newest First</Select.Option>
                <Select.Option value="oldest">Oldest First</Select.Option>
                <Select.Option value="price-low">Price: Low to High</Select.Option>
                <Select.Option value="price-high">Price: High to Low</Select.Option>
              </Select>
            </Col>
          </Row>
        </div>
      </div>

      {/* Results Section */}
      <div style={{ padding: '48px 0' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
          {/* Results Header */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: '32px',
            flexWrap: 'wrap',
            gap: '16px'
          }}>
            <div>
              <Title level={3} style={{ margin: 0 }}>
                {filteredProperties.length} Properties Found
              </Title>
              <Paragraph style={{ color: '#8c8c8c', margin: '4px 0 0 0' }}>
                Showing {startIndex + 1}-{Math.min(endIndex, filteredProperties.length)} of {filteredProperties.length} properties
              </Paragraph>
            </div>
            
            <Space wrap>
              {propertyType !== 'all' && (
                <Tag closable onClose={() => setPropertyType('all')}>
                  Type: {propertyType === 'sale' ? 'For Sale' : 'For Rent'}
                </Tag>
              )}
              {location !== 'all' && (
                <Tag closable onClose={() => setLocation('all')}>
                  Location: {location}
                </Tag>
              )}
              {priceRange !== 'all' && (
                <Tag closable onClose={() => setPriceRange('all')}>
                  Price: {priceRange}
                </Tag>
              )}
              {bedrooms !== 'all' && (
                <Tag closable onClose={() => setBedrooms('all')}>
                  Bedrooms: {bedrooms}
                </Tag>
              )}
            </Space>
          </div>

          {/* Properties Grid */}
          {paginatedProperties.length > 0 ? (
            <>
              <Row gutter={[32, 32]}>
                {paginatedProperties.map((property) => (
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

              {/* Pagination */}
              {filteredProperties.length > pageSize && (
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'center', 
                  marginTop: '48px' 
                }}>
                  <Pagination
                    current={currentPage}
                    total={filteredProperties.length}
                    pageSize={pageSize}
                    onChange={setCurrentPage}
                    showSizeChanger={false}
                    showQuickJumper
                    showTotal={(total, range) => 
                      `${range[0]}-${range[1]} of ${total} items`
                    }
                  />
                </div>
              )}
            </>
          ) : (
            <Card style={{ textAlign: 'center', padding: '64px 24px' }}>
              <Title level={3} style={{ color: '#8c8c8c' }}>
                No Properties Found
              </Title>
              <Paragraph style={{ color: '#8c8c8c', fontSize: '16px' }}>
                Try adjusting your search criteria to find more properties.
              </Paragraph>
              <Button 
                type="primary" 
                onClick={() => {
                  setPropertyType('all');
                  setLocation('all');
                  setPriceRange('all');
                  setBedrooms('all');
                  setSearchTerm('');
                }}
              >
                Clear All Filters
              </Button>
            </Card>
          )}
        </div>
      </div>
    </MainWrapper>
  );
}
