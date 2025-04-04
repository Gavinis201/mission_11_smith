// Import necessary React functionality and the CartItem type
import { createContext, ReactNode, useContext, useState } from 'react';
import { CartItem } from '../types/CartItem';

// Define the shape of the context so TypeScript can enforce correct usage
interface CartContextType {
  cart: CartItem[]; // Array of cart items
  addToCart: (item: CartItem) => void; // Function to add an item
  removeFromCart: (bookId: number) => void; // Function to remove by bookId
  clearCart: () => void; // Clears all items from the cart
}

// Create the context with an initial undefined value (will be checked later)
const CartContext = createContext<CartContextType | undefined>(undefined);

// Provider component that wraps the app and shares cart state
export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]); // Cart state

  // Add an item to the cart
  const addToCart = (item: CartItem) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((c) => c.bookId === item.bookId); // Check if already in cart

      if (existingItem) {
        // If the item exists, increment the quantity
        return prevCart.map((c) =>
          c.bookId === item.bookId
            ? { ...c, bookQuantity: c.bookQuantity + item.bookQuantity }
            : c
        );
      }

      // Otherwise, add the new item with quantity
      return [...prevCart, { ...item, bookQuantity: item.bookQuantity }];
    });
  };

  // Remove an item from the cart by its ID
  const removeFromCart = (bookId: number) => {
    setCart((prevCart) => prevCart.filter((c) => c.bookId !== bookId));
  };

  // Clear all items from the cart
  const clearCart = () => {
    setCart(() => []);
  };

  // Provide the cart and all cart-related functions to consumers
  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
};

// Custom hook to use the cart context easily throughout the app
export const useCart = () => {
  const context = useContext(CartContext);

  // Make sure the hook is only used inside a CartProvider
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }

  return context;
};
