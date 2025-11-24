'use client';

import { useState, useEffect, useCallback } from 'react';

// This is the event type for the beforeinstallprompt event.
// It's not included in the standard DOM types yet.
interface BeforeInstallPromptEvent extends Event {
  readonly platforms: Array<string>;
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export function usePwaInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [canInstall, setCanInstall] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      // Stash the event so it can be triggered later.
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      // Update UI to notify the user they can install the PWA
      setCanInstall(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    const handleAppInstalled = () => {
      // Hide the app-provided install promotion
      setCanInstall(false);
      // Clear the deferredPrompt so it can be garbage collected
      setDeferredPrompt(null);
    };

    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const install = useCallback(async () => {
    if (!deferredPrompt) {
      return;
    }
    // Show the install prompt.
    await deferredPrompt.prompt();
    // Wait for the user to respond to the prompt.
    const { outcome } = await deferredPrompt.userChoice;
    // We've used the prompt, and can't use it again, but we can listen for the appinstalled event.
    setDeferredPrompt(null);
    // Optionally, send analytics about the install prompt outcome.
    console.log(`User response to the install prompt: ${outcome}`);
  }, [deferredPrompt]);

  return { canInstall, install };
}
