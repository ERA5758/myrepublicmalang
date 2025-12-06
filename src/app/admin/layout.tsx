'use client';

import { useRouter } from 'next/navigation';
import { useUser } from '@/firebase';
import { Loader } from 'lucide-react';
import React, { useEffect } from 'react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    // Redirect if loading is finished and there's no user
    if (!isLoading && !user) {
      router.replace('/login');
    }
  }, [isLoading, user, router]);

  // Show a loader only on the initial load when user status is undetermined.
  // If the user is already authenticated, render the children immediately
  // to allow seamless navigation between admin pages without a loading flicker.
  if (isLoading && !user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  // If there's a user, we can render the admin content.
  if (user) {
     return <>{children}</>;
  }

  // If loading is done and there's still no user, we will be redirected by the effect.
  // We can show a loader in the meantime.
  return (
      <div className="flex h-screen items-center justify-center">
        <Loader className="h-8 w-8 animate-spin" />
      </div>
    );
}
