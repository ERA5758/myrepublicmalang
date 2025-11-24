'use client';

import { useState } from 'react';
import coverageData from '@/lib/coverage-area.json';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

export default function CoverageAreasPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const areas = Object.keys(coverageData).sort();

  const filteredAreas = areas.filter(area =>
    area.toLowerCase().includes(searchTerm.toLowerCase())
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
          <CardDescription>Cari nama kelurahan atau area Anda untuk memeriksa ketersediaan layanan.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <Input
              type="text"
              placeholder="Cari area Anda..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
          {filteredAreas.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredAreas.map((area) => (
                <div key={area} className="bg-muted/50 p-3 rounded-md">
                  <p className="font-medium text-sm text-foreground">{area}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Area tidak ditemukan. Silakan coba kata kunci lain.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
