import { useState } from 'react'
import type { SubmitEvent } from 'react'
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CreditCard,
  Minus,
  Plus,
  ReceiptText,
  ShoppingBag,
  Smartphone,
  Truck,
  X
} from 'lucide-react'
import { useCartStore } from '../stores/cart'
import { formatPrice } from '../utils/format'

type CheckoutStep = 'cart' | 'checkout' | 'complete'
type PaymentMethod = 'card' | 'swish' | 'invoice'

interface CartDrawerProps {
  onClose: () => void
}

export const CartDrawer = ({ onClose }: CartDrawerProps) => {
  const [step, setStep] = useState<CheckoutStep>('cart')
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card')
  const [orderNumber, setOrderNumber] = useState('')
  const { items, incrementItem, decrementItem, removeItem, clearCart } = useCartStore()
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const count = items.reduce((sum, item) => sum + item.quantity, 0)
  const shipping = total >= 1000 ? 0 : 49
  const orderTotal = total + shipping

  function completeMockOrder(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()
    setOrderNumber(`SL-${Date.now().toString().slice(-6)}`)
    clearCart()
    setStep('complete')
  }

  return (
    <div
      className='fixed inset-0 z-10 flex justify-end bg-[rgb(23_34_29/42%)] animate-fade-in'
      onMouseDown={event => event.target === event.currentTarget && onClose()}
    >
      <aside
        className='flex h-full w-full max-w-md flex-col overflow-y-auto bg-paper shadow-xl animate-slide-in'
        role='dialog'
        aria-modal='true'
        aria-labelledby={step === 'cart' ? 'cart-title' : 'checkout-title'}
      >
        <header className='flex min-h-23 items-center justify-between border-b border-line px-6 py-5'>
          <div>
            <span className='inline-flex items-center gap-2 text-xs font-semibold tracking-widest text-[#68766d]'>DINA FAVORITER</span>
            <h2 className='mt-1 mb-0 font-serif text-2xl font-medium' id={step === 'cart' ? 'cart-title' : 'checkout-title'}>
              {step === 'cart' ? (
                <>Varukorg <span className='font-sans text-xs text-[#838b83]'>({count})</span></>
              ) : step === 'checkout' ? 'Kassa' : 'Tack för din beställning!'}
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
        {step === 'complete' ? (
          <div className='flex flex-1 flex-col items-center justify-center p-7 text-center'>
            <span className='grid size-14 place-items-center rounded-full bg-[#e8eee8] text-forest'>
              <Check size={26} />
            </span>
            <h3 className='mb-2 mt-5 font-serif text-2xl font-medium'>Tack för ditt testköp!</h3>
            <p className='mb-1 mt-0 text-xs text-[#69736b]'>Din order <strong>{orderNumber}</strong> är registrerad i den här demonstrationen.</p>
            <p className='mb-6 mt-3 max-w-xs text-xs text-[#838981]'>Ingen betalning har genomförts och inga uppgifter har skickats till en betaltjänst.</p>
            <button className='flex min-h-11 items-center gap-2 bg-forest px-5 text-xs text-white transition-colors hover:bg-accent' type='button' onClick={onClose}>
              Tillbaka till butiken <ArrowRight size={16} />
            </button>
          </div>
        ) : step === 'checkout' ? (
          <form className='flex flex-1 flex-col' id='mock-checkout' onSubmit={completeMockOrder}>
            <div className='flex-1 space-y-6 overflow-auto px-6 py-5'>
              <button
                className='inline-flex items-center gap-2 border-0 bg-transparent p-0 text-xs text-forest'
                type='button'
                onClick={() => setStep('cart')}
              >
                <ArrowLeft size={15} /> Tillbaka till varukorgen
              </button>

              <section>
                <h3 className='mb-3 mt-0 font-serif text-lg font-medium'>Dina uppgifter</h3>
                <div className='grid grid-cols-2 gap-3'>
                  <label className='col-span-2 flex flex-col gap-1.5 text-xs text-[#59645d]'>
                    Namn
                    <input className='min-h-10 border border-line bg-white px-3 text-xs text-ink outline-none focus:border-forest' autoComplete='name' id='checkout-name' name='name' required />
                  </label>
                  <label className='col-span-2 flex flex-col gap-1.5 text-xs text-[#59645d]'>
                    E-post
                    <input className='min-h-10 border border-line bg-white px-3 text-xs text-ink outline-none focus:border-forest' autoComplete='email' id='checkout-email' name='email' type='email' required />
                  </label>
                  <label className='col-span-2 flex flex-col gap-1.5 text-xs text-[#59645d]'>
                    Adress
                    <input className='min-h-10 border border-line bg-white px-3 text-xs text-ink outline-none focus:border-forest' autoComplete='street-address' id='checkout-address' name='address' required />
                  </label>
                  <label className='flex flex-col gap-1.5 text-xs text-[#59645d]'>
                    Postnummer
                    <input className='min-h-10 border border-line bg-white px-3 text-xs text-ink outline-none focus:border-forest' autoComplete='postal-code' id='checkout-postal-code' name='postalCode' required />
                  </label>
                  <label className='flex flex-col gap-1.5 text-xs text-[#59645d]'>
                    Ort
                    <input className='min-h-10 border border-line bg-white px-3 text-xs text-ink outline-none focus:border-forest' autoComplete='address-level2' id='checkout-city' name='city' required />
                  </label>
                </div>
              </section>

              <section>
                <h3 className='mb-3 mt-0 font-serif text-lg font-medium'>Välj demosätt att betala</h3>
                <div className='space-y-2'>
                  {([
                    ['card', 'Kort (demo)'],
                    ['swish', 'Swish (demo)'],
                    ['invoice', 'Faktura (demo)']
                  ] as const).map(([value, label]) => (
                    <label className='flex min-h-11 cursor-pointer items-center gap-3 border border-line px-3 text-xs text-ink' key={value}>
                      <input
                        checked={paymentMethod === value}
                        className='accent-forest'
                        id={`payment-${value}`}
                        name='paymentMethod'
                        onChange={() => setPaymentMethod(value)}
                        type='radio'
                        value={value}
                      />
                      {value === 'card' ? <CreditCard size={16} /> : value === 'swish' ? <Smartphone size={16} /> : <ReceiptText size={16} />}
                      {label}
                    </label>
                  ))}
                </div>
                <p className='mb-0 mt-2 text-xs text-[#838981]'>Det här är endast ett val i demonstrationen. Ingen betalning sker.</p>
              </section>

              <section className='border-t border-line pt-4'>
                <h3 className='mb-3 mt-0 font-serif text-lg font-medium'>Din beställning</h3>
                {items.map(item => (
                  <div className='flex justify-between gap-3 py-1.5 text-xs' key={item.id}>
                    <span className='min-w-0 overflow-hidden text-ellipsis whitespace-nowrap text-[#59645d]'>{item.title} × {item.quantity}</span>
                    <strong className='shrink-0'>{formatPrice(item.price * item.quantity)}</strong>
                  </div>
                ))}
                <div className='mt-3 flex items-center justify-between border-t border-line pt-3 text-xs'>
                  <span className='flex items-center gap-2 text-[#59645d]'><Truck size={15} /> Frakt</span>
                  <strong>{shipping === 0 ? 'Gratis' : formatPrice(shipping)}</strong>
                </div>
                {shipping > 0 && <p className='mb-0 mt-1 text-right text-xs text-[#838981]'>Fri frakt över 1 000 kr</p>}
                <div className='mt-3 flex justify-between border-t border-line pt-3 text-xs'>
                  <strong>Totalt</strong>
                  <strong>{formatPrice(orderTotal)}</strong>
                </div>
              </section>
            </div>
            <footer className='border-t border-line px-6 pb-6 pt-4'>
              <p className='mb-3 mt-0 text-xs text-[#838981]'>Demo-kassa — inga pengar dras och ingen order skickas.</p>
              <button className='flex min-h-11 w-full items-center justify-between bg-forest px-4 text-xs text-white transition-colors hover:bg-accent' type='submit'>
                Bekräfta testköp <ArrowRight size={17} />
              </button>
            </footer>
          </form>
        ) : items.length === 0 ? (
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
              <p className='mb-4 mt-2 text-xs text-[#838981]'>Demo-kassa — ingen riktig betalning genomförs. Frakt visas i nästa steg.</p>
              <button
                className='flex min-h-11 w-full items-center justify-between bg-forest px-4 text-xs text-white transition-colors hover:bg-accent'
                type='button'
                onClick={() => setStep('checkout')}
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
