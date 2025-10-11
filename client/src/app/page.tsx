'use client';

import React from 'react';
import MainWrapper from '../components/layouts/MainWrapper';
import HeroSection from '../components/sections/HeroSection';
import FeaturesSection from '../components/sections/FeaturesSection';
import PropertiesSection from '../components/sections/PropertiesSection';
import Newsletter from '../components/Newsletter';
import { whatWeDoData } from '../data/features';
import { featuredProperties, saleProperties, rentProperties } from '../data/properties';
import { Property } from '../utils/types';

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

  const handleViewAllSales = () => {
    console.log('Navigate to all sales');
  };

  const handleViewAllRentals = () => {
    console.log('Navigate to all rentals');
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

      {/* Properties for Sale Section */}
      <PropertiesSection
        title="Properties for Sale"
        subtitle="Find your dream home from our exclusive collection"
        properties={saleProperties}
        buttonText="View All Sales"
        onButtonClick={handleViewAllSales}
        onViewDetails={handleViewDetails}
        onFavorite={handleFavorite}
        onShare={handleShare}
      />

      {/* Properties for Rent Section */}
      <PropertiesSection
        title="Properties for Rent"
        subtitle="Discover rental properties that suit your lifestyle"
        properties={rentProperties}
        buttonText="View All Rentals"
        onButtonClick={handleViewAllRentals}
        onViewDetails={handleViewDetails}
        onFavorite={handleFavorite}
        onShare={handleShare}
        backgroundColor="transparent"
      />

      {/* Newsletter Section */}
      <Newsletter />
    </MainWrapper>
  );
}
