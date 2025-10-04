import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { router } from "expo-router";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { useProducts } from "@/contexts/ProductContext";
import { colors, commonStyles } from "@/styles/commonStyles";
import { Button } from "@/components/Button";
import { IconSymbol } from "@/components/IconSymbol";
import { Address, Order, OrderItem } from "@/types";
import { mockOrders } from "@/data/mockData";

export default function CheckoutScreen() {
  const { items, total, clearCart } = useCart();
  const { user } = useAuth();
  const { updateProduct } = useProducts();
  const [isProcessing, setIsProcessing] = useState(false);

  const [address, setAddress] = useState<Address>({
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "USA",
  });

  const handlePlaceOrder = async () => {
    // Validate address
    if (
      !address.street ||
      !address.city ||
      !address.state ||
      !address.zipCode
    ) {
      Alert.alert("Error", "Please fill in all address fields");
      return;
    }

    // Check stock availability
    for (const item of items) {
      if (item.quantity > item.product.stock) {
        Alert.alert(
          "Insufficient Stock",
          `${item.product.name} has only ${item.product.stock} items available`
        );
        return;
      }
    }

    setIsProcessing(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Create order
      const orderItems: OrderItem[] = items.map((item) => ({
        id: Date.now().toString() + Math.random(),
        productId: item.productId,
        product: item.product,
        quantity: item.quantity,
        price: item.product.price,
      }));

      const order: Order = {
        id: Date.now().toString(),
        userId: user!.id,
        items: orderItems,
        total,
        status: "pending",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        shippingAddress: address,
      };

      // Add to mock orders
      mockOrders.push(order);

      // Update product stock
      items.forEach((item) => {
        updateProduct(item.productId, {
          stock: item.product.stock - item.quantity,
        });
      });

      // Clear cart
      clearCart();

      Alert.alert(
        "Order Placed Successfully!",
        `Your order #${order.id} has been placed and will be processed soon.`,
        [
          {
            text: "View Orders",
            //onPress: () => router.replace("/(tabs)/orders"),
          },
          {
            text: "Continue Shopping",
            onPress: () => router.replace("/(tabs)"),
          },
        ]
      );
    } catch (error) {
      console.log("Checkout error:", error);
      Alert.alert("Error", "Failed to place order. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (items.length === 0) {
    return (
      <View style={[commonStyles.container, styles.emptyContainer]}>
        <IconSymbol name="cart" color={colors.grey} size={64} />
        <Text style={styles.emptyTitle}>Your cart is empty</Text>
        <Text style={styles.emptySubtitle}>Add some products to checkout</Text>
        <Button
          onPress={() => router.replace("/(tabs)")}
          style={styles.shopButton}
        >
          Start Shopping
        </Button>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={commonStyles.wrapper}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Order Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Summary</Text>
          {items.map((item) => (
            <View key={item.id} style={styles.orderItem}>
              <Text style={styles.itemName} numberOfLines={1}>
                {item.product.name}
              </Text>
              <Text style={styles.itemDetails}>
                {item.quantity} × ${item.product.price.toFixed(2)}
              </Text>
              <Text style={styles.itemTotal}>
                ${(item.quantity * item.product.price).toFixed(2)}
              </Text>
            </View>
          ))}

          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total:</Text>
            <Text style={styles.totalValue}>${total.toFixed(2)}</Text>
          </View>
        </View>

        {/* Shipping Address */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Shipping Address</Text>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Street Address</Text>
            <TextInput
              style={commonStyles.input}
              value={address.street}
              onChangeText={(text) =>
                setAddress((prev) => ({ ...prev, street: text }))
              }
              placeholder="123 Main Street"
              placeholderTextColor={colors.grey}
            />
          </View>

          <View style={styles.row}>
            <View style={[styles.inputContainer, styles.halfWidth]}>
              <Text style={styles.label}>City</Text>
              <TextInput
                style={commonStyles.input}
                value={address.city}
                onChangeText={(text) =>
                  setAddress((prev) => ({ ...prev, city: text }))
                }
                placeholder="New York"
                placeholderTextColor={colors.grey}
              />
            </View>

            <View style={[styles.inputContainer, styles.halfWidth]}>
              <Text style={styles.label}>State</Text>
              <TextInput
                style={commonStyles.input}
                value={address.state}
                onChangeText={(text) =>
                  setAddress((prev) => ({ ...prev, state: text }))
                }
                placeholder="NY"
                placeholderTextColor={colors.grey}
              />
            </View>
          </View>

          <View style={styles.row}>
            <View style={[styles.inputContainer, styles.halfWidth]}>
              <Text style={styles.label}>ZIP Code</Text>
              <TextInput
                style={commonStyles.input}
                value={address.zipCode}
                onChangeText={(text) =>
                  setAddress((prev) => ({ ...prev, zipCode: text }))
                }
                placeholder="10001"
                placeholderTextColor={colors.grey}
                keyboardType="numeric"
              />
            </View>

            <View style={[styles.inputContainer, styles.halfWidth]}>
              <Text style={styles.label}>Country</Text>
              <TextInput
                style={commonStyles.input}
                value={address.country}
                onChangeText={(text) =>
                  setAddress((prev) => ({ ...prev, country: text }))
                }
                placeholder="USA"
                placeholderTextColor={colors.grey}
              />
            </View>
          </View>
        </View>

        {/* Payment Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Method</Text>
          <View style={styles.paymentInfo}>
            <IconSymbol name="creditcard" color={colors.primary} size={24} />
            <Text style={styles.paymentText}>
              Mock Payment (No actual charge)
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Place Order Button */}
      <View style={styles.bottomActions}>
        <Button
          onPress={handlePlaceOrder}
          loading={isProcessing}
          style={styles.placeOrderButton}
        >
          {isProcessing
            ? "Processing..."
            : `Place Order - $${total.toFixed(2)}`}
        </Button>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  section: {
    backgroundColor: colors.card,
    margin: 16,
    padding: 20,
    borderRadius: 12,
    ...commonStyles.shadow,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 16,
  },
  orderItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  itemName: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
  },
  itemDetails: {
    fontSize: 14,
    color: colors.grey,
    marginHorizontal: 12,
  },
  itemTotal: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
    minWidth: 60,
    textAlign: "right",
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 16,
    marginTop: 16,
    borderTopWidth: 2,
    borderTopColor: colors.border,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.text,
  },
  totalValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.primary,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 8,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  halfWidth: {
    width: "48%",
  },
  paymentInfo: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: colors.backgroundAlt,
    borderRadius: 8,
  },
  paymentText: {
    fontSize: 16,
    color: colors.text,
    marginLeft: 12,
  },
  bottomActions: {
    backgroundColor: colors.card,
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    ...commonStyles.shadow,
  },
  placeOrderButton: {
    width: "100%",
  },
  emptyContainer: {
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.text,
    marginTop: 20,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: colors.grey,
    textAlign: "center",
    marginBottom: 32,
  },
  shopButton: {
    width: "100%",
    maxWidth: 200,
  },
});
