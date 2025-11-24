'use client';

import { APIProvider, Map, Polygon } from '@vis.gl/react-google-maps';
import type { FC } from 'react';
import coverageData from '@/lib/coverage-area.json';
import { Card } from './ui/card';

const malangCenter = { lat: -7.983908, lng: 112.620934 };

const polygonOptions = {
  fillColor: 'hsl(197, 71%, 53%)',
  fillOpacity: 0.3,
  strokeColor: 'hsl(197, 71%, 53%)',
  strokeWeight: 2,
};

const coordinates = coverageData.features[0].geometry.coordinates[0].map(
  (coord) => ({ lat: coord[1], lng: coord[0] })
);

export const CoverageMap: FC = () => {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    return (
      <Card className="flex h-[400px] w-full items-center justify-center bg-muted/50 p-4 text-center">
        <div className="space-y-2">
          <h3 className="font-headline text-lg font-semibold">Peta Tidak Tersedia</h3>
          <p className="text-muted-foreground">
            Kunci API Google Maps tidak ditemukan. Harap tambahkan ke variabel lingkungan Anda untuk menampilkan peta jangkauan.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <APIProvider apiKey={apiKey}>
      <div className="h-[400px] w-full overflow-hidden rounded-lg border">
        <Map
          defaultCenter={malangCenter}
          defaultZoom={12}
          mapId="myrepublic_map"
          disableDefaultUI={true}
          gestureHandling={'greedy'}
        >
          <Polygon paths={coordinates} {...polygonOptions} />
        </Map>
      </div>
    </APIProvider>
  );
};
