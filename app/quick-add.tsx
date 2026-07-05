import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppColors } from '@/src/constants/theme';

export default function QuickAddScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.overlay, { paddingBottom: insets.bottom + 16 }]}>
      <Pressable style={styles.backdrop} onPress={() => router.back()} />
      <View style={styles.sheet}>
        <Text style={styles.title}>What would you like to add?</Text>
        <Pressable
          style={[styles.option, styles.incomeOption]}
          onPress={() => {
            router.back();
            router.push({ pathname: '/transaction/add', params: { type: 'income' } });
          }}>
          <Text style={styles.optionIcon}>↓</Text>
          <View>
            <Text style={styles.optionTitle}>Income</Text>
            <Text style={styles.optionSubtitle}>Money received</Text>
          </View>
        </Pressable>
        <Pressable
          style={[styles.option, styles.expenseOption]}
          onPress={() => {
            router.back();
            router.push({ pathname: '/transaction/add', params: { type: 'expense' } });
          }}>
          <Text style={styles.optionIcon}>↑</Text>
          <View>
            <Text style={styles.optionTitle}>Expense</Text>
            <Text style={styles.optionSubtitle}>Money spent</Text>
          </View>
        </Pressable>
        <Pressable style={styles.cancel} onPress={() => router.back()}>
          <Text style={styles.cancelText}>Cancel</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  sheet: {
    backgroundColor: AppColors.card,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: AppColors.text,
    marginBottom: 16,
    textAlign: 'center',
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 14,
    marginBottom: 10,
  },
  incomeOption: {
    backgroundColor: AppColors.incomeLight,
  },
  expenseOption: {
    backgroundColor: AppColors.expenseLight,
  },
  optionIcon: {
    fontSize: 24,
    fontWeight: '700',
    marginRight: 14,
    width: 32,
    textAlign: 'center',
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: AppColors.text,
  },
  optionSubtitle: {
    fontSize: 13,
    color: AppColors.textSecondary,
    marginTop: 2,
  },
  cancel: {
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 4,
  },
  cancelText: {
    fontSize: 16,
    color: AppColors.textSecondary,
    fontWeight: '500',
  },
});
