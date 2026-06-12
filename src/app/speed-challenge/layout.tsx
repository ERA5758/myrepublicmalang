import type { Metadata } from 'next';
import '../globals.css';
import { Toaster } from '@/components/ui/toaster';
import { FirebaseProvider } from '@/firebase/provider';

export const metadata: Metadata = {
  title: 'MyRepublic Speed Challenge & AI Diagnostic',
  description: 'Uji seberapa parah kecepatan internetmu sekarang dan dapatkan diagnosa cerdas dari AI!',
  robots: {
    index: false,
    follow: false,
  }
};

export default function SpeedChallengeLayout({
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
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-[#080312] font-body antialiased">
        <FirebaseProvider>
            <main>{children}</main>
            <Toaster />
        </FirebaseProvider>
      </body>
    </html>
  );
}
