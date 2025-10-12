'use client';

import React from 'react';
import { Layout } from 'antd';
import Navbar from '../Navbar';
import Footer from '../Footer';
import { useTheme } from '../../contexts/ThemeContext';

const { Content } = Layout;

interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  const { isDarkMode } = useTheme();

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Navbar />
      <Content style={{ 
        background: isDarkMode 
          ? 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)'
          : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 'calc(100vh - 64px)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Background decorative elements */}
        <div style={{
          position: 'absolute',
          top: '-50%',
          right: '-20%',
          width: '600px',
          height: '600px',
          background: isDarkMode 
            ? 'radial-gradient(circle, rgba(24, 144, 255, 0.1) 0%, transparent 70%)'
            : 'radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%)',
          borderRadius: '50%',
          animation: 'float 6s ease-in-out infinite'
        }} />
        <div style={{
          position: 'absolute',
          bottom: '-30%',
          left: '-15%',
          width: '400px',
          height: '400px',
          background: isDarkMode 
            ? 'radial-gradient(circle, rgba(64, 169, 255, 0.08) 0%, transparent 70%)'
            : 'radial-gradient(circle, rgba(255, 255, 255, 0.08) 0%, transparent 70%)',
          borderRadius: '50%',
          animation: 'float 8s ease-in-out infinite reverse'
        }} />
        
        {children}
      </Content>
      <Footer />
      
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
      `}</style>
    </Layout>
  );
};

export default AuthLayout;
