import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TextInput,
  Pressable,
  Image,
  Alert,
} from "react-native";
import { router } from "expo-router";
import { useProducts } from "@/contexts/ProductContext";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { colors, commonStyles } from "@/styles/commonStyles";
import { Button } from "@/components/Button";
import { IconSymbol } from "@/components/IconSymbol";
import { Product, ProductCategory } from "@/types";

const categories: { label: string; value: ProductCategory }[] = [
  { label: "All", value: "electronics" },
  { label: "Electronics", value: "electronics" },
  { label: "Clothing", value: "clothing" },
  { label: "Books", value: "books" },
  { label: "Home", value: "home" },
  { label: "Sports", value: "sports" },
  { label: "Beauty", value: "beauty" },
  { label: "Toys", value: "toys" },
  { label: "Food", value: "food" },
];

export default function ShopScreen() {
  const { filteredProducts, filters, setFilters } = useProducts();
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const [searchText, setSearchText] = useState("");

  const handleSearch = (text: string) => {
    setSearchText(text);
    setFilters({ ...filters, search: text });
  };

  const handleCategoryFilter = (category: ProductCategory | undefined) => {
    setFilters({ ...filters, category });
  };

  const handleAddToCart = (product: Product) => {
    if (!isAuthenticated) {
      Alert.alert("Login Required", "Please login to add items to cart", [
        { text: "Cancel", style: "cancel" },
        { text: "Login", onPress: () => router.push("/auth") },
      ]);
      return;
    }
    addToCart(product);
    Alert.alert("Added to Cart", `${product.name} has been added to your cart`);
  };

  const renderProduct = (product: Product) => (
    <View key={product.id} style={styles.productCard}>
      <Pressable
        onPress={() => router.push(`/product/${product.id}`)}
        style={styles.productImageContainer}
      >
        <Image source={{ uri: product.image }} style={styles.productImage} />
      </Pressable>

      <View style={styles.productInfo}>
        <Text style={styles.productName} numberOfLines={2}>
          {product.name}
        </Text>
        <Text style={styles.productPrice}>${product.price.toFixed(2)}</Text>
        <Text style={styles.productStock}>
          {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
        </Text>

        <View style={styles.productActions}>
          <Button
            onPress={() => handleAddToCart(product)}
            disabled={product.stock === 0}
            style={styles.addToCartButton}
            textStyle={styles.addToCartText}
          >
            Add to Cart
          </Button>
          <Pressable
            onPress={() => router.push(`/product/${product.id}`)}
            style={styles.viewButton}
          >
            <IconSymbol name="eye" color={colors.primary} size={20} />
          </Pressable>
        </View>
      </View>
    </View>
  );

  return (
    <View style={commonStyles.wrapper}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Shop</Text>
          {!isAuthenticated && (
            <Pressable
              onPress={() => router.push("/auth")}
              style={styles.loginButton}
            >
              <Text style={styles.loginText}>Login</Text>
            </Pressable>
          )}
        </View>

        {/* Search icon and input */}
        <View style={styles.searchContainer}>
          <IconSymbol name="magnifyingglass" color={colors.grey} size={20} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search products..."
            value={searchText}
            onChangeText={handleSearch}
            placeholderTextColor={colors.grey}
          />
        </View>

        {/*Top Categories */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoriesContainer}
        >
          <Pressable
            onPress={() => handleCategoryFilter(undefined)}
            style={[
              styles.categoryButton,
              !filters.category && styles.categoryButtonActive,
            ]}
          >
            <Text
              style={[
                styles.categoryText,
                !filters.category && styles.categoryTextActive,
              ]}
            >
              All
            </Text>
          </Pressable>
          {categories.slice(1).map((category) => (
            <Pressable
              key={category.value}
              onPress={() => handleCategoryFilter(category.value)}
              style={[
                styles.categoryButton,
                filters.category === category.value &&
                  styles.categoryButtonActive,
              ]}
            >
              <Text
                style={[
                  styles.categoryText,
                  filters.category === category.value &&
                    styles.categoryTextActive,
                ]}
              >
                {category.label}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        {/* Products Grid */}
        <View style={styles.productsGrid}>
          {filteredProducts.map(renderProduct)}
        </View>

        {filteredProducts.length === 0 && (
          <View style={styles.emptyState}>
            <IconSymbol name="magnifyingglass" color={colors.grey} size={48} />
            <Text style={styles.emptyText}>No products found</Text>
            <Text style={styles.emptySubtext}>
              Try adjusting your search or filters
            </Text>
          </View>
        )}
      </ScrollView>
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
  loginButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: colors.primary,
    borderRadius: 8,
  },
  loginText: {
    color: "white",
    fontWeight: "600",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 20,
    marginBottom: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.backgroundAlt,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: colors.text,
  },
  categoriesContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 12,
    backgroundColor: colors.backgroundAlt,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  categoryButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.text,
  },
  categoryTextActive: {
    color: "white",
  },
  productsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 20,
    justifyContent: "space-between",
  },
  productCard: {
    width: "48%",
    backgroundColor: colors.card,
    borderRadius: 12,
    marginBottom: 16,
    overflow: "hidden",
    ...commonStyles.shadow,
  },
  productImageContainer: {
    width: "100%",
    height: 150,
  },
  productImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  productInfo: {
    padding: 12,
  },
  productName: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.primary,
    marginBottom: 4,
  },
  productStock: {
    fontSize: 12,
    color: colors.grey,
    marginBottom: 8,
  },
  productActions: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  addToCartButton: {
    flex: 1,
    marginRight: 8,
    paddingVertical: 8,
  },
  addToCartText: {
    fontSize: 12,
  },
  viewButton: {
    padding: 8,
    backgroundColor: colors.backgroundAlt,
    borderRadius: 8,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: colors.grey,
    marginTop: 4,
  },
});
