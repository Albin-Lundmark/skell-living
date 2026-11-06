import { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { LoaderCircle, Search, ShoppingBag, Sparkles } from 'lucide-react'
import { fetchProductCatalog } from '../api/products'
import type { CategoryFilter } from '../types'
import { formatPrice, getCategoryLabel } from '../utils/format'

interface SiteHeaderProps {
  search: string
  cartCount: number
  onSearchChange: (value: string) => void
  onCategoryChange: (category: CategoryFilter) => void
  onCartOpen: () => void
}

export default function SiteHeader({
  search,
  cartCount,
  onSearchChange,
  onCategoryChange,
  onCartOpen
}: SiteHeaderProps) {
  const location = useLocation()
  const navigate = useNavigate()
  const [searchOpen, setSearchOpen] = useState(false)
  const normalizedSearch = search.trim().toLocaleLowerCase('sv-SE')
  const {
    data: searchCatalog = [],
    isPending: isCatalogPending,
    isError: isCatalogError,
    refetch: refetchCatalog
  } = useQuery({
    queryKey: ['product-suggestion-catalog'],
    queryFn: ({ signal }) => fetchProductCatalog(signal),
    enabled: searchOpen && normalizedSearch.length >= 2
  })

  const suggestions = useMemo(() => {
    if (normalizedSearch.length < 2) return []
    return searchCatalog
      .filter(product =>
        `${product.title} ${product.description} ${product.category} ${product.brand ?? ''} ${product.tags.join(' ')}`
          .toLocaleLowerCase('sv-SE')
          .includes(normalizedSearch)
      )
      .slice(0, 5)
  }, [normalizedSearch, searchCatalog])

  function openFirstSuggestion() {
    const firstSuggestion = suggestions[0]
    if (!firstSuggestion) return
    onSearchChange('')
    setSearchOpen(false)
    navigate(`/products/${firstSuggestion.id}`)
  }

  return (
    <>
      <div className='announcement-bar'>
        <Sparkles size={13} /> Små saker. Stor skillnad.{' '}
        <span>Upptäck säsongens favoriter</span>
      </div>
      <header className='site-header'>
        <Link className='wordmark' to='/' aria-label='Skell Living startsida'>
          skell<span>.</span>
        </Link>
        <nav className='main-nav' aria-label='Huvudmeny'>
          <Link
            className={location.pathname === '/' ? 'active' : ''}
            to='/#shop'
          >
            Shoppa
          </Link>
          <Link to='/#shop' onClick={() => onCategoryChange('furniture')}>
            Möbler
          </Link>
          <Link to='/#shop' onClick={() => onCategoryChange('home-decoration')}>
            Inredning
          </Link>
        </nav>
        <div className='header-actions'>
          <div
            className='search-container'
            onBlur={event => {
              if (
                !event.currentTarget.contains(
                  event.relatedTarget as Node | null
                )
              ) {
                setSearchOpen(false)
              }
            }}
          >
            <form
              className='header-search'
              onSubmit={event => {
                event.preventDefault()
                openFirstSuggestion()
              }}
            >
              <button
                className='search-submit'
                type='submit'
                aria-label='Öppna första sökförslaget'
                title='Öppna första sökförslaget'
              >
                <Search size={17} strokeWidth={1.7} />
              </button>
              <input
                aria-label='Sök produkter'
                aria-expanded={searchOpen && normalizedSearch.length >= 2}
                aria-controls='product-suggestions'
                placeholder='Sök'
                value={search}
                onFocus={() => setSearchOpen(true)}
                onKeyDown={event => {
                  if (event.key === 'Escape') setSearchOpen(false)
                }}
                onChange={event => {
                  onSearchChange(event.target.value)
                  setSearchOpen(true)
                }}
              />
            </form>
            {searchOpen && normalizedSearch.length >= 2 && (
              <div
                className='search-suggestions'
                id='product-suggestions'
                role='region'
                aria-label='Sökförslag'
                aria-live='polite'
              >
                <p className='search-suggestions-heading'>
                  FÖRSLAG I SORTIMENTET
                </p>
                {isCatalogPending ? (
                  <p className='search-suggestions-message' role='status'>
                    <LoaderCircle className='spin' size={15} /> Söker i
                    sortimentet
                  </p>
                ) : isCatalogError ? (
                  <button
                    className='search-suggestions-message search-retry'
                    type='button'
                    onClick={() => refetchCatalog()}
                  >
                    Kunde inte hämta förslag. Försök igen.
                  </button>
                ) : suggestions.length === 0 ? (
                  <p className='search-suggestions-message'>
                    Inga matchande produkter.
                  </p>
                ) : (
                  suggestions.map(product => (
                    <Link
                      className='search-suggestion'
                      key={product.id}
                      to={`/products/${product.id}`}
                      onClick={() => {
                        onSearchChange('')
                        setSearchOpen(false)
                      }}
                    >
                      <img src={product.thumbnail} alt='' />
                      <span className='search-suggestion-copy'>
                        <strong>{product.title}</strong>
                        <small>{getCategoryLabel(product.category)}</small>
                      </span>
                      <span className='search-suggestion-price'>
                        {formatPrice(product.price)}
                      </span>
                    </Link>
                  ))
                )}
              </div>
            )}
          </div>
          <button
            className='cart-button'
            type='button'
            onClick={onCartOpen}
            aria-label={`Öppna varukorgen, ${cartCount} produkter`}
          >
            <ShoppingBag size={19} strokeWidth={1.7} />
            <span className='cart-label'>Varukorg</span>
            <span className='cart-count'>{cartCount}</span>
          </button>
        </div>
      </header>
    </>
  )
}
