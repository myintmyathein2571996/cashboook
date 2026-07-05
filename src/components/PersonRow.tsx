import { Pressable, StyleSheet, Text, View } from 'react-native';

import { AppColors } from '@/src/constants/theme';
import type { CurrencyOption, PersonWithBalance } from '@/src/types';
import { formatMoney } from '@/src/utils/formatMoney';

interface PersonRowProps {
  person: PersonWithBalance;
  currency: CurrencyOption;
  onPress?: () => void;
}

export function PersonRow({ person, currency, onPress }: PersonRowProps) {
  const { balance } = person;
  const settled = balance === 0;
  const theyOweYou = balance > 0;

  const statusText = settled
    ? 'Settled'
    : theyOweYou
      ? 'Owes you'
      : 'You owe';

  const color = settled
    ? AppColors.textMuted
    : theyOweYou
      ? AppColors.income
      : AppColors.expense;

  return (
    <Pressable style={styles.row} onPress={onPress}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{person.name.charAt(0).toUpperCase()}</Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.name}>{person.name}</Text>
        <Text style={[styles.status, { color }]}>{statusText}</Text>
      </View>
      <Text style={[styles.balance, { color }]}>
        {settled ? '—' : formatMoney(Math.abs(balance), currency)}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: AppColors.card,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: AppColors.border,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: AppColors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 18,
    fontWeight: '700',
    color: AppColors.primary,
  },
  content: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: AppColors.text,
  },
  status: {
    fontSize: 13,
    marginTop: 2,
  },
  balance: {
    fontSize: 16,
    fontWeight: '700',
  },
});
