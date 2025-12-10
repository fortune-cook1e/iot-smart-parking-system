import { Platform, StyleSheet, Dimensions, Alert } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Fonts } from '@/constants/theme';
import MapView, { Marker, MarkerSelectEvent } from 'react-native-maps';
import { useEffect, useState, useCallback, useMemo } from 'react';
import { ParkingSpace } from '@iot-smart-parking-system/shared-schemas';
import SearchableSelect, { SelectOption } from '@/components/SearchableSelect';
import ParkingSpaceCard from '@/components/ParkingSpaceCard';
import { showError, showSuccess } from '@/utils/toast';
import {
  deleteSubscriptionHandler,
  createSubscriptionHandler,
  checkSubscriptionHandler,
} from '@/services/subscription';
import { useParkingSpaces } from '@/hooks/use-parking-spaces';
import { useAuthStore } from '@/store/auth';
import { router } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { useSocket, useParkingSpaceUpdates } from '@/hooks/use-socket';
import { WebhookSensorData } from '@iot-smart-parking-system/shared-schemas/src/webhook.schema';

const { height } = Dimensions.get('window');

const isIOS = Platform.OS === 'ios';
const STOCKHOLM_COORDINATES = { latitude: 59.3293, longitude: 18.0686 };

export default function Parking() {
  const { isAuthenticated } = useAuthStore();

  const [selectedParkingId, setSelectedParkingId] = useState<string>('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [currentPosition, setCurrentPosition] = useState<{ latitude: number; longitude: number }>(
    STOCKHOLM_COORDINATES
  );

  const { parkingSpaces, getCurrentParkingSpace, getParkingSpaces } = useParkingSpaces();
  const { subscribe: socketSubscribe, unsubscribe: socketUnsubscribe, isConnected } = useSocket();

  const selectedParking = useMemo(() => {
    return parkingSpaces.find(space => space.id === selectedParkingId) || null;
  }, [selectedParkingId, parkingSpaces]);

  // FixMe: When user logins, existing subscriptions are not subscribed to socket
  // Subscribe to all parking spaces when subscriptions load
  // useEffect(() => {
  //   if (isConnected && parkingSpaces.length > 0) {
  //     parkingSpaces.forEach(parkingLot => {
  //       socketSubscribe(parkingLot.id);
  //     });
  //   }
  // }, [isConnected, parkingSpaces]);

  // Listen for real-time parking space updates
  useParkingSpaceUpdates(
    useCallback(
      (data: WebhookSensorData) => {
        console.log('data changed....');
        getParkingSpaces().then(() => {
          console.log('New Data');
        });
      },
      [parkingSpaces]
    )
  );

  // Convert parking spaces to select options
  const parkingOptions: SelectOption[] = parkingSpaces.map(space => ({
    label: `${space.name} - ${space.isOccupied ? '🔴 Occupied' : '🟢 Available'}`,
    value: space.id,
  }));

  const handleParkingSelect = (option: SelectOption) => {
    setSelectedParkingId(option.value);
    const selected = parkingSpaces.find(space => space.id === option.value);
    if (selected && isIOS) {
      setCurrentPosition({
        latitude: selected.latitude,
        longitude: selected.longitude,
      });
    }
  };

  // Check subscription status when parking space is selected
  useEffect(() => {
    const checkSubscription = async () => {
      if (selectedParkingId && isAuthenticated) {
        try {
          const result = await checkSubscriptionHandler(selectedParkingId);
          setIsSubscribed(result.isSubscribed);
        } catch (error) {
          console.error('Failed to check subscription:', error);
          setIsSubscribed(false);
        }
      } else {
        setIsSubscribed(false);
      }
    };

    checkSubscription();
  }, [selectedParkingId, isAuthenticated]);

  // Re-check subscription status when screen is focused
  useFocusEffect(
    useCallback(() => {
      const recheckSubscription = async () => {
        if (selectedParkingId && isAuthenticated) {
          try {
            const result = await checkSubscriptionHandler(selectedParkingId);
            setIsSubscribed(result.isSubscribed);
          } catch (error) {
            console.error('Failed to recheck subscription:', error);
          }
        }
      };

      recheckSubscription();
    }, [selectedParkingId, isAuthenticated])
  );

  const handleSubscribe = async (parkingSpace: ParkingSpace) => {
    if (!isAuthenticated) {
      Alert.alert('Authentication Required', 'Please log in to subscribe to parking spaces', [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Log In',
          onPress: () => router.push('/login'),
        },
      ]);
      return;
    }

    try {
      await createSubscriptionHandler(parkingSpace.id);
      setIsSubscribed(true);
      // Subscribe to socket updates
      socketSubscribe(parkingSpace.id);
      showSuccess('Subscribed successfully');
    } catch (error) {
      console.error('Failed to subscribe:', error);
      showError('Failed to subscribe');
    }
  };

  const handleUnsubscribe = async (parkingSpace: ParkingSpace) => {
    Alert.alert('Unsubscribe', `Are you sure you want to unsubscribe from ${parkingSpace.name}?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Unsubscribe',
        style: 'destructive',
        onPress: async () => {
          try {
            // Unsubscribe from socket updates
            socketUnsubscribe(parkingSpace.id);
            await deleteSubscriptionHandler(parkingSpace.id);
            setIsSubscribed(false);
            showSuccess('Unsubscribed successfully');
          } catch (error) {
            console.error('Failed to unsubscribe:', error);
            showError('Failed to unsubscribe');
          }
        },
      },
    ]);
  };

  const onMarkerSelect = (event: MarkerSelectEvent) => {
    const { coordinate } = event.nativeEvent;
    const selected = parkingSpaces.find(
      space => space.latitude === coordinate.latitude && space.longitude === coordinate.longitude
    );
    if (selected) {
      setSelectedParkingId(selected.id);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>
        Parking Map
      </ThemedText>

      {/* Searchable Select */}
      <SearchableSelect
        options={parkingOptions}
        value={selectedParkingId}
        placeholder="Search parking spaces..."
        onSelect={handleParkingSelect}
        label="Select Parking Space"
      />

      {/* Selected Parking Info */}
      {selectedParking && (
        <ParkingSpaceCard
          item={selectedParking}
          onPressSubscribe={handleSubscribe}
          onPressUnsubscribe={handleUnsubscribe}
          isSubscribed={isSubscribed}
          showFooter={true}
        />
      )}

      {isIOS && (
        <MapView
          style={styles.map}
          region={{
            latitude: selectedParking?.latitude || currentPosition.latitude,
            longitude: selectedParking?.longitude || currentPosition.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
          showsUserLocation
          showsMyLocationButton
        >
          {parkingSpaces.map(parkingLot => (
            <Marker
              key={parkingLot.id}
              coordinate={{ latitude: parkingLot.latitude, longitude: parkingLot.longitude }}
              title={parkingLot.name || 'Parking Lot'}
              description={`${parkingLot.isOccupied ? 'Occupied' : 'Available'} - ${parkingLot.currentPrice} SEK/hr`}
              pinColor={parkingLot.isOccupied ? 'red' : 'green'}
              opacity={selectedParkingId && parkingLot.id !== selectedParkingId ? 1 : 1}
              image={
                parkingLot.isOccupied
                  ? require('@/assets/images/parking-red.png')
                  : require('@/assets/images/parking-blue.png')
              }
              onSelect={onMarkerSelect}
            />
          ))}
        </MapView>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontFamily: Fonts.rounded,
    marginBottom: 20,
    fontSize: 32,
  },
  infoCard: {
    backgroundColor: '#667eea',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  infoTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 6,
    fontFamily: Fonts.rounded,
  },
  infoAddress: {
    fontSize: 14,
    color: '#e0e7ff',
    marginBottom: 12,
    fontFamily: Fonts.rounded,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  infoLabel: {
    fontSize: 15,
    color: '#e0e7ff',
    marginRight: 8,
    fontWeight: '600',
    fontFamily: Fonts.rounded,
  },
  infoValue: {
    fontSize: 15,
    color: '#ffffff',
    fontWeight: '600',
    fontFamily: Fonts.rounded,
  },
  map: {
    flex: 1,
    borderRadius: 20,
    overflow: 'hidden',
    minHeight: height * 0.4,
  },
  webMapPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 20,
    minHeight: height * 0.75,
  },
  webMapText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#667eea',
    marginTop: 20,
  },
  webMapSubText: {
    fontSize: 15,
    color: '#999',
    marginTop: 8,
  },
});
