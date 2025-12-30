import { View, Text, StyleSheet, TextInput, Keyboard } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';

export default function TripSetupScreen() {
  const [destination, setDestination] = useState('');
  const [buffer, setBuffer] = useState<number | null>(null);
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Trip Setup</Text>

        <TextInput
          placeholder="Enter destination"
          placeholderTextColor="#888"
          style={styles.input}
          value={destination}
          onChangeText={setDestination}
        />

        <Text style={styles.preview}>Destination: {destination}</Text>

        <Text style={styles.label}>Alert Before Arrival</Text>

        <View style={styles.bufferRow}>
          {[10, 20, 30].map((min) => (
            <Text
              key={min}
              style={[
                styles.bufferButton,
                buffer === min && styles.bufferButtonSelected,
              ]}
              onPress={() => setBuffer(min)}
            >
              {min} min
            </Text>
          ))}
        </View>

        {buffer !== null && (
          <Text style={styles.preview}>Selected: {buffer} min</Text>
        )}

        <Text
          style={styles.startButton}
          onPress={() => {
            if (!destination) {
              alert('Please enter destination');
              return;
            }
            if (buffer === null) {
              alert('Please select alert time');
              return;
            }

            Keyboard.dismiss();

            router.push({
              pathname: '/status',
              params: { destination, buffer },
            });
          }}
        >
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
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 14,
    elevation: 5,
  },

  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
  },

  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginTop: 20,
    fontSize: 16,
    color: '#000',
  },

  preview: {
    marginTop: 15,
    fontSize: 16,
    color: '#333',
  },

  label: {
    marginTop: 30,
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },

  bufferRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },

  bufferButton: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginHorizontal: 5,
    color: '#000',
  },

  bufferButtonSelected: {
    backgroundColor: '#cce5ff',
    borderColor: '#3399ff',
  },

  startButton: {
    marginTop: 40,
    backgroundColor: '#3399ff',
    paddingVertical: 14,
    borderRadius: 10,
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
