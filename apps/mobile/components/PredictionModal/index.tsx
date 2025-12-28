import { View, Text, StyleSheet, TouchableOpacity, Modal, ActivityIndicator } from 'react-native';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Fonts } from '@/constants/theme';
import { useThemeColors } from '@/hooks/use-theme-color';

interface PredictionModalProps {
  visible: boolean;
  loading: boolean;
  error: string | null;
  probability: number;
  onClose: () => void;
}

export function PredictionModal({
  visible,
  loading,
  error,
  probability,
  onClose,
}: PredictionModalProps) {
  const colors = useThemeColors();

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContent, { backgroundColor: colors.cardBackground }]}>
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Occupancy Prediction</Text>
            <TouchableOpacity onPress={onClose}>
              <IconSymbol name="xmark.circle.fill" size={28} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={colors.primary} />
              <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
                Analyzing data...
              </Text>
            </View>
          ) : error ? (
            <View style={styles.errorContainer}>
              <IconSymbol name="exclamationmark.triangle.fill" size={48} color={colors.danger} />
              <Text style={[styles.errorText, { color: colors.danger }]}>{error}</Text>
            </View>
          ) : (
            <View style={styles.resultContainer}>
              <Text style={[styles.resultLabel, { color: colors.textSecondary }]}>
                30 minutes from now
              </Text>
              <View style={styles.probabilityContainer}>
                <Text style={[styles.probabilityValue, { color: colors.primary }]}>
                  {(probability * 100).toFixed(1)}%
                </Text>
                <Text style={[styles.probabilityLabel, { color: colors.textSecondary }]}>
                  Probability of being occupied
                </Text>
              </View>
              <View
                style={[
                  styles.predictionBadge,
                  {
                    backgroundColor:
                      probability > 0.6 ? colors.danger + '20' : colors.success + '20',
                  },
                ]}
              >
                <IconSymbol
                  name={probability > 0.6 ? 'xmark.circle' : 'checkmark.circle'}
                  size={24}
                  color={probability > 0.6 ? colors.danger : colors.success}
                />
                <Text
                  style={[
                    styles.predictionText,
                    {
                      color: probability > 0.6 ? colors.danger : colors.success,
                    },
                  ]}
                >
                  {probability > 0.6 ? 'Likely Occupied' : 'Likely Available'}
                </Text>
              </View>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    maxWidth: 400,
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    fontFamily: Fonts.rounded,
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 40,
    gap: 16,
  },
  loadingText: {
    fontSize: 16,
    fontFamily: Fonts.rounded,
  },
  errorContainer: {
    alignItems: 'center',
    paddingVertical: 40,
    gap: 16,
  },
  errorText: {
    fontSize: 16,
    fontFamily: Fonts.rounded,
    textAlign: 'center',
  },
  resultContainer: {
    alignItems: 'center',
    gap: 16,
  },
  resultLabel: {
    fontSize: 14,
    fontFamily: Fonts.rounded,
  },
  probabilityContainer: {
    alignItems: 'center',
    gap: 8,
    paddingVertical: 20,
  },
  probabilityValue: {
    fontSize: 48,
    fontWeight: '700',
    fontFamily: Fonts.rounded,
  },
  probabilityLabel: {
    fontSize: 14,
    fontFamily: Fonts.rounded,
    textAlign: 'center',
  },
  predictionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 10,
  },
  predictionText: {
    fontSize: 16,
    fontWeight: '700',
    fontFamily: Fonts.rounded,
  },
});
