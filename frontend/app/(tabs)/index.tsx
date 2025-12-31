import { View, Text, StyleSheet, TextInput, Keyboard } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import * as Location from 'expo-location';

export default function TripSetupScreen() {
  const [destination, setDestination] = useState('');
  const [buffer, setBuffer] = useState<number | null>(null);
  const router = useRouter();

  const startJourney = async () => {
  if (!destination) {
    alert('Please enter destination');
    return;
  }
  if (buffer === null) {
    alert('Please select alert time');
    return;
  }

  Keyboard.dismiss();

  try {
    // 🔹 Ask location permission
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      alert('Location permission denied');
      return;
    }

    // 🔹 Get real GPS
    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.High,
    });

    const { latitude, longitude } = location.coords;
    console.log('REAL GPS:', latitude, longitude);

    // 🔹 Call backend ONCE
    const response = await fetch(
      'http://10.205.206.222:8000/journey/start',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          destination,
          alert_before: buffer,
          origin_lat: latitude,
          origin_lng: longitude,
        }),
      }
    );

    const data = await response.json();
    console.log('Backend response:', data);

    // 🔹 Navigate to status screen with backend data
    router.push({
      pathname: '/status',
      params: {
        journeyData: JSON.stringify(data),
      },
    });

  } catch (err) {
    console.log('ERROR:', err);
    alert('Failed to start journey');
  }
};


  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Trip Setup</Text>

        <TextInput
          placeholder="Enter destination"
          style={styles.input}
          value={destination}
          onChangeText={setDestination}
        />

        <Text style={styles.label}>Alert Before Arrival</Text>

        <View style={styles.row}>
          {[10, 20, 30].map((m) => (
            <Text
              key={m}
              style={[
                styles.btn,
                buffer === m && styles.btnActive,
              ]}
              onPress={() => setBuffer(m)}
            >
              {m} min
            </Text>
          ))}
        </View>

        <Text style={styles.startBtn} onPress={startJourney}>
          Start Journey
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f2f2f2',
  },
  card: {
    width: '90%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 14,
    elevation: 5,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginTop: 20,
  },
  label: {
    marginTop: 20,
    fontSize: 16,
    fontWeight: '600',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  btn: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginHorizontal: 6,
    borderRadius: 6,
  },
  btnActive: {
    backgroundColor: '#cce5ff',
    borderColor: '#3399ff',
  },
  startBtn: {
    marginTop: 30,
    backgroundColor: '#3399ff',
    color: '#fff',
    padding: 14,
    borderRadius: 10,
    fontSize: 18,
    textAlign: 'center',
    fontWeight: 'bold',
  },
});
