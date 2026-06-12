import type { Metadata } from 'next';
import '../globals.css';

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
    <div className="min-h-screen bg-[#080312] font-body antialiased">
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        {children}
    </div>
  );
}
