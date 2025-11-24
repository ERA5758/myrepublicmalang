'use client';

import { APIProvider, Map } from '@vis.gl/react-google-maps';
import type { FC } from 'react';
import { Card } from './ui/card';

// This is a dummy polygon for demonstration purposes.
const malangCenter = { lat: -7.983908, lng: 112.620934 };
const polygonCoords = [
    { lat: -8.02, lng: 112.58 },
    { lat: -8.02, lng: 112.68 },
    { lat: -7.92, lng: 112.68 },
    { lat: -7.92, lng: 112.58 },
];

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

  // The Polygon component is not available in @vis.gl/react-google-maps.
  // This map is for demonstration purposes only.
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
          {/* A polygon would be rendered here, but the library doesn't support it directly. */}
        </Map>
      </div>
    </APIProvider>
  );
};