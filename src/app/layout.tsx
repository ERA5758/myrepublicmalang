import type { Metadata } from 'next';
import './globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster';
import { FirebaseProvider } from '@/firebase/provider';

const siteUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'MyRepublic Malang - Internet Cepat, Unlimited, dan Terjangkau',
    template: '%s | MyRepublic Malang',
  },
  description: 'Daftar dan pasang internet fiber MyRepublic di Malang. Nikmati koneksi super cepat, unlimited tanpa FUP, dan tahan cuaca. Gratis instalasi dan harga flat!',
  keywords: ['internet malang', 'myrepublic malang', 'wifi malang', 'provider internet malang', 'internet cepat malang', 'internet unlimited malang'],
  manifest: '/manifest.json',
  openGraph: {
    title: 'MyRepublic Malang - Internet Fiber Cepat & Unlimited',
    description: 'Bergabunglah dengan jaringan internet fiber tercepat di Malang. Kecepatan simetris, unlimited, dan andal. Cek jangkauan dan daftar sekarang!',
    url: siteUrl,
    siteName: 'MyRepublic Malang',
    images: [
      {
        url: '/og-image.png', // Harap sediakan gambar ini di folder /public
        width: 1200,
        height: 630,
        alt: 'MyRepublic Internet Cepat Malang',
      },
    ],
    locale: 'id_ID',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MyRepublic Malang - Internet Fiber Terbaik',
    description: 'Cari internet cepat dan stabil di Malang? Cek penawaran dari MyRepublic. Unlimited, simetris, dan harga terjangkau.',
    images: ['/og-image.png'], // Harap sediakan gambar ini di folder /public
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=PT+Sans:ital,wght@0,400;0,700;1,400;1,700&display=swap"
          rel="stylesheet"
        />
        <meta name="theme-color" content="#8B5CF6" />
        <link rel="apple-touch-icon" href="/icons/myrep.png" />
      </head>
      <body
        className={cn(
          'min-h-screen bg-background font-body antialiased'
        )}
      >
        <FirebaseProvider>
          {children}
          <Toaster />
        </FirebaseProvider>
      </body>
    </html>
  );
}
