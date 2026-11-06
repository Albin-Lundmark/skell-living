import { useEffect, useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  ArrowDownWideNarrow,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  LoaderCircle,
  Search
} from 'lucide-react'
import { fetchProductsPage, PRODUCTS_PER_PAGE } from '../api/products'
import HeroCarousel from '../components/HeroCarousel'
import ProductCard from '../components/ProductCard'
import { useCartStore } from '../stores/cart'
import type { CategoryFilter } from '../types'

const categories: { id: CategoryFilter; label: string }[] = [
  { id: 'all', label: 'Allt' },
  { id: 'furniture', label: 'Möbler' },
  { id: 'home-decoration', label: 'Inredning' }
]

const sortLabels = {
  featured: 'Utvalda',
  'price-asc': 'Pris: lägst först',
  'price-desc': 'Pris: högst först',
  rating: 'Högst betyg'
} as const

type SortOrder = keyof typeof sortLabels

interface ShopPageProps {
  category: CategoryFilter
  search: string
  favoriteIds: number[]
  onCategoryChange: (category: CategoryFilter) => void
  onSearchChange: (value: string) => void
  onToggleFavorite: (id: number) => void
}

export default function ShopPage({
  category,
  search,
  favoriteIds,
  onCategoryChange,
  onSearchChange,
  onToggleFavorite
}: ShopPageProps) {
  const [sort, setSort] = useState<SortOrder>('featured')
  const [page, setPage] = useState(1)
  const { addItem } = useCartStore()
  const {
    data: pageData,
    isPending,
    isError,
    error,
    refetch,
    isFetching
  } = useQuery({
    queryKey: ['products', category, page],
    queryFn: ({ signal }) => fetchProductsPage(category, page, signal)
  })

  const normalizedSearch = search.trim().toLocaleLowerCase('sv-SE')
  const products = pageData?.products ?? []
  const pageCount = pageData?.pageCount ?? 1
  const totalProducts = pageData?.total ?? 0
  const rangeStart = totalProducts > 0 ? (page - 1) * PRODUCTS_PER_PAGE + 1 : 0
  const rangeEnd = Math.min(page * PRODUCTS_PER_PAGE, totalProducts)
  const filteredProducts = useMemo(() => {
    const filtered = products.filter(
      product =>
        !normalizedSearch ||
        `${product.title} ${product.description} ${product.category}`
          .toLocaleLowerCase('sv-SE')
          .includes(normalizedSearch)
    )

    if (sort === 'price-asc')
      return filtered.sort((first, second) => first.price - second.price)
    if (sort === 'price-desc')
      return filtered.sort((first, second) => second.price - first.price)
    if (sort === 'rating')
      return filtered.sort((first, second) => second.rating - first.rating)
    return filtered
  }, [normalizedSearch, products, sort])

  useEffect(() => {
    setPage(1)
  }, [category, normalizedSearch])

  return (
    <>
      <HeroCarousel product={products[0]} />
      <section className='shop-section' id='shop'>
        <div className='section-heading'>
          <div>
            <span className='eyebrow'>VÄLJ MED KÄNSLA</span>
            <h2>
              Hitta din <em>favorit.</em>
            </h2>
          </div>
          <p>
            En finare vardag börjar
            <br />
            med de små valen.
          </p>
        </div>

        <div className='shop-toolbar'>
          <div
            className='category-tabs'
            role='tablist'
            aria-label='Produktkategori'
          >
            {categories.map(option => (
              <button
                key={option.id}
                className={category === option.id ? 'selected' : ''}
                type='button'
                role='tab'
                aria-selected={category === option.id}
                onClick={() => onCategoryChange(option.id)}
              >
                {option.label}
              </button>
            ))}
          </div>
          <div className='toolbar-right'>
            <span className='result-count'>
              {isPending
                ? 'Hämtar sortiment'
                : normalizedSearch
                  ? `${filteredProducts.length} träffar på sidan`
                  : totalProducts > 0
                    ? `${rangeStart}–${rangeEnd} av ${totalProducts} produkter`
                    : '0 av 0 produkter'}
            </span>
            <label className='sort-select'>
              <ArrowDownWideNarrow size={16} />
              <select
                aria-label='Sortera produkter'
                value={sort}
                onChange={event => {
                  setSort(event.target.value as SortOrder)
                  setPage(1)
                }}
              >
                {Object.entries(sortLabels).map(([value, label]) => (
                  <option value={value} key={value}>
                    {label}
                  </option>
                ))}
              </select>
              <ChevronDown size={14} />
            </label>
          </div>
        </div>

        {isPending ? (
          <div className='product-grid' aria-label='Laddar produkter'>
            {Array.from({ length: PRODUCTS_PER_PAGE }, (_, index) => (
              <div className='skeleton-card' key={index}>
                <div />
                <span />
                <span />
              </div>
            ))}
          </div>
        ) : isError ? (
          <div className='error-state' role='alert'>
            <div className='error-mark'>!</div>
            <h3>Sortimentet kunde inte hämtas.</h3>
            <p>
              {error instanceof Error
                ? error.message
                : 'Kontrollera din uppkoppling och försök igen.'}
            </p>
            <button
              type='button'
              onClick={() => refetch()}
              disabled={isFetching}
            >
              {isFetching ? <LoaderCircle className='spin' size={16} /> : null}
              Försök igen
            </button>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className='empty-results'>
            <Search size={24} />
            <h3>
              {normalizedSearch
                ? 'Inga träffar på den här sidan.'
                : 'Inga träffar den här gången.'}
            </h3>
            <p>Prova ett annat sökord eller välj en annan kategori.</p>
            <button
              className='text-link'
              type='button'
              onClick={() => {
                onSearchChange('')
                onCategoryChange('all')
                setPage(1)
              }}
            >
              Visa hela sortimentet
              <ChevronRight size={15} />
            </button>
          </div>
        ) : (
          <div className='product-grid'>
            {filteredProducts.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                onAdd={addItem}
                isFavorite={favoriteIds.includes(product.id)}
                onToggleFavorite={onToggleFavorite}
              />
            ))}
          </div>
        )}

        {!isPending && !isError && pageCount > 1 && !normalizedSearch && (
          <nav className='pagination' aria-label='Produktpaginering'>
            <button
              type='button'
              aria-label='Föregående sida'
              title='Föregående sida'
              disabled={page === 1 || isFetching}
              onClick={() => setPage(current => current - 1)}
            >
              <ChevronLeft size={17} />
            </button>
            <span aria-live='polite'>
              Sida {page} av {pageCount}
            </span>
            <button
              type='button'
              aria-label='Nästa sida'
              title='Nästa sida'
              disabled={page >= pageCount || isFetching}
              onClick={() => setPage(current => current + 1)}
            >
              <ChevronRight size={17} />
            </button>
          </nav>
        )}
      </section>
    </>
  )
}
