'use client';

import React from 'react';
import MainWrapper from '../../components/layouts/MainWrapper';
import AboutHeroSection from '../../components/sections/AboutHeroSection';
import FeaturesSection from '../../components/sections/FeaturesSection';
import StorySection from '../../components/sections/StorySection';
import { aboutFeatures } from '../../data/features';

const AboutPage: React.FC = () => {
  return (
    <MainWrapper>
      {/* Hero Section */}
      <AboutHeroSection />

      {/* Features Section */}
      <FeaturesSection 
        title="Why Choose RezoX?"
        subtitle="We combine cutting-edge technology with personalized service to deliver exceptional real estate experiences."
        features={aboutFeatures}
        backgroundColor="transparent"
      />

      {/* Story Section */}
      <StorySection />
    </MainWrapper>
  );
};

export default AboutPage;
