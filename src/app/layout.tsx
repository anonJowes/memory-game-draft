import type { Metadata } from 'next';
import './globals.scss';

export const metadata: Metadata = {
  title: 'Memory Game',
  description: 'A fun memory card-matching game',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
