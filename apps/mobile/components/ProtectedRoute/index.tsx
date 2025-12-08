import React, { useEffect, useMemo } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useRouter, useSegments } from 'expo-router';
import { useAuthStore } from '@/store/auth';
import { Stack, usePathname } from 'expo-router';

interface ProtectedRouteProps {
  children?: React.ReactNode;
}

const PUBLIC_ROUTES = ['login', 'parking'];

// check auth interval (5 minutes)
const AUTH_CHECK_INTERVAL = 5 * 60 * 1000;

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const router = useRouter();
  const segments = useSegments();
  const { isAuthenticated, isLoading, checkAuth, setLoading } = useAuthStore();
  const pathName = usePathname();

  const isPublicRoute = useMemo(() => {
    if (!segments.length) return true;
    const currentRoute = segments[segments.length - 1];
    return PUBLIC_ROUTES.includes(currentRoute);
  }, [segments]);

  useEffect(() => {
    // If logged in, periodically check authentication status
    let intervalId: ReturnType<typeof setInterval> | null = null;
    if (!isPublicRoute) {
      // Initial check
      checkAuth();

      if (isAuthenticated) {
        intervalId = setInterval(() => {
          console.log('🔄 Checking authentication status...');
          checkAuth();
        }, AUTH_CHECK_INTERVAL);
      }
    } else {
      setLoading(false);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isAuthenticated]);

  useEffect(() => {
    if (isLoading) return;

    // Proctect routes: profile page
    const inTabsGroup = segments[0] === '(tabs)';
    const inProfilePage = segments[1] === 'profile';

    //  redirect to login if trying to access profile page (but not if we're already navigating away)
    if (!isAuthenticated && inTabsGroup && inProfilePage && pathName !== '/login') {
      // Use a small delay to avoid conflicts with logout navigation
      // const timer = setTimeout(() => {
      //   router.replace('/login');
      // }, 100);
      router.replace('/login');
      // return () => clearTimeout(timer);
    } else if (isAuthenticated && pathName === '/login') {
      // redirect to parking if logged in and trying to access login page
      router.push('/(tabs)/parking');
    }
  }, [isAuthenticated, isLoading, segments, pathName]);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#667eea" />
      </View>
    );
  }

  return null;
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});
