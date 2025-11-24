'use client';

import Link from 'next/link';
import Image from 'next/image';

export function FloatingWhatsApp() {
  const phoneNumber = "6285184000880";
  const message = "Halo, saya tertarik untuk berlangganan MyRepublic. Bisa minta informasinya?";
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
  const profileImageUrl = "https://instagram.fmlg9-1.fna.fbcdn.net/v/t51.2885-19/191792427_915546175966090_4882543682695670340_n.jpg?stp=dst-jpg_s150x150_tt6&efg=eyJ2ZW5jb2RlX3RhZyI6InByb2ZpbGVfcGljLmRqYW5nby4xMDgwLmMyIn0&_nc_ht=instagram.fmlg9-1.fna.fbcdn.net&_nc_cat=110&_nc_oc=Q6cZ2QEOX4mVXJQYybe59nKAZnd8vWLzKECTCKWanPdEG-1nrU9u5mwamVlF4R0-PdakXzddoKMS7-PdYhPmIunXoFOG&_nc_ohc=pRNPP7uTmIAQ7kNvwGS5jZK&_nc_gid=AXUZAbpWQPitq_9Ez5juBQ&edm=AOQ1c0wBAAAA&ccb=7-5&oh=00_AfhTyqGiysh1Pa6_S6zZhR8eKmQKjtcAJX8RNLLBQ73Rsg&oe=6929C825&_nc_sid=8b3546";

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
            className="object-cover"
        />
    </Link>
  );
}
