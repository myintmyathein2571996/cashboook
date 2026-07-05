import { router } from 'expo-router';
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';

import { EmptyState } from '@/src/components/EmptyState';
import { Fab } from '@/src/components/Fab';
import { PersonRow } from '@/src/components/PersonRow';
import { AppColors } from '@/src/constants/theme';
import { usePeople } from '@/src/hooks/usePeople';
import { useSettings } from '@/src/hooks/useSettings';

export default function PeopleScreen() {
  const { people, loading, reload } = usePeople();
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
        contentContainerStyle={people.length === 0 ? styles.emptyContent : styles.content}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={reload} />}>
        {people.length === 0 ? (
          <EmptyState
            title="No people yet"
            message="Add someone to track money you borrow or lend"
            icon="👥"
          />
        ) : (
          <View style={styles.list}>
            {people.map((person) => (
              <PersonRow
                key={person.id}
                person={person}
                currency={currency}
                onPress={() => router.push(`/person/${person.id}`)}
              />
            ))}
          </View>
        )}
      </ScrollView>

      <Fab onPress={() => router.push('/person/add')} />
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
  content: {
    paddingBottom: 100,
  },
  emptyContent: {
    flexGrow: 1,
    paddingBottom: 100,
  },
  list: {
    marginTop: 8,
    backgroundColor: AppColors.card,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: AppColors.border,
  },
});
