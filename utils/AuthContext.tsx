import * as SecureStore from "expo-secure-store";
import { SplashScreen, useRouter } from "expo-router";
import { createContext, PropsWithChildren, useEffect, useState } from "react";
import { API_URL } from "@/constants/url";

SplashScreen.preventAutoHideAsync();

type AuthState = {
  isLoggedIn: boolean;
  isReady: boolean;
  userToken: string | null;
  logIn: (credentials: { email: string; password: string }) => Promise<void>;
  logOut: () => void;
};

type AuthRequest = {
  email: string;
  password: string;
};

type AuthSuccessResponse = {
  data: {
    jwt: string;
  };
};

const authStorageKey = "auth-key";
const JWT_KEY = "user-token";

export const AuthContext = createContext<AuthState>({
  isLoggedIn: false,
  isReady: false,
  userToken: null,
  logIn: async () => {},
  logOut: () => {},
});

export function AuthProvider({ children }: PropsWithChildren) {
  const [isReady, setIsReady] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userToken, setUserToken] = useState<string | null>(null);
  const router = useRouter();

  const storeAuthState = async (newState: {
    isLoggedIn: boolean;
    userToken?: string | null;
  }) => {
    try {
      const jsonValue = JSON.stringify(newState);
      await SecureStore.setItemAsync(authStorageKey, jsonValue);
      if (newState.userToken !== undefined) {
        if (newState.userToken) {
          await SecureStore.setItemAsync(JWT_KEY, newState.userToken);
        } else {
          await SecureStore.deleteItemAsync(JWT_KEY);
        }
      }
    } catch (error) {
      console.log("Error saving auth state", error);
    }
  };

  const logIn = async ({ email, password }: AuthRequest) => {
    try {
      const res = await fetch(`${API_URL}/auth/authenticate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Login failed");
      }

      const json: AuthSuccessResponse = await res.json();
      const token = json.data.jwt;

      setIsLoggedIn(true);
      setUserToken(token);
      await storeAuthState({ isLoggedIn: true, userToken: token });
      router.replace("/");
    } catch (error) {
      console.log("Login error:", error);
      throw error;
    }
  };

  const logOut = () => {
    setIsLoggedIn(false);
    // setUserToken(null);
    // storeAuthState({ isLoggedIn: false, userToken: null });
    router.replace("/login");
  };

  useEffect(() => {
    const getAuthFromStorage = async () => {
      try {
        const value = await SecureStore.getItemAsync(authStorageKey);
        const token = await SecureStore.getItemAsync(JWT_KEY);

        if (value !== null) {
          const auth = JSON.parse(value);
          setIsLoggedIn(auth.isLoggedIn);
        }

        if (token) {
          setUserToken(token);
        }
      } catch (error) {
        console.log("Error fetching from storage", error);
      }
      setIsReady(true);
    };
    getAuthFromStorage();
  }, []);

  useEffect(() => {
    if (isReady) {
      SplashScreen.hideAsync();
    }
  }, [isReady]);

  return (
    <AuthContext.Provider
      value={{
        isReady,
        isLoggedIn,
        userToken,
        logIn,
        logOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
