'use client';

import React from 'react';
import { Layout } from 'antd';
import Navbar from '../Navbar';
import Footer from '../Footer';

const { Content } = Layout;

interface MainWrapperProps {
  children: React.ReactNode;
}

const MainWrapper: React.FC<MainWrapperProps> = ({ children }) => {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Navbar />
      <Content>
        {children}
      </Content>
      <Footer />
    </Layout>
  );
};

export default MainWrapper;
