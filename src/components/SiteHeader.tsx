import { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { LoaderCircle, Search, ShoppingBag, Sparkles } from 'lucide-react'
import { fetchProductCatalog } from '../api/products'
import { formatPrice, getCategoryLabel } from '../utils/format'

interface SiteHeaderProps {
  search: string
  cartCount: number
  onSearchChange: (value: string) => void
  onCartOpen: () => void
}

export const SiteHeader = ({
  search,
  cartCount,
  onSearchChange,
  onCartOpen
}: SiteHeaderProps) => {
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
      <div className='flex min-h-8 items-center justify-center gap-2 bg-forest px-5 py-2 text-xs tracking-wide text-[#f7f5eb] max-sm:min-h-8 max-sm:text-xs'>
        <Sparkles className='text-[#e8ab77]' size={13} /> Små saker. Stor skillnad.{' '}
        <span className='ml-1 text-[#c9d1c9] max-sm:hidden'>Upptäck säsongens favoriter</span>
      </div>
      <header className='grid h-19 grid-cols-3 items-center border-b border-line px-6 lg:px-16 max-lg:px-7 max-sm:flex max-sm:justify-between max-sm:h-15 max-sm:px-4'>
        <Link className='w-fit text-3xl font-bold leading-none tracking-tighter max-sm:text-3xl' to='/' aria-label='Skell Living startsida'>
          skell<span className='text-accent'>.</span>
        </Link>
        <nav className='flex h-full items-center justify-center gap-8 max-sm:absolute max-sm:left-0 max-sm:right-0 max-sm:top-24 max-sm:h-9 max-sm:justify-start max-sm:gap-6 max-sm:border-b max-sm:border-line max-sm:bg-paper max-sm:px-5' aria-label='Huvudmeny'>
          <Link
            className={`relative flex h-full items-center text-xs transition-colors after:absolute after:bottom-5 after:left-0 after:right-0 after:h-0.5 after:bg-accent hover:text-ink max-sm:after:bottom-0 ${location.pathname === '/' || location.pathname.startsWith('/products/') ? 'text-ink' : 'text-[#68716b] after:hidden'}`}
            to='/'
          >
            Shoppa
          </Link>
          <Link className={`relative flex h-full items-center text-xs transition-colors after:absolute after:bottom-5 after:left-0 after:right-0 after:h-0.5 after:bg-accent hover:text-ink max-sm:after:bottom-0 ${location.pathname === '/kundservice' ? 'text-ink' : 'text-[#68716b] after:hidden'}`} to='/kundservice'>
            Kundservice
          </Link>
          <Link className={`relative flex h-full items-center text-xs transition-colors after:absolute after:bottom-5 after:left-0 after:right-0 after:h-0.5 after:bg-accent hover:text-ink max-sm:after:bottom-0 ${location.pathname === '/om-oss' ? 'text-ink' : 'text-[#68716b] after:hidden'}`} to='/om-oss'>
            Om Oss
          </Link>
        </nav>
        <div className='flex items-center justify-end gap-5 max-sm:gap-3'>
          <div
            className='relative'
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
              className='group/header-search flex h-9 w-35 items-center gap-2 border-b border-line text-[#59645d] transition-[width] duration-200 max-sm:h-8 max-sm:w-8 max-sm:justify-center max-sm:border-0 max-sm:focus-within:w-36 max-sm:focus-within:border-b max-sm:focus-within:border-line'
              onSubmit={event => {
                event.preventDefault()
                openFirstSuggestion()
              }}
            >
              <button
                className='grid shrink-0 place-items-center border-0 bg-transparent p-0 text-inherit'
                type='submit'
                aria-label='Öppna första sökförslaget'
                title='Öppna första sökförslaget'
              >
                <Search size={17} strokeWidth={1.7} />
              </button>
              <input
                className='w-full border-0 bg-transparent text-xs text-ink outline-none placeholder:text-[#858b85] max-sm:min-w-0 max-sm:flex-1 max-sm:bg-paper max-sm:opacity-0 max-sm:group-focus-within/header-search:opacity-100'
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
                className='absolute right-0 top-full z-20 mt-3 max-h-112 w-80 overflow-auto border border-line bg-paper shadow-lg max-sm:fixed max-sm:left-4 max-sm:right-4 max-sm:top-52 max-sm:mt-0 max-sm:max-h-dvh max-sm:w-auto'
                id='product-suggestions'
                role='region'
                aria-label='Sökförslag'
                aria-live='polite'
              >
                <p className='m-0 border-b border-line px-3 pb-2 pt-3 text-xs tracking-widest text-[#7a817b]'>
                  FÖRSLAG I SORTIMENTET
                </p>
                {isCatalogPending ? (
                  <p className='m-0 flex min-h-14 items-center gap-2 p-3 text-xs text-muted' role='status'>
                    <LoaderCircle className='animate-spin' size={15} /> Söker i
                    sortimentet
                  </p>
                ) : isCatalogError ? (
                  <button
                    className='flex min-h-14 w-full items-center border-0 bg-transparent p-3 text-left text-xs text-muted'
                    type='button'
                    onClick={() => refetchCatalog()}
                  >
                    Kunde inte hämta förslag. Försök igen.
                  </button>
                ) : suggestions.length === 0 ? (
                  <p className='m-0 flex min-h-14 items-center gap-2 p-3 text-xs text-muted'>
                    Inga matchande produkter.
                  </p>
                ) : (
                  suggestions.map(product => (
                    <Link
                      className='flex min-h-17 items-center gap-2 border-b border-line px-3 py-2 transition-colors last:border-0 hover:bg-[#eeece5] focus-visible:bg-[#eeece5]'
                      key={product.id}
                      to={`/products/${product.id}`}
                      onClick={() => {
                        onSearchChange('')
                        setSearchOpen(false)
                      }}
                    >
                      <img className='size-12 bg-[#eceae3] object-cover' src={product.thumbnail} alt='' />
                      <span className='flex min-w-0 flex-1 flex-col gap-1'>
                        <strong className='overflow-hidden text-ellipsis whitespace-nowrap text-xs font-medium text-ink'>{product.title}</strong>
                        <small className='text-xs text-muted'>{getCategoryLabel(product.category)}</small>
                      </span>
                      <span className='text-xs font-semibold text-ink'>
                        {formatPrice(product.price)}
                      </span>
                    </Link>
                  ))
                )}
              </div>
            )}
          </div>
          <button
            className='flex cursor-pointer items-center gap-2 border-0 bg-transparent py-2 text-xs max-sm:gap-1'
            type='button'
            onClick={onCartOpen}
            aria-label={`Öppna varukorgen, ${cartCount} produkter`}
          >
            <ShoppingBag size={19} strokeWidth={1.7} />
            <span className='max-sm:hidden'>Varukorg</span>
            <span className='grid size-5 min-w-5 place-items-center rounded-full bg-accent px-1 text-xs text-white'>{cartCount}</span>
          </button>
        </div>
      </header>
    </>
  )
}
