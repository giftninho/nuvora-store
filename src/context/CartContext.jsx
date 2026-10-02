import React, { createContext, useContext, useState } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);

  /**
   * Add a product to the cart with a specified quantity
   * @param {Object} product - Product to add
   * @param {number} quantity - Quantity to add (defaults to 1)
   */
  const addToCart = (product, quantity = 1) => {
    if (!product || !product.id || quantity <= 0) return;

    setCartItems((prevItems) => {
      const existingIndex = prevItems.findIndex(
        (item) => String(item.product.id) === String(product.id)
      );

      if (existingIndex > -1) {
        const updated = [...prevItems];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + quantity,
        };
        return updated;
      }

      return [...prevItems, { product, quantity }];
    });
  };

  /**
   * Remove an item from the cart
   */
  const removeFromCart = (productId) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => String(item.product.id) !== String(productId))
    );
  };

  /**
   * Update item quantity directly
   */
  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        String(item.product.id) === String(productId)
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  /**
   * Clear all items in cart
   */
  const clearCart = () => {
    setCartItems([]);
  };

  // Total quantity of items in cart
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  // Subtotal calculation
  const subtotal = cartItems.reduce(
    (acc, item) => acc + (item.product.price || 0) * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartCount,
        subtotal,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
