interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

interface OrderItem {
  id: string;
  productId: string;
  product: Product;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  total: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  createdAt: string;
  updatedAt: string;
  shippingAddress: Address;
}

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  stock: number;
  createdAt: string;
  updatedAt: string;
}

interface User {
  id: string;
  email: string;
  name: string;
  isAdmin: boolean;
  createdAt: string;
}

export const mockUsers: User[] = [
  {
    id: "1",
    email: "admin@example.com",
    name: "Admin User",
    isAdmin: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    email: "user@example.com",
    name: "John Doe",
    isAdmin: false,
    createdAt: new Date().toISOString(),
  },
];

export const mockProducts: Product[] = [
  {
    id: "1",
    name: "iPhone 17 Pro",
    description: "Latest iPhone with advanced camera system and A17 Pro chip",
    price: 2000000,
    image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400",
    category: "electronics",
    stock: 25,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "2",
    name: "MacBook Air M2",
    description: "Powerful laptop with M2 chip and long battery life",
    price: 5000000,
    image: "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400",
    category: "electronics",
    stock: 15,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "3",
    name: "Nike Air Max 270",
    description: "Comfortable running shoes with Max Air cushioning",
    price: 10490.99,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400",
    category: "clothing",
    stock: 50,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "4",
    name: "Wireless Headphones",
    description: "Premium noise-cancelling wireless headphones",
    price: 32000.99,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400",
    category: "electronics",
    stock: 30,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "5",
    name: "Coffee Maker",
    description: "Automatic drip coffee maker with programmable timer",
    price: 89000,
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400",
    category: "home",
    stock: 20,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "6",
    name: "Yoga Mat",
    description: "Non-slip yoga mat for all types of yoga practice",
    price: 39000,
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400",
    category: "sports",
    stock: 40,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "7",
    name: "Skincare Set",
    description:
      "Complete skincare routine with cleanser, toner, and moisturizer",
    price: 50000,
    image: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400",
    category: "beauty",
    stock: 35,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "8",
    name: "Gaming Controller",
    description:
      "Wireless gaming controller compatible with multiple platforms",
    price: 19000,
    image: "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400",
    category: "electronics",
    stock: 45,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const mockOrders: Order[] = [];
