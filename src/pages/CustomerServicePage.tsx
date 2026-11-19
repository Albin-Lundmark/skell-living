import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

export const CustomerServicePage = () => (
  <article className='mx-auto max-w-screen-2xl px-6 py-16 lg:px-16 max-lg:px-7 max-sm:px-4 max-sm:py-12'>
    <section className='mx-auto max-w-3xl'>
      <span className='text-xs font-semibold tracking-widest text-[#68766d]'>
        VI FINNS HÄR FÖR DIG
      </span>
      <h1 className='mb-4 mt-3 font-serif text-5xl font-medium max-sm:text-4xl'>
        Kundservice
      </h1>
      <p className='max-w-2xl text-base leading-relaxed text-[#69736b]'>
        Behöver du hjälp med att hitta rätt till ditt hem? Vi hjälper dig gärna
        med frågor om sortimentet, beställningar, leveranser och returer.
      </p>
      <div className='mt-10 grid gap-6 border-t border-line py-6 sm:grid-cols-2'>
        <section>
          <h2 className='font-serif text-2xl font-medium'>Beställning och sortiment</h2>
          <p className='mt-2 text-sm leading-relaxed text-[#69736b]'>
            Utforska produkterna och deras information på produktsidorna. Där
            hittar du bland annat pris, lagerstatus och tillgängliga detaljer.
          </p>
        </section>
        <section>
          <h2 className='font-serif text-2xl font-medium'>Leverans och retur</h2>
          <p className='mt-2 text-sm leading-relaxed text-[#69736b]'>
            Information om leverans och retur visas på respektive produktsida
            när den finns tillgänglig.
          </p>
        </section>
      </div>
      <Link
        className='mt-4 inline-flex items-center gap-2 border-b border-current pb-1 text-sm text-forest'
        to='/#shop'
      >
        Till sortimentet <ArrowRight size={16} />
      </Link>
    </section>
  </article>
)
