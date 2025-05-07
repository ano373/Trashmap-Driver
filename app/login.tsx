// screens/LoginScreen.tsx
import React, { useContext, useState } from "react";
import { View, StyleSheet } from "react-native";
import { TextInput, Button, Snackbar, Title } from "react-native-paper";
import { AuthContext } from "../utils/AuthContext";

const LoginScreen: React.FC = () => {
  const { logIn } = useContext(AuthContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleLogin = async () => {
    try {
      await logIn({ email, password });
    } catch (err: any) {
      setErrorMsg(err.message);
    }
  };

  return (
    <View style={styles.container}>
      <Title style={styles.title}>Sign In</Title>
      <TextInput
        label="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        style={styles.input}
      />
      <TextInput
        label="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />
      <Button mode="contained" onPress={handleLogin} style={styles.button}>
        Login
      </Button>

      <Snackbar
        visible={!!errorMsg}
        onDismiss={() => setErrorMsg("")}
        duration={3000}
      >
        {errorMsg}
      </Snackbar>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  title: {
    marginBottom: 20,
    alignSelf: "center",
  },
  input: {
    marginBottom: 15,
  },
  button: {
    marginTop: 10,
  },
});
