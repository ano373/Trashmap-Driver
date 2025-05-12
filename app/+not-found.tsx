import { Link, Stack, useRouter } from "expo-router";
import { Pressable, Text, View, StyleSheet } from "react-native";

export default function NotFoundScreen() {
  const router = useRouter();

  return (
    <>
      <Stack.Screen options={{ title: "Oops!" }} />
      <View style={styles.container}>
        <Text style={styles.title}>404 - Page Not Found</Text>
        <Text style={styles.subtitle}>
          The page you're looking for doesn't exist.
        </Text>

        <Pressable onPress={() => router.back()} style={styles.link}>
          <Text style={styles.linkText}>← Go back</Text>
        </Pressable>

        <Link href="/" asChild>
          <Pressable style={styles.link}>
            <Text style={styles.linkText}>🏠 Go to home</Text>
          </Pressable>
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    gap: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 20,
  },
  link: {
    marginTop: 15,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
  },
  linkText: {
    fontSize: 16,
    color: "#2e78b7",
    fontWeight: "500",
  },
});
