import { CoverageMap } from '@/components/coverage-map';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function CoverageCheckPage() {
  return (
    <div className="container mx-auto max-w-5xl py-12 sm:py-16">
      <div className="text-center mb-12">
        <h1 className="font-headline text-4xl font-bold tracking-tight sm:text-5xl">Cek Jangkauan Kami</h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
          Gunakan peta interaktif untuk melihat jangkauan jaringan fiber kami di seluruh Malang. Kami berkembang setiap hari!
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Area Layanan Malang</CardTitle>
          <CardDescription>Area yang disorot menunjukkan di mana internet fiber MyRepublic saat ini tersedia. Anda dapat memasukkan alamat Anda di bawah untuk memeriksa, meskipun ini untuk tujuan demonstrasi.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="address">Masukkan alamat Anda untuk memeriksa</Label>
            <Input id="address" name="address" placeholder="cth. Jl. Soekarno Hatta, Malang" />
          </div>
          <CoverageMap />
        </CardContent>
      </Card>
    </div>
  );
}
