import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { AppColors } from '@/src/constants/theme';

interface CategoryPickerProps {
  categories: readonly string[];
  selected: string;
  onSelect: (category: string) => void;
}

export function CategoryPicker({ categories, selected, onSelect }: CategoryPickerProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Category</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.list}>
        {categories.map((category) => {
          const isSelected = category === selected;
          return (
            <Pressable
              key={category}
              style={[styles.chip, isSelected && styles.chipSelected]}
              onPress={() => onSelect(category)}>
              <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>
                {category}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: AppColors.textSecondary,
    marginBottom: 10,
    paddingHorizontal: 16,
  },
  list: {
    paddingHorizontal: 16,
    gap: 8,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: AppColors.background,
    borderWidth: 1,
    borderColor: AppColors.border,
  },
  chipSelected: {
    backgroundColor: AppColors.primaryLight,
    borderColor: AppColors.primary,
  },
  chipText: {
    fontSize: 14,
    color: AppColors.textSecondary,
    fontWeight: '500',
  },
  chipTextSelected: {
    color: AppColors.primary,
    fontWeight: '600',
  },
});
