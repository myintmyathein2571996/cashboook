import { Pressable, StyleSheet, Text } from 'react-native';

import { AppColors } from '@/src/constants/theme';

interface FabProps {
  onPress: () => void;
  label?: string;
}

export function Fab({ onPress, label = '+' }: FabProps) {
  return (
    <Pressable style={styles.fab} onPress={onPress}>
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: AppColors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  label: {
    fontSize: 28,
    color: '#fff',
    fontWeight: '400',
    marginTop: -2,
  },
});
