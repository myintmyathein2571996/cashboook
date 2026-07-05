import { Pressable, StyleSheet, Text, View } from 'react-native';

import { getDebtTypeLabel } from '@/src/db/repositories/debts';
import { AppColors } from '@/src/constants/theme';
import type { CurrencyOption, DebtEntry } from '@/src/types';
import { formatDisplayDate } from '@/src/utils/dates';
import { formatMoney } from '@/src/utils/formatMoney';

interface DebtEntryRowProps {
  entry: DebtEntry;
  currency: CurrencyOption;
  onLongPress?: () => void;
}

export function DebtEntryRow({ entry, currency, onLongPress }: DebtEntryRowProps) {
  const isPositive = entry.type === 'lent' || entry.type === 'repaid_by';
  const color = isPositive ? AppColors.income : AppColors.expense;

  return (
    <Pressable style={styles.row} onLongPress={onLongPress}>
      <View style={styles.content}>
        <Text style={styles.type}>{getDebtTypeLabel(entry.type)}</Text>
        <Text style={styles.meta} numberOfLines={1}>
          {entry.note ? entry.note : formatDisplayDate(entry.date)}
        </Text>
      </View>
      <Text style={[styles.amount, { color }]}>
        {isPositive ? '+' : '-'}
        {formatMoney(entry.amount, currency).replace(/^-/, '')}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: AppColors.card,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: AppColors.border,
  },
  content: {
    flex: 1,
    marginRight: 8,
  },
  type: {
    fontSize: 15,
    fontWeight: '600',
    color: AppColors.text,
  },
  meta: {
    fontSize: 13,
    color: AppColors.textMuted,
    marginTop: 2,
  },
  amount: {
    fontSize: 16,
    fontWeight: '700',
  },
});
