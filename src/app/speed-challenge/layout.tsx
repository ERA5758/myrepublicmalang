import type { Metadata } from 'next';
import '../globals.css';
import { Toaster } from '@/components/ui/toaster';
import { FirebaseProvider } from '@/firebase/provider';

export const metadata: Metadata = {
  title: 'MyRepublic Speed Challenge',
  description: 'Uji seberapa parah kecepatan internetmu sekarang dan dapatkan solusinya!',
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
    <div className="min-h-screen bg-[#1a1a2e] font-body antialiased">
      <FirebaseProvider>
          <main>{children}</main>
          <Toaster />
      </FirebaseProvider>
    </div>
  );
}
