// ─── useCart.js ──────────────────────────────────────────────────────────────
// Custom hook for cart state, strictly integrated with backend API (/cart/:userId).
// Guest users must log in before adding items to cart or checking out.

import { useState, useCallback, useEffect } from 'react';
import {
  fetchUserCart,
  addItemToBackendCart,
  updateBackendCartItemQty,
  removeBackendCartItem,
  clearBackendCart,
} from '../services/cartService';

function formatBackendCart(backendCart, products) {
  if (!backendCart || !Array.isArray(backendCart.items)) return [];
  return backendCart.items.map((item) => {
    const pId = typeof item.productId === 'object' ? item.productId._id : item.productId;
    const fullProduct = products.find((p) => (p.id || p._id) === pId) || {
      id: pId,
      _id: pId,
      name: item.name,
      price: item.price,
      vendor: 'Market Store',
      category: 'elektronik',
      stock: 99,
      rating: 4.5,
      icon: 'package',
      imageUrl: 'https://picsum.photos/200',
      description: '',
      tags: [],
    };
    return { product: fullProduct, qty: item.quantity };
  });
}

export function useCart(user = null, products = [], onRequireLogin = null) {
  const [cart, setCart] = useState([]);
  const userId = user?.id || user?._id;

  // Load backend cart when user is authenticated
  useEffect(() => {
    if (!userId) {
      setCart([]);
      return;
    }

    let isMounted = true;
    fetchUserCart(userId)
      .then((backendCart) => {
        if (!isMounted) return;
        setCart(formatBackendCart(backendCart, products));
      })
      .catch((err) => {
        console.warn('Gagal memuat keranjang dari backend:', err.message);
      });

    return () => {
      isMounted = false;
    };
  }, [userId, products]);

  // Tambah item ke cart backend
  const addToCart = useCallback(
    async (product, qty = 1) => {
      if (!userId) {
        if (typeof onRequireLogin === 'function') {
          onRequireLogin();
        }
        return { success: false, requireLogin: true };
      }

      const pId = product.id || product._id;
      try {
        const updatedCart = await addItemToBackendCart(userId, pId, qty);
        setCart(formatBackendCart(updatedCart, products));
        return { success: true };
      } catch (err) {
        console.error('Gagal menambah item ke keranjang backend:', err.message);
        return { success: false, error: err.message };
      }
    },
    [userId, products, onRequireLogin]
  );

  // Update quantity di cart backend
  const updateQty = useCallback(
    async (productId, qty) => {
      if (!userId) {
        if (typeof onRequireLogin === 'function') onRequireLogin();
        return;
      }

      try {
        let updatedCart;
        if (qty <= 0) {
          updatedCart = await removeBackendCartItem(userId, productId);
        } else {
          updatedCart = await updateBackendCartItemQty(userId, productId, qty);
        }
        setCart(formatBackendCart(updatedCart, products));
      } catch (err) {
        console.error('Gagal mengupdate kuantitas item di backend:', err.message);
      }
    },
    [userId, products, onRequireLogin]
  );

  const removeFromCart = useCallback(
    async (productId) => {
      if (!userId) {
        if (typeof onRequireLogin === 'function') onRequireLogin();
        return;
      }

      try {
        const updatedCart = await removeBackendCartItem(userId, productId);
        setCart(formatBackendCart(updatedCart, products));
      } catch (err) {
        console.error('Gagal menghapus item dari keranjang backend:', err.message);
      }
    },
    [userId, products, onRequireLogin]
  );

  const clearCart = useCallback(async () => {
    if (!userId) return;
    try {
      const updatedCart = await clearBackendCart(userId);
      setCart(formatBackendCart(updatedCart, products));
    } catch (err) {
      console.error('Gagal mengosongkan keranjang di backend:', err.message);
      setCart([]);
    }
  }, [userId, products]);

  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);
  const cartTotal = cart.reduce((sum, item) => sum + item.product.price * item.qty, 0);

  return { cart, cartCount, cartTotal, addToCart, updateQty, removeFromCart, clearCart };
}
