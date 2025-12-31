import MapView, { Marker } from 'react-native-maps';
import { StyleSheet } from 'react-native';

export default function MapSection({ origin, destination }: any) {
  return (
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
  );
}

const styles = StyleSheet.create({
  map: {
    width: '100%',
    height: 240,
  },
});
