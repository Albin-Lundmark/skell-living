import { useState } from 'react'
import { ArrowRight, Minus, Plus, ShoppingBag, X } from 'lucide-react'
import { useCartStore } from '../stores/cart'
import { formatPrice } from '../utils/format'

interface CartDrawerProps {
  onClose: () => void
}

export const CartDrawer = ({ onClose }: CartDrawerProps) => {
  const [checkoutNotice, setCheckoutNotice] = useState(false)
  const { items, incrementItem, decrementItem, removeItem } = useCartStore()
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const count = items.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <div
      className='fixed inset-0 z-10 flex justify-end bg-[rgb(23_34_29/42%)] animate-fade-in'
      onMouseDown={event => event.target === event.currentTarget && onClose()}
    >
      <aside
        className='flex h-full w-full max-w-md flex-col bg-paper shadow-xl animate-slide-in'
        role='dialog'
        aria-modal='true'
        aria-labelledby='cart-title'
      >
        <header className='flex min-h-23 items-center justify-between border-b border-line px-6 py-5'>
          <div>
            <span className='inline-flex items-center gap-2 text-xs font-semibold tracking-widest text-[#68766d]'>DINA FAVORITER</span>
            <h2 className='mt-1 mb-0 font-serif text-2xl font-medium' id='cart-title'>
              Varukorg <span className='font-sans text-xs text-[#838b83]'>({count})</span>
            </h2>
          </div>
          <button
            className='grid size-9 place-items-center rounded-full border border-[#e6e3db] bg-paper transition-colors hover:border-accent hover:text-accent'
            type='button'
            onClick={onClose}
            aria-label='Stäng varukorgen'
          >
            <X size={20} />
          </button>
        </header>
        {items.length === 0 ? (
          <div className='flex flex-1 flex-col items-center justify-center p-7 text-center'>
            <ShoppingBag className='text-accent' size={34} strokeWidth={1.3} />
            <h3 className='mt-4 mb-1 font-serif text-2xl font-medium'>Här var det tomt.</h3>
            <p className='mb-4 mt-0 text-xs text-[#7a817b]'>Hitta något som gör ditt hem lite mer du.</p>
            <button className='inline-flex items-center gap-2 border-0 border-b border-current bg-transparent text-xs text-forest' type='button' onClick={onClose}>
              Till sortimentet <ArrowRight size={15} />
            </button>
          </div>
        ) : (
          <>
            <div className='flex-1 overflow-auto px-6'>
              {items.map(item => (
                <article className='relative flex gap-3 border-b border-line py-4' key={item.id}>
                  <img className='h-21 w-20 bg-[#eceae3] object-cover' src={item.thumbnail} alt='' />
                  <div className='min-w-0 flex-1'>
                    <h3 className='mb-1 mr-5 mt-1 overflow-hidden text-ellipsis whitespace-nowrap text-xs font-medium'>{item.title}</h3>
                    <span className='text-xs text-[#69736b]'>{formatPrice(item.price)}</span>
                    <div className='mt-3 flex h-6 w-fit items-center border border-line'>
                      <button
                        type='button'
                        onClick={() => decrementItem(item.id)}
                        aria-label={`Minska antal ${item.title}`}
                      >
                        <Minus size={13} />
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        type='button'
                        onClick={() => incrementItem(item.id)}
                        aria-label={`Öka antal ${item.title}`}
                      >
                        <Plus size={13} />
                      </button>
                    </div>
                  </div>
                  <button
                    className='absolute right-0 top-4 grid size-7 place-items-center bg-transparent text-[#858b85]'
                    type='button'
                    onClick={() => removeItem(item.id)}
                    aria-label={`Ta bort ${item.title}`}
                  >
                    <X size={15} />
                  </button>
                </article>
              ))}
            </div>
            <footer className='border-t border-line px-6 pb-6 pt-5'>
              <div className='flex justify-between text-xs'>
                <span>Delsumma</span>
                <strong>{formatPrice(total)}</strong>
              </div>
              <p className='mb-4 mt-2 text-xs text-[#838981]' role={checkoutNotice ? 'status' : undefined}>
                {checkoutNotice
                  ? 'Kassan är inte ansluten i den här förhandsvisningen.'
                  : 'Frakt och eventuella skatter beräknas i kassan.'}
              </p>
              <button
                className='flex min-h-11 w-full items-center justify-between bg-forest px-4 text-xs text-white transition-colors hover:bg-accent'
                type='button'
                onClick={() => setCheckoutNotice(true)}
              >
                Fortsätt till kassan <ArrowRight size={17} />
              </button>
            </footer>
          </>
        )}
      </aside>
    </div>
  )
}
