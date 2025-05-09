// screens/LoginScreen.tsx
import React, { useContext, useState } from "react";
import { View, StyleSheet, Image, TouchableOpacity, Text } from "react-native";
import { TextInput, Button, useTheme, IconButton } from "react-native-paper";
import { AuthContext } from "../utils/AuthContext";
import { useRouter } from "expo-router";

const LoginScreen: React.FC = () => {
  const { logIn } = useContext(AuthContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const router = useRouter();
  const theme = useTheme();

  const handleLogin = async () => {
    try {
      if (!email || !password) {
        setErrorMsg("Email and password are required.");
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setErrorMsg("Please enter a valid email.");
        return;
      }
      await logIn({ email, password });
    } catch (err: any) {
      setErrorMsg(err.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>TrashMap</Text>
      <Text style={styles.subtitle}>DELIVERY SYSTEM</Text>

      <Text style={styles.loginText}>Login to your account</Text>

      <TextInput
        label="Email"
        value={email}
        mode="outlined"
        onChangeText={setEmail}
        left={<TextInput.Icon icon="email" />}
        style={styles.input}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        label="Password"
        value={password}
        mode="outlined"
        onChangeText={setPassword}
        left={<TextInput.Icon icon="lock" />}
        secureTextEntry
        style={styles.input}
      />

      <TouchableOpacity onPress={() => console.log("Forgot password?")}>
        <Text style={styles.forgotText}>Forgot password?</Text>
      </TouchableOpacity>

      {errorMsg ? <Text style={styles.errorText}>{errorMsg}</Text> : null}

      <Button
        mode="contained"
        onPress={handleLogin}
        style={styles.loginButton}
        labelStyle={{ fontWeight: "bold" }}
      >
        Login
      </Button>

      <Text style={styles.orText}>— Or Login with —</Text>

      <View style={styles.socialContainer}>
        <IconButton icon="google" size={30} onPress={() => {}} />
        <IconButton icon="facebook" size={30} onPress={() => {}} />
        <IconButton icon="twitter" size={30} onPress={() => {}} />
      </View>

      <Text style={styles.signupText}>
        Don’t have an account?{" "}
        <Text
          style={{ color: theme.colors.primary }}
          onPress={() => router.replace("/signup")}
        >
          Sign Up
        </Text>
      </Text>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 25,
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  backButton: {
    position: "absolute",
    top: 30,
    left: 0,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#2e7d32", // green
    textAlign: "center",
    marginBottom: 0,
  },
  subtitle: {
    fontSize: 14,
    color: "#888",
    textAlign: "center",
    marginBottom: 40,
  },
  loginText: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 16,
  },
  input: {
    marginBottom: 16,
  },
  forgotText: {
    color: "#2e7d32",
    alignSelf: "flex-end",
    marginBottom: 20,
  },
  loginButton: {
    backgroundColor: "#2e7d32",
    marginBottom: 20,
    paddingVertical: 6,
    borderRadius: 10,
  },
  orText: {
    textAlign: "center",
    marginBottom: 12,
    color: "#666",
  },
  socialContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 30,
  },
  signupText: {
    textAlign: "center",
    color: "#444",
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginBottom: 10,
  },
});
