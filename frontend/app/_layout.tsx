import { SystemBars } from "react-native-edge-to-edge";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useFonts } from "expo-font";
import "react-native-reanimated";
import { Stack } from "expo-router";
import { DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { useColorScheme } from "react-native";
import { useEffect } from "react";
import * as SplashScreen from "expo-splash-screen";
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import { ProductProvider } from "@/contexts/ProductContext";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <ProductProvider>
          <CartProvider>
            <ThemeProvider value={DefaultTheme}>
              <SystemBars style="dark" />
              <Stack>
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen name="auth" options={{ headerShown: false }} />
                <Stack.Screen
                  name="product/[id]"
                  options={{ title: "Product Details" }}
                />
                <Stack.Screen name="checkout" options={{ title: "Checkout" }} />
                <Stack.Screen name="admin" options={{ headerShown: false }} />
              </Stack>
              {/* <StatusBar style="auto" /> */}
            </ThemeProvider>
          </CartProvider>
        </ProductProvider>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}
