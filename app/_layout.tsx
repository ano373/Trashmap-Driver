import { Stack } from "expo-router";
import React from "react";
import { StatusBar } from "react-native";
import { AuthProvider } from "../utils/AuthContext";
import { PaperProvider } from "react-native-paper";

export default function RootLayout() {
  return (
    <AuthProvider>
      <PaperProvider>
        <StatusBar />
        <Stack>
          <Stack.Screen
            name="(protected)"
            options={{ headerShown: false, animation: "none" }}
          />
          <Stack.Screen
            name="login"
            options={{
              animation: "none",
            }}
          />
        </Stack>
      </PaperProvider>
    </AuthProvider>
  );
}
