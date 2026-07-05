import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import {
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
import { PrimaryButton } from '@/src/components/PrimaryButton';
import { AppColors } from '@/src/constants/theme';
import { useRefresh } from '@/src/context/RefreshContext';
import { createDebtEntry } from '@/src/db/repositories/debts';
import { useSettings } from '@/src/hooks/useSettings';
import type { DebtEntryType } from '@/src/types';
import { toDateString } from '@/src/utils/dates';

const ENTRY_TYPES: { type: DebtEntryType; label: string; subtitle: string }[] = [
  { type: 'borrowed', label: 'Borrowed', subtitle: 'You received money' },
  { type: 'lent', label: 'Lent', subtitle: 'You gave money' },
  { type: 'repaid_to', label: 'You repaid', subtitle: 'You paid them back' },
  { type: 'repaid_by', label: 'They repaid', subtitle: 'They paid you back' },
];

export default function AddDebtEntryScreen() {
  const { personId } = useLocalSearchParams<{ personId: string }>();
  const { currency } = useSettings();
  const { refresh } = useRefresh();

  const [entryType, setEntryType] = useState<DebtEntryType>('borrowed');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [date, setDate] = useState(toDateString());
  const [saving, setSaving] = useState(false);

  const parsedAmount = parseFloat(amount);
  const isValid = !isNaN(parsedAmount) && parsedAmount > 0;

  const handleSave = async () => {
    if (!isValid) return;
    setSaving(true);
    try {
      await createDebtEntry({
        person_id: Number(personId),
        type: entryType,
        amount: parsedAmount,
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
        <Text style={styles.sectionLabel}>Entry type</Text>
        <View style={styles.typeGrid}>
          {ENTRY_TYPES.map((item) => {
            const selected = entryType === item.type;
            return (
              <Pressable
                key={item.type}
                style={[styles.typeCard, selected && styles.typeCardSelected]}
                onPress={() => setEntryType(item.type)}>
                <Text style={[styles.typeLabel, selected && styles.typeLabelSelected]}>
                  {item.label}
                </Text>
                <Text style={styles.typeSubtitle}>{item.subtitle}</Text>
              </Pressable>
            );
          })}
        </View>

        <AmountInput
          value={amount}
          onChangeText={(text) => setAmount(text.replace(/[^0-9.]/g, ''))}
          currency={currency}
        />

        <View style={styles.field}>
          <Text style={styles.label}>Note (optional)</Text>
          <TextInput
            style={styles.input}
            value={note}
            onChangeText={setNote}
            placeholder="Add a note"
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

      <PrimaryButton title="Save Entry" onPress={handleSave} disabled={!isValid} loading={saving} />
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
  sectionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: AppColors.textSecondary,
    paddingHorizontal: 16,
    marginBottom: 10,
    marginTop: 8,
  },
  typeGrid: {
    paddingHorizontal: 16,
    gap: 8,
    marginBottom: 8,
  },
  typeCard: {
    padding: 14,
    borderRadius: 12,
    backgroundColor: AppColors.card,
    borderWidth: 1,
    borderColor: AppColors.border,
  },
  typeCardSelected: {
    backgroundColor: AppColors.primaryLight,
    borderColor: AppColors.primary,
  },
  typeLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: AppColors.text,
  },
  typeLabelSelected: {
    color: AppColors.primary,
  },
  typeSubtitle: {
    fontSize: 13,
    color: AppColors.textMuted,
    marginTop: 2,
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
