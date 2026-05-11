import type { Metadata } from 'next';
import '../globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster';
import { FirebaseProvider } from '@/firebase/provider';
import Image from 'next/image';
import { FloatingWhatsApp } from '@/components/floating-whatsapp';
import Link from 'next/link';
import { Home } from 'lucide-react';

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
                <Link href="/parallel" className="flex items-center gap-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-600 text-white shadow-lg shadow-orange-600/20">
                        <Home className="h-6 w-6" />
                    </div>
                    <div className="flex flex-col leading-none">
                        <span className="text-xl font-black tracking-tighter text-slate-900">PARALLEL</span>
                        <span className="text-xs font-bold tracking-[0.2em] text-orange-600">HOME</span>
                    </div>
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
                <div className="mb-6 flex items-center justify-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-600 text-white">
                        <Home className="h-5 w-5" />
                    </div>
                    <div className="flex flex-col items-start leading-none">
                        <span className="text-lg font-black tracking-tighter text-white">PARALLEL</span>
                        <span className="text-[10px] font-bold tracking-[0.2em] text-orange-400">HOME</span>
                    </div>
                </div>
                <p className="mx-auto max-w-md text-sm text-slate-400">
                    Program Parallel Hemat dikelola secara eksklusif oleh Sales Executive untuk memberikan solusi internet terbaik dengan harga kolektif yang lebih ringan.
                </p>
                <div className="my-8 h-px w-full bg-slate-800" />
                <p className="text-xs text-slate-500">
                    © {new Date().getFullYear()} Parallel Home Program. All area coverage check via Sales Executive.
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
