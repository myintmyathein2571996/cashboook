import { router, useLocalSearchParams, useNavigation } from 'expo-router';
import { useEffect } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { DebtEntryRow } from '@/src/components/DebtEntryRow';
import { EmptyState } from '@/src/components/EmptyState';
import { Fab } from '@/src/components/Fab';
import { AppColors } from '@/src/constants/theme';
import { useRefresh } from '@/src/context/RefreshContext';
import { deleteDebtEntry } from '@/src/db/repositories/debts';
import { deletePerson } from '@/src/db/repositories/people';
import { usePerson } from '@/src/hooks/usePeople';
import { useSettings } from '@/src/hooks/useSettings';
import { formatMoney } from '@/src/utils/formatMoney';

export default function PersonDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const personId = Number(id);
  const navigation = useNavigation();
  const { person, balance, entries, loading, reload } = usePerson(personId);
  const { currency } = useSettings();
  const { refresh } = useRefresh();

  useEffect(() => {
    if (person) {
      navigation.setOptions({ title: person.name });
    }
  }, [navigation, person]);

  const handleDeletePerson = () => {
    Alert.alert(
      'Delete person',
      'This will also delete all borrow/lend records for this person.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await deletePerson(personId);
            refresh();
            router.back();
          },
        },
      ]
    );
  };

  const handleDeleteEntry = (entryId: number) => {
    Alert.alert('Delete entry', 'This cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await deleteDebtEntry(entryId);
          refresh();
        },
      },
    ]);
  };

  if (!currency || loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color={AppColors.primary} />
      </View>
    );
  }

  if (!person) {
    return (
      <View style={styles.centered}>
        <Text style={styles.notFound}>Person not found</Text>
      </View>
    );
  }

  const settled = balance === 0;
  const theyOweYou = balance > 0;
  const balanceColor = settled
    ? AppColors.textMuted
    : theyOweYou
      ? AppColors.income
      : AppColors.expense;
  const balanceLabel = settled
    ? 'Settled up'
    : theyOweYou
      ? 'Owes you'
      : 'You owe';

  return (
    <View style={styles.container}>
      <ScrollView
        refreshControl={<RefreshControl refreshing={loading} onRefresh={reload} />}
        contentContainerStyle={styles.content}>
        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>{balanceLabel}</Text>
          <Text style={[styles.balanceAmount, { color: balanceColor }]}>
            {settled ? '—' : formatMoney(Math.abs(balance), currency)}
          </Text>
          {person.note ? <Text style={styles.note}>{person.note}</Text> : null}
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>History</Text>
          <Pressable onPress={handleDeletePerson}>
            <Text style={styles.deleteLink}>Delete person</Text>
          </Pressable>
        </View>

        {entries.length === 0 ? (
          <EmptyState
            title="No entries yet"
            message="Record money borrowed, lent, or repaid"
            icon="📋"
          />
        ) : (
          <View style={styles.list}>
            {entries.map((entry) => (
              <DebtEntryRow
                key={entry.id}
                entry={entry}
                currency={currency}
                onLongPress={() => handleDeleteEntry(entry.id)}
              />
            ))}
          </View>
        )}
      </ScrollView>

      <Fab
        onPress={() =>
          router.push({ pathname: '/person/entry-add', params: { personId: String(personId) } })
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.background,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notFound: {
    color: AppColors.textSecondary,
    fontSize: 16,
  },
  content: {
    paddingBottom: 100,
  },
  balanceCard: {
    margin: 16,
    padding: 24,
    backgroundColor: AppColors.card,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: AppColors.border,
  },
  balanceLabel: {
    fontSize: 14,
    color: AppColors.textSecondary,
    marginBottom: 6,
  },
  balanceAmount: {
    fontSize: 32,
    fontWeight: '700',
  },
  note: {
    marginTop: 10,
    fontSize: 14,
    color: AppColors.textMuted,
    textAlign: 'center',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: AppColors.text,
  },
  deleteLink: {
    fontSize: 14,
    color: AppColors.expense,
    fontWeight: '500',
  },
  list: {
    backgroundColor: AppColors.card,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: AppColors.border,
  },
});
