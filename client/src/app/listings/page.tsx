'use client';

import React, { useState, useEffect } from 'react';
import { Typography, Row, Col, Select, Input, Button, Card, Tag, Space, Pagination } from 'antd';
import { SearchOutlined, FilterOutlined, SortAscendingOutlined } from '@ant-design/icons';
import MainWrapper from '../../components/layouts/MainWrapper';
import PropertyCard from '../../components/PropertyCard';
import HeroSection from '../../components/sections/HeroSection';
import { useTheme } from '../../contexts/ThemeContext';
import { Property } from '../../utils/types';
import { allProperties } from '../../data/properties';
import { LOCATIONS, PROPERTY_TYPES, PRICE_RANGES, BEDROOMS, SORT_OPTIONS } from '../../data/constants';

const { Title, Paragraph } = Typography;
const { Search } = Input;

export default function Listings() {
  const { isDarkMode } = useTheme();
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
      {/* Hero Section */}
      <HeroSection 
        title="Property Listings"
        subtitle="Find your perfect property from our extensive collection"
        showSearch={false}
        height="60vh"
      />

      {/* Filters Section */}
      <div style={{ 
        background: isDarkMode ? '#1f1f1f' : 'white', 
        padding: '32px 0',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        position: 'sticky',
        top: '64px',
        zIndex: 100,
        borderBottom: isDarkMode ? '1px solid #434343' : 'none'
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
                {PROPERTY_TYPES.map(type => (
                  <Select.Option key={type.value} value={type.value}>
                    {type.label}
                  </Select.Option>
                ))}
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
                {LOCATIONS.map(loc => (
                  <Select.Option key={loc.value} value={loc.value}>
                    {loc.label}
                  </Select.Option>
                ))}
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
                {PRICE_RANGES.map(range => (
                  <Select.Option key={range.value} value={range.value}>
                    {range.label}
                  </Select.Option>
                ))}
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
                {BEDROOMS.map(bed => (
                  <Select.Option key={bed.value} value={bed.value}>
                    {bed.label}
                  </Select.Option>
                ))}
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
                {SORT_OPTIONS.map(option => (
                  <Select.Option key={option.value} value={option.value}>
                    {option.label}
                  </Select.Option>
                ))}
              </Select>
            </Col>
          </Row>
        </div>
      </div>

      {/* Results Section */}
      <div style={{ padding: '48px 0', background: isDarkMode ? '#141414' : 'transparent' }}>
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
              <Title level={3} style={{ margin: 0, color: isDarkMode ? '#ffffff' : '#262626' }}>
                {filteredProperties.length} Properties Found
              </Title>
              <Paragraph style={{ color: isDarkMode ? '#d9d9d9' : '#8c8c8c', margin: '4px 0 0 0' }}>
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
            <Card style={{ 
              textAlign: 'center', 
              padding: '64px 24px',
              background: isDarkMode ? '#1f1f1f' : 'white',
              border: isDarkMode ? '1px solid #434343' : 'none'
            }}>
              <Title level={3} style={{ color: isDarkMode ? '#d9d9d9' : '#8c8c8c' }}>
                No Properties Found
              </Title>
              <Paragraph style={{ color: isDarkMode ? '#d9d9d9' : '#8c8c8c', fontSize: '16px' }}>
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
