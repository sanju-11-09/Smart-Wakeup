import { View, Text, StyleSheet } from 'react-native';

export default function AlertBanner() {
  return (
    <View style={styles.banner}>
      <Text style={styles.icon}>⏰</Text>
      <Text style={styles.text}>
        Wake-up alert! Your destination is approaching.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    backgroundColor: '#FFE8D6',
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  icon: {
    fontSize: 22,
  },
  text: {
    color: '#7C2D12',
    fontWeight: '700',
    flex: 1,
  },
});
