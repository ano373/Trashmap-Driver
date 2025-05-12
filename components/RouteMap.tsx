import React, { useState, useEffect } from "react";
import { StyleSheet, View } from "react-native";
import {
  Callout,
  Camera,
  LineLayer,
  PointAnnotation,
  ShapeSource,
} from "@maplibre/maplibre-react-native";

interface RouteMapProps {
  sourcePoint: { latitude: number; longitude: number };
  destPoint: { latitude: number; longitude: number };
}

const RouteMap = ({ sourcePoint, destPoint }: RouteMapProps) => {
  const [routeCoordinates, setRouteCoordinates] = useState<[number, number][]>(
    []
  );

  useEffect(() => {
    fetchRoute();
  }, [sourcePoint, destPoint]);

  const fetchRoute = async () => {
    try {
      const response = await fetch(
        `http://router.project-osrm.org/route/v1/driving/${sourcePoint.longitude},${sourcePoint.latitude};${destPoint.longitude},${destPoint.latitude}?overview=full&geometries=geojson`
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP Error ${response.status}: ${errorText}`);
      }

      const json = await response.json();

      if (json.routes?.[0]) {
        setRouteCoordinates(json.routes[0].geometry.coordinates);
      }
    } catch (error) {
      console.error("Error fetching route:", error);
    }
  };

  return (
    <>
      <Camera
        zoomLevel={12}
        centerCoordinate={[
          (sourcePoint.longitude + destPoint.longitude) / 2,
          (sourcePoint.latitude + destPoint.latitude) / 2,
        ]}
        animationDuration={0}
      />

      <PointAnnotation
        id="sourcePoint"
        coordinate={[sourcePoint.longitude, sourcePoint.latitude]}
      >
        <View style={styles.marker}>
          <View style={[styles.markerInner, { backgroundColor: "blue" }]} />
        </View>
        <Callout title="Start Point" />
      </PointAnnotation>

      <PointAnnotation
        id="destPoint"
        coordinate={[destPoint.longitude, destPoint.latitude]}
      >
        <View style={styles.marker}>
          <View style={[styles.markerInner, { backgroundColor: "red" }]} />
        </View>
        <Callout title="Destination" />
      </PointAnnotation>

      {routeCoordinates.length > 0 && (
        <ShapeSource
          id="routeSource"
          shape={{
            type: "Feature",
            properties: {},
            geometry: {
              type: "LineString",
              coordinates: routeCoordinates,
            },
          }}
        >
          <LineLayer
            id="routeLine"
            style={{
              lineColor: "#000",
              lineWidth: 3,
              lineCap: "round",
              lineJoin: "round",
            }}
          />
        </ShapeSource>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  marker: {
    height: 24,
    width: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  markerInner: {
    height: 16,
    width: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "white",
  },
});

export default RouteMap;
