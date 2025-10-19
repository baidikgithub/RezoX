'use client';

import React, { ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { Spin, Typography } from 'antd';
import { useAuth } from '../hooks/useAuth';

const { Text } = Typography;

interface ProtectedRouteProps {
  children: ReactNode;
  fallback?: ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  fallback = (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column',
      alignItems: 'center', 
      justifyContent: 'center', 
      minHeight: '100vh',
      gap: '16px'
    }}>
      <Spin size="large" />
      <Text>Loading...</Text>
    </div>
  )
}) => {
  const { user, loading } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return <>{fallback}</>;
  }

  if (!user) {
    return null; // Will redirect to login
  }

  return <>{children}</>;
};

export default ProtectedRoute;

