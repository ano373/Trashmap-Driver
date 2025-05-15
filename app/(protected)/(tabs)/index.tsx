import { AuthContext } from "@/utils/AuthContext";
import { Button } from "react-native-paper";
import React, { useContext, useEffect, useRef, useState } from "react";
import { StyleSheet, View } from "react-native";
import mapjson from "@/constants/mapjson.json";
import * as Location from "expo-location";
import { FAB, Provider as PaperProvider } from "react-native-paper";
import LocationSearchBar from "@/components/LocationSearchBar";
import RouteMap from "@/components/RouteMap";
import {
  MapView,
  Camera,
  ShapeSource,
  CircleLayer,
} from "@maplibre/maplibre-react-native";

export default function HomeScreen() {
  const authState = useContext(AuthContext);
  const handleLogout = () => {
    authState.logOut();
  };
  const cameraRef = useRef(null);
  const [userLocation, setUserLocation] = useState<number[] | null>(null);
  const [sourceText, setSource] = useState("");
  const [destinationText, setDestination] = useState("");
  const [sourceCoords, setSourceCoords] = useState<{
    lat: string;
    lon: string;
  } | null>(null);
  const [destinationCoords, setDestinationCoords] = useState<{
    lat: string;
    lon: string;
  } | null>(null);

  const handleSourceChange = (text: string) => {
    setSource(text);
  };

  const handleDestinationChange = (text: string) => {
    setDestination(text);
  };

  const handleSourceSelect = (coords: { lat: string; lon: string }) => {
    setSourceCoords(coords);
    console.log("Source coordinates selected:", coords);
  };

  const handleDestinationSelect = (coords: { lat: string; lon: string }) => {
    setDestinationCoords(coords);
    console.log("Destination coordinates selected:", coords);
  };
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
          {sourceCoords && destinationCoords && (
            <RouteMap
              sourcePoint={{
                latitude: parseFloat(sourceCoords.lat),
                longitude: parseFloat(sourceCoords.lon),
              }}
              destPoint={{
                latitude: parseFloat(destinationCoords.lat),
                longitude: parseFloat(destinationCoords.lon),
              }}
            />
          )}
        </MapView>

        <View style={styles.searchBarContainer}>
          <LocationSearchBar
            onSourceChange={handleSourceChange}
            onDestinationChange={handleDestinationChange}
            onSourceSelect={handleSourceSelect}
            onDestinationSelect={handleDestinationSelect}
          />
        </View>

        <FAB icon="crosshairs-gps" style={styles.fab} onPress={centerOnUser} />
        <Button
          mode="contained"
          onPress={handleLogout}
          style={{ marginTop: 5 }}
        >
          Logout
        </Button>
      </View>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
  },
  map: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  searchBarContainer: {
    position: "absolute",
    top: 0,
    left: 16,
    right: 16,
    zIndex: 1,
  },
  fab: {
    position: "absolute",
    right: 16,
    bottom: 70,
    zIndex: 1,
  },
});
