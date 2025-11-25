import 'antd/dist/reset.css';
import 'leaflet/dist/leaflet.css';
import './globals.css';
import Link from 'next/link';
import FloatingChat from '../components/FloatingChat';

export const metadata = {
  title: 'RezoX AI',
  description: 'Real Estate Management & Price Prediction'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'linear-gradient(to bottom, #f5f7fa 0%, #ffffff 100%)' }}>
          <header style={{ 
            padding: '16px 24px', 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
            color: '#fff', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
          }}>
            <Link href="/" style={{ color: 'inherit', textDecoration: 'none' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ 
                  width: 40, 
                  height: 40, 
                  borderRadius: 8, 
                  background: 'rgba(255,255,255,0.2)', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  fontSize: 20,
                  fontWeight: 'bold'
                }}>
                  R
                </div>
                <span style={{ fontSize: 20, fontWeight: 700, letterSpacing: '0.5px' }}>RezoX AI</span>
              </div>
            </Link>

            <nav style={{ display: 'flex', gap: 8 }}>
              <Link href="/" style={{ 
                color: '#fff', 
                padding: '8px 16px', 
                borderRadius: 8,
                transition: 'all 0.3s',
                textDecoration: 'none'
              }} className="nav-link">Home</Link>
              <Link href="/listings" style={{ 
                color: '#fff', 
                padding: '8px 16px', 
                borderRadius: 8,
                transition: 'all 0.3s',
                textDecoration: 'none'
              }} className="nav-link">Listings</Link>
              <Link href="/predict" style={{ 
                color: '#fff', 
                padding: '8px 16px', 
                borderRadius: 8,
                transition: 'all 0.3s',
                textDecoration: 'none'
              }} className="nav-link">Predict</Link>
              <Link href="/admin" style={{ 
                color: '#fff', 
                padding: '8px 16px', 
                borderRadius: 8,
                transition: 'all 0.3s',
                textDecoration: 'none'
              }} className="nav-link">Admin</Link>
            </nav>
          </header>

          <main style={{ flex: 1, padding: '32px 16px' }}>
            <div style={{ maxWidth: 1400, margin: '0 auto', width: '100%' }}>{children}</div>
          </main>

          <footer style={{ 
            textAlign: 'center', 
            padding: '24px 16px', 
            background: '#fff',
            borderTop: '1px solid #f0f0f0',
            marginTop: 'auto'
          }}>
            <div style={{ color: '#666', fontSize: 14 }}>
              RezoX ©{new Date().getFullYear()} — Built with AI & Machine Learning
            </div>
          </footer>
          
          <FloatingChat />
        </div>
      </body>
    </html>
  );
}
