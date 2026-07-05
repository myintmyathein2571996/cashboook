import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  RefreshControl,
  SectionList,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { EmptyState } from '@/src/components/EmptyState';
import { Fab } from '@/src/components/Fab';
import { TransactionRow } from '@/src/components/TransactionRow';
import { useRefresh } from '@/src/context/RefreshContext';
import { deleteTransaction } from '@/src/db/repositories/transactions';
import { AppColors } from '@/src/constants/theme';
import { useTransactions } from '@/src/hooks/useTransactions';
import { useSettings } from '@/src/hooks/useSettings';
import type { Transaction, TransactionType } from '@/src/types';
import { formatDisplayDate } from '@/src/utils/dates';

type Filter = 'all' | TransactionType;

export default function TransactionsScreen() {
  const [filter, setFilter] = useState<Filter>('all');
  const { transactions, loading, reload } = useTransactions(
    filter === 'all' ? undefined : filter
  );
  const { currency } = useSettings();
  const { refresh } = useRefresh();

  const sections = useMemo(() => {
    const grouped = new Map<string, Transaction[]>();
    for (const txn of transactions) {
      const key = txn.date;
      const list = grouped.get(key) ?? [];
      list.push(txn);
      grouped.set(key, list);
    }
    return Array.from(grouped.entries()).map(([date, data]) => ({
      title: formatDisplayDate(date),
      data,
    }));
  }, [transactions]);

  const handleDelete = (txn: Transaction) => {
    Alert.alert('Delete transaction', 'This cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await deleteTransaction(txn.id);
          refresh();
        },
      },
    ]);
  };

  if (!currency) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color={AppColors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.filters}>
        {(['all', 'income', 'expense'] as Filter[]).map((item) => (
          <Pressable
            key={item}
            style={[styles.filterChip, filter === item && styles.filterChipActive]}
            onPress={() => setFilter(item)}>
            <Text style={[styles.filterText, filter === item && styles.filterTextActive]}>
              {item === 'all' ? 'All' : item === 'income' ? 'Income' : 'Expense'}
            </Text>
          </Pressable>
        ))}
      </View>

      <SectionList
        sections={sections}
        keyExtractor={(item) => String(item.id)}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={reload} />}
        renderSectionHeader={({ section: { title } }) => (
          <Text style={styles.sectionHeader}>{title}</Text>
        )}
        renderItem={({ item }) => (
          <TransactionRow
            transaction={item}
            currency={currency}
            onPress={() => router.push(`/transaction/${item.id}`)}
            onLongPress={() => handleDelete(item)}
          />
        )}
        ListEmptyComponent={
          !loading ? (
            <EmptyState
              title="No transactions"
              message={
                filter === 'all'
                  ? 'Add income or expense to start tracking'
                  : `No ${filter} transactions yet`
              }
              icon="📝"
            />
          ) : null
        }
        contentContainerStyle={sections.length === 0 ? styles.emptyList : styles.list}
      />

      <Fab onPress={() => router.push('/quick-add')} />
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
  filters: {
    flexDirection: 'row',
    padding: 16,
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: AppColors.card,
    borderWidth: 1,
    borderColor: AppColors.border,
  },
  filterChipActive: {
    backgroundColor: AppColors.primaryLight,
    borderColor: AppColors.primary,
  },
  filterText: {
    fontSize: 14,
    color: AppColors.textSecondary,
    fontWeight: '500',
  },
  filterTextActive: {
    color: AppColors.primary,
    fontWeight: '600',
  },
  sectionHeader: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    fontSize: 13,
    fontWeight: '600',
    color: AppColors.textSecondary,
    backgroundColor: AppColors.background,
  },
  list: {
    paddingBottom: 100,
  },
  emptyList: {
    flexGrow: 1,
    paddingBottom: 100,
  },
});
