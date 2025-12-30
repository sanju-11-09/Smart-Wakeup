import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
} from 'react-native';

export default function HistoryScreen() {
  const trips = [
    { destination: 'Chennai', status: 'Alert Triggered ✅' },
    { destination: 'Bangalore', status: 'Traffic Delay ⚠️' },
    { destination: 'Vellore', status: 'Normal Trip' },
  ];

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Trip History</Text>

        {trips.map((trip, index) => (
          <View key={index} style={styles.card}>
            <Text style={styles.text}>
              Destination: {trip.destination}
            </Text>
            <Text style={styles.text}>Status: {trip.status}</Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  container: {
    paddingVertical: 20,
    paddingBottom: 40,
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#000',
  },
  card: {
    width: '90%',
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 10,
    marginBottom: 12,
    elevation: 2,
  },
  text: {
    fontSize: 16,
    color: '#333',
  },
});
