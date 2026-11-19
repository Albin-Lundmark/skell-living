import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Heart,
  LoaderCircle,
  ShoppingBag,
  Star
} from 'lucide-react'
import { fetchProductById } from '../api/products'
import { useCartStore } from '../stores/cart'
import { useFavoritesStore } from '../stores/favorites'
import type { Product } from '../types'
import { formatPrice, getCategoryLabel } from '../utils/format'

const ProductState = ({
  title,
  message,
  retry
}: {
  title: string
  message: string
  retry?: () => void
}) => {
  return (
    <section className='flex min-h-95 flex-col items-center justify-center px-5 py-12 text-center max-sm:min-h-75' role={retry ? 'alert' : undefined}>
      <span className='inline-flex items-center gap-2 text-xs font-semibold tracking-widest text-[#68766d]'>SKELL LIVING</span>
      <h1 className='my-3 font-serif text-3xl font-medium'>{title}</h1>
      <p className='mb-4 mt-0 text-xs text-muted'>{message}</p>
      {retry && (
        <button className='inline-flex items-center gap-2 bg-forest px-3 py-2 text-xs text-white' type='button' onClick={retry}>
          Försök igen <ArrowRight size={16} />
        </button>
      )}
      <Link className='mt-3 inline-flex items-center gap-2 border-0 border-b border-current bg-transparent text-xs text-forest' to='/'>
        <ArrowLeft size={15} /> Till sortimentet
      </Link>
    </section>
  )
}

const ProductDetails = ({ product }: { product: Product }) => {
  const [activeImage, setActiveImage] = useState(0)
  const [added, setAdded] = useState(false)
  const { addItem } = useCartStore()
  const isFavorite = useFavoritesStore(state => state.ids.includes(product.id))
  const toggleFavorite = useFavoritesStore(state => state.toggle)
  const images = product.images.length ? product.images : [product.thumbnail]
  const categoryLabel = getCategoryLabel(product.category)
  const dimensions = product.dimensions
    ? `${product.dimensions.width} × ${product.dimensions.height} × ${product.dimensions.depth} cm`
    : ''
  const specifications = [
    { label: 'Kategori', value: categoryLabel },
    { label: 'Varumärke', value: product.brand },
    { label: 'Artikelnummer', value: product.sku },
    { label: 'Vikt', value: product.weight ? `${product.weight} kg` : '' },
    { label: 'Mått', value: dimensions },
    { label: 'Garanti', value: product.warrantyInformation },
    { label: 'Leverans', value: product.shippingInformation },
    { label: 'Retur', value: product.returnPolicy },
    {
      label: 'Minsta antal',
      value: product.minimumOrderQuantity?.toString()
    },
    { label: 'Streckkod', value: product.meta?.barcode }
  ].filter(specification => specification.value)

  function addToCart() {
    addItem(product)
    setAdded(true)
    window.setTimeout(() => setAdded(false), 1400)
  }

  return (
    <article className='mx-auto max-w-screen-2xl animate-rise-in-fast px-6 lg:px-16 pb-18 pt-6 max-lg:px-7 max-sm:px-4 max-sm:pb-12 max-sm:pt-14'>
      <nav className='mb-6 flex items-center gap-2 text-xs text-[#899087] max-sm:mb-4 max-sm:text-xs' aria-label='Brödsmulor'>
        <Link to='/'>Sortiment</Link>
        <span aria-hidden='true'>/</span>
        <Link to={`/?category=${product.category}#shop`}>{categoryLabel}</Link>
        <span aria-hidden='true'>/</span>
        <span className='overflow-hidden text-ellipsis whitespace-nowrap text-ink' aria-current='page'>{product.title}</span>
      </nav>

      <div className='grid grid-cols-2 items-start gap-12 lg:gap-16 max-lg:grid-cols-2 max-lg:gap-7 max-sm:grid-cols-1 max-sm:gap-5'>
        <div className='min-w-0'>
          <div className='aspect-square overflow-hidden bg-[#eceae3] max-sm:aspect-square'>
            <img className='h-full w-full object-contain mix-blend-multiply' src={images[activeImage]} alt={product.title} />
          </div>
          {images.length > 1 && (
            <div className='mt-3 flex gap-2 overflow-x-auto' aria-label='Produktbilder'>
              {images.map((image, index) => (
                <button
                  key={`${image}-${index}`}
                  className={`h-17 w-17 shrink-0 border bg-[#eceae3] p-1 ${activeImage === index ? 'border-forest' : 'border-line'}`}
                  type='button'
                  aria-label={`Visa bild ${index + 1}`}
                  aria-pressed={activeImage === index}
                  onClick={() => setActiveImage(index)}
                >
                  <img className='h-full w-full object-contain mix-blend-multiply' src={image} alt='' />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className='pt-3 max-sm:pt-0'>
          <span className='inline-flex items-center gap-2 text-xs font-semibold tracking-widest text-[#68766d]'>
            <span className='size-1 rounded-full bg-accent' /> {categoryLabel.toUpperCase()}
          </span>
          <h1 className='my-4 mb-3 font-serif text-4xl font-medium leading-tight max-sm:mt-3 max-sm:text-4xl'>{product.title}</h1>
          <div className='flex items-center gap-1 text-xs text-[#b4773d]'>
            <Star size={15} fill='currentColor' />
            <span>{product.rating.toFixed(1)}</span>
            <span className='ml-1 text-muted'>
              {product.reviews?.length ?? 0} omdömen
            </span>
          </div>
          <div className='mt-5 flex items-baseline gap-3'>
            <strong>{formatPrice(product.price)}</strong>
            {product.discountPercentage > 0 && (
              <span className='text-xs text-accent'>{Math.round(product.discountPercentage)}% rabatt</span>
            )}
          </div>
          <p className='my-4 text-xs leading-relaxed text-[#69736b]'>{product.description}</p>
          <p className='my-4 flex items-center gap-2 text-xs text-[#647068]'>
            <span className={`size-2 rounded-full ${product.stock > 0 ? 'bg-[#56805b]' : 'bg-accent'}`} />
            {product.stock > 0
              ? `${product.stock} i lager`
              : 'Tillfälligt slut'}
          </p>
          <button
            className='flex min-h-12 w-full items-center justify-center gap-2 bg-forest px-4 text-xs text-white transition-colors hover:bg-accent disabled:cursor-not-allowed disabled:opacity-50'
            type='button'
            onClick={addToCart}
            disabled={product.stock <= 0}
          >
            {added ? <Check size={17} /> : <ShoppingBag size={17} />}
            {added ? 'Tillagd i varukorgen' : 'Lägg i varukorg'}
          </button>
          <button
            className={`mt-2 flex min-h-10 w-full items-center justify-center gap-2 border px-4 text-xs transition-colors hover:border-accent hover:text-accent ${isFavorite ? 'border-accent bg-accent/5 text-accent' : 'border-line bg-transparent text-ink'}`}
            type='button'
            aria-pressed={isFavorite}
            aria-label={`${isFavorite ? 'Ta bort' : 'Spara'} ${product.title} ${isFavorite ? 'från' : 'som'} favorit`}
            onClick={() => toggleFavorite(product.id)}
          >
            <Heart
              size={17}
              strokeWidth={1.7}
              fill={isFavorite ? 'currentColor' : 'none'}
            />
            {isFavorite ? 'Sparad som favorit' : 'Spara som favorit'}
          </button>

          {product.tags.length > 0 && (
            <div className='mt-4 flex flex-wrap gap-1' aria-label='Produktetiketter'>
              {product.tags.map(tag => (
                <span className='bg-[#eceae3] px-2 py-1 text-xs text-[#69736b]' key={tag}>{tag}</span>
              ))}
            </div>
          )}

          {specifications.length > 0 && (
            <dl className='mt-5 grid grid-cols-2 gap-x-4'>
              {specifications.map(specification => (
                <div className='min-w-0 border-t border-line py-2' key={specification.label}>
                  <dt className='mb-1 text-xs text-[#879087]'>{specification.label}</dt>
                  <dd className='m-0 wrap-anywhere text-xs leading-normal text-ink'>{specification.value}</dd>
                </div>
              ))}
            </dl>
          )}
        </div>
      </div>

      {product.reviews && product.reviews.length > 0 && (
        <section className='mt-14 border-t border-line pt-6 max-sm:mt-9' aria-labelledby='reviews-title'>
          <div className='mb-4 flex items-end justify-between'>
            <div>
              <span className='inline-flex items-center gap-2 text-xs font-semibold tracking-widest text-[#68766d]'>ERFARENHETER</span>
              <h2 className='mt-1 mb-0 font-serif text-3xl font-medium' id='reviews-title'>Omdömen</h2>
            </div>
            <span className='text-xs text-muted'>{product.reviews.length} omdömen</span>
          </div>
          <div className='grid grid-cols-3 gap-5 max-lg:grid-cols-2 max-sm:grid-cols-1 max-sm:gap-2'>
            {product.reviews.map((review, index) => (
              <article
                className='min-w-0 border-t border-line py-3'
                key={`${review.date}-${index}`}
              >
                <div
                  className='flex gap-0 text-[#b4773d]'
                  aria-label={`${review.rating} av 5 stjärnor`}
                >
                  {Array.from({ length: 5 }, (_, star) => (
                    <Star
                      key={star}
                      size={13}
                      fill={star < review.rating ? 'currentColor' : 'none'}
                    />
                  ))}
                </div>
                <p className='my-2 font-serif text-sm leading-normal text-[#59645d]'>{review.comment}</p>
                <span className='text-xs text-[#899087]'>
                  {review.reviewerName} ·{' '}
                  {new Intl.DateTimeFormat('sv-SE', {
                    dateStyle: 'medium'
                  }).format(new Date(review.date))}
                </span>
              </article>
            ))}
          </div>
        </section>
      )}
    </article>
  )
}

export const ProductDetailPage = () => {
  const { productId = '' } = useParams()
  const id = Number(productId)
  const validId = Number.isSafeInteger(id) && id > 0
  const {
    data: product,
    isPending,
    isError,
    error,
    refetch,
    isFetching
  } = useQuery({
    queryKey: ['product', id],
    queryFn: ({ signal }) => fetchProductById(id, signal),
    enabled: validId
  })

  if (!validId) {
    return (
      <ProductState
        title='Ogiltig produktadress.'
        message='Produktnumret i adressen är inte giltigt.'
      />
    )
  }

  if (isPending) {
    return (
      <div className='flex min-h-95 flex-col items-center justify-center px-5 py-12 text-center max-sm:min-h-75' role='status'>
        <LoaderCircle className='animate-spin' size={22} />
        <p className='mb-4 mt-0 text-xs text-muted'>Hämtar produktinformation</p>
      </div>
    )
  }

  if (isError || !product) {
    return (
      <ProductState
        title='Produkten kunde inte hämtas.'
        message={
          error instanceof Error
            ? error.message
            : 'Kontrollera din uppkoppling och försök igen.'
        }
        retry={isFetching ? undefined : () => refetch()}
      />
    )
  }

  return <ProductDetails product={product} />
}
