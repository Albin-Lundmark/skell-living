import { useEffect, useState } from 'react'
import { ArrowRight, Leaf } from 'lucide-react'
import type { Product } from '../types'

interface HeroCarouselProps {
  product?: Product
}

export default function HeroCarousel({ product }: HeroCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const images = product?.images.length
    ? product.images
    : product
      ? [product.thumbnail]
      : []
  const imageIndex = images.length ? activeIndex % images.length : 0

  useEffect(() => {
    setActiveIndex(0)
    if (
      images.length < 2 ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      return
    }

    const timer = window.setInterval(() => {
      setActiveIndex(index => (index + 1) % images.length)
    }, 5000)

    return () => window.clearInterval(timer)
  }, [product?.id, images.length])

  return (
    <section className='hero' aria-label='Säsongens utvalda'>
      <div className='hero-copy'>
        <span className='eyebrow'>
          <span className='eyebrow-dot' /> FORM FÖR VARDAGEN
        </span>
        <h1>
          Rum att
          <br />
          <em>landa i.</em>
        </h1>
        <p>
          Omtänksamt utvalda detaljer och möbler som gör vardagen lite vackrare.
        </p>
        <a className='hero-cta' href='#shop'>
          Upptäck sortimentet <ArrowRight size={17} />
        </a>
        <div className='hero-note'>
          <Leaf size={16} strokeWidth={1.6} />
          <span>
            Form som håller
            <br />
            lite längre
          </span>
        </div>
      </div>
      <div className='hero-visual'>
        {product ? (
          <img
            key={images[imageIndex]}
            src={images[imageIndex]}
            alt={`${product.title}, bild ${imageIndex + 1}`}
          />
        ) : (
          <div className='hero-placeholder'>
            <span>skell.</span>
          </div>
        )}
        <div className='hero-image-caption'>
          <span>ETT HEM I BALANS</span>
          {images.length > 0 && (
            <span>
              {String(imageIndex + 1).padStart(2, '0')} /{' '}
              {String(images.length).padStart(2, '0')}
            </span>
          )}
        </div>
        <div className='hero-stamp'>
          <span>
            GODA
            <br />
            TING
            <br />
            <em>här</em>
          </span>
        </div>
      </div>
    </section>
  )
}
