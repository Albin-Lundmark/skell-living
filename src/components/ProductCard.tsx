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

export const ProductCard = ({
  product,
  isFavorite,
  onAdd,
  onToggleFavorite
}: ProductCardProps) => {
  const [added, setAdded] = useState(false)
  const image = product.thumbnail || product.images[0]

  function addToCart() {
    onAdd(product)
    setAdded(true)
    window.setTimeout(() => setAdded(false), 1200)
  }

  return (
    <article className='group min-w-0 animate-rise-in-fast'>
      <div className='relative aspect-square overflow-hidden bg-[#eceae3]'>
        <Link
          className='absolute inset-0 block'
          to={`/products/${product.id}`}
          aria-label={`Visa detaljer för ${product.title}`}
        >
          <img
            className='h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105'
            src={image}
            alt={product.title}
            loading='lazy'
          />
        </Link>
        <span className='absolute left-3 top-3 z-10 bg-paper/95 px-2 py-1 text-xs tracking-wide text-[#68736b] max-sm:left-2 max-sm:top-2 max-sm:px-1 max-sm:py-1 max-sm:text-xs'>
          {product.category === 'furniture' ? 'Möbler' : 'Inredning'}
        </span>
        <button
          className={`absolute right-2 top-2 z-10 grid size-9 place-items-center rounded-full border border-[#e6e3db] bg-paper transition-all duration-200 hover:border-accent hover:text-accent focus-visible:translate-y-0 focus-visible:opacity-100 max-sm:right-1 max-sm:top-1 max-sm:size-7 ${isFavorite ? 'translate-y-0 text-accent opacity-100' : 'translate-y-1 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 max-sm:translate-y-0 max-sm:opacity-100'}`}
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
          className={`absolute bottom-2 left-2 right-2 z-10 flex min-h-9 translate-y-1 items-center justify-center gap-2 bg-paper/95 text-xs text-ink opacity-0 transition-all duration-200 hover:bg-forest hover:text-white focus-visible:translate-y-0 focus-visible:opacity-100 group-hover:translate-y-0 group-hover:opacity-100 max-sm:bottom-1 max-sm:left-1 max-sm:right-1 max-sm:min-h-8 max-sm:translate-y-0 max-sm:text-xs max-sm:opacity-100 ${added ? 'translate-y-0 bg-forest text-white opacity-100' : ''}`}
          type='button'
          onClick={addToCart}
        >
          {added ? <Check size={16} /> : <Plus size={16} />}
          <span>{added ? 'Tillagd' : 'Lägg i varukorg'}</span>
        </button>
      </div>
      <div className='flex min-w-0 justify-between gap-2 pt-2'>
        <div className='min-w-0 flex-1'>
          <h3 className='m-0 min-w-0 max-w-full overflow-hidden text-ellipsis whitespace-nowrap text-xs font-medium text-[#303e37]'>
            <Link to={`/products/${product.id}`}>{product.title}</Link>
          </h3>
          <p className='mt-1 min-w-0 max-w-full overflow-hidden text-ellipsis whitespace-nowrap text-xs leading-normal text-[#838981]'>{product.description}</p>
        </div>
        <span className='shrink-0 text-xs font-semibold text-ink max-sm:text-xs'>{formatPrice(product.price)}</span>
      </div>
    </article>
  )
}
