'use client';

import { useAuthStore } from '@/store/auth';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

const publicPaths = ['/', '/login'];
const REFRESH_INTERVAL = 5 * 60 * 1000; // 5 minutes

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, initialize } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);

  // Initial authentication check
  useEffect(() => {
    const init = async () => {
      await initialize();
      setIsLoading(false);
    };
    init();
  }, [initialize]);

  // Periodic user info refresh to keep session alive
  useEffect(() => {
    if (!isAuthenticated) return;

    const refreshInterval = setInterval(() => {
      initialize();
    }, REFRESH_INTERVAL);

    return () => clearInterval(refreshInterval);
  }, [isAuthenticated, initialize]);

  // Route protection
  useEffect(() => {
    if (!isLoading) {
      const isPublicPath = publicPaths.includes(pathname);

      if (!isAuthenticated && !isPublicPath) {
        router.push('/login');
      } else if (isAuthenticated && pathname === '/login') {
        router.push('/dashboard');
      }
    }
  }, [isAuthenticated, pathname, router, isLoading]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900" />
      </div>
    );
  }

  return <>{children}</>;
}
