
'use client';

import { useState } from 'react';
import coverageData from '@/lib/coverage-area.json';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { MapPin } from 'lucide-react';

export default function CoverageAreasPage() {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Create a more structured data array
  const areas = Object.entries(coverageData).map(([name, rws]) => ({
    name,
    rws
  })).sort((a, b) => a.name.localeCompare(b.name));

  const filteredAreas = areas.filter(area =>
    area.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto max-w-5xl py-12 sm:py-16 px-4">
      <div className="text-center mb-12">
        <h1 className="font-headline text-4xl font-bold tracking-tight sm:text-5xl">Daftar Area Jangkauan</h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
          Temukan apakah area Anda termasuk dalam jangkauan jaringan fiber MyRepublic. Kami terus berkembang setiap hari!
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Area Layanan di Malang dan Sekitarnya</CardTitle>
          <CardDescription>Cari nama kelurahan Anda untuk melihat daftar RW yang ter-cover.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-8">
            <Input
              type="text"
              placeholder="Cari kelurahan Anda..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full max-w-md mx-auto"
            />
          </div>
          {filteredAreas.length > 0 ? (
            <div className="space-y-4">
              {filteredAreas.map((area) => (
                <div key={area.name} className="p-4 rounded-lg border bg-card text-card-foreground shadow-sm">
                  <h3 className="font-semibold flex items-center gap-2 text-primary">
                    <MapPin className="h-5 w-5" />
                    {area.name}
                  </h3>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {area.rws.map((rw) => (
                      <Badge key={rw} variant="secondary">RW {rw}</Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 text-muted-foreground bg-muted/50 rounded-lg">
                <p className="font-semibold">Area Tidak Ditemukan</p>
                <p className="text-sm mt-1">Silakan coba kata kunci lain atau hubungi kami untuk informasi lebih lanjut.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
