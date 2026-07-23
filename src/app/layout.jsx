import './globals.css';
import AppWrapper from '@/components/layout/AppWrapper';

export const metadata = {
  title: 'SOLECRFT — Reimagined Footwear Studio',
  description: 'Design, customize, and purchase high-end footwear using our real-time 3D configurator. Powered by Next.js & Three.js.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased">
        <AppWrapper>
          {children}
        </AppWrapper>
      </body>
    </html>
  );
}
