import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { AmountInput } from '@/src/components/AmountInput';
import { CategoryPicker } from '@/src/components/CategoryPicker';
import { PrimaryButton } from '@/src/components/PrimaryButton';
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '@/src/constants/categories';
import { AppColors } from '@/src/constants/theme';
import { useRefresh } from '@/src/context/RefreshContext';
import { createTransaction } from '@/src/db/repositories/transactions';
import { useSettings } from '@/src/hooks/useSettings';
import type { TransactionType } from '@/src/types';
import { toDateString } from '@/src/utils/dates';

export default function AddTransactionScreen() {
  const { type: typeParam } = useLocalSearchParams<{ type?: string }>();
  const type: TransactionType = typeParam === 'income' ? 'income' : 'expense';
  const { currency } = useSettings();
  const { refresh } = useRefresh();

  const categories = type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<string>(categories[0]);
  const [note, setNote] = useState('');
  const [date, setDate] = useState(toDateString());
  const [saving, setSaving] = useState(false);

  const accent = type === 'income' ? AppColors.income : AppColors.expense;
  const parsedAmount = parseFloat(amount);
  const isValid = !isNaN(parsedAmount) && parsedAmount > 0;

  const handleSave = async () => {
    if (!isValid) return;
    setSaving(true);
    try {
      await createTransaction({
        type,
        amount: parsedAmount,
        category,
        note: note.trim(),
        date,
      });
      refresh();
      router.back();
    } finally {
      setSaving(false);
    }
  };

  if (!currency) return null;

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.content}>
        <AmountInput
          value={amount}
          onChangeText={(text) => setAmount(text.replace(/[^0-9.]/g, ''))}
          currency={currency}
          color={accent}
        />

        <CategoryPicker
          categories={categories}
          selected={category}
          onSelect={setCategory}
        />

        <View style={styles.field}>
          <Text style={styles.label}>Note (optional)</Text>
          <TextInput
            style={styles.input}
            value={note}
            onChangeText={setNote}
            placeholder="What was this for?"
            placeholderTextColor={AppColors.textMuted}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Date</Text>
          <TextInput
            style={styles.input}
            value={date}
            onChangeText={setDate}
            placeholder="YYYY-MM-DD"
            placeholderTextColor={AppColors.textMuted}
          />
        </View>
      </ScrollView>

      <PrimaryButton
        title={`Save ${type === 'income' ? 'Income' : 'Expense'}`}
        onPress={handleSave}
        disabled={!isValid}
        loading={saving}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.background,
  },
  content: {
    paddingBottom: 24,
  },
  field: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: AppColors.textSecondary,
    marginBottom: 8,
  },
  input: {
    backgroundColor: AppColors.card,
    borderWidth: 1,
    borderColor: AppColors.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: AppColors.text,
  },
});
