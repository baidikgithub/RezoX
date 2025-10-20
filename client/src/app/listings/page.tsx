'use client';

import React, { useState, useEffect } from 'react';
import { Typography, Row, Col, Select, Input, Button, Card, Tag, Space, Pagination, Spin, Alert } from 'antd';
import { SearchOutlined, FilterOutlined, SortAscendingOutlined } from '@ant-design/icons';
import MainWrapper from '../../components/layouts/MainWrapper';
import PropertyCard from '../../components/PropertyCard';
import HeroSection from '../../components/sections/HeroSection';
import { useTheme } from '../../contexts/ThemeContext';
import { useProperties } from '../../hooks/useProperties';
import { useCities } from '../../hooks/useCities';
// import { useFavorites } from '../../hooks/useUser'; // Removed for now
import { useAuth } from '../../hooks/useAuth';
import { Property, PropertyFilters, PropertySort } from '../../utils/types';
import { PROPERTY_TYPES, PRICE_RANGES, BEDROOMS, SORT_OPTIONS } from '../../data/constants';
import axios from 'axios';
const { Title, Paragraph } = Typography;
const { Search } = Input;

export default function Listings() {
  const { isDarkMode } = useTheme();
  const { user } = useAuth();
  const { cities, loading: citiesLoading } = useCities();
  const [propertyType, setPropertyType] = useState<string>('all');
  const [location, setLocation] = useState<string>('all');
  const [priceRange, setPriceRange] = useState<string>('all');
  const [bedrooms, setBedrooms] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('newest');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize] = useState<number>(8);

  // Build filters object
  const filters: PropertyFilters = {
    ...(propertyType !== 'all' && { type: propertyType as 'sale' | 'rent' }),
    ...(location !== 'all' && { location }),
    ...(priceRange !== 'all' && {
      minPrice: priceRange === '0-500k' ? 0 : priceRange === '500k-1m' ? 500000 : priceRange === '1m-2m' ? 1000000 : 2000000,
      maxPrice: priceRange === '0-500k' ? 500000 : priceRange === '500k-1m' ? 1000000 : priceRange === '1m-2m' ? 2000000 : undefined,
    }),
    ...(bedrooms !== 'all' && { bedrooms: parseInt(bedrooms) }),
    ...(searchTerm && { searchTerm }),
  };

  // Build sort object
  const sort: PropertySort = {
    field: sortBy === 'price-low' || sortBy === 'price-high' ? 'price' : 'createdAt',
    direction: sortBy === 'price-low' || sortBy === 'oldest' ? 'asc' : 'desc',
  };

  // Use API hook
  const { data, loading, error } = useProperties(filters);
  // const { toggleFavorite, isFavorite } = useFavorites(user?.uid || ''); // Removed for now

  // Get paginated properties from API
  const paginatedProperties = data.properties;
  const totalProperties = data.pagination?.totalProperties || 0;

  const handleViewDetails = (property: Property) => {
    window.location.href = `/property/${property._id}`;
  };

  const handleFavorite = async (property: Property) => {
    // if (user) {
    //   await toggleFavorite(property._id);
    // } else {
    //   // TODO: Show login modal or redirect to login
    //   console.log('Please login to add favorites');
    // }
    console.log('Favorite functionality temporarily disabled');
  };

  const handleShare = (property: Property) => {
    console.log('Share property:', property.title);
    // TODO: Implement share functionality
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };

  useEffect(() => {
    const fetchCities = async () => {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/cities`);
      const data = response.data;
      console.log('Cities:', data);
    };
    fetchCities();
  }, []);

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
        boxShadow: isDarkMode ? '0 2px 8px rgba(0,0,0,0.3)' : '0 2px 8px rgba(0,0,0,0.1)',
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
                enterButton={<SearchOutlined style={{ color: isDarkMode ? '#ffffff' : '#000000' }} />}
                size="large"
                onSearch={handleSearch}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  background: isDarkMode ? '#2a2a2a' : '#ffffff',
                  borderColor: isDarkMode ? '#434343' : '#d9d9d9'
                }}
              />
            </Col>
            
            <Col xs={12} sm={6} md={3}>
              <Select
                placeholder="Type"
                value={propertyType}
                onChange={setPropertyType}
                style={{ 
                  width: '100%',
                  background: isDarkMode ? '#2a2a2a' : '#ffffff',
                  color: isDarkMode ? '#ffffff' : '#000000'
                }}
                size="large"
                dropdownStyle={{
                  background: isDarkMode ? '#1f1f1f' : '#ffffff',
                  border: isDarkMode ? '1px solid #434343' : '1px solid #d9d9d9'
                }}
              >
                {PROPERTY_TYPES.map(type => (
                  <Select.Option key={type.value} value={type.value} style={{
                    background: isDarkMode ? '#1f1f1f' : '#ffffff',
                    color: isDarkMode ? '#ffffff' : '#000000'
                  }}>
                    {type.label}
                  </Select.Option>
                ))}
              </Select>
            </Col>

            <Col xs={12} sm={6} md={3}>
              <Select
                placeholder={citiesLoading ? "Loading cities..." : "Location"}
                loading={citiesLoading}
                value={location}
                onChange={setLocation}
                style={{ 
                  width: '100%',
                  background: isDarkMode ? '#ffffff' : '#ffffff',
                  color: isDarkMode ? '#ffffff' : '#000000'
                }}
                size="large"
                dropdownStyle={{
                  background: isDarkMode ? '#1f1f1f' : '#ffffff',
                  border: isDarkMode ? '1px solid #434343' : '1px solid #d9d9d9'
                }}
              >
                <Select.Option value="all" style={{
                  background: isDarkMode ? '#1f1f1f' : '#ffffff',
                  color: isDarkMode ? '#ffffff' : '#000000'
                }}>
                  All Locations
                </Select.Option>
                {cities.map((city) => (
                  <Select.Option key={city._id} value={city.name} style={{
                    background: isDarkMode ? '#1f1f1f' : '#ffffff',
                    color: isDarkMode ? '#ffffff' : '#000000'
                  }}>
                    {city.name}
                  </Select.Option>
                ))}
              </Select>
            </Col>

            <Col xs={12} sm={6} md={3}>
              <Select
                placeholder="Price Range"
                value={priceRange}
                onChange={setPriceRange}
                style={{ 
                  width: '100%',
                  background: isDarkMode ? '#2a2a2a' : '#ffffff',
                  color: isDarkMode ? '#ffffff' : '#000000'
                }}
                size="large"
                dropdownStyle={{
                  background: isDarkMode ? '#1f1f1f' : '#ffffff',
                  border: isDarkMode ? '1px solid #434343' : '1px solid #d9d9d9'
                }}
              >
                {PRICE_RANGES.map(range => (
                  <Select.Option key={range.value} value={range.value} style={{
                    background: isDarkMode ? '#1f1f1f' : '#ffffff',
                    color: isDarkMode ? '#ffffff' : '#000000'
                  }}>
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
                style={{ 
                  width: '100%',
                  background: isDarkMode ? '#2a2a2a' : '#ffffff',
                  color: isDarkMode ? '#ffffff' : '#000000'
                }}
                size="large"
                dropdownStyle={{
                  background: isDarkMode ? '#1f1f1f' : '#ffffff',
                  border: isDarkMode ? '1px solid #434343' : '1px solid #d9d9d9'
                }}
              >
                {BEDROOMS.map(bed => (
                  <Select.Option key={bed.value} value={bed.value} style={{
                    background: isDarkMode ? '#1f1f1f' : '#ffffff',
                    color: isDarkMode ? '#ffffff' : '#000000'
                  }}>
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
                style={{ 
                  width: '100%',
                  background: isDarkMode ? '#2a2a2a' : '#ffffff',
                  color: isDarkMode ? '#ffffff' : '#000000'
                }}
                size="large"
                suffixIcon={<SortAscendingOutlined style={{ color: isDarkMode ? '#ffffff' : '#000000' }} />}
                dropdownStyle={{
                  background: isDarkMode ? '#1f1f1f' : '#ffffff',
                  border: isDarkMode ? '1px solid #434343' : '1px solid #d9d9d9'
                }}
              >
                {SORT_OPTIONS.map(option => (
                  <Select.Option key={option.value} value={option.value} style={{
                    background: isDarkMode ? '#1f1f1f' : '#ffffff',
                    color: isDarkMode ? '#ffffff' : '#000000'
                  }}>
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
                {totalProperties} Properties Found
              </Title>
              <Paragraph style={{ color: isDarkMode ? '#d9d9d9' : '#8c8c8c', margin: '4px 0 0 0' }}>
                Showing {paginatedProperties.length} of {totalProperties} properties
              </Paragraph>
            </div>
            
            <Space wrap>
              {propertyType !== 'all' && (
                <Tag 
                  closable 
                  onClose={() => setPropertyType('all')}
                  style={{
                    background: isDarkMode ? '#2a2a2a' : '#f0f0f0',
                    color: isDarkMode ? '#ffffff' : '#000000',
                    border: isDarkMode ? '1px solid #434343' : '1px solid #d9d9d9'
                  }}
                >
                  Type: {propertyType === 'sale' ? 'For Sale' : 'For Rent'}
                </Tag>
              )}
              {location !== 'all' && (
                <Tag 
                  closable 
                  onClose={() => setLocation('all')}
                  style={{
                    background: isDarkMode ? '#2a2a2a' : '#f0f0f0',
                    color: isDarkMode ? '#ffffff' : '#000000',
                    border: isDarkMode ? '1px solid #434343' : '1px solid #d9d9d9'
                  }}
                >
                  Location: {location}
                </Tag>
              )}
              {priceRange !== 'all' && (
                <Tag 
                  closable 
                  onClose={() => setPriceRange('all')}
                  style={{
                    background: isDarkMode ? '#2a2a2a' : '#f0f0f0',
                    color: isDarkMode ? '#ffffff' : '#000000',
                    border: isDarkMode ? '1px solid #434343' : '1px solid #d9d9d9'
                  }}
                >
                  Price: {priceRange}
                </Tag>
              )}
              {bedrooms !== 'all' && (
                <Tag 
                  closable 
                  onClose={() => setBedrooms('all')}
                  style={{
                    background: isDarkMode ? '#2a2a2a' : '#f0f0f0',
                    color: isDarkMode ? '#ffffff' : '#000000',
                    border: isDarkMode ? '1px solid #434343' : '1px solid #d9d9d9'
                  }}
                >
                  Bedrooms: {bedrooms}
                </Tag>
              )}
            </Space>
          </div>

          {/* Properties Grid */}
          {loading ? (
            <div style={{ textAlign: 'center', padding: '64px 0' }}>
              <Spin size="large" />
              <Paragraph style={{ marginTop: '16px', color: isDarkMode ? '#d9d9d9' : '#8c8c8c' }}>
                Loading properties...
              </Paragraph>
            </div>
          ) : error ? (
            <Alert
              message="Error Loading Properties"
              description={error}
              type="error"
              showIcon
              style={{ margin: '32px 0' }}
            />
          ) : paginatedProperties.length > 0 ? (
            <>
              <Row gutter={[32, 32]}>
                {paginatedProperties.map((property) => (
                  <Col xs={24} sm={12} lg={6} key={property._id}>
                    <PropertyCard
                      property={property}
                      onViewDetails={handleViewDetails}
                      onFavorite={handleFavorite}
                      onShare={handleShare}
                      isFavorite={false} // Temporarily disabled
                    />
                  </Col>
                ))}
              </Row>

              {/* Pagination */}
              {totalProperties > pageSize && (
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'center', 
                  marginTop: '48px' 
                }}>
                  <Pagination
                    current={currentPage}
                    total={totalProperties}
                    pageSize={pageSize}
                    onChange={setCurrentPage}
                    showSizeChanger={false}
                    showQuickJumper
                    showTotal={(total, range) => 
                      `${range[0]}-${range[1]} of ${total} items`
                    }
                    style={{
                      color: isDarkMode ? '#ffffff' : '#000000'
                    }}
                    itemRender={(current, type, originalElement) => {
                      if (type === 'prev') {
                        return <Button style={{ 
                          color: isDarkMode ? '#ffffff' : '#000000',
                          background: isDarkMode ? '#2a2a2a' : '#ffffff',
                          borderColor: isDarkMode ? '#434343' : '#d9d9d9'
                        }}>Previous</Button>;
                      }
                      if (type === 'next') {
                        return <Button style={{ 
                          color: isDarkMode ? '#ffffff' : '#000000',
                          background: isDarkMode ? '#2a2a2a' : '#ffffff',
                          borderColor: isDarkMode ? '#434343' : '#d9d9d9'
                        }}>Next</Button>;
                      }
                      return originalElement;
                    }}
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
      
      <style jsx>{`
        .ant-pagination .ant-pagination-item {
          background: ${isDarkMode ? '#2a2a2a' : '#ffffff'} !important;
          border-color: ${isDarkMode ? '#434343' : '#d9d9d9'} !important;
        }
        .ant-pagination .ant-pagination-item a {
          color: ${isDarkMode ? '#ffffff' : '#000000'} !important;
        }
        .ant-pagination .ant-pagination-item:hover {
          border-color: #1890ff !important;
        }
        .ant-pagination .ant-pagination-item:hover a {
          color: #1890ff !important;
        }
        .ant-pagination .ant-pagination-item-active {
          background: #1890ff !important;
          border-color: #1890ff !important;
        }
        .ant-pagination .ant-pagination-item-active a {
          color: #ffffff !important;
        }
        .ant-pagination .ant-pagination-jump-prev,
        .ant-pagination .ant-pagination-jump-next {
          color: ${isDarkMode ? '#ffffff' : '#000000'} !important;
        }
        .ant-pagination .ant-pagination-options {
          color: ${isDarkMode ? '#ffffff' : '#000000'} !important;
        }
        .ant-pagination .ant-pagination-options .ant-select {
          color: ${isDarkMode ? '#ffffff' : '#000000'} !important;
        }
        .ant-pagination .ant-pagination-options .ant-select .ant-select-selector {
          background: ${isDarkMode ? '#2a2a2a' : '#ffffff'} !important;
          border-color: ${isDarkMode ? '#434343' : '#d9d9d9'} !important;
          color: ${isDarkMode ? '#ffffff' : '#000000'} !important;
        }
        .ant-pagination .ant-pagination-options .ant-select .ant-select-selection-item {
          color: ${isDarkMode ? '#ffffff' : '#000000'} !important;
        }
        .ant-pagination .ant-pagination-total-text {
          color: ${isDarkMode ? '#ffffff' : '#000000'} !important;
        }
      `}</style>
    </MainWrapper>
  );
}
