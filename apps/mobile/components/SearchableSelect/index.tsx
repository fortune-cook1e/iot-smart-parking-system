import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Modal,
  Pressable,
  useColorScheme,
} from 'react-native';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Fonts } from '@/constants/theme';

export interface SelectOption {
  label: string;
  value: string;
}

interface SearchableSelectProps {
  options: SelectOption[];
  value?: string;
  placeholder?: string;
  onSelect: (option: SelectOption) => void;
  label?: string;
}

export default function SearchableSelect({
  options,
  value,
  placeholder = 'Select an option',
  onSelect,
  label,
}: SearchableSelectProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [searchText, setSearchText] = useState('');
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const selectedOption = options.find(opt => opt.value === value);

  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleSelect = (option: SelectOption) => {
    onSelect(option);
    setIsVisible(false);
    setSearchText('');
  };

  const colors = {
    background: isDark ? '#1a1a1a' : '#ffffff',
    surface: isDark ? '#2a2a2a' : '#f8f9fa',
    border: isDark ? '#404040' : '#e0e0e0',
    text: isDark ? '#ffffff' : '#000000',
    textSecondary: isDark ? '#a0a0a0' : '#666666',
    overlay: isDark ? 'rgba(0, 0, 0, 0.85)' : 'rgba(0, 0, 0, 0.5)',
    primary: '#667eea',
    hover: isDark ? '#353535' : '#f0f0f0',
  };

  return (
    <View style={styles.container}>
      {label && <Text style={[styles.label, { color: colors.text }]}>{label}</Text>}

      <TouchableOpacity
        style={[
          styles.selectButton,
          { backgroundColor: colors.surface, borderColor: colors.border },
        ]}
        onPress={() => setIsVisible(true)}
        activeOpacity={0.7}
      >
        <Text
          style={[
            styles.selectButtonText,
            { color: selectedOption ? colors.text : colors.textSecondary },
          ]}
          numberOfLines={1}
        >
          {selectedOption?.label || placeholder}
        </Text>
        <IconSymbol name="chevron.down" size={20} color={colors.textSecondary} />
      </TouchableOpacity>

      <Modal
        visible={isVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsVisible(false)}
      >
        <Pressable
          style={[styles.modalOverlay, { backgroundColor: colors.overlay }]}
          onPress={() => setIsVisible(false)}
        >
          <Pressable
            style={[styles.modalContent, { backgroundColor: colors.background }]}
            onPress={e => e.stopPropagation()}
          >
            {/* Header */}
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>
                {label || 'Select Option'}
              </Text>
              <TouchableOpacity onPress={() => setIsVisible(false)} style={styles.closeButton}>
                <IconSymbol name="xmark" size={24} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>

            {/* Search Input */}
            <View style={[styles.searchContainer, { backgroundColor: colors.surface }]}>
              <IconSymbol name="magnifyingglass" size={20} color={colors.textSecondary} />
              <TextInput
                style={[styles.searchInput, { color: colors.text }]}
                placeholder="Search..."
                placeholderTextColor={colors.textSecondary}
                value={searchText}
                onChangeText={setSearchText}
                autoFocus
              />
              {searchText.length > 0 && (
                <TouchableOpacity onPress={() => setSearchText('')}>
                  <IconSymbol name="xmark.circle.fill" size={18} color={colors.textSecondary} />
                </TouchableOpacity>
              )}
            </View>

            {/* Options List */}
            <FlatList
              data={filteredOptions}
              keyExtractor={item => item.value}
              style={styles.optionsList}
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <IconSymbol name="magnifyingglass" size={48} color={colors.textSecondary} />
                  <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                    No results found
                  </Text>
                </View>
              }
              renderItem={({ item }) => {
                const isSelected = item.value === value;
                return (
                  <TouchableOpacity
                    style={[
                      styles.optionItem,
                      isSelected && { backgroundColor: colors.primary + '15' },
                    ]}
                    onPress={() => handleSelect(item)}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        {
                          color: isSelected ? colors.primary : colors.text,
                          fontWeight: isSelected ? '600' : '400',
                        },
                      ]}
                      numberOfLines={2}
                    >
                      {item.label}
                    </Text>
                    {isSelected && (
                      <IconSymbol name="checkmark.circle.fill" size={22} color={colors.primary} />
                    )}
                  </TouchableOpacity>
                );
              }}
            />
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    fontFamily: Fonts.rounded,
  },
  selectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1.5,
  },
  selectButtonText: {
    fontSize: 16,
    flex: 1,
    fontFamily: Fonts.rounded,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    maxWidth: 500,
    maxHeight: '80%',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    paddingBottom: 16,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '700',
    fontFamily: Fonts.rounded,
  },
  closeButton: {
    padding: 4,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: Fonts.rounded,
    padding: 0,
  },
  optionsList: {
    maxHeight: 400,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 12,
    marginHorizontal: 12,
    marginBottom: 6,
  },
  optionText: {
    fontSize: 16,
    flex: 1,
    marginRight: 12,
    fontFamily: Fonts.rounded,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    marginTop: 16,
    fontFamily: Fonts.rounded,
  },
});
