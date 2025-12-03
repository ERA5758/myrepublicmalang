import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Phone, Instagram, Facebook, Twitter } from 'lucide-react';
import Link from 'next/link';

const contactMethods = [
    {
        icon: <Phone className="h-8 w-8 text-primary" />,
        title: 'Telepon / WhatsApp',
        value: '0851 84000 800',
        name: 'Mira Velicia',
        actionText: 'Hubungi Sekarang',
        href: 'https://wa.me/6285184000800'
    },
    {
        icon: <Instagram className="h-8 w-8 text-primary" />,
        title: 'Instagram',
        value: '@myrepublickotamalang',
        actionText: 'Kunjungi Profil',
        href: 'https://www.instagram.com/myrepublickotamalang/'
    },
    {
        icon: <Facebook className="h-8 w-8 text-primary" />,
        title: 'Facebook',
        value: 'MyRepublic Malang',
        actionText: 'Kunjungi Halaman',
        href: '#'
    },
    {
        icon: <Twitter className="h-8 w-8 text-primary" />,
        title: 'Twitter',
        value: '@myrepublicmlg',
        actionText: 'Kunjungi Profil',
        href: '#'
    }
]

export default function ContactPage() {
  return (
    <div className="container mx-auto max-w-4xl py-12 sm:py-16">
      <div className="text-center mb-12">
        <h1 className="font-headline text-4xl font-bold tracking-tight sm:text-5xl">Hubungi Kami</h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
          Punya pertanyaan atau butuh bantuan? Tim kami siap melayani Anda.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {contactMethods.map((method) => (
            <Card key={method.title}>
                <CardHeader className="text-center">
                     <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-4">
                        {method.icon}
                     </div>
                    <CardTitle>{method.title}</CardTitle>
                    <CardDescription>
                        {method.value}
                        {method.name && <span className="block text-xs">({method.name})</span>}
                    </CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                    <Button asChild>
                        <Link href={method.href} target="_blank" rel="noopener noreferrer">
                            {method.actionText}
                        </Link>
                    </Button>
                </CardContent>
            </Card>
        ))}
      </div>
    </div>
  );
}
