import { AuthContext } from "@/utils/AuthContext";
import React, { useContext } from "react";
import { View, Text } from "react-native";
import { Button } from "react-native-paper";
import { MapView } from "@maplibre/maplibre-react-native";

export default function HomeScreen() {
  const authState = useContext(AuthContext);
  const handleLogout = () => {
    authState.logOut();
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Home Screen</Text>
      
      <Button mode="contained" onPress={handleLogout} style={{ marginTop: 20 }}>
        Logout
      </Button>
    </View>
  );
}
