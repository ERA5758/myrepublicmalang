import Link from 'next/link';
import { Facebook, Instagram, Phone, Rocket, Twitter } from 'lucide-react';
import Image from 'next/image';

export function Footer() {
  return (
    <footer className="w-full border-t border-border/40 bg-background text-foreground">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 py-12 md:grid-cols-12">
          
          <div className="md:col-span-4 lg:col-span-5">
             <Link href="/" className="flex items-center space-x-2">
                <Image 
                  src="https://iconlogovector.com/uploads/images/2025/04/lg-67fd7fa2b8b25-MyRepublic.webp"
                  alt="MyRepublic Malang Logo"
                  width={180}
                  height={48}
                  className="object-contain"
                />
            </Link>
            <p className="mt-4 text-muted-foreground text-sm">
                Menyediakan koneksi internet fiber ultra-cepat, 100% unlimited, dan andal untuk wilayah Malang dan sekitarnya.
            </p>
          </div>

          <div className="md:col-span-8 lg:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-semibold tracking-wider uppercase">Tautan Cepat</h3>
              <ul className="mt-4 space-y-2 text-sm">
                <li><Link href="/register" className="text-muted-foreground hover:text-primary">Daftar</Link></li>
                <li><Link href="/coverage-areas" className="text-muted-foreground hover:text-primary">Area Jangkauan</Link></li>
                <li><Link href="/blog" className="text-muted-foreground hover:text-primary">Blog</Link></li>
                 <li><Link href="/payment-methods" className="text-muted-foreground hover:text-primary">Cara Bayar</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold tracking-wider uppercase">Hubungi Kami</h3>
              <ul className="mt-4 space-y-2 text-sm">
                <li className="flex items-start">
                    <Phone className="h-4 w-4 mr-2 mt-1 shrink-0"/>
                    <span className="text-muted-foreground">Mira Velicia: 0851 84000 880</span>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold tracking-wider uppercase">Ikuti Kami</h3>
              <div className="mt-4 flex space-x-4">
                <Link href="#" className="text-muted-foreground hover:text-primary"><span className="sr-only">Facebook</span><Facebook className="h-6 w-6" /></Link>
                <Link href="https://www.instagram.com/myrepublickotamalang/" className="text-muted-foreground hover:text-primary"><span className="sr-only">Instagram</span><Instagram className="h-6 w-6" /></Link>
                <Link href="#" className="text-muted-foreground hover:text-primary"><span className="sr-only">Twitter</span><Twitter className="h-6 w-6" /></Link>
              </div>
            </div>
          </div>

        </div>
        
        <div className="border-t border-border/40 py-6">
          <p className="text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} MyRepublic Malang. Hak cipta dilindungi undang-undang.
          </p>
        </div>
      </div>
    </footer>
  );
}
