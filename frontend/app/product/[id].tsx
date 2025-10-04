//this is the params page for each product details
import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  Alert,
  Dimensions,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { useProducts } from "@/contexts/ProductContext";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { colors, commonStyles } from "@/styles/commonStyles";
import { Button } from "@/components/Button";
import { IconSymbol } from "@/components/IconSymbol";

const { width } = Dimensions.get("window");

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getProduct } = useProducts();
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const [quantity, setQuantity] = useState(1);

  const product = getProduct(id!);

  if (!product) {
    return (
      <View style={[commonStyles.container, styles.errorContainer]}>
        <IconSymbol
          name="exclamationmark.triangle"
          color={colors.error}
          size={64}
        />
        <Text style={styles.errorTitle}>Product Not Found</Text>
        <Text style={styles.errorSubtitle}>
          The product you're looking for doesn't exist
        </Text>
        <Button onPress={() => router.back()} style={styles.backButton}>
          Go Back
        </Button>
      </View>
    );
  }

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      Alert.alert("Login Required", "Please login to add items to cart", [
        { text: "Cancel", style: "cancel" },
        { text: "Login", onPress: () => router.push("/auth") },
      ]);
      return;
    }

    if (quantity > product.stock) {
      Alert.alert(
        "Insufficient Stock",
        `Only ${product.stock} items available`
      );
      return;
    }

    addToCart(product, quantity);
    Alert.alert(
      "Added to Cart",
      `${quantity} ${product.name}(s) added to your cart`,
      [
        { text: "Continue Shopping", onPress: () => router.back() },
        { text: "View Cart", onPress: () => router.push("/(tabs)/cart") },
      ]
    );
  };

  const adjustQuantity = (delta: number) => {
    const newQuantity = quantity + delta;
    if (newQuantity >= 1 && newQuantity <= product.stock) {
      setQuantity(newQuantity);
    }
  };

  return (
    <View style={commonStyles.wrapper}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Product Image */}
        <View style={styles.imageContainer}>
          <Image source={{ uri: product.image }} style={styles.productImage} />
        </View>

        {/* Product Info */}
        <View style={styles.productInfo}>
          <Text style={styles.productName}>{product.name}</Text>
          <Text style={styles.productPrice}>${product.price.toFixed(2)}</Text>

          <View style={styles.stockContainer}>
            <IconSymbol
              name={product.stock > 0 ? "checkmark.circle" : "xmark.circle"}
              color={product.stock > 0 ? colors.success : colors.error}
              size={20}
            />
            <Text
              style={[
                styles.stockText,
                { color: product.stock > 0 ? colors.success : colors.error },
              ]}
            >
              {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
            </Text>
          </View>

          <Text style={styles.categoryLabel}>Category</Text>
          <Text style={styles.categoryValue}>{product.category}</Text>

          <Text style={styles.descriptionLabel}>Description</Text>
          <Text style={styles.description}>{product.description}</Text>

          {/* Quantity Selector */}
          {product.stock > 0 && (
            <View style={styles.quantitySection}>
              <Text style={styles.quantityLabel}>Quantity</Text>
              <View style={styles.quantityContainer}>
                <Button
                  onPress={() => adjustQuantity(-1)}
                  disabled={quantity <= 1}
                  variant="outline"
                  style={styles.quantityButton}
                >
                  <IconSymbol name="minus" color={colors.primary} size={16} />
                </Button>

                <Text style={styles.quantityText}>{quantity}</Text>

                <Button
                  onPress={() => adjustQuantity(1)}
                  disabled={quantity >= product.stock}
                  variant="outline"
                  style={styles.quantityButton}
                >
                  <IconSymbol name="plus" color={colors.primary} size={16} />
                </Button>
              </View>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Bottom Actions */}
      <View style={styles.bottomActions}>
        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>Total:</Text>
          <Text style={styles.totalValue}>
            ${(product.price * quantity).toFixed(2)}
          </Text>
        </View>

        <Button
          onPress={handleAddToCart}
          disabled={product.stock === 0}
          style={styles.addToCartButton}
        >
          {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
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
  imageContainer: {
    width: "100%",
    height: width * 0.8,
    backgroundColor: colors.backgroundAlt,
  },
  productImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  productInfo: {
    padding: 20,
  },
  productName: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 8,
  },
  productPrice: {
    fontSize: 28,
    fontWeight: "bold",
    color: colors.primary,
    marginBottom: 16,
  },
  stockContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  stockText: {
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  categoryLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.grey,
    marginBottom: 4,
  },
  categoryValue: {
    fontSize: 16,
    color: colors.text,
    marginBottom: 20,
    textTransform: "capitalize",
  },
  descriptionLabel: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: colors.text,
    lineHeight: 24,
    marginBottom: 24,
  },
  quantitySection: {
    marginBottom: 20,
  },
  quantityLabel: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 12,
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  quantityButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  quantityText: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.text,
    marginHorizontal: 24,
    minWidth: 40,
    textAlign: "center",
  },
  bottomActions: {
    backgroundColor: colors.card,
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    ...commonStyles.shadow,
  },
  totalContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
  },
  totalValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.primary,
  },
  addToCartButton: {
    width: "100%",
  },
  errorContainer: {
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.text,
    marginTop: 20,
    marginBottom: 8,
  },
  errorSubtitle: {
    fontSize: 16,
    color: colors.grey,
    textAlign: "center",
    marginBottom: 32,
  },
  backButton: {
    width: "100%",
    maxWidth: 200,
  },
});
