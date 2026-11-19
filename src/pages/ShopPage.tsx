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
      <section className='border-t border-line px-6 lg:px-16 pb-17 pt-8 max-lg:px-7 max-sm:px-4 max-sm:pb-12 max-sm:pt-7' id='shop'>
        <div className='mb-6 flex items-end justify-between max-sm:items-center'>
          <div>
            <span className='inline-flex items-center gap-2 text-xs font-semibold tracking-widest text-[#68766d]'>VÄLJ MED KÄNSLA</span>
            <h2 className='mt-2 mb-0 font-serif text-4xl font-medium leading-tight tracking-tight max-sm:text-3xl'>
              Hitta din <em className='font-medium text-accent'>favorit.</em>
            </h2>
          </div>
          <p className='mb-1 mt-0 font-serif text-sm italic leading-normal text-[#7a817b] max-sm:text-xs'>
            En finare vardag börjar
            <br />
            med de små valen.
          </p>
        </div>

        <div className='mb-4 flex min-h-13 items-center justify-between border-y border-line max-sm:min-h-0 max-sm:flex-col max-sm:items-start max-sm:gap-2 max-sm:pb-2'>
          <div
            className='flex h-13 items-center gap-6 max-sm:h-11 max-sm:gap-5'
            role='tablist'
            aria-label='Produktkategori'
          >
            {categories.map(option => (
              <button
                key={option.id}
                className={`h-full cursor-pointer border-0 border-b-2 border-transparent bg-transparent px-px text-xs text-[#737b74] transition-colors duration-200 ${category === option.id ? 'border-accent text-ink' : ''}`}
                type='button'
                role='tab'
                aria-selected={category === option.id}
                onClick={() => onCategoryChange(option.id)}
              >
                {option.label}
              </button>
            ))}
          </div>
          <div className='flex items-center gap-5 max-sm:w-full max-sm:justify-between'>
            <span className='text-xs text-[#7a817b]'>
              {isPending
                ? 'Hämtar sortiment'
                : normalizedSearch
                  ? `${filteredProducts.length} träffar på sidan`
                  : totalProducts > 0
                    ? `${rangeStart}–${rangeEnd} av ${totalProducts} produkter`
                    : '0 av 0 produkter'}
            </span>
            <label className='flex items-center gap-2 text-[#647068]'>
              <ArrowDownWideNarrow size={16} />
              <select
                className='max-w-36 appearance-none border-0 bg-transparent py-2 text-xs text-ink outline-none'
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
          <div className='grid grid-cols-2 gap-x-2 gap-y-5 sm:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 sm:gap-x-4 sm:gap-y-6' aria-label='Laddar produkter'>
            {Array.from({ length: PRODUCTS_PER_PAGE }, (_, index) => (
              <div key={index}>
                <div className='aspect-square animate-shimmer bg-[linear-gradient(100deg,#eceae3_35%,#f2f0e9_50%,#eceae3_65%)] bg-cover' />
                <span className='mt-3 block h-2 w-2/3 bg-[#e9e7df]' />
                <span className='mt-2 block h-2 w-1/2 bg-[#e9e7df]' />
              </div>
            ))}
          </div>
        ) : isError ? (
          <div className='flex min-h-65 flex-col items-center justify-center text-center' role='alert'>
            <div className='grid size-9 place-items-center rounded-full border border-[#d88a76] font-serif text-accent'>!</div>
            <h3 className='mt-3 mb-0 font-serif text-xl font-medium'>Sortimentet kunde inte hämtas.</h3>
            <p className='mb-4 mt-2 text-xs text-muted'>
              {error instanceof Error
                ? error.message
                : 'Kontrollera din uppkoppling och försök igen.'}
            </p>
            <button
              className='flex min-h-9 cursor-pointer items-center gap-2 border-0 bg-forest px-3 text-xs text-white disabled:cursor-wait disabled:opacity-70'
              type='button'
              onClick={() => refetch()}
              disabled={isFetching}
            >
              {isFetching ? <LoaderCircle className='animate-spin' size={16} /> : null}
              Försök igen
            </button>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className='flex min-h-65 flex-col items-center justify-center text-center'>
            <Search className='text-accent' size={24} />
            <h3 className='mt-3 mb-0 font-serif text-xl font-medium'>
              {normalizedSearch
                ? 'Inga träffar på den här sidan.'
                : 'Inga träffar den här gången.'}
            </h3>
            <p className='mb-4 mt-2 text-xs text-muted'>Prova ett annat sökord eller välj en annan kategori.</p>
            <button
              className='inline-flex items-center gap-2 border-0 border-b border-current bg-transparent text-xs text-forest'
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
          <div className='grid grid-cols-2 gap-x-2 gap-y-5 sm:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 sm:gap-x-4 sm:gap-y-6'>
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
          <nav className='mx-auto mt-8 flex items-center justify-center gap-4' aria-label='Produktpaginering'>
            <button
              className='grid size-9 cursor-pointer place-items-center border border-line bg-transparent text-ink hover:border-accent hover:text-accent disabled:cursor-not-allowed disabled:opacity-40'
              type='button'
              aria-label='Föregående sida'
              title='Föregående sida'
              disabled={page === 1 || isFetching}
              onClick={() => setPage(current => current - 1)}
            >
              <ChevronLeft size={17} />
            </button>
            <span className='min-w-18 text-center text-xs text-muted' aria-live='polite'>
              Sida {page} av {pageCount}
            </span>
            <button
              className='grid size-9 cursor-pointer place-items-center border border-line bg-transparent text-ink hover:border-accent hover:text-accent disabled:cursor-not-allowed disabled:opacity-40'
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
