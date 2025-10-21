'use client';

import React, { useState, useEffect } from 'react';
import { Typography, Card, Row, Col, Button, Select, Spin } from 'antd';
import { SearchOutlined, EnvironmentOutlined, HomeOutlined, DollarOutlined } from '@ant-design/icons';
import { useTheme } from '../../contexts/ThemeContext';
import { HERO_PROPERTY_TYPES, HERO_PRICE_RANGES } from '../../data/constants';
import { useCities } from '../../hooks/useCities';
import axios from 'axios';

const { Title, Paragraph } = Typography;

interface HeroSectionProps {
  title?: string;
  subtitle?: string;
  showSearch?: boolean;
  backgroundImage?: string;
  height?: string;
  onSearch?: (location: string, propertyType: string, priceRange: string) => void;
  onClearFilters?: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({
  title = "Find Your Dream Home",
  subtitle = "Discover the perfect property for sale or rent in your desired location",
  showSearch = true,
  backgroundImage = 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1973&q=80',
  height = '70vh',
  onSearch,
  onClearFilters
}) => {
  const { isDarkMode } = useTheme();
  const { cities, loading: citiesLoading } = useCities();
  const [locations, setLocations] = useState<string[]>([]);
  const [propertyTypesLoading, setPropertyTypesLoading] = useState(true);
  const [propertyTypes, setPropertyTypes] = useState<string[]>([]);
  const [priceRanges, setPriceRanges] = useState<string[]>([]);
  const [priceRangesLoading, setPriceRangesLoading] = useState(true);
  
  // State for selected values - set default to "All" options
  const [selectedLocation, setSelectedLocation] = useState<string>('All Locations');
  const [selectedPropertyType, setSelectedPropertyType] = useState<string>('All Types');
  const [selectedPriceRange, setSelectedPriceRange] = useState<string>('All Prices');
  
  const handleSearch = (location: string, propertyType: string, priceRange: string) => {
    window.location.href = `/listings?location=${location}&propertyType=${propertyType}&priceRange=${priceRange}`;
  };
  useEffect(() => {
    const fetchLocations = async () => {
      const response = await axios.get('/api/locations');
      setLocations(response.data.map((location: { label: string }) => location.label));
    };
    fetchLocations();
  }, []);

  useEffect(() => {
    const fetchPropertyTypes = async () => {
      const response = await axios.get('/api/property-types');
      setPropertyTypes(response.data.map((type: { name: string }) => type.name));
      setPropertyTypesLoading(false);
    };
    fetchPropertyTypes();
  }, []);

  useEffect(() => {
    const fetchPriceRanges = async () => {
      const response = await axios.get('/api/price-ranges');
      setPriceRanges(response.data.map((range: { name: string }) => range.name));
      setPriceRangesLoading(false);
    };
    fetchPriceRanges();
  }, []);

  // Reset dropdowns when clear filters is called
  useEffect(() => {
    if (onClearFilters) {
      const resetDropdowns = () => {
        setSelectedLocation('All Locations');
        setSelectedPropertyType('All Types');
        setSelectedPriceRange('All Prices');
      };
      
      // Listen for clear filters event
      const handleClearFilters = () => {
        resetDropdowns();
      };
      
      // Store the reset function on the window object so parent can call it
      (window as any).resetHeroDropdowns = resetDropdowns;
      
      return () => {
        delete (window as any).resetHeroDropdowns;
      };
    }
  }, [onClearFilters]);

  return (
    <div style={{
      background: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url("${backgroundImage}")`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      minHeight: height,
      display: 'flex',
      alignItems: 'center',
      color: 'white',
      position: 'relative'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 24px',
        zIndex: 1
      }}>
        <Row justify="center" align="middle" style={{ minHeight: '60vh' }}>
          <Col xs={24} md={16} lg={12} style={{ textAlign: 'center' }}>
            <Title level={1} style={{
              color: 'white',
              fontSize: '3.5rem',
              marginBottom: '24px',
              textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
            }}>
              {title}
            </Title>
            <Paragraph style={{
              color: 'white',
              fontSize: '1.2rem',
              marginBottom: '48px',
              opacity: 0.9,
              textShadow: '1px 1px 2px rgba(0,0,0,0.5)'
            }}>
              {subtitle}
            </Paragraph>

            {showSearch && (
              <Card style={{
                background: isDarkMode ? 'rgba(31,31,31,0.95)' : 'rgba(255,255,255,0.95)',
                borderRadius: '12px',
                boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                marginTop: '32px',
                border: isDarkMode ? '1px solid #434343' : 'none'
              }}>
                <Row gutter={[16, 16]} align="middle">
                  <Col xs={24} sm={8}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <EnvironmentOutlined style={{ color: '#1890ff' }} />
                      <Select
                        placeholder={citiesLoading ? "Loading cities..." : "Location"}
                        loading={citiesLoading}
                        value={selectedLocation}
                        onChange={setSelectedLocation}
                        style={{
                          width: '100%',
                          color: isDarkMode ? '#ffffff' : '#000000'
                        }}
                        size="large"
                        bordered={false}
                        className={isDarkMode ? 'dark-select' : ''}
                        dropdownStyle={{
                          background: isDarkMode ? '#1f1f1f' : '#ffffff',
                          border: isDarkMode ? '1px solid #434343' : '1px solid #d9d9d9'
                        }}
                      >
                        <Select.Option
                          key="All Locations"
                          value="All Locations"
                          style={{
                            background: isDarkMode ? '#1f1f1f' : '#ffffff',
                            color: isDarkMode ? '#ffffff' : '#000000'
                          }}
                        >
                          All Locations
                        </Select.Option>
                        {locations.map(location => (
                          <Select.Option
                            key={location}
                            value={location}
                            style={{
                              background: isDarkMode ? '#1f1f1f' : '#ffffff',
                              color: isDarkMode ? '#ffffff' : '#000000'
                            }}
                          >
                            {location}
                          </Select.Option>
                        ))}
                      </Select>
                    </div>
                  </Col>
                  <Col xs={24} sm={8}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <HomeOutlined style={{ color: '#1890ff' }} />
                      <Select
                        placeholder={propertyTypesLoading ? "Loading property types..." : "Property Type"}
                        loading={propertyTypesLoading}
                        value={selectedPropertyType}
                        onChange={setSelectedPropertyType}
                        style={{
                          width: '100%',
                          color: isDarkMode ? '#ffffff' : '#000000'
                        }}
                        size="large"
                        bordered={false}
                        className={isDarkMode ? 'dark-select' : ''}
                        dropdownStyle={{
                          background: isDarkMode ? '#1f1f1f' : '#ffffff',
                          border: isDarkMode ? '1px solid #434343' : '1px solid #d9d9d9'
                        }}
                      >
                        <Select.Option
                          key="All Types"
                          value="All Types"
                          style={{
                            background: isDarkMode ? '#1f1f1f' : '#ffffff',
                            color: isDarkMode ? '#ffffff' : '#000000'
                          }}
                        >
                          All Types
                        </Select.Option>
                        {propertyTypes.map((type) => (
                          <Select.Option
                            key={type}
                            value={type}
                            style={{
                              background: isDarkMode ? '#1f1f1f' : '#ffffff',
                              color: isDarkMode ? '#ffffff' : '#000000'
                            }}
                          >
                            {type}
                          </Select.Option>
                        ))}
                      </Select>
                    </div>
                  </Col>

                  <Col xs={24} sm={8}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <DollarOutlined style={{ color: '#1890ff' }} />
                      <Select
                        placeholder={priceRangesLoading ? "Loading price ranges..." : "Price Range"}
                        loading={priceRangesLoading}
                        value={selectedPriceRange}
                        onChange={setSelectedPriceRange}
                        style={{
                          width: '100%',
                          color: isDarkMode ? '#ffffff' : '#000000'
                        }}
                        size="large"
                        bordered={false}
                        className={isDarkMode ? 'dark-select' : ''}
                        dropdownStyle={{
                          background: isDarkMode ? '#1f1f1f' : '#ffffff',
                          border: isDarkMode ? '1px solid #434343' : '1px solid #d9d9d9'
                        }}
                      >
                        <Select.Option
                          key="All Prices"
                          value="All Prices"
                          style={{
                            background: isDarkMode ? '#1f1f1f' : '#ffffff',
                            color: isDarkMode ? '#ffffff' : '#000000'
                          }}
                        >
                          All Prices
                        </Select.Option>
                        {priceRanges.map((range: string) => (
                          <Select.Option
                            key={range}
                            value={range}
                            style={{
                              background: isDarkMode ? '#1f1f1f' : '#ffffff',
                              color: isDarkMode ? '#ffffff' : '#000000'
                            }}
                          >
                            {range}
                          </Select.Option>
                        ))}
                      </Select>
                    </div>
                  </Col>
                  <Col xs={24}>
                    <Button
                      type="primary"
                      size="large"
                      icon={<SearchOutlined />}
                      style={{
                        width: '100%',
                        height: '48px',
                        fontSize: '16px',
                        fontWeight: 'bold'
                      }}
                      onClick={() => {
                        if (onSearch) {
                          onSearch(selectedLocation, selectedPropertyType, selectedPriceRange);
                        } else {
                          handleSearch(selectedLocation, selectedPropertyType, selectedPriceRange);
                        }
                      }}
                    >
                      Search Properties
                    </Button>
                  </Col>
                </Row>
              </Card>
            )}
          </Col>
        </Row>
      </div>

      <style jsx>{`
        .dark-select .ant-select-selector {
          background: ${isDarkMode ? '#2a2a2a' : '#ffffff'} !important;
          color: ${isDarkMode ? '#ffffff' : '#000000'} !important;
        }
        .dark-select .ant-select-selection-placeholder {
          color: ${isDarkMode ? '#a0a0a0' : '#8c8c8c'} !important;
        }
        .dark-select .ant-select-selection-item {
          color: ${isDarkMode ? '#ffffff' : '#000000'} !important;
        }
        .dark-select .ant-select-arrow {
          color: ${isDarkMode ? '#ffffff' : '#000000'} !important;
        }
        .dark-select:hover .ant-select-selector {
          border-color: #1890ff !important;
        }
        .dark-select.ant-select-focused .ant-select-selector {
          border-color: #1890ff !important;
          box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2) !important;
        }
      `}</style>
    </div>
  );
};

export default HeroSection;

