import { router } from 'expo-router';
import {
  ActivityIndicator,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { BalanceCard, SummaryRow } from '@/src/components/BalanceCard';
import { EmptyState } from '@/src/components/EmptyState';
import { Fab } from '@/src/components/Fab';
import { TransactionRow } from '@/src/components/TransactionRow';
import { AppColors } from '@/src/constants/theme';
import { useDashboard } from '@/src/hooks/useTransactions';
import { useSettings } from '@/src/hooks/useSettings';

export default function HomeScreen() {
  const { summary, recent, loading, reload } = useDashboard();
  const { currency } = useSettings();

  if (!currency) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color={AppColors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={reload} />}>
        <BalanceCard
          label="Total Balance"
          amount={summary?.totalBalance ?? 0}
          currency={currency}
        />

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>This Month</Text>
          <View style={styles.card}>
            <SummaryRow
              label="Income"
              amount={summary?.monthIncome ?? 0}
              currency={currency}
              variant="income"
            />
            <SummaryRow
              label="Expense"
              amount={summary?.monthExpense ?? 0}
              currency={currency}
              variant="expense"
            />
            <View style={styles.divider} />
            <SummaryRow
              label="Net"
              amount={summary?.monthNet ?? 0}
              currency={currency}
            />
          </View>
        </View>

        {(summary?.totalYouOwe ?? 0) > 0 || (summary?.totalOwedToYou ?? 0) > 0 ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Debts</Text>
            <View style={styles.card}>
              {(summary?.totalYouOwe ?? 0) > 0 && (
                <SummaryRow
                  label="You owe"
                  amount={summary?.totalYouOwe ?? 0}
                  currency={currency}
                  variant="expense"
                  onPress={() => router.push('/(tabs)/people')}
                />
              )}
              {(summary?.totalOwedToYou ?? 0) > 0 && (
                <SummaryRow
                  label="Owed to you"
                  amount={summary?.totalOwedToYou ?? 0}
                  currency={currency}
                  variant="income"
                  onPress={() => router.push('/(tabs)/people')}
                />
              )}
            </View>
          </View>
        ) : null}

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent</Text>
            {recent.length > 0 && (
              <Pressable onPress={() => router.push('/(tabs)/transactions')}>
                <Text style={styles.seeAll}>See all</Text>
              </Pressable>
            )}
          </View>
          {recent.length === 0 ? (
            <View style={styles.card}>
              <EmptyState
                title="No transactions yet"
                message="Tap + to add your first income or expense"
                icon="💰"
              />
            </View>
          ) : (
            <View style={styles.listCard}>
              {recent.map((txn) => (
                <TransactionRow
                  key={txn.id}
                  transaction={txn}
                  currency={currency}
                  onPress={() => router.push(`/transaction/${txn.id}`)}
                />
              ))}
            </View>
          )}
        </View>
      </ScrollView>

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
    backgroundColor: AppColors.background,
  },
  content: {
    padding: 16,
    paddingBottom: 100,
  },
  section: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: AppColors.text,
    marginBottom: 10,
  },
  seeAll: {
    fontSize: 14,
    color: AppColors.primary,
    fontWeight: '500',
    marginBottom: 10,
  },
  card: {
    backgroundColor: AppColors.card,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: AppColors.border,
  },
  listCard: {
    backgroundColor: AppColors.card,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: AppColors.border,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: AppColors.border,
  },
});
