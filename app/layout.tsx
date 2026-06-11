import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'GenAI Pulse Survey',
  description: 'GenAI for SDLC — Monthly Pulse Survey',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th">
      <body>{children}</body>
    </html>
  );
}
