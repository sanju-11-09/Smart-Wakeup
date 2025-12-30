import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { startFakeJourney } from './services/fakebackend';
import MapView, { Marker } from 'react-native-maps';


export default function StatusScreen() {
  const { destination, buffer } = useLocalSearchParams();
  const router = useRouter();

  const [status, setStatus] = useState('Starting...');
  const [eta, setEta] = useState('Calculating...');
  const [haltType] = useState('Traffic Stop 🟡');
  const [haltDuration] = useState('1 min 20 sec');
  const [haltLocation] = useState('Main Road');
  const [routeWarning] = useState(true);
  const [updatedEta] = useState('52 min');

  useEffect(() => {
    const stop = startFakeJourney(({ status, eta }) => {
      setStatus(status);
      setEta(eta);
    });
    return stop;
  }, []);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        {routeWarning && (
          <View style={styles.warningBanner}>
            <Text style={styles.warningText}>⚠ Route Change Detected</Text>
            <Text style={styles.warningSub}>
              Updated ETA: {updatedEta}
            </Text>
          </View>

        )}

        <View style={styles.header}>
  <Text style={styles.headerTitle}>Journey Status</Text>
  <Text style={styles.headerSub}>Live travel monitoring</Text>
</View>


        <View style={styles.card}>
          <Text style={styles.cardTitle}>Trip Info</Text>
           <MapView
    style={styles.map}
    initialRegion={{
      latitude: 13.0827,       // Chennai (example)
      longitude: 80.2707,
      latitudeDelta: 0.1,
      longitudeDelta: 0.1,
    }}
  >
    <Marker
      coordinate={{ latitude: 13.0827, longitude: 80.2707 }}
      title="Current Location"
    />

    <Marker
      coordinate={{ latitude: 13.05, longitude: 80.25 }}
      title="Destination"
      pinColor="blue"
    />
  </MapView>
          <Text style={styles.text}>📍 Destination: {destination}</Text>
          <Text style={styles.text}>Alert Before: {buffer} min</Text>
        </View>

        <View style={styles.card}>
          <Text style={[styles.cardTitle, styles.primaryCardTitle]}>
  Live ETA
</Text>

          <Text style={styles.text}>⏱ Remaining ETA: {eta}</Text>

        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>System Mode</Text>
          <Text style={styles.text}>Tracking Mode: Hybrid</Text>
          <Text style={styles.text}>🔋Battery Mode: Optimized</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Movement</Text>
          <Text
  style={[
    styles.text,
    status === 'Moving'
      ? { color: '#28a745' }
      : { color: '#dc3545' },
  ]}
>
  🚗 Status: {status}
</Text>

          <Text style={styles.text}>Speed: 62 km/h</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Halt Detected</Text>
          <Text style={styles.text}>Type: {haltType}</Text>
          <Text style={styles.text}>Duration: {haltDuration}</Text>
          <Text style={styles.text}>Location: {haltLocation}</Text>
        </View>

        <Text
          style={styles.alertButton}
          onPress={() =>
            router.push({
              pathname: '/alert',
              params: { destination, buffer },
            })
          }
        >
          Simulate Wake-Up Alert
        </Text>

        <Text
          style={styles.historyLink}
          onPress={() => router.push('/history')}
        >
          View Trip History
        </Text>
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
    marginBottom: 15,
    color: '#000',
  },
  card: {
    width: '90%',
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 12,
    marginVertical: 8,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 6,
    color: '#000',
  },
  text: {
    fontSize: 16,
    color: '#333',
  },
  warningBanner: {
    width: '90%',
    backgroundColor: '#fff3cd',
    padding: 12,
    borderRadius: 10,
    marginBottom: 15,
  },
  warningText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#856404',
  },
  warningSub: {
    fontSize: 14,
    color: '#856404',
  },
  alertButton: {
    marginTop: 30,
    backgroundColor: '#cc0000',
    color: '#fff',
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 10,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  historyLink: {
    marginTop: 20,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#3399ff',
  },
  header: {
  width: '100%',
  paddingVertical: 20,
  alignItems: 'center',
  backgroundColor: '#3399ff',
  marginBottom: 15,
},
map: {
  width: '100%',
  height: 200,
  borderRadius: 10,
},


headerTitle: {
  fontSize: 26,
  fontWeight: 'bold',
  color: '#ffffff',
},

headerSub: {
  fontSize: 14,
  color: '#e6f2ff',
  marginTop: 4,
},
primaryCardTitle: {
  color: '#3399ff',
},


});
