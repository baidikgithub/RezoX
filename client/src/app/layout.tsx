import 'antd/dist/reset.css';
import 'leaflet/dist/leaflet.css';
import './globals.css';
import AppShell from '../components/AppShell';

export const metadata = {
  title: 'RezoX AI',
  description: 'Real Estate Management & Price Prediction'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
