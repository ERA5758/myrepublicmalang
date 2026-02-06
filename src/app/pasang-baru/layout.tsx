import type { Metadata } from 'next';
import '../globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster';
import { FirebaseProvider } from '@/firebase/provider';
import Image from 'next/image';
import { FloatingWhatsApp } from '@/components/floating-whatsapp';

const siteUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: 'Promo Spesial MyRepublic - Gratis Instalasi!',
  description: 'Daftar internet MyRepublic sekarang dan dapatkan gratis biaya instalasi senilai Rp500.000. Internet cepat, unlimited, dan stabil untuk Anda.',
  robots: {
    index: false, // Disarankan untuk tidak mengindeks halaman landing page iklan
    follow: false,
  }
};

function LandingPageHeader() {
    return (
        <header className="py-4 border-b">
            <div className="container mx-auto flex justify-between items-center">
                 <Image 
                    src="https://i.ibb.co/7MP29XK/Picsart-25-11-28-12-55-53-228.png"
                    alt="MyRepublic Logo"
                    width={150}
                    height={40}
                    className="object-contain"
                />
                <div className="text-right">
                    <p className="font-semibold text-foreground">Mira Velicia</p>
                    <p className="text-sm text-muted-foreground">Sales Executive</p>
                </div>
            </div>
        </header>
    )
}

function LandingPageFooter() {
    return (
        <footer className="bg-muted py-4 mt-8">
            <div className="container mx-auto text-center text-muted-foreground text-sm">
                <p>© {new Date().getFullYear()} MyRepublic - Penawaran Khusus Pemasaran Online.</p>
            </div>
        </footer>
    )
}

export default function PasangBaruLayout({
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
        {/* Google tag (gtag.js) */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=AW-17765192016"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'AW-17765192016');
            `,
          }}
        />
        {/* TikTok Pixel Code Start */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
            !function (w, d, t) {
              w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie","holdConsent","revokeConsent","grantConsent"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(
            var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var r="https://analytics.tiktok.com/i18n/pixel/events.js",o=n&&n.partner;ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=r,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};n=document.createElement("script")
            ;n.type="text/javascript",n.async=!0,n.src=r+"?sdkid="+e+"&lib="+t;e=document.getElementsByTagName("script")[0];e.parentNode.insertBefore(n,e)};

              ttq.load('D62KEO3C77U8OPSUC1CG');
              ttq.page();
            }(window, document, 'ttq');
            `,
          }}
        />
        {/* TikTok Pixel Code End */}
      </head>
      <body
        className={cn(
          'min-h-screen bg-background font-body antialiased'
        )}
      >
        <FirebaseProvider>
            <LandingPageHeader />
            <main>{children}</main>
            <LandingPageFooter />
            <FloatingWhatsApp />
            <Toaster />
        </FirebaseProvider>
      </body>
    </html>
  );
}
