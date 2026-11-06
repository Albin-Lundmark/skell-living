import { useState } from 'react'
import { ArrowRight, Minus, Plus, ShoppingBag, X } from 'lucide-react'
import { useCartStore } from '../stores/cart'
import { formatPrice } from '../utils/format'

interface CartDrawerProps {
  onClose: () => void
}

export default function CartDrawer({ onClose }: CartDrawerProps) {
  const [checkoutNotice, setCheckoutNotice] = useState(false)
  const { items, incrementItem, decrementItem, removeItem } = useCartStore()
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const count = items.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <div
      className='drawer-backdrop'
      onMouseDown={event => event.target === event.currentTarget && onClose()}
    >
      <aside
        className='cart-drawer'
        role='dialog'
        aria-modal='true'
        aria-labelledby='cart-title'
      >
        <header className='drawer-header'>
          <div>
            <span className='eyebrow'>DINA FAVORITER</span>
            <h2 id='cart-title'>
              Varukorg <span>({count})</span>
            </h2>
          </div>
          <button
            className='icon-button'
            type='button'
            onClick={onClose}
            aria-label='Stäng varukorgen'
          >
            <X size={20} />
          </button>
        </header>
        {items.length === 0 ? (
          <div className='empty-cart'>
            <ShoppingBag size={34} strokeWidth={1.3} />
            <h3>Här var det tomt.</h3>
            <p>Hitta något som gör ditt hem lite mer du.</p>
            <button className='text-link' type='button' onClick={onClose}>
              Till sortimentet <ArrowRight size={15} />
            </button>
          </div>
        ) : (
          <>
            <div className='cart-items'>
              {items.map(item => (
                <article className='cart-item' key={item.id}>
                  <img src={item.thumbnail} alt='' />
                  <div className='cart-item-copy'>
                    <h3>{item.title}</h3>
                    <span>{formatPrice(item.price)}</span>
                    <div className='quantity-control'>
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
                    className='remove-item'
                    type='button'
                    onClick={() => removeItem(item.id)}
                    aria-label={`Ta bort ${item.title}`}
                  >
                    <X size={15} />
                  </button>
                </article>
              ))}
            </div>
            <footer className='cart-footer'>
              <div className='subtotal'>
                <span>Delsumma</span>
                <strong>{formatPrice(total)}</strong>
              </div>
              <p role={checkoutNotice ? 'status' : undefined}>
                {checkoutNotice
                  ? 'Kassan är inte ansluten i den här förhandsvisningen.'
                  : 'Frakt och eventuella skatter beräknas i kassan.'}
              </p>
              <button
                className='checkout-button'
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
