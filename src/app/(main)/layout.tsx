'use client';

import { Header } from '@/components/layout/header';
import { FloatingWhatsApp } from '@/components/floating-whatsapp';
import { Footer } from '@/components/layout/footer';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-dvh flex-col bg-background">
      <Header />
      <main className="flex-1">{children}</main>
      <FloatingWhatsApp />
      <Footer />
    </div>
  );
}
