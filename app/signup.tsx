import React, { useContext, useState } from "react";
import { View, StyleSheet } from "react-native";
import { Button, TextInput, Text, useTheme } from "react-native-paper";
import { useRouter } from "expo-router";
import { AuthContext } from "@/utils/AuthContext";
import { API_URL } from "@/constants/url";

const SignUpScreen = () => {
  const router = useRouter();
  const theme = useTheme();
  const { userToken } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    licenseNumber: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (field: keyof typeof formData) => (text: string) => {
    setFormData((prev) => ({ ...prev, [field]: text }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_URL}/admin/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userToken}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        console.log("Registration error:", data);
        throw new Error(data.message || "Registration failed");
      }

      router.replace("/login");
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message || "An error occurred during registration");
      } else {
        setError("An unknown error occurred during registration");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text
        variant="headlineMedium"
        style={[styles.title, { color: theme.colors.primary }]}
      >
        Create an Account
      </Text>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <TextInput
        label="First Name"
        value={formData.firstName}
        onChangeText={handleChange("firstName")}
        mode="outlined"
        style={styles.input}
      />

      <TextInput
        label="Last Name"
        value={formData.lastName}
        onChangeText={handleChange("lastName")}
        mode="outlined"
        style={styles.input}
      />

      <TextInput
        label="Email"
        value={formData.email}
        onChangeText={handleChange("email")}
        mode="outlined"
        keyboardType="email-address"
        autoCapitalize="none"
        style={styles.input}
      />

      <TextInput
        label="Password"
        value={formData.password}
        onChangeText={handleChange("password")}
        mode="outlined"
        secureTextEntry
        style={styles.input}
      />

      <TextInput
        label="License Number"
        value={formData.licenseNumber}
        onChangeText={handleChange("licenseNumber")}
        mode="outlined"
        style={styles.input}
      />

      <Button
        mode="contained"
        onPress={handleSubmit}
        loading={loading}
        disabled={loading}
        style={styles.button}
        buttonColor="#2e7d32"
      >
        Sign Up
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  title: {
    textAlign: "center",
    marginBottom: 20,
    fontWeight: "bold",
  },
  input: {
    marginBottom: 15,
  },
  button: {
    marginTop: 10,
  },
  error: {
    color: "red",
    textAlign: "center",
    marginBottom: 15,
  },
});

export default SignUpScreen;
