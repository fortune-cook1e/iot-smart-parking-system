import { deleteSubscriptionHandler } from '@/services/subscription';
import { useAuthStore } from '@/store/auth';
import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from 'react-native';
import { Subscription } from '@iot-smart-parking-system/shared-schemas';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Fonts } from '@/constants/theme';
import { showError, showSuccess } from '@/utils/toast';
import { useThemeColors } from '@/hooks/use-theme-color';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import SubscriptionCard from '@/components/Subscriptions/SubscriptionCard';
import { useSubscriptions } from '@/hooks/use-subscription';

export default function Subscriptions() {
  const { isAuthenticated } = useAuthStore();
  const [refreshing, setRefreshing] = useState(false);
  const colors = useThemeColors();

  const { loading, subscriptions, getSubscriptions, setLoading, setSubscriptions } =
    useSubscriptions();

  const onRefresh = async () => {
    setRefreshing(true);
    await getSubscriptions();
    setRefreshing(false);
  };

  const handleUnsubscribe = async (item: Subscription) => {
    const { parkingSpace } = item;
    Alert.alert('Unsubscribe', `Are you sure you want to unsubscribe from ${parkingSpace.name}?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Unsubscribe',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteSubscriptionHandler(parkingSpace.id);
            setSubscriptions(prev => prev.filter(sub => sub.parkingSpaceId !== parkingSpace.id));
            showSuccess('Unsubscribed successfully');
          } catch (error) {
            console.error('Failed to unsubscribe:', error);
            showError('Failed to unsubscribe');
          }
        },
      },
    ]);
  };

  if (!isAuthenticated) {
    return (
      <View style={[styles.emptyContainer, { backgroundColor: colors.background }]}>
        <IconSymbol name="person.crop.circle.badge.xmark" size={64} color={colors.textSecondary} />
        <Text style={[styles.emptyTitle, { color: colors.text }]}>Not Authenticated</Text>
        <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
          Please log in to view your subscriptions
        </Text>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
          Loading subscriptions...
        </Text>
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <FlatList
          data={subscriptions}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={colors.primary}
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <IconSymbol name="bell.slash" size={64} color={colors.textSecondary} />
              <Text style={[styles.emptyTitle, { color: colors.text }]}>No Subscriptions</Text>
              <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                Subscribe to parking spaces to get notified when they become available
              </Text>
            </View>
          }
          renderItem={({ item }) => (
            <SubscriptionCard item={item} onPressUnsubscribe={handleUnsubscribe} />
          )}
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    fontFamily: Fonts.rounded,
  },
  listContent: {
    padding: 16,
    paddingBottom: 32,
  },

  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 80,
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginTop: 20,
    marginBottom: 8,
    fontFamily: Fonts.rounded,
  },
  emptyText: {
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
    fontFamily: Fonts.rounded,
  },
});
