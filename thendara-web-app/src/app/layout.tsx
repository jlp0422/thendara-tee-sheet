import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Thendara Golf',
  description: 'Tee sheet booking for Thendara Golf Club members',
  appleWebApp: { capable: true, title: 'Thendara', statusBarStyle: 'black-translucent' },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-surface">{children}</body>
    </html>
  );
}
