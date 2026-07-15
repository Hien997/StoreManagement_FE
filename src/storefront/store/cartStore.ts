import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { StoreProduct } from '../types'

export interface CartItem {
  id: string
  name: string
  image: string
  price: number
  salePrice?: number
  quantity: number
  stockStatus: StoreProduct['stockStatus']
  stock: number
}

interface CartState {
  items: CartItem[]
  add: (product: StoreProduct, quantity?: number) => void
  remove: (id: string) => void
  setQuantity: (id: string, quantity: number) => void
  clear: () => void
  totalItems: () => number
  subtotal: () => number
}

const unitPrice = (i: CartItem) => i.salePrice ?? i.price

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      add: (product, quantity = 1) =>
        set((state) => {
          const existing = state.items.find((i) => i.id === product.id)
          if (existing) {
            const next = Math.min(existing.quantity + quantity, Math.max(product.stock, 1))
            return {
              items: state.items.map((i) => (i.id === product.id ? { ...i, quantity: next } : i)),
            }
          }
          return {
            items: [
              ...state.items,
              {
                id: product.id,
                name: product.name,
                image: product.image,
                price: product.sellingPrice,
                salePrice: product.salePrice,
                quantity: Math.min(quantity, Math.max(product.stock, 1)),
                stockStatus: product.stockStatus,
                stock: product.stock,
              },
            ],
          }
        }),
      remove: (id) => set((state) => ({ items: state.items.filter((i) => i.id !== id) })),
      setQuantity: (id, quantity) =>
        set((state) => ({
          items: state.items.map((i) =>
            i.id === id ? { ...i, quantity: Math.max(1, Math.min(quantity, Math.max(i.stock, 1))) } : i,
          ),
        })),
      clear: () => set({ items: [] }),
      totalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
      subtotal: () => get().items.reduce((sum, i) => sum + unitPrice(i) * i.quantity, 0),
    }),
    { name: 'store-cart' },
  ),
)