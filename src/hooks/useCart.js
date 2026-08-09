// ─── useCart.js ──────────────────────────────────────────────────────────────
// Custom hook for cart state, supporting backend API sync when authenticated.

import { useState, useCallback, useEffect } from 'react';
import {
  fetchUserCart,
  addItemToBackendCart,
  updateBackendCartItemQty,
  removeBackendCartItem,
  clearBackendCart,
} from '../services/cartService';

export function useCart(user = null, products = []) {
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('marketo_local_cart');
    if (!saved) return [];
    try {
      return JSON.parse(saved);
    } catch {
      return [];
    }
  });

  // Sync to localStorage for guest users
  useEffect(() => {
    if (!user) {
      localStorage.setItem('marketo_local_cart', JSON.stringify(cart));
    }
  }, [cart, user]);

  // Load backend cart when user logs in
  useEffect(() => {
    if (user?.id) {
      let isMounted = true;
      fetchUserCart(user.id)
        .then((backendCart) => {
          if (!isMounted || !backendCart || !Array.isArray(backendCart.items)) return;
          const formatted = backendCart.items.map((item) => {
            const pId = typeof item.productId === 'object' ? item.productId._id : item.productId;
            const fullProduct = products.find((p) => p.id === pId || p._id === pId) || {
              id: pId,
              _id: pId,
              name: item.name,
              price: item.price,
              vendor: 'Market',
              category: 'elektronik',
              stock: 99,
              rating: 4.5,
              reviewCount: 10,
              icon: 'package',
              description: '',
              tags: [],
            };
            return { product: fullProduct, qty: item.quantity };
          });
          setCart(formatted);
        })
        .catch((err) => {
          console.warn('Gagal memuat keranjang dari backend:', err.message);
        });

      return () => {
        isMounted = false;
      };
    }
  }, [user?.id, products]);

  // Tambah item ke cart
  const addToCart = useCallback(
    (product, qty = 1) => {
      const pId = product.id || product._id;
      setCart((prev) => {
        const existing = prev.find((item) => (item.product.id || item.product._id) === pId);
        if (existing) {
          return prev.map((item) =>
            (item.product.id || item.product._id) === pId
              ? { ...item, qty: item.qty + qty }
              : item
          );
        }
        return [...prev, { product, qty }];
      });

      if (user?.id) {
        addItemToBackendCart(user.id, pId, qty).catch((err) =>
          console.warn('Gagal sync tambah cart ke backend:', err.message)
        );
      }
    },
    [user?.id]
  );

  // Update quantity
  const updateQty = useCallback(
    (productId, qty) => {
      if (qty <= 0) {
        setCart((prev) => prev.filter((item) => (item.product.id || item.product._id) !== productId));
        if (user?.id) {
          removeBackendCartItem(user.id, productId).catch((err) =>
            console.warn('Gagal sync hapus cart di backend:', err.message)
          );
        }
      } else {
        setCart((prev) =>
          prev.map((item) =>
            (item.product.id || item.product._id) === productId ? { ...item, qty } : item
          )
        );
        if (user?.id) {
          updateBackendCartItemQty(user.id, productId, qty).catch((err) =>
            console.warn('Gagal sync update qty cart di backend:', err.message)
          );
        }
      }
    },
    [user?.id]
  );

  const removeFromCart = useCallback(
    (productId) => {
      setCart((prev) => prev.filter((item) => (item.product.id || item.product._id) !== productId));
      if (user?.id) {
        removeBackendCartItem(user.id, productId).catch((err) =>
          console.warn('Gagal sync remove cart item di backend:', err.message)
        );
      }
    },
    [user?.id]
  );

  const clearCart = useCallback(() => {
    setCart([]);
    localStorage.removeItem('marketo_local_cart');
    if (user?.id) {
      clearBackendCart(user.id).catch((err) =>
        console.warn('Gagal clear cart di backend:', err.message)
      );
    }
  }, [user?.id]);

  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);
  const cartTotal = cart.reduce((sum, item) => sum + item.product.price * item.qty, 0);

  return { cart, cartCount, cartTotal, addToCart, updateQty, removeFromCart, clearCart };
}
