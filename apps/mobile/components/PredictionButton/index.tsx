import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Fonts } from '@/constants/theme';
import { useThemeColors } from '@/hooks/use-theme-color';

interface PredictionButtonProps {
  onPress: () => void;
}

export function PredictionButton({ onPress }: PredictionButtonProps) {
  const colors = useThemeColors();

  return (
    <TouchableOpacity
      style={[
        styles.predictButton,
        { backgroundColor: colors.primary + '15', borderColor: colors.primary },
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <IconSymbol name="chart.line.uptrend.xyaxis" size={18} color={colors.primary} />
      <Text style={[styles.predictButtonText, { color: colors.primary }]}>
        Predict in 30 minutes
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  predictButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 12,
    gap: 8,
    borderWidth: 1.5,
  },
  predictButtonText: {
    fontSize: 14,
    fontWeight: '600',
    fontFamily: Fonts.rounded,
  },
});
