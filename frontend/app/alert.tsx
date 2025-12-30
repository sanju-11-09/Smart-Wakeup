import { View, Text, StyleSheet, Vibration } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useEffect } from 'react';

export default function AlertScreen() {
  const router = useRouter();
  const { destination, buffer } = useLocalSearchParams();

  useEffect(() => {
    // Simulate loud alert + vibration
    Vibration.vibrate([500, 500, 500], true);

    return () => Vibration.cancel();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.alertTitle}>🚨 WAKE UP</Text>

      <Text style={styles.message}>
        You will reach your stop in
      </Text>

      <Text style={styles.time}>{buffer} minutes</Text>

      <Text style={styles.destination}>
        Destination: {destination}
      </Text>

      <Text
        style={styles.stopButton}
        onPress={() => {
          Vibration.cancel();
          router.back();
        }}
      >
        STOP ALARM
      </Text>

      <Text style={styles.note}>
        High-priority alert (user inactive)
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff3f3',
    padding: 20,
  },

  alertTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#cc0000',
    marginBottom: 20,
  },

  message: {
    fontSize: 18,
    color: '#333',
  },

  time: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#000',
    marginVertical: 10,
  },

  destination: {
    fontSize: 18,
    marginBottom: 40,
    color: '#333',
  },

  stopButton: {
    backgroundColor: '#cc0000',
    color: '#ffffff',
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 12,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },

  note: {
    marginTop: 20,
    fontSize: 14,
    color: '#555',
  },
});
