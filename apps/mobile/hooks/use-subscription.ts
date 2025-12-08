import { deleteSubscriptionHandler, getUserSubscriptionsHandler } from '@/services/subscription';
import { useAuthStore } from '@/store/auth';
import { showError, showSuccess } from '@/utils/toast';
import { Subscription } from '@iot-smart-parking-system/shared-schemas';
import { useEffect, useState } from 'react';
import { Alert } from 'react-native';

export function useSubscriptions() {
  const { isAuthenticated } = useAuthStore();
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(false);

  const getSubscriptions = async () => {
    if (!isAuthenticated) return;
    try {
      setLoading(true);
      const result = await getUserSubscriptionsHandler();
      setSubscriptions(result || []);
    } catch (error) {
      console.error('Failed to fetch subscriptions:', error);
      showError('Failed to load subscriptions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getSubscriptions();
  }, []);

  return {
    subscriptions,
    setSubscriptions,
    loading,
    setLoading,
    getSubscriptions,
  };
}

export function useSubscribeParkingSpace() {}
