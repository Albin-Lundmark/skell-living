import { useState } from 'react'
import { ArrowRight, ChevronUp } from 'lucide-react'
import { Link, Route, Routes } from 'react-router-dom'
import { CartDrawer } from './components/CartDrawer'
import { SiteHeader } from './components/SiteHeader'
import { AboutPage } from './pages/AboutPage'
import { CustomerServicePage } from './pages/CustomerServicePage'
import { ProductDetailPage } from './pages/ProductDetailPage'
import { ShopPage } from './pages/ShopPage'
import { useCartStore } from './stores/cart'
import { useFavoritesStore } from './stores/favorites.ts'
import type { CategoryFilter } from './types'

export const App = () => {
  const [category, setCategory] = useState<CategoryFilter>('all')
  const [search, setSearch] = useState('')
  const [cartOpen, setCartOpen] = useState(false)
  const favoriteIds = useFavoritesStore(state => state.ids)
  const toggleFavorite = useFavoritesStore(state => state.toggle)
  const { items } = useCartStore()
  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <div className='mx-auto max-w-screen-2xl overflow-clip bg-paper text-ink'>
      <SiteHeader
        search={search}
        cartCount={cartCount}
        onSearchChange={setSearch}
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
          <Route path='/kundservice' element={<CustomerServicePage />} />
          <Route path='/om-oss' element={<AboutPage />} />
          <Route path='/products/:productId' element={<ProductDetailPage />} />
          <Route
            path='*'
            element={
              <section className='flex min-h-95 flex-col items-center justify-center px-5 py-12 text-center'>
                <span className='inline-flex items-center gap-2 text-xs font-semibold tracking-widest text-[#68766d]'>404</span>
                <h1 className='my-3 font-serif text-3xl font-medium'>Den här sidan finns inte.</h1>
                <Link className='inline-flex items-center gap-2 border-0 border-b border-current bg-transparent text-xs text-forest' to='/'>
                  <ArrowRight size={15} /> Till sortimentet
                </Link>
              </section>
            }
          />
        </Routes>
      </main>
      <footer className='flex min-h-20 items-center justify-between border-t border-line px-6 lg:px-16 py-4 max-sm:min-h-17 max-sm:px-4 max-sm:py-4'>
        <Link className='w-fit text-2xl font-bold leading-none tracking-tighter' to='/'>
          skell<span className='text-accent'>.</span>
        </Link>
        <span className='text-xs text-[#778078] max-sm:hidden'>Skapat för livet mellan raderna.</span>
        <a className='flex items-center gap-1 text-xs text-[#778078]' href='#top'>
          Till toppen <ChevronUp size={14} />
        </a>
      </footer>
      {cartOpen && <CartDrawer onClose={() => setCartOpen(false)} />}
    </div>
  )
}
