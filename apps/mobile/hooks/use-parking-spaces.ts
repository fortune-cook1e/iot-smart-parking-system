import { getParkingSpaceList } from '@/services/parking-space';
import { ParkingSpace } from '@iot-smart-parking-system/shared-schemas';
import { useEffect, useState } from 'react';

export function useParkingSpaces() {
  const [parkingSpaces, setParkingSpaces] = useState<ParkingSpace[]>([]);
  const [loading, setLoading] = useState(false);

  const getCurrentParkingSpace = (id: string) => {
    return parkingSpaces.find(space => space.id === id) || null;
  };

  const getParkingSpaces = async () => {
    const data = await getParkingSpaceList();
    setParkingSpaces(data.parkingSpaces);
    return data.parkingSpaces;
  };

  useEffect(() => {
    getParkingSpaces();
  }, []);

  return {
    parkingSpaces,
    loading,
    setParkingSpaces,
    getParkingSpaces,
    setLoading,
    getCurrentParkingSpace,
  };
}
