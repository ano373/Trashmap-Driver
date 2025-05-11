import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, View, Platform } from "react-native";
import {
  MapView,
  Camera,
  ShapeSource,
  CircleLayer,
} from "@maplibre/maplibre-react-native";
import mapjson from "@/constants/mapjson.json";
import * as Location from "expo-location";
import { FAB, Provider as PaperProvider } from "react-native-paper";

export default function MapScreen() {
  const cameraRef = useRef(null);
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.warn("Location permission not granted");
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const coords = [location.coords.longitude, location.coords.latitude];
      setUserLocation(coords);
    })();
  }, []);

  const centerOnUser = () => {
    if (userLocation && cameraRef.current) {
      cameraRef.current.setCamera({
        centerCoordinate: userLocation,
        zoomLevel: 14,
        animationDuration: 1000,
      });
    }
  };

  return (
    <PaperProvider>
      <View style={styles.container}>
        <MapView style={styles.map} mapStyle={mapjson}>
          <Camera
            ref={cameraRef}
            zoomLevel={14}
            centerCoordinate={userLocation || [31, 31]}
          />

          {userLocation && (
            <ShapeSource
              id="userLocationCircle"
              shape={{
                type: "FeatureCollection",
                features: [
                  {
                    type: "Feature",
                    geometry: {
                      type: "Point",
                      coordinates: userLocation,
                    },
                    properties: null,
                  },
                ],
              }}
            >
              <CircleLayer
                id="userCircle"
                style={{
                  circleRadius: 8,
                  circleColor: "#007AFF",
                }}
              />
            </ShapeSource>
          )}
        </MapView>

        <FAB icon="crosshairs-gps" style={styles.fab} onPress={centerOnUser} />
      </View>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  fab: {
    position: "absolute",
    top: Platform.OS === "ios" ? 60 : 40,
    right: 16,
    backgroundColor: "#007AFF",
  },
});
