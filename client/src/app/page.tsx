'use client';

import React from 'react';
import MainWrapper from '../components/layouts/MainWrapper';
import HeroSection from '../components/sections/HeroSection';
import FeaturesSection from '../components/sections/FeaturesSection';
import PropertiesSection from '../components/sections/PropertiesSection';
import Newsletter from '../components/Newsletter';
import { whatWeDoData } from '../data/features';
import { useFeaturedProperties } from '../hooks/useProperties';
import { useAuth } from '../hooks/useAuth';
import { Property } from '../utils/types';

export default function Home() {
  const { user } = useAuth();
  const { properties: featuredProperties, loading: featuredLoading } = useFeaturedProperties();
  // const { properties: saleProperties, loading: saleLoading } = usePropertiesByType('sale', 4); // Removed
  // const { properties: rentProperties, loading: rentLoading } = usePropertiesByType('rent', 4); // Removed

  const handleViewDetails = (property: Property) => {
    window.location.href = `/property/${property._id}`;
  };

  const handleFavorite = (property: Property) => {
    console.log('Add to favorites:', property.title);
    // TODO: Implement favorite functionality
  };

  const handleShare = (property: Property) => {
    console.log('Share property:', property.title);
    // TODO: Implement share functionality
  };

  const handleViewAllSales = () => {
    window.location.href = '/listings?type=sale';
  };

  const handleViewAllRentals = () => {
    window.location.href = '/listings?type=rent';
  };

  return (
    <MainWrapper>
      {/* Hero Section */}
      <HeroSection />

      {/* What We Do Section */}
      <FeaturesSection 
        title="What We Do"
        subtitle="We provide comprehensive real estate services to help you find, buy, rent, or manage properties with ease."
        features={whatWeDoData}
      />

      {/* Featured Properties Section */}
      <PropertiesSection
        title="Featured Properties"
        subtitle="Discover our handpicked selection of premium properties"
        properties={featuredProperties}
        onViewDetails={handleViewDetails}
        onFavorite={handleFavorite}
        onShare={handleShare}
        backgroundColor="transparent"
        showButton={false}
      />

      {/* Properties for Sale Section - Temporarily disabled */}
      {/* <PropertiesSection
        title="Properties for Sale"
        subtitle="Find your dream home from our exclusive collection"
        properties={[]}
        loading={false}
        buttonText="View All Sales"
        onButtonClick={handleViewAllSales}
        onViewDetails={handleViewDetails}
        onFavorite={handleFavorite}
        onShare={handleShare}
      /> */}

      {/* Properties for Rent Section - Temporarily disabled */}
      {/* <PropertiesSection
        title="Properties for Rent"
        subtitle="Discover rental properties that suit your lifestyle"
        properties={[]}
        loading={false}
        buttonText="View All Rentals"
        onButtonClick={handleViewAllRentals}
        onViewDetails={handleViewDetails}
        onFavorite={handleFavorite}
        onShare={handleShare}
        backgroundColor="transparent"
      /> */}

      {/* Newsletter Section */}
      <Newsletter />
    </MainWrapper>
  );
}
