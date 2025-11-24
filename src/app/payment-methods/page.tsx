import { Banknote, Smartphone, Store } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const paymentMethods = {
  virtualAccount: {
    title: 'Virtual Account',
    icon: <Banknote className="h-6 w-6 text-primary" />,
    methods: ['BCA Virtual Account', 'Mandiri Virtual Account', 'BNI Virtual Account', 'Permata Virtual Account', 'Bank Lainnya'],
  },
  eWallet: {
    title: 'E-Wallet',
    icon: <Smartphone className="h-6 w-6 text-primary" />,
    methods: ['GoPay', 'OVO', 'DANA', 'LinkAja'],
  },
  retail: {
    title: 'Gerai Ritel',
    icon: <Store className="h-6 w-6 text-primary" />,
    methods: ['Indomaret', 'Alfamart'],
  },
};

export default function PaymentMethodsPage() {
  return (
    <div className="container mx-auto max-w-5xl py-12 sm:py-16">
      <div className="text-center mb-12">
        <h1 className="font-headline text-4xl font-bold tracking-tight sm:text-5xl">Metode Pembayaran</h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
          Kami menyediakan berbagai cara mudah dan aman untuk membayar tagihan MyRepublic Anda.
        </p>
      </div>

      <div className="space-y-12">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-4">
              {paymentMethods.virtualAccount.icon}
              <CardTitle className="font-headline text-2xl">{paymentMethods.virtualAccount.title}</CardTitle>
            </div>
            <CardDescription>Transfer dengan mudah melalui bank pilihan Anda menggunakan nomor Virtual Account.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {paymentMethods.virtualAccount.methods.map((method) => (
                <div key={method} className="bg-muted/50 p-4 rounded-lg text-center">
                  <p className="font-medium text-sm">{method}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-4">
              {paymentMethods.eWallet.icon}
              <CardTitle className="font-headline text-2xl">{paymentMethods.eWallet.title}</CardTitle>
            </div>
            <CardDescription>Bayar tagihan secara instan menggunakan dompet digital favorit Anda.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {paymentMethods.eWallet.methods.map((method) => (
                <div key={method} className="bg-muted/50 p-4 rounded-lg text-center">
                  <p className="font-medium text-sm">{method}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-4">
              {paymentMethods.retail.icon}
              <CardTitle className="font-headline text-2xl">{paymentMethods.retail.title}</CardTitle>
            </div>
            <CardDescription>Bayar tagihan secara tunai di gerai ritel terdekat di kota Anda.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {paymentMethods.retail.methods.map((method) => (
                <div key={method} className="bg-muted/50 p-4 rounded-lg text-center">
                  <p className="font-medium text-sm">{method}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

    