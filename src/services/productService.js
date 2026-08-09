// ─── Product Service ──────────────────────────────────────────────────────────
// Interacts with /product routes on spd_team_backend

import { request } from './api';
import { PRODUCTS as DUMMY_PRODUCTS } from '../data/dummy';

export function normalizeProduct(p) {
  if (!p) return null;
  const id = p._id || p.id;

  // Infer icon or vendor if missing
  let icon = p.icon;
  if (!icon) {
    const nameLower = (p.name || '').toLowerCase();
    if (nameLower.includes('mouse') || nameLower.includes('keyboard')) icon = 'laptop';
    else if (nameLower.includes('headphone') || nameLower.includes('audio')) icon = 'headphones';
    else if (nameLower.includes('hub') || nameLower.includes('ssd')) icon = 'hard-drive';
    else icon = 'package';
  }

  return {
    id,
    _id: id,
    name: p.name || 'Produk',
    vendor: p.vendor || 'Market Store',
    category: p.category || 'elektronik',
    price: p.price ?? 0,
    originalPrice: p.originalPrice || null,
    badge: p.badge || (p.stock > 0 && p.stock <= 5 ? 'Terbatas' : null),
    badgeColor: p.badgeColor || (p.stock > 0 && p.stock <= 5 ? 'amber' : 'dark'),
    stock: p.stock ?? 0,
    rating: p.rating ?? 4.5,
    reviewCount: p.reviewCount ?? 12,
    icon,
    imageUrl: p.imageUrl || 'https://picsum.photos/200',
    description: p.description || 'Deskripsi produk berkualitas.',
    tags: p.tags || ['Elektronik', 'Populer'],
  };
}

export async function getProducts() {
  try {
    const data = await request('/product');
    if (Array.isArray(data) && data.length > 0) {
      return data.map(normalizeProduct);
    }
    // Fallback if array is empty
    return DUMMY_PRODUCTS;
  } catch (err) {
    console.warn('Gagal mengambil data produk dari backend, menggunakan data lokal:', err.message);
    return DUMMY_PRODUCTS;
  }
}

export async function getProductById(id) {
  try {
    const p = await request(`/product/${id}`);
    if (p) return normalizeProduct(p);
  } catch (err) {
    console.warn(`Gagal mengambil detail produk ${id} dari backend, mencari di data lokal:`, err.message);
  }
  const dummy = DUMMY_PRODUCTS.find((p) => p.id === id || p._id === id);
  return dummy ? normalizeProduct(dummy) : null;
}
