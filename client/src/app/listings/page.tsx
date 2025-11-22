'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Typography, Row, Col, Select, Input, Button, Card, Tag, Space, Pagination, Spin, Alert } from 'antd';
import { SearchOutlined, FilterOutlined, SortAscendingOutlined } from '@ant-design/icons';
import MainWrapper from '../../components/layouts/MainWrapper';
import PropertyCard from '../../components/PropertyCard';
import HeroSection from '../../components/sections/HeroSection';
import SocialShareModal from '../../components/SocialShareModal';
import { useTheme } from '../../contexts/ThemeContext';
// import { useProperties } from '../../hooks/useProperties'; // Not needed as we use axios directly
// import { useCities } from '../../hooks/useCities'; // Not needed as we use axios directly
// import { useFavorites } from '../../hooks/useUser'; // Removed for now
import { useAuth } from '../../hooks/useAuth';
import { Property, PropertyFilters } from '../../utils/types'; // Assuming Property and PropertyFilters types are defined
import { SORT_OPTIONS } from '../../data/constants'; // Assuming SORT_OPTIONS is defined
import axios from 'axios';

const { Title, Paragraph } = Typography;
const { Search } = Input;

// Define a placeholder type for the API response structure
interface PropertyApiResponse {
  properties: Property[];
  totalCount: number; // CRITICAL: Your backend MUST provide this for correct pagination
}

export default function Listings() {
  const { isDarkMode } = useTheme();
  const { user } = useAuth(); // Assuming useAuth is correctly implemented

  // Filter States
  const [propertyType, setPropertyType] = useState<string>('all');
  const [location, setLocation] = useState<string>('all');
  const [priceRange, setPriceRange] = useState<string>('all');
  const [bedrooms, setBedrooms] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Dropdown Options States
  const [propertyTypes, setPropertyTypes] = useState<string[]>([]);
  const [priceRanges, setPriceRanges] = useState<string[]>([]);
  const [locations, setLocations] = useState<string[]>([]);
  const [bedroomOptions, setBedroomOptions] = useState<string[]>([]);

  // Loading States for Dropdowns
  const [propertyTypesLoading, setPropertyTypesLoading] = useState(true);
  const [priceRangesLoading, setPriceRangesLoading] = useState(true);
  const [locationsLoading, setLocationsLoading] = useState(true);
  const [bedroomsLoading, setBedroomsLoading] = useState(true);

  // Listing States
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Sorting and Pagination States
  const [sortBy, setSortBy] = useState<string>('newest');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize] = useState<number>(8);
  const [totalProperties, setTotalProperties] = useState<number>(0); // CRITICAL for Pagination
  
  // Share modal state
  const [shareModalVisible, setShareModalVisible] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);



  /**
   * Function to handle when any filter or search term changes.
   * Resets the page number to 1.
   */
  const handleFilterChange = () => {
    setCurrentPage(1);
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    handleFilterChange(); // Reset to first page when searching
  };

  const handleShare = (property: Property) => {
    setSelectedProperty(property);
    setShareModalVisible(true);
  };

  // --- Dropdown Data Fetching Effects ---

  useEffect(() => {
    const fetchDropdownData = async (endpoint: string, setter: React.Dispatch<React.SetStateAction<string[]>>, loadingSetter: React.Dispatch<React.SetStateAction<boolean>>) => {
      try {
        const response = await axios.get(endpoint);
        // Assuming your API returns an array of objects with a 'name' property
        setter(response.data.map((item: { name: string }) => item.name));
      } catch (err) {
        console.error(`Error fetching data from ${endpoint}:`, err);
        // Optionally set an error state here for the dropdowns
      } finally {
        loadingSetter(false);
      }
    };

    fetchDropdownData('/api/property-types', setPropertyTypes, setPropertyTypesLoading);
    fetchDropdownData('/api/price-ranges', setPriceRanges, setPriceRangesLoading);
    fetchDropdownData('/api/locations', setLocations, setLocationsLoading);
    fetchDropdownData('/api/bedrooms', setBedroomOptions, setBedroomsLoading);

  }, []); // Run only once on mount to get static filter options


  // --- MAIN PROPERTY FETCHING EFFECT (FIXED) ---

  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const params = {
          propertyType: propertyType !== 'all' ? propertyType : undefined,
          location: location !== 'all' ? location : undefined,
          priceRange: priceRange !== 'all' ? priceRange : undefined,
          bedrooms: bedrooms !== 'all' ? bedrooms : undefined,
          searchTerm: searchTerm || undefined,
          sortBy,
          page: currentPage,
          limit: pageSize
        };

        // Remove undefined values
        const cleanParams = Object.fromEntries(
          Object.entries(params).filter(([_, value]) => value !== undefined)
        );

        const response = await axios.get<PropertyApiResponse>('/api/properties', {
          params: cleanParams,
        });

        // Set properties and total count from API response
        setProperties(response.data.properties || []);
        setTotalProperties(response.data.totalCount || 0);
        
      } catch (err) {
        console.error('Error fetching properties:', err);
        setError('Failed to load property listings. Please try refreshing the page.');
        setProperties([]);
        setTotalProperties(0);
      } finally {
        setLoading(false);
      }
    };
    
    // Dependencies: Rerun when any filter, sort, search term, or page changes
    fetchProperties(); 
  }, [
    currentPage, 
    pageSize, 
    sortBy, 
    propertyType, 
    location, 
    priceRange, 
    bedrooms, 
    searchTerm
  ]);


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
                defaultValue={searchTerm}
                style={{
                  background: isDarkMode ? '#2a2a2a' : '#ffffff',
                  borderColor: isDarkMode ? '#434343' : '#d9d9d9'
                }}
              />
            </Col>
            
            <Col xs={12} sm={6} md={3}>
              <Select
                placeholder={propertyTypesLoading ? "Loading..." : "Type"}
                loading={propertyTypesLoading}
                value={propertyType}
                onChange={(value) => {
                  setPropertyType(value);
                  handleFilterChange();
                }}
                style={{ width: '100%' }}
                size="large"
                dropdownStyle={{ background: isDarkMode ? '#1f1f1f' : '#ffffff' }}
              >
                <Select.Option value="all">All Types</Select.Option>
                {propertyTypes.map((type: string) => (
                  <Select.Option key={type} value={type}>{type}</Select.Option>
                ))}
              </Select>
            </Col>

            <Col xs={12} sm={6} md={3}>
              <Select
                placeholder={locationsLoading ? "Loading..." : "Location"}
                loading={locationsLoading}
                value={location}
                onChange={(value) => {
                  setLocation(value);
                  handleFilterChange();
                }}
                style={{ width: '100%' }}
                size="large"
                dropdownStyle={{ background: isDarkMode ? '#1f1f1f' : '#ffffff' }}
              >
                <Select.Option value="all">All Locations</Select.Option>
                {locations.map((loc: string) => (
                  <Select.Option key={loc} value={loc}>{loc}</Select.Option>
                ))}
              </Select>
            </Col>

            <Col xs={12} sm={6} md={3}>
              <Select
                placeholder={priceRangesLoading ? "Loading..." : "Price Range"}
                loading={priceRangesLoading}
                value={priceRange}
                onChange={(value) => {
                  setPriceRange(value);
                  handleFilterChange();
                }}
                style={{ width: '100%' }}
                size="large"
                dropdownStyle={{ background: isDarkMode ? '#1f1f1f' : '#ffffff' }}
              >
                <Select.Option value="all">All Prices</Select.Option>
                {priceRanges.map((range: string) => (
                  <Select.Option key={range} value={range}>{range}</Select.Option>
                ))}
              </Select>
            </Col>

            <Col xs={12} sm={6} md={3}>
              <Select
                placeholder={bedroomsLoading ? "Loading..." : "Bedrooms"}
                loading={bedroomsLoading}
                value={bedrooms}
                onChange={(value) => {
                  setBedrooms(value);
                  handleFilterChange();
                }}
                style={{ width: '100%' }}
                size="large"
                dropdownStyle={{ background: isDarkMode ? '#1f1f1f' : '#ffffff' }}
              >
                <Select.Option value="all">Any</Select.Option>
                {bedroomOptions.map((bedroom: string) => (
                  <Select.Option key={bedroom} value={bedroom}>{bedroom}</Select.Option>
                ))}
              </Select>
            </Col>

            <Col xs={12} sm={6} md={3}>
              <Select
                placeholder="Sort By"
                value={sortBy}
                onChange={(value) => {
                  setSortBy(value);
                  handleFilterChange();
                }}
                style={{ width: '100%' }}
                size="large"
                suffixIcon={<SortAscendingOutlined style={{ color: isDarkMode ? '#ffffff' : '#000000' }} />}
                dropdownStyle={{ background: isDarkMode ? '#1f1f1f' : '#ffffff' }}
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
                {totalProperties} Properties Found
              </Title>
              <Paragraph style={{ color: isDarkMode ? '#d9d9d9' : '#8c8c8c', margin: '4px 0 0 0' }}>
                Showing {Math.min(totalProperties, (currentPage - 1) * pageSize + 1)}–{Math.min(totalProperties, currentPage * pageSize)} of {totalProperties} properties
              </Paragraph>
            </div>
            
            <Space wrap>
              {/* Filter Tags */}
              {propertyType !== 'all' && (
                <Tag closable onClose={() => {setPropertyType('all'); handleFilterChange();}}>
                  Type: {propertyType}
                </Tag>
              )}
              {location !== 'all' && (
                <Tag closable onClose={() => {setLocation('all'); handleFilterChange();}}>
                  Location: {location}
                </Tag>
              )}
              {priceRange !== 'all' && (
                <Tag closable onClose={() => {setPriceRange('all'); handleFilterChange();}}>
                  Price: {priceRange}
                </Tag>
              )}
              {bedrooms !== 'all' && (
                <Tag closable onClose={() => {setBedrooms('all'); handleFilterChange();}}>
                  Bedrooms: {bedrooms}
                </Tag>
              )}
            </Space>
          </div>

          {/* Error Alert */}
          {error && (
            <Alert
              message="Data Loading Error"
              description={error}
              type="error"
              showIcon
              closable
              onClose={() => setError(null)}
              style={{ marginBottom: '32px' }}
            />
          )}

          {/* Properties Grid */}
          {loading ? (
            <div style={{ textAlign: 'center', padding: '64px 0' }}>
              <Spin size="large" />
              <Paragraph style={{ marginTop: '16px', color: isDarkMode ? '#d9d9d9' : '#8c8c8c' }}>
                Loading properties...
              </Paragraph>
            </div>
          ) : properties.length > 0 ? (
            <>
              <Row gutter={[32, 32]}>
                {properties.map((property) => (
                  <Col xs={24} sm={12} lg={6} key={property._id}>
                    <PropertyCard
                      property={property}
                      onViewDetails={() => window.location.href = `/property/${property._id}`}
                      onFavorite={() => console.log('Add to favorites:', property.title)}
                      onShare={() => handleShare(property)}
                      isFavorite={false} // Adjust with actual favorite hook when implemented
                    />
                  </Col>
                ))}
              </Row>

              {/* Pagination (Now using totalProperties) */}
              {totalProperties > pageSize && (
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'center', 
                  marginTop: '48px' 
                }}>
                  <Pagination
                    current={currentPage}
                    total={totalProperties} // Use the total count from API
                    pageSize={pageSize}
                    onChange={setCurrentPage}
                    showSizeChanger={false}
                    showQuickJumper
                    showTotal={(total, range) => 
                      `${range[0]}-${range[1]} of ${total} items`
                    }
                    // Apply custom styles via className or global AntD theme
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
                Try adjusting your search criteria or clearing your current filters.
              </Paragraph>
              <Button 
                type="primary" 
                onClick={() => {
                  setPropertyType('all');
                  setLocation('all');
                  setPriceRange('all');
                  setBedrooms('all');
                  setSearchTerm('');
                  setCurrentPage(1);
                }}
              >
                Clear All Filters
              </Button>
            </Card>
          )}
        </div>
      </div>
      
      {/* Existing inline styles moved to a style block for cleanliness */}
      <style jsx global>{`
        /* Custom styles for Ant Design components in dark mode */
        :where(.ant-select), 
        :where(.ant-input-affix-wrapper),
        :where(.ant-pagination-item),
        :where(.ant-btn) {
            transition: all 0.3s;
            ${isDarkMode ? `
              background: #2a2a2a !important;
              color: #ffffff !important;
              border-color: #434343 !important;
            ` : ''}
        }
        
        .ant-select-selector {
            ${isDarkMode ? `
              background: #2a2a2a !important;
              color: #ffffff !important;
              border-color: #434343 !important;
            ` : ''}
        }
        
        /* Specific pagination styling cleanup */
        .ant-pagination-item a,
        .ant-pagination-total-text {
          color: ${isDarkMode ? '#ffffff' : '#000000'} !important;
        }
        .ant-pagination-item-active {
          background: #1890ff !important;
          border-color: #1890ff !important;
        }
        .ant-pagination-item-active a {
          color: #ffffff !important;
        }
        .ant-pagination .ant-pagination-jump-prev,
        .ant-pagination .ant-pagination-jump-next {
          color: ${isDarkMode ? '#ffffff' : '#000000'} !important;
        }
        
        /* Style for Select dropdown options in dark mode */
        .ant-select-dropdown {
          ${isDarkMode ? `
            background: #1f1f1f !important;
            border: 1px solid #434343 !important;
          ` : ''}
        }
        .ant-select-item-option-content {
          color: ${isDarkMode ? '#ffffff' : '#000000'} !important;
        }
        .ant-select-item-option-selected:not(.ant-select-item-option-disabled) {
          background-color: ${isDarkMode ? 'rgba(24, 144, 255, 0.2)' : '#e6f7ff'} !important;
        }
      `}</style>
      
      {/* Social Share Modal */}
      {selectedProperty && (
        <SocialShareModal
          visible={shareModalVisible}
          onClose={() => {
            setShareModalVisible(false);
            setSelectedProperty(null);
          }}
          property={selectedProperty}
          url={`${window.location.origin}/property/${selectedProperty._id}`}
        />
      )}
    </MainWrapper>
  );
}