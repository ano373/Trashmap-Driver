import React, { useEffect, useRef, useState } from "react";
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import { TextInput, IconButton, useTheme } from "react-native-paper";
import { MaterialIcons } from "@expo/vector-icons";

interface LocationSearchBarProps {
  onSourceChange: (text: string) => void;
  onDestinationChange: (text: string) => void;
  onSourceSelect: (coords: { lat: string; lon: string }) => void;
  onDestinationSelect: (coords: { lat: string; lon: string }) => void;
}

type GeocodeResult = {
  display_name: string;
  lat: string;
  lon: string;
};

const LocationSearchBar: React.FC<LocationSearchBarProps> = ({
  onSourceChange,
  onDestinationChange,
  onSourceSelect,
  onDestinationSelect,
}) => {
  const { colors } = useTheme();
  const [sourceQuery, setSourceQuery] = useState("");
  const [destinationQuery, setDestinationQuery] = useState("");
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);
  const [sourceResults, setSourceResults] = useState<GeocodeResult[]>([]);
  const [destinationResults, setDestinationResults] = useState<GeocodeResult[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(false);

  const handleGeocode = async (
    text: string,
    type: "source" | "destination"
  ) => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
          text
        )}&format=json&limit=5&viewbox=25.0,22.0,36.0,31.6&bounded=1`,
        {
          headers: {
            "User-Agent": "YourApp/1.0 (your@email.com)",
          },
        }
      );

      if (!response.ok) throw new Error("Network response was not ok");
      const data: GeocodeResult[] = await response.json();
      if (type === "source") {
        setSourceResults(data);
      } else {
        setDestinationResults(data);
      }
    } catch (error) {
      console.error(`Error during ${type} geocoding:`, error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTextChange = (text: string, type: "source" | "destination") => {
    if (type === "source") {
      setSourceQuery(text);
      onSourceChange(text);
    } else {
      setDestinationQuery(text);
      onDestinationChange(text);
    }

    // if (debounceTimer.current) clearTimeout(debounceTimer.current);

    // debounceTimer.current = setTimeout(() => {
    //   if (text.trim().length > 0) {
    handleGeocode(text, type);
    //   } else {
    //     type === "source" ? setSourceResults([]) : setDestinationResults([]);
    //   }
    // }, 500);
  };

  const handleSuggestionSelect = (
    result: GeocodeResult,
    type: "source" | "destination"
  ) => {
    if (type === "source") {
      setSourceQuery(result.display_name);
      onSourceChange(result.display_name);
      onSourceSelect({ lat: result.lat, lon: result.lon });
      setSourceResults([]);
    } else {
      setDestinationQuery(result.display_name);
      onDestinationChange(result.display_name);
      onDestinationSelect({ lat: result.lat, lon: result.lon });
      setDestinationResults([]);
    }
  };

  const handleSwap = () => {
    const temp = sourceQuery;
    setSourceQuery(destinationQuery);
    setDestinationQuery(temp);
    setSourceResults([]);
    setDestinationResults([]);
    onSourceChange(destinationQuery);
    onDestinationChange(temp);
  };

  useEffect(() => {
    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, []);

  return (
    <View style={styles.container}>
      <View
        style={[styles.inputContainer, { backgroundColor: colors.surface }]}
      >
        <View style={styles.inputsColumn}>
          <View style={styles.inputWrapper}>
            <MaterialIcons
              name="circle"
              size={20}
              color={colors.primary}
              style={styles.icon}
            />
            <View style={styles.inputAndSuggestions}>
              <TextInput
                placeholder="From"
                value={sourceQuery}
                onChangeText={(text) => handleTextChange(text, "source")}
                style={styles.input}
                onBlur={() => setSourceResults([])}
                right={
                  isLoading ? (
                    <TextInput.Icon name="clock" />
                  ) : sourceQuery ? (
                    <TextInput.Icon
                      name="close"
                      onPress={() => handleTextChange("", "source")}
                    />
                  ) : null
                }
              />
              {sourceResults.length > 0 && (
                <View
                  style={[
                    styles.suggestionsContainer,
                    { backgroundColor: colors.surface },
                  ]}
                >
                  {sourceResults.map((result, index) => (
                    <TouchableOpacity
                      key={index}
                      style={styles.suggestionItem}
                      onPress={() => handleSuggestionSelect(result, "source")}
                    >
                      <MaterialIcons
                        name="location-on"
                        size={20}
                        color={colors.primary}
                      />
                      <Text
                        style={[styles.suggestionText, { color: colors.text }]}
                      >
                        {result.display_name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          </View>

          <View style={styles.inputWrapper}>
            <MaterialIcons
              name="flag"
              size={20}
              color={colors.primary}
              style={styles.icon}
            />
            <View style={styles.inputAndSuggestions}>
              <TextInput
                placeholder="To"
                value={destinationQuery}
                onChangeText={(text) => handleTextChange(text, "destination")}
                style={styles.input}
                onBlur={() => setDestinationResults([])}
                right={
                  isLoading ? (
                    <TextInput.Icon name="clock" />
                  ) : destinationQuery ? (
                    <TextInput.Icon
                      name="close"
                      onPress={() => handleTextChange("", "destination")}
                    />
                  ) : null
                }
              />
              {destinationResults.length > 0 && (
                <View
                  style={[
                    styles.suggestionsContainer,
                    { backgroundColor: colors.surface },
                  ]}
                >
                  {destinationResults.map((result, index) => (
                    <TouchableOpacity
                      key={index}
                      style={styles.suggestionItem}
                      onPress={() =>
                        handleSuggestionSelect(result, "destination")
                      }
                    >
                      <MaterialIcons
                        name="location-on"
                        size={20}
                        color={colors.primary}
                      />
                      <Text
                        style={[styles.suggestionText, { color: colors.text }]}
                      >
                        {result.display_name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          </View>
        </View>

        <IconButton
          icon="swap-vertical"
          size={24}
          onPress={handleSwap}
          style={[styles.swapButton, { backgroundColor: colors.surface }]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    width: "100%",
    alignSelf: "center",
    zIndex: 1,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    padding: 12,
    backgroundColor: "#fff",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },
  inputsColumn: {
    flex: 1,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 4,
  },
  icon: {
    marginRight: 10,
    color: "#888",
  },
  inputAndSuggestions: {
    flex: 1,
    position: "relative",
  },
  input: {
    flex: 1,
    backgroundColor: "transparent",
    fontSize: 16,
    height: 40,
    color: "#333",
    paddingVertical: 0,
  },
  swapButton: {
    backgroundColor: "#fff",
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: "#f0f0f0",
    marginLeft: 8,
  },
  suggestionsContainer: {
    position: "absolute",
    top: 40,
    left: 0,
    right: 0,
    borderRadius: 8,
    marginTop: 4,
    elevation: 2,
    zIndex: 2,
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },
  suggestionItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  suggestionText: {
    marginLeft: 8,
    fontSize: 14,
  },
});

export default LocationSearchBar;
