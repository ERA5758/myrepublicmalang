import Link from 'next/link';
import { Phone, Wifi } from 'lucide-react';

export function Footer() {
  return (
    <footer className="w-full border-t border-border/40 bg-background">
      <div className="container mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 py-10 md:flex-row md:py-6">
        <div className="flex flex-col items-center gap-4 px-8 text-center md:flex-row md:gap-2 md:px-0 md:text-left">
          <Wifi className="h-6 w-6 text-primary" />
          <p className="text-sm leading-loose text-muted-foreground">
            © {new Date().getFullYear()} MyRepublic Malang. Hak cipta dilindungi undang-undang.
          </p>
        </div>
        <div className="flex flex-col items-center gap-2 text-sm text-muted-foreground md:items-end">
          <p className="font-semibold text-foreground">Hubungi Kami:</p>
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4" />
            <span>Mira Velicia: 0851 84000 880</span>
          </div>
        </div>
      </div>
    </footer>
  );
}