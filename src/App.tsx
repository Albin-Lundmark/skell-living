import { useState } from 'react'
import { ArrowRight, ChevronLeft } from 'lucide-react'
import { Link, Route, Routes } from 'react-router-dom'
import CartDrawer from './components/CartDrawer'
import SiteHeader from './components/SiteHeader'
import ProductDetailPage from './pages/ProductDetailPage'
import ShopPage from './pages/ShopPage'
import { useCartStore } from './stores/cart'
import type { CategoryFilter } from './types'

export default function App() {
  const [category, setCategory] = useState<CategoryFilter>('all')
  const [search, setSearch] = useState('')
  const [cartOpen, setCartOpen] = useState(false)
  const [favoriteIds, setFavoriteIds] = useState<number[]>([])
  const { items } = useCartStore()
  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0)

  function toggleFavorite(id: number) {
    setFavoriteIds(current =>
      current.includes(id)
        ? current.filter(favoriteId => favoriteId !== id)
        : [...current, id]
    )
  }

  return (
    <div className='site-shell bg-(paper) text-(--ink)'>
      <SiteHeader
        search={search}
        cartCount={cartCount}
        onSearchChange={setSearch}
        onCategoryChange={setCategory}
        onCartOpen={() => setCartOpen(true)}
      />
      <main id='top'>
        <Routes>
          <Route
            path='/'
            element={
              <ShopPage
                category={category}
                search={search}
                favoriteIds={favoriteIds}
                onCategoryChange={setCategory}
                onSearchChange={setSearch}
                onToggleFavorite={toggleFavorite}
              />
            }
          />
          <Route path='/products/:productId' element={<ProductDetailPage />} />
          <Route
            path='*'
            element={
              <section className='not-found-state'>
                <span className='eyebrow'>404</span>
                <h1>Den här sidan finns inte.</h1>
                <Link className='text-link' to='/'>
                  <ArrowRight size={15} /> Till sortimentet
                </Link>
              </section>
            }
          />
        </Routes>
      </main>
      <footer className='site-footer'>
        <Link className='wordmark' to='/'>
          skell<span>.</span>
        </Link>
        <span>Skapat för livet mellan raderna.</span>
        <a href='#top'>
          Till toppen <ChevronLeft size={14} />
        </a>
      </footer>
      {cartOpen && <CartDrawer onClose={() => setCartOpen(false)} />}
    </div>
  )
}
