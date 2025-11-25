
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';

export default function PaymentMethodsPage() {
  const paymentImageUrl = 'https://www.myrepublic.co.id/_next/image?url=%2Fimg%2Fgothel%2Fuploads%2FPayment_Channel_My_Republic_Web_Banner_c846871a7f.webp&w=1080&q=75';

  return (
    <div className="container mx-auto max-w-5xl py-12 sm:py-16">
      <div className="text-center mb-12">
        <h1 className="font-headline text-4xl font-bold tracking-tight sm:text-5xl">Metode Pembayaran</h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
          Kami menyediakan berbagai cara mudah dan aman untuk membayar tagihan MyRepublic Anda.
        </p>
      </div>

      <Card>
        <CardContent className="p-0">
            <div className="relative w-full aspect-[2/1] overflow-hidden rounded-lg">
                <Image
                    src={paymentImageUrl}
                    alt="Metode Pembayaran MyRepublic"
                    layout="fill"
                    objectFit="contain"
                />
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
