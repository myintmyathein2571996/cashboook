import { Pressable, StyleSheet, Text, View } from 'react-native';

import { AppColors } from '@/src/constants/theme';
import type { CurrencyOption, Transaction } from '@/src/types';
import { formatDisplayDate } from '@/src/utils/dates';
import { formatMoney } from '@/src/utils/formatMoney';

interface TransactionRowProps {
  transaction: Transaction;
  currency: CurrencyOption;
  onPress?: () => void;
  onLongPress?: () => void;
}

export function TransactionRow({
  transaction,
  currency,
  onPress,
  onLongPress,
}: TransactionRowProps) {
  const isIncome = transaction.type === 'income';
  const color = isIncome ? AppColors.income : AppColors.expense;
  const prefix = isIncome ? '+' : '-';

  return (
    <Pressable
      style={styles.row}
      onPress={onPress}
      onLongPress={onLongPress}
      android_ripple={{ color: AppColors.border }}>
      <View style={[styles.iconWrap, { backgroundColor: isIncome ? AppColors.incomeLight : AppColors.expenseLight }]}>
        <Text style={styles.icon}>{isIncome ? '↓' : '↑'}</Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.category}>{transaction.category}</Text>
        <Text style={styles.meta} numberOfLines={1}>
          {transaction.note ? transaction.note : formatDisplayDate(transaction.date)}
        </Text>
      </View>
      <Text style={[styles.amount, { color }]}>
        {prefix}
        {formatMoney(transaction.amount, currency).replace(/^-/, '')}
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
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  icon: {
    fontSize: 18,
    fontWeight: '700',
    color: AppColors.text,
  },
  content: {
    flex: 1,
    marginRight: 8,
  },
  category: {
    fontSize: 16,
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
