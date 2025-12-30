import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import MapView, { Marker } from 'react-native-maps';

export default function StatusScreen() {
  const { journeyData } = useLocalSearchParams();

  const data = journeyData
    ? JSON.parse(journeyData as string)
    : null;

  if (!data) {
    return (
      <SafeAreaView style={styles.safe}>
        <Text style={{ margin: 20 }}>Loading...</Text>
      </SafeAreaView>
    );
  }

  const origin = data.origin;
  const destination = data.destination_coords;

  return (
    <SafeAreaView style={styles.safe}>
      {/* 🗺️ MAP */}
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: origin.lat,
          longitude: origin.lng,
          latitudeDelta: 3,
          longitudeDelta: 3,
        }}
      >
        <Marker
          coordinate={{ latitude: origin.lat, longitude: origin.lng }}
          title="Your Location"
          pinColor="green"
        />
        <Marker
          coordinate={{
            latitude: destination.lat,
            longitude: destination.lng,
          }}
          title="Destination"
          pinColor="blue"
        />
      </MapView>

      {/* 📄 DETAILS */}
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.card}>
          <Text style={styles.title}>Journey Status</Text>
          <Text>Destination: {data.trip.destination}</Text>
          <Text>Alert Before: {data.trip.alert_before} min</Text>
        </View>

        <View style={styles.card}>
          <Text>ETA: {data.live_eta.eta_min} min</Text>
          <Text>Distance: {data.live_eta.distance_km} km</Text>
        </View>

        <View style={styles.card}>
          <Text>Status: {data.movement.status}</Text>
          <Text>Speed: {data.movement.speed} km/h</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#fff',
  },
  map: {
    width: '100%',
    height: 240,
  },
  container: {
    alignItems: 'center',
    paddingBottom: 40,
  },
  card: {
    width: '90%',
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 12,
    marginVertical: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});
