import Constants from 'expo-constants';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { AppColors } from '@/src/constants/theme';
import { CURRENCIES } from '@/src/constants/currencies';
import { useSettings } from '@/src/hooks/useSettings';

export default function SettingsScreen() {
  const { currency, loading, updateCurrency } = useSettings();

  if (!currency || loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color={AppColors.primary} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.sectionTitle}>Currency</Text>
      <View style={styles.card}>
        {CURRENCIES.map((item, index) => {
          const selected = currency.code === item.code;
          return (
            <Pressable
              key={item.code}
              style={[styles.row, index < CURRENCIES.length - 1 && styles.rowBorder]}
              onPress={() => updateCurrency({ code: item.code, symbol: item.symbol })}>
              <View>
                <Text style={styles.currencyName}>{item.name}</Text>
                <Text style={styles.currencyCode}>
                  {item.code} · {item.symbol}
                </Text>
              </View>
              {selected && <Text style={styles.check}>✓</Text>}
            </Pressable>
          );
        })}
      </View>

      <Text style={styles.sectionTitle}>About</Text>
      <View style={styles.card}>
        <View style={styles.row}>
          <Text style={styles.aboutLabel}>App</Text>
          <Text style={styles.aboutValue}>CashBook</Text>
        </View>
        <View style={[styles.row, styles.rowBorder]}>
          <Text style={styles.aboutLabel}>Version</Text>
          <Text style={styles.aboutValue}>
            {Constants.expoConfig?.version ?? '1.0.0'}
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.aboutLabel}>Storage</Text>
          <Text style={styles.aboutValue}>Offline (on device)</Text>
        </View>
      </View>
    </ScrollView>
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
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: AppColors.textSecondary,
    marginBottom: 8,
    marginTop: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  card: {
    backgroundColor: AppColors.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: AppColors.border,
    overflow: 'hidden',
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  rowBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: AppColors.border,
  },
  currencyName: {
    fontSize: 16,
    fontWeight: '500',
    color: AppColors.text,
  },
  currencyCode: {
    fontSize: 13,
    color: AppColors.textMuted,
    marginTop: 2,
  },
  check: {
    fontSize: 18,
    color: AppColors.primary,
    fontWeight: '700',
  },
  aboutLabel: {
    fontSize: 15,
    color: AppColors.textSecondary,
  },
  aboutValue: {
    fontSize: 15,
    color: AppColors.text,
    fontWeight: '500',
  },
});
