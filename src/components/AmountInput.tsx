import { StyleSheet, Text, TextInput, View } from 'react-native';

import { AppColors } from '@/src/constants/theme';
import type { CurrencyOption } from '@/src/types';

interface AmountInputProps {
  value: string;
  onChangeText: (text: string) => void;
  currency: CurrencyOption;
  color?: string;
}

export function AmountInput({ value, onChangeText, currency, color = AppColors.text }: AmountInputProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Amount</Text>
      <View style={styles.inputRow}>
        <Text style={[styles.symbol, { color }]}>{currency.symbol}</Text>
        <TextInput
          style={[styles.input, { color }]}
          value={value}
          onChangeText={onChangeText}
          keyboardType="decimal-pad"
          placeholder="0"
          placeholderTextColor={AppColors.textMuted}
          autoFocus
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 16,
  },
  label: {
    fontSize: 14,
    color: AppColors.textSecondary,
    marginBottom: 8,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  symbol: {
    fontSize: 36,
    fontWeight: '600',
    marginRight: 8,
  },
  input: {
    fontSize: 48,
    fontWeight: '700',
    minWidth: 120,
    textAlign: 'center',
  },
});
