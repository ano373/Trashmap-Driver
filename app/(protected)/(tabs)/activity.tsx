import { StyleSheet, View, Text } from "react-native";
import { Camera, MapView } from "@maplibre/maplibre-react-native";
import mapjson from "@/constants/mapjson.json";
export default function ActivityScreen() {
  return (
    <View style={styles.container}>
      <MapView style={{ flex: 1 }} mapStyle={mapjson}>
        <Camera
          centerCoordinate={[31.2357, 30.0444]} // [longitude, latitude]
          zoomLevel={11}
          animationDuration={0}
        />
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
});
