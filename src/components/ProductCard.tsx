import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Check, Heart, Plus } from 'lucide-react'
import type { Product } from '../types'
import { formatPrice } from '../utils/format'

interface ProductCardProps {
  product: Product
  isFavorite: boolean
  onAdd: (product: Product) => void
  onToggleFavorite: (id: number) => void
}

export default function ProductCard({
  product,
  isFavorite,
  onAdd,
  onToggleFavorite
}: ProductCardProps) {
  const [added, setAdded] = useState(false)
  const image = product.thumbnail || product.images[0]

  function addToCart() {
    onAdd(product)
    setAdded(true)
    window.setTimeout(() => setAdded(false), 1200)
  }

  return (
    <article className='product-card group'>
      <div className='product-image-wrap'>
        <Link
          className='product-image-link'
          to={`/products/${product.id}`}
          aria-label={`Visa detaljer för ${product.title}`}
        >
          <img
            className='product-image'
            src={image}
            alt={product.title}
            loading='lazy'
          />
        </Link>
        <span className='product-tag'>
          {product.category === 'furniture' ? 'Möbler' : 'Inredning'}
        </span>
        <button
          className={`icon-button favorite-button ${isFavorite ? 'is-favorite' : ''}`}
          type='button'
          aria-label={`${isFavorite ? 'Ta bort' : 'Spara'} ${product.title} ${isFavorite ? 'från' : 'som'} favorit`}
          aria-pressed={isFavorite}
          onClick={() => onToggleFavorite(product.id)}
        >
          <Heart
            size={17}
            strokeWidth={1.7}
            fill={isFavorite ? 'currentColor' : 'none'}
          />
        </button>
        <button
          className={`quick-add ${added ? 'is-added' : ''}`}
          type='button'
          onClick={addToCart}
        >
          {added ? <Check size={16} /> : <Plus size={16} />}
          <span>{added ? 'Tillagd' : 'Lägg i varukorg'}</span>
        </button>
      </div>
      <div className='product-info'>
        <div>
          <h3>
            <Link to={`/products/${product.id}`}>{product.title}</Link>
          </h3>
          <p>{product.description}</p>
        </div>
        <span className='product-price'>{formatPrice(product.price)}</span>
      </div>
    </article>
  )
}
