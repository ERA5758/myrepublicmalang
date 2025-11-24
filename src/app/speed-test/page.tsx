
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function SpeedTestPage() {
  return (
    <div className="container mx-auto max-w-5xl py-12 sm:py-16">
      <div className="text-center mb-12">
        <h1 className="font-headline text-4xl font-bold tracking-tight sm:text-5xl">Tes Kecepatan Internet</h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
          Gunakan alat di bawah ini untuk mengukur kecepatan unduh dan unggah koneksi internet Anda saat ini.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Speed Test</CardTitle>
          <CardDescription>
            Klik tombol &quot;Start&quot; untuk memulai. Tes ini didukung oleh Cloudflare.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative w-full h-[650px] overflow-hidden rounded-lg border">
            <iframe
              width="100%"
              height="100%"
              frameBorder="0"
              src="https://speed.cloudflare.com/"
              className="absolute top-0 left-0"
            ></iframe>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
