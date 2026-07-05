import { router, useLocalSearchParams, useNavigation } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
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
import {
  deleteTransaction,
  getTransactionById,
  updateTransaction,
} from '@/src/db/repositories/transactions';
import { useSettings } from '@/src/hooks/useSettings';
import type { TransactionType } from '@/src/types';
import { toDateString } from '@/src/utils/dates';

export default function EditTransactionScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const navigation = useNavigation();
  const { currency } = useSettings();
  const { refresh } = useRefresh();

  const [type, setType] = useState<TransactionType>('expense');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Other');
  const [note, setNote] = useState('');
  const [date, setDate] = useState(toDateString());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const categories = type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
  const accent = type === 'income' ? AppColors.income : AppColors.expense;
  const parsedAmount = parseFloat(amount);
  const isValid = !isNaN(parsedAmount) && parsedAmount > 0;

  const handleDelete = useCallback(() => {
    Alert.alert('Delete transaction', 'This cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await deleteTransaction(Number(id));
          refresh();
          router.back();
        },
      },
    ]);
  }, [id, refresh]);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Pressable onPress={handleDelete} style={{ marginRight: 8 }}>
          <Text style={{ color: AppColors.expense, fontWeight: '600' }}>Delete</Text>
        </Pressable>
      ),
    });
  }, [navigation, handleDelete]);

  useEffect(() => {
    const load = async () => {
      const txn = await getTransactionById(Number(id));
      if (txn) {
        setType(txn.type);
        setAmount(String(txn.amount));
        setCategory(txn.category);
        setNote(txn.note);
        setDate(txn.date);
      }
      setLoading(false);
    };
    load();
  }, [id]);

  const handleSave = async () => {
    if (!isValid) return;
    setSaving(true);
    try {
      await updateTransaction(Number(id), {
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

  if (!currency || loading) return null;

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.typeToggle}>
          <Pressable
            style={[styles.typeBtn, type === 'income' && styles.typeBtnActiveIncome]}
            onPress={() => {
              setType('income');
              if (!INCOME_CATEGORIES.includes(category as (typeof INCOME_CATEGORIES)[number])) {
                setCategory(INCOME_CATEGORIES[0]);
              }
            }}>
            <Text style={[styles.typeBtnText, type === 'income' && styles.typeBtnTextActive]}>
              Income
            </Text>
          </Pressable>
          <Pressable
            style={[styles.typeBtn, type === 'expense' && styles.typeBtnActiveExpense]}
            onPress={() => {
              setType('expense');
              if (!EXPENSE_CATEGORIES.includes(category as (typeof EXPENSE_CATEGORIES)[number])) {
                setCategory(EXPENSE_CATEGORIES[0]);
              }
            }}>
            <Text style={[styles.typeBtnText, type === 'expense' && styles.typeBtnTextActive]}>
              Expense
            </Text>
          </Pressable>
        </View>

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

      <PrimaryButton title="Save Changes" onPress={handleSave} disabled={!isValid} loading={saving} />
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
  typeToggle: {
    flexDirection: 'row',
    margin: 16,
    gap: 8,
  },
  typeBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    backgroundColor: AppColors.card,
    borderWidth: 1,
    borderColor: AppColors.border,
  },
  typeBtnActiveIncome: {
    backgroundColor: AppColors.incomeLight,
    borderColor: AppColors.income,
  },
  typeBtnActiveExpense: {
    backgroundColor: AppColors.expenseLight,
    borderColor: AppColors.expense,
  },
  typeBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: AppColors.textSecondary,
  },
  typeBtnTextActive: {
    color: AppColors.text,
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
