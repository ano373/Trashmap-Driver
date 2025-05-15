import React from "react";
import { Button, View } from "react-native";
import useNotifications from "@/hooks/useNotifications";

export default function accountScreen() {
  const { sendHotWeatherNotification } = useNotifications();

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Button title="check weather" onPress={sendHotWeatherNotification} />
    </View>
  );
}
