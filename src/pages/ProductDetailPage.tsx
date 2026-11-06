import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  ArrowRight,
  Check,
  LoaderCircle,
  ShoppingBag,
  Star
} from 'lucide-react'
import { fetchProductById } from '../api/products'
import { useCartStore } from '../stores/cart'
import type { Product } from '../types'
import { formatPrice, getCategoryLabel } from '../utils/format'

function ProductState({
  title,
  message,
  retry
}: {
  title: string
  message: string
  retry?: () => void
}) {
  return (
    <section className='product-state' role={retry ? 'alert' : undefined}>
      <span className='eyebrow'>SKELL LIVING</span>
      <h1>{title}</h1>
      <p>{message}</p>
      {retry && (
        <button className='detail-retry' type='button' onClick={retry}>
          Försök igen <ArrowRight size={16} />
        </button>
      )}
      <Link className='text-link' to='/'>
        <ArrowLeft size={15} /> Till sortimentet
      </Link>
    </section>
  )
}

function ProductDetails({ product }: { product: Product }) {
  const [activeImage, setActiveImage] = useState(0)
  const [added, setAdded] = useState(false)
  const { addItem } = useCartStore()
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
    <article className='product-detail-page'>
      <nav className='product-breadcrumbs' aria-label='Brödsmulor'>
        <Link to='/'>Sortiment</Link>
        <span aria-hidden='true'>/</span>
        <Link to={`/?category=${product.category}#shop`}>{categoryLabel}</Link>
        <span aria-hidden='true'>/</span>
        <span aria-current='page'>{product.title}</span>
      </nav>

      <div className='product-detail-layout'>
        <div className='detail-gallery'>
          <div className='detail-main-image'>
            <img src={images[activeImage]} alt={product.title} />
          </div>
          {images.length > 1 && (
            <div className='detail-thumbnails' aria-label='Produktbilder'>
              {images.map((image, index) => (
                <button
                  key={`${image}-${index}`}
                  className={activeImage === index ? 'selected' : ''}
                  type='button'
                  aria-label={`Visa bild ${index + 1}`}
                  aria-pressed={activeImage === index}
                  onClick={() => setActiveImage(index)}
                >
                  <img src={image} alt='' />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className='product-detail-copy'>
          <span className='eyebrow'>
            <span className='eyebrow-dot' /> {categoryLabel.toUpperCase()}
          </span>
          <h1>{product.title}</h1>
          <div className='detail-rating'>
            <Star size={15} fill='currentColor' />
            <span>{product.rating.toFixed(1)}</span>
            <span className='detail-rating-count'>
              {product.reviews?.length ?? 0} omdömen
            </span>
          </div>
          <div className='detail-price-row'>
            <strong>{formatPrice(product.price)}</strong>
            {product.discountPercentage > 0 && (
              <span>{Math.round(product.discountPercentage)}% rabatt</span>
            )}
          </div>
          <p className='detail-description'>{product.description}</p>
          <p className='detail-stock'>
            <span className={product.stock > 0 ? 'in-stock' : 'out-of-stock'} />
            {product.stock > 0
              ? `${product.stock} i lager`
              : 'Tillfälligt slut'}
          </p>
          <button
            className='detail-add-button'
            type='button'
            onClick={addToCart}
            disabled={product.stock <= 0}
          >
            {added ? <Check size={17} /> : <ShoppingBag size={17} />}
            {added ? 'Tillagd i varukorgen' : 'Lägg i varukorg'}
          </button>

          {product.tags.length > 0 && (
            <div className='detail-tags' aria-label='Produktetiketter'>
              {product.tags.map(tag => (
                <span key={tag}>{tag}</span>
              ))}
            </div>
          )}

          {specifications.length > 0 && (
            <dl className='product-specifications'>
              {specifications.map(specification => (
                <div key={specification.label}>
                  <dt>{specification.label}</dt>
                  <dd>{specification.value}</dd>
                </div>
              ))}
            </dl>
          )}
        </div>
      </div>

      {product.reviews && product.reviews.length > 0 && (
        <section className='product-reviews' aria-labelledby='reviews-title'>
          <div className='reviews-heading'>
            <div>
              <span className='eyebrow'>ERFARENHETER</span>
              <h2 id='reviews-title'>Omdömen</h2>
            </div>
            <span>{product.reviews.length} omdömen</span>
          </div>
          <div className='review-list'>
            {product.reviews.map((review, index) => (
              <article
                className='product-review'
                key={`${review.date}-${index}`}
              >
                <div
                  className='review-rating'
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
                <p>{review.comment}</p>
                <span>
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

export default function ProductDetailPage() {
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
      <div className='product-state' role='status'>
        <LoaderCircle className='spin' size={22} />
        <p>Hämtar produktinformation</p>
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
