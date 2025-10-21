'use client';

import React, { useEffect, useState } from 'react';
import { Button, Space, Tag } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import MainWrapper from '../components/layouts/MainWrapper';
import HeroSection from '../components/sections/HeroSection';
import FeaturesSection from '../components/sections/FeaturesSection';
import PropertiesSection from '../components/sections/PropertiesSection';
import Newsletter from '../components/Newsletter';
import SocialShareModal from '../components/SocialShareModal';
import { whatWeDoData } from '../data/features';
import { useFeaturedProperties, useProperties } from '../hooks/useProperties';
import { useAuth } from '../hooks/useAuth';
import { Property } from '../utils/types';
import { useTheme } from '../contexts/ThemeContext';
import axios from 'axios';

export default function Home() {
  const { user } = useAuth();
  const { isDarkMode } = useTheme();
  const [allProperties, setAllProperties] = useState<Property[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Search filter states
  const [searchFilters, setSearchFilters] = useState({
    location: '',
    propertyType: '',
    priceRange: ''
  });
  
  // Share modal state
  const [shareModalVisible, setShareModalVisible] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  
  useEffect(() => {
    const fetchProperties = async () => {
      const response = await axios.get('/api/properties');
      setAllProperties(response.data.properties || response.data);
      setFilteredProperties(response.data.properties || response.data);
      setLoading(false);
    };
    fetchProperties();
  }, []);

  const handleViewDetails = (property: Property) => {
    window.location.href = `/property/${property._id}`;
  };
  const handleFavorite = (property: Property) => {
    console.log('Add to favorites:', property.title);
    // TODO: Implement favorite functionality
  };

  const handleShare = (property: Property) => {
    setSelectedProperty(property);
    setShareModalVisible(true);
  };

  const handleViewAllSales = () => {
    window.location.href = '/listings?type=sale';
  };

  const handleViewAllRentals = () => {
    window.location.href = '/listings?type=rent';
  };

  // Handle search from hero section
  const handleSearch = (location: string, propertyType: string, priceRange: string) => {
    // Check if any filter is actually selected (not "All" options)
    const hasLocationFilter = location && location !== 'All Locations';
    const hasPropertyTypeFilter = propertyType && propertyType !== 'All Types';
    const hasPriceRangeFilter = priceRange && priceRange !== 'All Prices';
    
    setSearchFilters({ 
      location: hasLocationFilter ? location : '', 
      propertyType: hasPropertyTypeFilter ? propertyType : '', 
      priceRange: hasPriceRangeFilter ? priceRange : '' 
    });
    
    // Filter properties based on search criteria
    let filtered = allProperties;
    
    if (hasLocationFilter) {
      filtered = filtered.filter(property => 
        property.location.city.toLowerCase().includes(location.toLowerCase()) ||
        property.location.state.toLowerCase().includes(location.toLowerCase())
      );
    }
    
    if (hasPropertyTypeFilter) {
      filtered = filtered.filter(property => 
        property.propertyType.toLowerCase() === propertyType.toLowerCase()
      );
    }
    
    if (hasPriceRangeFilter) {
      // Parse price range and filter accordingly
      if (priceRange === '0-500k') {
        filtered = filtered.filter(property => property.price <= 500000);
      } else if (priceRange === '500k-1m') {
        filtered = filtered.filter(property => property.price > 500000 && property.price <= 1000000);
      } else if (priceRange === '1m-2m') {
        filtered = filtered.filter(property => property.price > 1000000 && property.price <= 2000000);
      } else if (priceRange === '2m+') {
        filtered = filtered.filter(property => property.price > 2000000);
      }
    }
    
    setFilteredProperties(filtered);
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchFilters({ location: '', propertyType: '', priceRange: '' });
    setFilteredProperties(allProperties);
    // Reset HeroSection dropdowns to default "All" values
    if ((window as any).resetHeroDropdowns) {
      (window as any).resetHeroDropdowns();
    }
  };

  return (
    <MainWrapper>
      {/* Hero Section */}
      <HeroSection onSearch={handleSearch} />

      {/* What We Do Section - Only show when no filters are active */}
      {!(searchFilters.location || searchFilters.propertyType || searchFilters.priceRange) && (
        <FeaturesSection 
          title="What We Do"
          subtitle="We provide comprehensive real estate services to help you find, buy, rent, or manage properties with ease."
          features={whatWeDoData}
        />
      )}

      {/* Featured Properties Section */}
      {filteredProperties.length > 0 ? (
        <PropertiesSection
          title={
            searchFilters.location || searchFilters.propertyType || searchFilters.priceRange
              ? "Search Results"
              : "Featured Properties"
          }
          subtitle={
            searchFilters.location || searchFilters.propertyType || searchFilters.priceRange
              ? `Found ${filteredProperties.length} properties matching your search criteria`
              : "Discover our handpicked selection of premium properties"
          }
          properties={filteredProperties}
          onViewDetails={handleViewDetails}
          onFavorite={handleFavorite}
          onShare={handleShare}
          backgroundColor={
            searchFilters.location || searchFilters.propertyType || searchFilters.priceRange
              ? isDarkMode ? '#1a1a1a' : '#f8f9fa'
              : 'transparent'
          }
          showButton={false}
        />
      ) : (searchFilters.location || searchFilters.propertyType || searchFilters.priceRange) ? (
        <div style={{
          padding: '80px 0',
          background: isDarkMode ? '#1a1a1a' : '#f8f9fa',
          textAlign: 'center'
        }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
            <h2 style={{
              fontSize: '32px',
              marginBottom: '16px',
              color: isDarkMode ? '#ffffff' : '#262626'
            }}>
              No Properties Found
            </h2>
            <p style={{
              fontSize: '16px',
              color: isDarkMode ? '#d9d9d9' : '#8c8c8c',
              marginBottom: '32px'
            }}>
              We couldn't find any properties matching your search criteria. Try adjusting your filters.
            </p>
            <Button 
              type="primary" 
              size="large"
              onClick={clearFilters}
              style={{
                background: '#1890ff',
                borderColor: '#1890ff'
              }}
            >
              Clear All Filters
            </Button>
          </div>
        </div>
      ) : null}
      
      
      <Newsletter />
      
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
