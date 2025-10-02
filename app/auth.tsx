import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { router } from "expo-router";
import { useAuth } from "@/contexts/AuthContext";
import { colors, commonStyles } from "@/styles/commonStyles";
import { Button } from "@/components/Button";
import { IconSymbol } from "@/components/IconSymbol";

export default function AuthScreen() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { login, register, isLoading } = useAuth();

  const handleSubmit = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    if (!isLogin) {
      if (!name) {
        Alert.alert("Error", "Please enter your name");
        return;
      }
      if (password !== confirmPassword) {
        Alert.alert("Error", "Passwords do not match");
        return;
      }
    }

    try {
      let success = false;
      if (isLogin) {
        success = await login(email, password);
      } else {
        success = await register(email, password, name);
      }

      if (success) {
        router.replace("/(tabs)");
      } else {
        Alert.alert(
          "Error",
          isLogin
            ? "Invalid email or password. Try: admin@example.com / password"
            : "Registration failed. Email might already exist."
        );
      }
    } catch (error) {
      console.log("Auth error:", error);
      Alert.alert("Error", "Something went wrong. Please try again.");
    }
  };

  return (
    <KeyboardAvoidingView
      style={commonStyles.wrapper}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <IconSymbol name="storefront" color={colors.primary} size={64} />
          <Text style={styles.title}>
            {isLogin ? "Welcome Back" : "Create Account"}
          </Text>
          <Text style={styles.subtitle}>
            {isLogin
              ? "Sign in to continue shopping"
              : "Join us to start shopping"}
          </Text>
        </View>

        <View style={styles.form}>
          {!isLogin && (
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Full Name</Text>
              <TextInput
                style={commonStyles.input}
                value={name}
                onChangeText={setName}
                placeholder="Enter your full name"
                placeholderTextColor={colors.grey}
                autoCapitalize="words"
              />
            </View>
          )}

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={commonStyles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="Enter your email"
              placeholderTextColor={colors.grey}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={commonStyles.input}
              value={password}
              onChangeText={setPassword}
              placeholder="Enter your password"
              placeholderTextColor={colors.grey}
              secureTextEntry
              autoCapitalize="none"
            />
          </View>

          {!isLogin && (
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Confirm Password</Text>
              <TextInput
                style={commonStyles.input}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="Confirm your password"
                placeholderTextColor={colors.grey}
                secureTextEntry
                autoCapitalize="none"
              />
            </View>
          )}

          <Button
            onPress={handleSubmit}
            loading={isLoading}
            style={styles.submitButton}
          >
            {isLogin ? "Sign In" : "Create Account"}
          </Button>

          <Button
            onPress={() => setIsLogin(!isLogin)}
            variant="outline"
            style={styles.switchButton}
          >
            {isLogin
              ? "Don't have an account? Sign Up"
              : "Already have an account? Sign In"}
          </Button>
        </View>

        {isLogin && (
          <View style={styles.demoCredentials}>
            <Text style={styles.demoTitle}>Demo Credentials:</Text>
            <Text style={styles.demoText}>
              Admin: admin@example.com / password
            </Text>
            <Text style={styles.demoText}>
              User: user@example.com / password
            </Text>
          </View>
        )}

        <Button
          onPress={() => router.back()}
          variant="ghost"
          style={styles.backButton}
        >
          Back to Shop
        </Button>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  header: {
    alignItems: "center",
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: colors.text,
    marginTop: 20,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.grey,
    textAlign: "center",
  },
  form: {
    width: "100%",
    maxWidth: 400,
    alignSelf: "center",
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 8,
  },
  submitButton: {
    marginTop: 20,
    marginBottom: 16,
  },
  switchButton: {
    marginBottom: 20,
  },
  demoCredentials: {
    backgroundColor: colors.backgroundAlt,
    padding: 16,
    borderRadius: 12,
    marginTop: 20,
    alignSelf: "center",
    width: "100%",
    maxWidth: 400,
  },
  demoTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 8,
  },
  demoText: {
    fontSize: 12,
    color: colors.grey,
    marginBottom: 4,
  },
  backButton: {
    marginTop: 20,
    alignSelf: "center",
  },
});
