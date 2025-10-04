import React from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  Pressable,
  Alert,
} from "react-native";
import { router } from "expo-router";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { colors, commonStyles } from "@/styles/commonStyles";
import { Button } from "@/components/Button";
import { IconSymbol } from "@/components/IconSymbol";
import { CartItem } from "@/types";

export default function CartScreen() {
  const { items, total, itemCount, updateQuantity, removeFromCart } = useCart();
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return (
      <View style={[commonStyles.container, styles.emptyContainer]}>
        <IconSymbol name="cart" color={colors.grey} size={64} />
        <Text style={styles.emptyTitle}>Login Required</Text>
        <Text style={styles.emptySubtitle}>Please login to view your cart</Text>
        <Button onPress={() => router.push("/auth")} style={styles.loginButton}>
          Login
        </Button>
      </View>
    );
  }

  if (items.length === 0) {
    return (
      <View style={[commonStyles.container, styles.emptyContainer]}>
        <IconSymbol name="cart" color={colors.grey} size={64} />
        <Text style={styles.emptyTitle}>Your cart is empty</Text>
        <Text style={styles.emptySubtitle}>
          Add some products to get started
        </Text>
        <Button
          onPress={() => router.push("/(tabs)")}
          style={styles.shopButton}
        >
          Start Shopping
        </Button>
      </View>
    );
  }

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      Alert.alert(
        "Remove Item",
        "Are you sure you want to remove this item from your cart?",
        [
          { text: "Cancel", style: "cancel" },
          { text: "Remove", onPress: () => removeFromCart(productId) },
        ]
      );
    } else {
      updateQuantity(productId, newQuantity);
    }
  };

  const renderCartItem = (item: CartItem) => (
    <View key={item.id} style={styles.cartItem}>
      <Image source={{ uri: item.product.image }} style={styles.itemImage} />

      <View style={styles.itemDetails}>
        <Text style={styles.itemName} numberOfLines={2}>
          {item.product.name}
        </Text>
        <Text style={styles.itemPrice}>${item.product.price.toFixed(2)}</Text>

        <View style={styles.quantityContainer}>
          <Pressable
            onPress={() =>
              handleQuantityChange(item.productId, item.quantity - 1)
            }
            style={styles.quantityButton}
          >
            <IconSymbol name="minus" color={colors.primary} size={16} />
          </Pressable>

          <Text style={styles.quantityText}>{item.quantity}</Text>

          <Pressable
            onPress={() =>
              handleQuantityChange(item.productId, item.quantity + 1)
            }
            style={styles.quantityButton}
            disabled={item.quantity >= item.product.stock}
          >
            <IconSymbol
              name="plus"
              color={
                item.quantity >= item.product.stock
                  ? colors.grey
                  : colors.primary
              }
              size={16}
            />
          </Pressable>
        </View>
      </View>

      <View style={styles.itemActions}>
        <Text style={styles.itemTotal}>
          ${(item.product.price * item.quantity).toFixed(2)}
        </Text>
        <Pressable
          onPress={() => removeFromCart(item.productId)}
          style={styles.removeButton}
        >
          <IconSymbol name="trash" color={colors.error} size={20} />
        </Pressable>
      </View>
    </View>
  );

  return (
    <View style={commonStyles.wrapper}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Shopping Cart</Text>
          <Text style={styles.itemCount}>{itemCount} items</Text>
        </View>

        <View style={styles.cartItems}>{items.map(renderCartItem)}</View>
      </ScrollView>

      {/* Cart Summary */}
      <View style={styles.cartSummary}>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Subtotal:</Text>
          <Text style={styles.summaryValue}>${total.toFixed(2)}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Shipping:</Text>
          <Text style={styles.summaryValue}>Free</Text>
        </View>
        <View style={[styles.summaryRow, styles.totalRow]}>
          <Text style={styles.totalLabel}>Total:</Text>
          <Text style={styles.totalValue}>${total.toFixed(2)}</Text>
        </View>

        <Button
          onPress={() => router.push("/checkout")}
          style={styles.checkoutButton}
        >
          Proceed to Checkout
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: colors.text,
  },
  itemCount: {
    fontSize: 16,
    color: colors.grey,
  },
  cartItems: {
    paddingHorizontal: 20,
  },
  cartItem: {
    flexDirection: "row",
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    ...commonStyles.shadow,
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    resizeMode: "cover",
  },
  itemDetails: {
    flex: 1,
    marginLeft: 16,
    justifyContent: "space-between",
  },
  itemName: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 14,
    color: colors.grey,
    marginBottom: 8,
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  quantityButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.backgroundAlt,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.border,
  },
  quantityText: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
    marginHorizontal: 16,
    minWidth: 24,
    textAlign: "center",
  },
  itemActions: {
    alignItems: "flex-end",
    justifyContent: "space-between",
  },
  itemTotal: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.primary,
  },
  removeButton: {
    padding: 8,
    backgroundColor: colors.backgroundAlt,
    borderRadius: 8,
    marginTop: 8,
  },
  cartSummary: {
    backgroundColor: colors.card,
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    ...commonStyles.shadow,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 16,
    color: colors.text,
  },
  summaryValue: {
    fontSize: 16,
    color: colors.text,
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 12,
    marginTop: 8,
    marginBottom: 16,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.text,
  },
  totalValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.primary,
  },
  checkoutButton: {
    marginTop: 8,
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
  loginButton: {
    width: "100%",
    maxWidth: 200,
  },
  shopButton: {
    width: "100%",
    maxWidth: 200,
  },
});
