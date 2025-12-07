import { Platform, StyleSheet, View, Text, Dimensions } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Fonts } from '@/constants/theme';
import MapView, { Marker, MarkerSelectEvent, Region } from 'react-native-maps';
import { getParkingSpaceList } from '@/services/parking-space';
import { useEffect, useState } from 'react';
import { ParkingSpace } from '@iot-smart-parking-system/shared-schemas';
import SearchableSelect, { SelectOption } from '@/components/SearchableSelect';

const { height } = Dimensions.get('window');

const isWeb = Platform.OS === 'web';
const isIOS = Platform.OS === 'ios';
const STOCKHOLM_COORDINATES = { latitude: 59.3293, longitude: 18.0686 };

export default function Parking() {
  const [parkingSpaces, setParkingSpaces] = useState<ParkingSpace[]>([]);
  const [selectedParkingId, setSelectedParkingId] = useState<string>('');
  const [currentPosition, setCurrentPosition] = useState<{ latitude: number; longitude: number }>(
    STOCKHOLM_COORDINATES
  );

  const getParkingSpaces = async () => {
    const data = await getParkingSpaceList();
    setParkingSpaces(data.parkingSpaces);
  };

  useEffect(() => {
    getParkingSpaces();
  }, []);

  // Convert parking spaces to select options
  const parkingOptions: SelectOption[] = parkingSpaces.map(space => ({
    label: `${space.name || space.sensorId} - ${space.isOccupied ? '🔴 Occupied' : '🟢 Available'}`,
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

  const selectedParking = parkingSpaces.find(space => space.id === selectedParkingId);

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
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>{selectedParking.name || selectedParking.sensorId}</Text>
          <Text style={styles.infoAddress}>{selectedParking.address}</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Status:</Text>
            <Text
              style={[
                styles.infoValue,
                { color: selectedParking.isOccupied ? '#ef4444' : '#10b981' },
              ]}
            >
              {selectedParking.isOccupied ? 'Occupied' : 'Available'}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Price:</Text>
            <Text style={styles.infoValue}>{selectedParking.currentPrice} SEK/hr</Text>
          </View>
        </View>
      )}

      {isWeb && (
        <View style={styles.webMapPlaceholder}>
          <IconSymbol name="map" size={64} color="#667eea" />
          <Text style={styles.webMapText}>Map View</Text>
          <Text style={styles.webMapSubText}>Available on mobile devices</Text>
        </View>
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
