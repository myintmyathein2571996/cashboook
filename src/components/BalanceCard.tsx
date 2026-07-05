import { Pressable, StyleSheet, Text, View } from 'react-native';

import { AppColors } from '@/src/constants/theme';
import type { CurrencyOption } from '@/src/types';
import { formatMoney } from '@/src/utils/formatMoney';

interface BalanceCardProps {
  label: string;
  amount: number;
  currency: CurrencyOption;
  variant?: 'default' | 'income' | 'expense';
}

export function BalanceCard({
  label,
  amount,
  currency,
  variant = 'default',
}: BalanceCardProps) {
  const color =
    variant === 'income'
      ? AppColors.income
      : variant === 'expense'
        ? AppColors.expense
        : AppColors.text;

  return (
    <View style={styles.card}>
      <Text style={styles.label}>{label}</Text>
      <Text style={[styles.amount, { color }]}>{formatMoney(amount, currency)}</Text>
    </View>
  );
}

interface SummaryRowProps {
  label: string;
  amount: number;
  currency: CurrencyOption;
  variant?: 'income' | 'expense' | 'default';
  onPress?: () => void;
}

export function SummaryRow({
  label,
  amount,
  currency,
  variant = 'default',
  onPress,
}: SummaryRowProps) {
  const color =
    variant === 'income'
      ? AppColors.income
      : variant === 'expense'
        ? AppColors.expense
        : AppColors.text;

  const content = (
    <>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={[styles.rowAmount, { color }]}>{formatMoney(amount, currency)}</Text>
    </>
  );

  if (onPress) {
    return (
      <Pressable style={styles.row} onPress={onPress}>
        {content}
      </Pressable>
    );
  }

  return <View style={styles.row}>{content}</View>;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: AppColors.card,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: AppColors.border,
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    color: AppColors.textSecondary,
    marginBottom: 6,
  },
  amount: {
    fontSize: 32,
    fontWeight: '700',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  rowLabel: {
    fontSize: 15,
    color: AppColors.textSecondary,
  },
  rowAmount: {
    fontSize: 16,
    fontWeight: '600',
  },
});
