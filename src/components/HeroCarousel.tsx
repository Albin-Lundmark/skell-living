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
    <section className='grid min-h-108 grid-cols-2 gap-10 px-6 lg:px-16 pb-12 pt-8 max-lg:gap-6 max-lg:px-7 max-sm:min-h-0 max-sm:grid-cols-1 max-sm:gap-6 max-sm:px-4 max-sm:pb-7 max-sm:pt-16' aria-label='Säsongens utvalda'>
      <div className='relative animate-rise-in self-stretch py-7 pb-8 max-sm:py-1'>
        <span className='inline-flex items-center gap-2 text-xs font-semibold tracking-widest text-[#68766d]'>
          <span className='size-1 rounded-full bg-accent' /> FORM FÖR VARDAGEN
        </span>
        <h1 className='my-5 mb-3 font-serif text-7xl font-medium leading-none tracking-tight max-sm:mt-3 max-sm:text-6xl'>
          Rum att
          <br />
          <em className='font-medium text-accent'>landa i.</em>
        </h1>
        <p className='m-0 max-w-82 text-xs leading-relaxed text-[#69736b] max-sm:max-w-72 max-sm:text-xs'>
          Omtänksamt utvalda detaljer och möbler som gör vardagen lite vackrare.
        </p>
        <a className='mt-5 inline-flex h-11 w-fit items-center gap-5 bg-forest px-4 text-xs text-white transition-all duration-200 hover:gap-6 hover:bg-accent max-sm:mt-4 max-sm:h-10' href='#shop'>
          Upptäck sortimentet <ArrowRight size={17} />
        </a>
        <div className='absolute bottom-9 right-1 flex items-center gap-2 text-xs leading-normal text-[#748077] max-lg:hidden'>
          <Leaf size={16} strokeWidth={1.6} />
          <span>
            Form som håller
            <br />
            lite längre
          </span>
        </div>
      </div>
      <div className='relative min-h-87 overflow-hidden bg-[#d7d3c7] animate-rise-in-slow max-sm:max-h-72 max-sm:min-h-64 before:pointer-events-none before:absolute before:bottom-0 before:left-0 before:right-0 before:top-1/2 before:z-10 before:bg-[linear-gradient(transparent,rgb(26_39_33/48%))]'>
        {product ? (
          <img
            className='absolute inset-0 h-full min-h-87 w-full animate-hero-image-in object-cover object-center mix-blend-multiply max-sm:max-h-72 max-sm:min-h-64'
            key={images[imageIndex]}
            src={images[imageIndex]}
            alt={`${product.title}, bild ${imageIndex + 1}`}
          />
        ) : (
          <div className='grid h-full min-h-87 w-full place-items-center text-6xl font-bold tracking-tighter text-[#b7b2a7] max-sm:max-h-72 max-sm:min-h-64'>
            <span>skell.</span>
          </div>
        )}
        <div className='absolute bottom-4 left-5 right-5 z-10 flex justify-between text-xs tracking-widest text-white'>
          <span>ETT HEM I BALANS</span>
          {images.length > 0 && (
            <span>
              {String(imageIndex + 1).padStart(2, '0')} /{' '}
              {String(images.length).padStart(2, '0')}
            </span>
          )}
        </div>
        <div className='absolute right-4 top-4 z-10 grid size-22 rotate-12 place-items-center rounded-full bg-[#e9b08c] text-center text-[#293d33] max-sm:size-18'>
          <span className='text-xs font-semibold leading-tight tracking-wider max-sm:text-xs'>
            GODA
            <br />
            TING
            <br />
            <em className='font-serif text-sm font-medium max-sm:text-xs'>här</em>
          </span>
        </div>
      </div>
    </section>
  )
}
