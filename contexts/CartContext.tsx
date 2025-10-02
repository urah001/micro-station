import React, { createContext, useContext, useReducer, useEffect } from "react";
import { CartState, CartItem, Product } from "../types";
import { useAuth } from "./AuthContext";

interface CartContextType extends CartState {
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

type CartAction =
  | { type: "ADD_TO_CART"; payload: { product: Product; quantity: number } }
  | { type: "REMOVE_FROM_CART"; payload: string }
  | {
      type: "UPDATE_QUANTITY";
      payload: { productId: string; quantity: number };
    }
  | { type: "CLEAR_CART" }
  | { type: "LOAD_CART"; payload: CartItem[] };

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case "ADD_TO_CART": {
      const { product, quantity } = action.payload;
      const existingItem = state.items.find(
        (item) => item.productId === product.id
      );

      let newItems: CartItem[];
      if (existingItem) {
        newItems = state.items.map((item) =>
          item.productId === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        const newItem: CartItem = {
          id: Date.now().toString(),
          productId: product.id,
          product,
          quantity,
        };
        newItems = [...state.items, newItem];
      }

      const total = newItems.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0
      );
      const itemCount = newItems.reduce((sum, item) => sum + item.quantity, 0);

      return { items: newItems, total, itemCount };
    }

    case "REMOVE_FROM_CART": {
      const newItems = state.items.filter(
        (item) => item.productId !== action.payload
      );
      const total = newItems.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0
      );
      const itemCount = newItems.reduce((sum, item) => sum + item.quantity, 0);

      return { items: newItems, total, itemCount };
    }

    case "UPDATE_QUANTITY": {
      const { productId, quantity } = action.payload;
      if (quantity <= 0) {
        return cartReducer(state, {
          type: "REMOVE_FROM_CART",
          payload: productId,
        });
      }

      const newItems = state.items.map((item) =>
        item.productId === productId ? { ...item, quantity } : item
      );

      const total = newItems.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0
      );
      const itemCount = newItems.reduce((sum, item) => sum + item.quantity, 0);

      return { items: newItems, total, itemCount };
    }

    case "CLEAR_CART":
      return { items: [], total: 0, itemCount: 0 };

    case "LOAD_CART": {
      const items = action.payload;
      const total = items.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0
      );
      const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

      return { items, total, itemCount };
    }

    default:
      return state;
  }
};

const initialState: CartState = {
  items: [],
  total: 0,
  itemCount: 0,
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const { user } = useAuth();

  const addToCart = (product: Product, quantity: number = 1) => {
    console.log("Adding to cart:", product.name, "quantity:", quantity);
    dispatch({ type: "ADD_TO_CART", payload: { product, quantity } });
  };

  const removeFromCart = (productId: string) => {
    console.log("Removing from cart:", productId);
    dispatch({ type: "REMOVE_FROM_CART", payload: productId });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    console.log("Updating quantity:", productId, "to:", quantity);
    dispatch({ type: "UPDATE_QUANTITY", payload: { productId, quantity } });
  };

  const clearCart = () => {
    console.log("Clearing cart");
    dispatch({ type: "CLEAR_CART" });
  };

  return (
    <CartContext.Provider
      value={{
        ...state,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
