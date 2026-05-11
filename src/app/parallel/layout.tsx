
import type { Metadata } from 'next';
import '../globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster';
import { FirebaseProvider } from '@/firebase/provider';
import Image from 'next/image';
import { FloatingWhatsApp } from '@/components/floating-whatsapp';
import Link from 'next/link';

const siteUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: 'Parallel Hemat - Internet Cepat Harga Tetangga | MyRepublic',
  description: 'Solusi internet fiber super cepat dengan harga paling terjangkau melalui sistem kolektif. Cocok untuk penghuni kost dan area perumahan.',
  robots: {
    index: true,
    follow: true,
  }
};

function ParallelHeader() {
    return (
        <header className="fixed top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
            <div className="container mx-auto flex h-16 items-center justify-between px-4">
                <Link href="/">
                    <Image 
                        src="https://i.ibb.co/7MP29XK/Picsart-25-11-28-12-55-53-228.png"
                        alt="MyRepublic Logo"
                        width={140}
                        height={38}
                        className="object-contain"
                    />
                </Link>
                <div className="flex items-center gap-4">
                    <span className="hidden text-sm font-medium md:inline-block text-orange-600">Exclusive Sales Program</span>
                    <Link href="https://wa.me/6285184000800" target="_blank" className="rounded-full bg-orange-600 px-5 py-2 text-sm font-bold text-white transition-all hover:bg-orange-700 shadow-lg shadow-orange-600/20">
                        Cek Area Sekarang
                    </Link>
                </div>
            </div>
        </header>
    )
}

function ParallelFooter() {
    return (
        <footer className="bg-slate-950 py-12 text-white">
            <div className="container mx-auto px-4 text-center">
                <Image 
                    src="https://i.ibb.co/7MP29XK/Picsart-25-11-28-12-55-53-228.png"
                    alt="MyRepublic Logo"
                    width={120}
                    height={32}
                    className="mx-auto mb-6 brightness-0 invert"
                />
                <p className="mx-auto max-w-md text-sm text-slate-400">
                    Program Parallel Hemat dikelola secara eksklusif oleh Sales Executive untuk memberikan solusi internet terbaik dengan harga kolektif yang lebih ringan.
                </p>
                <div className="my-8 h-px w-full bg-slate-800" />
                <p className="text-xs text-slate-500">
                    © {new Date().getFullYear()} MyRepublic Parallel Program. All area coverage check via Sales Executive.
                </p>
            </div>
        </footer>
    )
}

export default function ParallelLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen flex-col font-body antialiased selection:bg-orange-100 selection:text-orange-900">
      <FirebaseProvider>
          <ParallelHeader />
          <main className="flex-grow pt-16">{children}</main>
          <ParallelFooter />
          <FloatingWhatsApp />
          <Toaster />
      </FirebaseProvider>
    </div>
  );
}
