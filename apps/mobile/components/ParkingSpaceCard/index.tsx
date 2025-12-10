import { ParkingSpace } from '@iot-smart-parking-system/shared-schemas';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Fonts } from '@/constants/theme';
import { useThemeColors } from '@/hooks/use-theme-color';

interface ParkingSpaceCardProps {
  item: ParkingSpace;
  onPressUnsubscribe?: (parkingSpace: ParkingSpace) => void;
  onPressSubscribe?: (parkingSpace: ParkingSpace) => void;
  isSubscribed?: boolean;
  showFooter?: boolean;
}

const ParkingSpaceCard: React.FC<ParkingSpaceCardProps> = ({
  item,
  onPressUnsubscribe,
  onPressSubscribe,
  isSubscribed = false,
  showFooter = true,
}) => {
  const colors = useThemeColors();

  // Todo: 1.Check subscription status inside the component
  //       2. Handle subscribe/unsubscribe actions inside the component

  if (!item) return null;

  return (
    <View style={[styles.card, { backgroundColor: colors.cardBackground }]}>
      {/* Header */}
      <View style={styles.cardHeader}>
        <View style={styles.headerLeft}>
          <IconSymbol name="parkingsign.circle.fill" size={40} color={colors.primary} />
          <View style={styles.headerText}>
            <Text style={[styles.cardTitle, { color: colors.text }]}>
              {item.name || item.sensorId}
            </Text>
            <Text style={[styles.cardSubtitle, { color: colors.textSecondary }]}>
              {item.sensorId}
            </Text>
          </View>
        </View>
        <View
          style={[
            styles.statusBadge,
            {
              backgroundColor: item.isOccupied ? colors.danger + '20' : colors.success + '20',
            },
          ]}
        >
          <Text
            style={[styles.statusText, { color: item.isOccupied ? colors.danger : colors.success }]}
          >
            {item.isOccupied ? 'Occupied' : 'Available'}
          </Text>
        </View>
      </View>

      {/* Address */}
      <View style={styles.infoRow}>
        <IconSymbol name="location.fill" size={16} color={colors.textSecondary} />
        <Text style={[styles.infoText, { color: colors.textSecondary }]} numberOfLines={2}>
          {item.address}
        </Text>
      </View>

      {/* Description */}
      {item.description && (
        <View style={styles.infoRow}>
          <IconSymbol name="info.circle" size={16} color={colors.textSecondary} />
          <Text style={[styles.infoText, { color: colors.textSecondary }]} numberOfLines={2}>
            {item.description}
          </Text>
        </View>
      )}

      {/* Price */}
      <View style={styles.infoRow}>
        <IconSymbol name="creditcard.fill" size={16} color={colors.textSecondary} />
        <Text style={[styles.priceText, { color: colors.warning }]}>
          {item.currentPrice} SEK/hr
        </Text>
      </View>

      {/* Footer - Subscribe/Unsubscribe */}
      {showFooter && (
        <View style={styles.cardFooter}>
          <Text style={[styles.subscribeDate, { color: colors.textSecondary }]}>
            {isSubscribed && item.createdAt
              ? `Subscribed: ${new Date(item.createdAt).toLocaleDateString()}`
              : ''}
          </Text>
          {isSubscribed ? (
            <TouchableOpacity
              style={[styles.unsubscribeButton, { backgroundColor: colors.danger }]}
              onPress={() => onPressUnsubscribe?.(item)}
              activeOpacity={0.7}
            >
              <IconSymbol name="bell.slash.fill" size={16} color="#ffffff" />
              <Text style={styles.unsubscribeText}>Unsubscribe</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[styles.subscribeButton, { backgroundColor: colors.primary }]}
              onPress={() => onPressSubscribe?.(item)}
              activeOpacity={0.7}
            >
              <IconSymbol name="bell.badge.fill" size={16} color="#ffffff" />
              <Text style={styles.subscribeText}>Subscribe</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 12,
  },
  headerText: {
    marginLeft: 12,
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    fontFamily: Fonts.rounded,
    marginBottom: 2,
  },
  cardSubtitle: {
    fontSize: 13,
    fontFamily: Fonts.rounded,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700',
    fontFamily: Fonts.rounded,
    textTransform: 'uppercase',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 8,
    gap: 8,
  },
  infoText: {
    fontSize: 14,
    flex: 1,
    fontFamily: Fonts.rounded,
  },
  priceText: {
    fontSize: 16,
    fontWeight: '700',
    fontFamily: Fonts.rounded,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(128, 128, 128, 0.2)',
  },
  subscribeDate: {
    fontSize: 12,
    fontFamily: Fonts.rounded,
  },
  unsubscribeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  unsubscribeText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
    fontFamily: Fonts.rounded,
  },
  subscribeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  subscribeText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
    fontFamily: Fonts.rounded,
  },
});

export default ParkingSpaceCard;
