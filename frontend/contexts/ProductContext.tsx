import React, { createContext, useContext, useState, useEffect } from "react";
import { Product, ProductFilters } from "../types";
import { mockProducts } from "../data/mockData";

interface ProductContextType {
  products: Product[];
  filteredProducts: Product[];
  filters: ProductFilters;
  isLoading: boolean;
  setFilters: (filters: ProductFilters) => void;
  addProduct: (
    product: Omit<Product, "id" | "createdAt" | "updatedAt">
  ) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  getProduct: (id: string) => Product | undefined;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [filteredProducts, setFilteredProducts] =
    useState<Product[]>(mockProducts);
  const [filters, setFilters] = useState<ProductFilters>({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    console.log("Applying filters:", filters);
    let filtered = [...products];

    // Apply category filter
    if (filters.category) {
      filtered = filtered.filter(
        (product) => product.category === filters.category
      );
    }

    // Apply price filters
    if (filters.minPrice !== undefined) {
      filtered = filtered.filter(
        (product) => product.price >= filters.minPrice!
      );
    }
    if (filters.maxPrice !== undefined) {
      filtered = filtered.filter(
        (product) => product.price <= filters.maxPrice!
      );
    }

    // Apply search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm) ||
          product.description.toLowerCase().includes(searchTerm)
      );
    }

    // Apply sorting
    if (filters.sortBy) {
      filtered.sort((a, b) => {
        let aValue: any = a[filters.sortBy!];
        let bValue: any = b[filters.sortBy!];

        if (filters.sortBy === "name") {
          aValue = aValue.toLowerCase();
          bValue = bValue.toLowerCase();
        }

        if (filters.sortOrder === "desc") {
          return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
        } else {
          return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
        }
      });
    }

    setFilteredProducts(filtered);
  }, [products, filters]);

  const addProduct = (
    productData: Omit<Product, "id" | "createdAt" | "updatedAt">
  ) => {
    console.log("Adding new product:", productData.name);
    const newProduct: Product = {
      ...productData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setProducts((prev) => [...prev, newProduct]);
  };

  const updateProduct = (id: string, productData: Partial<Product>) => {
    console.log("Updating product:", id);
    setProducts((prev) =>
      prev.map((product) =>
        product.id === id
          ? { ...product, ...productData, updatedAt: new Date().toISOString() }
          : product
      )
    );
  };

  const deleteProduct = (id: string) => {
    console.log("Deleting product:", id);
    setProducts((prev) => prev.filter((product) => product.id !== id));
  };

  const getProduct = (id: string) => {
    return products.find((product) => product.id === id);
  };

  return (
    <ProductContext.Provider
      value={{
        products,
        filteredProducts,
        filters,
        isLoading,
        setFilters,
        addProduct,
        updateProduct,
        deleteProduct,
        getProduct,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error("useProducts must be used within a ProductProvider");
  }
  return context;
};
