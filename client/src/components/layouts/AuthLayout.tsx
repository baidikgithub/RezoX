'use client';

import React from 'react';
import { Layout } from 'antd';
import Navbar from '../Navbar';
import Footer from '../Footer';

const { Content } = Layout;

interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Navbar />
      <Content style={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '80px 0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        {children}
      </Content>
      <Footer />
    </Layout>
  );
};

export default AuthLayout;
