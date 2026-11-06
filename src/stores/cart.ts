import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Product } from '../types'

export interface CartItem {
  id: number
  title: string
  price: number
  thumbnail: string
  quantity: number
}

interface CartState {
  items: CartItem[]
  addItem: (product: Product) => void
  incrementItem: (id: number) => void
  decrementItem: (id: number) => void
  removeItem: (id: number) => void
  clearCart: () => void
}

export const useCartStore = create<CartState>()(
  persist(
    set => ({
      items: [],
      addItem: product =>
        set(state => {
          const item = state.items.find(entry => entry.id === product.id)
          if (item) {
            return {
              items: state.items.map(entry =>
                entry.id === product.id
                  ? { ...entry, quantity: entry.quantity + 1 }
                  : entry
              )
            }
          }
          return {
            items: [
              ...state.items,
              {
                id: product.id,
                title: product.title,
                price: product.price,
                thumbnail: product.thumbnail,
                quantity: 1
              }
            ]
          }
        }),
      incrementItem: id =>
        set(state => ({
          items: state.items.map(item =>
            item.id === id ? { ...item, quantity: item.quantity + 1 } : item
          )
        })),
      decrementItem: id =>
        set(state => ({
          items: state.items.flatMap(item =>
            item.id === id
              ? item.quantity > 1
                ? [{ ...item, quantity: item.quantity - 1 }]
                : []
              : [item]
          )
        })),
      removeItem: id =>
        set(state => ({ items: state.items.filter(item => item.id !== id) })),
      clearCart: () => set({ items: [] })
    }),
    { name: 'skell-living-cart' }
  )
)
