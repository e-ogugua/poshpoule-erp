import './globals.css';
import { Inter } from 'next/font/google';
import { Metadata } from 'next';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'PoshPOULE Farms Ltd - Pure Goodness, Eat Fresh, Eat Healthy',
  description: 'Premium organic poultry, fresh eggs, vegetables, and farm-fresh produce. Experience the taste of pure, healthy goodness from our sustainable farm.',
  keywords: 'organic farm, poultry, fresh eggs, vegetables, sustainable farming, healthy food',
  authors: [{ name: 'PoshPOULE Farms Ltd' }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
      </head>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}
