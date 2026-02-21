'use client';

import Link from 'next/link';
import Image from 'next/image';

export function FloatingWhatsApp() {
  const phoneNumber = "6285184000800";
  const message = "Halo, saya tertarik untuk berlangganan MyRepublic. Bisa minta informasinya?";
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
  const profileImageUrl = "https://lh3.googleusercontent.com/d/1RBUDc24cfVAivO-fXO2-Q64Xt3aRv9k1";

  return (
    <Link 
      href={whatsappUrl} 
      target="_blank" 
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex h-16 w-16 items-center justify-center rounded-full bg-green-500 text-white shadow-lg transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 overflow-hidden animate-pulse-whatsapp"
      aria-label="Hubungi via WhatsApp"
    >
        <Image 
            src={profileImageUrl}
            alt="Hubungi Sales"
            width={64}
            height={64}
            className="object-contain"
        />
    </Link>
  );
}
