import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AntdRegistry } from '@ant-design/nextjs-registry';
import { ThemeProvider } from '../contexts/ThemeContext';
import { AuthProvider } from '../contexts/AuthContext';

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "RezoX - Real Estate Platform",
  description: "Find your dream home with RezoX - the leading real estate platform for buying, renting, and managing properties.",
  keywords: "real estate, property, buy, rent, home, apartment, house",
  authors: [{ name: "RezoX Team" }],
  viewport: "width=device-width, initial-scale=1",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.variable}>
        <ThemeProvider>
          <AuthProvider>
            <AntdRegistry>
              {children}
            </AntdRegistry>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
