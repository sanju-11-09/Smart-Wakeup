import { View, Text, StyleSheet } from 'react-native';

export default function MapSection() {
  return (
    <View style={styles.map}>
      <Text style={styles.text}>🗺️ Map available on mobile</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  map: {
    width: '100%',
    height: 240,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f3f3f3',
  },
  text: {
    color: '#666',
  },
});
