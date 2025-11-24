'use client';

import { usePwaInstall } from '@/hooks/use-pwa-install';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

export function PwaInstallButton() {
  const { canInstall, install } = usePwaInstall();

  if (!canInstall) {
    return null;
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={install}
      aria-label="Install App"
    >
      <Download className="mr-2 h-4 w-4" />
      Install
    </Button>
  );
}
