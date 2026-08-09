// ─── Cart Service ─────────────────────────────────────────────────────────────
// Interacts with /cart routes on spd_team_backend

import { request } from './api';

export async function fetchUserCart(userId) {
  if (!userId) return null;
  const carts = await request(`/cart/${userId}`);
  if (Array.isArray(carts)) {
    // Find pending cart or return the first one
    const pendingCart = carts.find((c) => c.status === 'pending') || carts[0];
    return pendingCart || null;
  }
  return carts;
}

export async function addItemToBackendCart(userId, productId, quantity = 1) {
  if (!userId || !productId) return null;
  return await request(`/cart/${userId}/items`, {
    method: 'POST',
    body: { productId, quantity },
  });
}

export async function updateBackendCartItemQty(userId, productId, quantity) {
  if (!userId || !productId) return null;
  return await request(`/cart/${userId}/items/${productId}`, {
    method: 'PUT',
    body: { quantity },
  });
}

export async function removeBackendCartItem(userId, productId) {
  if (!userId || !productId) return null;
  return await request(`/cart/${userId}/items/${productId}`, {
    method: 'DELETE',
  });
}

export async function clearBackendCart(userId) {
  if (!userId) return null;
  return await request(`/cart/${userId}`, {
    method: 'DELETE',
  });
}
