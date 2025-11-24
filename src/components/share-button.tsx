
'use client';

import { Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

export function ShareButton({ title, url, size = "sm" }: { title: string; url: string, size?: "sm" | "default" | "lg" | "icon" | null | undefined}) {
  const { toast } = useToast();

  const handleShare = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault(); // Prevent link navigation if the button is inside a link
    e.stopPropagation();

    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: `Cek artikel menarik ini dari MyRepublic Malang!`,
          url: url,
        });
      } catch (error) {
        // Ignore AbortError which occurs when the user cancels the share dialog
        if (error instanceof DOMException && error.name === 'AbortError') {
          return;
        }
        console.error('Error sharing:', error);
        toast({
          title: 'Gagal Membagikan',
          description: 'Gagal menggunakan fitur bagikan.',
          variant: 'destructive',
        });
      }
    } else {
        // Fallback for browsers that don't support the Web Share API
        try {
            await navigator.clipboard.writeText(url);
            toast({
                title: 'Tautan Disalin!',
                description: 'Tautan artikel telah disalin ke clipboard.',
            });
        } catch (err) {
            toast({
                title: 'Gagal Menyalin',
                description: 'Tidak dapat menyalin tautan ke clipboard.',
                variant: 'destructive',
            });
        }
    }
  };

  return (
    <Button variant="outline" size={size} onClick={handleShare}>
      <Share2 className="mr-2 h-4 w-4" />
      <span>Bagikan</span>
    </Button>
  );
}
