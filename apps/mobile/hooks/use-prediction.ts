import { useState } from 'react';
import { predictOccupancy } from '@/services/prediction';

interface UsePredictionParams {
  sensorId: string;
  latitude: number;
  longitude: number;
  predictMinutesAhead?: number;
}

interface PredictionData {
  probability: number;
  loading: boolean;
  error: string | null;
}

export function usePrediction() {
  const [showPrediction, setShowPrediction] = useState(false);
  const [predictionData, setPredictionData] = useState<PredictionData>({
    probability: 0,
    loading: false,
    error: null,
  });

  const handlePredict = async (params: UsePredictionParams) => {
    setShowPrediction(true);
    setPredictionData({ probability: 0, loading: true, error: null });

    try {
      const probability = await predictOccupancy({
        sensorId: params.sensorId,
        predictMinutesAhead: params.predictMinutesAhead || 30,
        currentTime: Date.now(),
        latitude: params.latitude,
        longitude: params.longitude,
      });

      setPredictionData({
        probability,
        loading: false,
        error: null,
      });
    } catch (error) {
      setPredictionData({
        probability: 0,
        loading: false,
        error: 'Failed to load prediction',
      });
    }
  };

  const closePrediction = () => {
    setShowPrediction(false);
  };

  return {
    showPrediction,
    predictionData,
    handlePredict,
    closePrediction,
  };
}
