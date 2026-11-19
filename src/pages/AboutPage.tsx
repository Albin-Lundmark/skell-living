import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

export const AboutPage = () => (
  <article className='mx-auto max-w-screen-2xl px-6 py-16 lg:px-16 max-lg:px-7 max-sm:px-4 max-sm:py-12'>
    <section className='mx-auto max-w-3xl'>
      <span className='text-xs font-semibold tracking-widest text-[#68766d]'>
        FORM FÖR VARDAGEN
      </span>
      <h1 className='mb-4 mt-3 font-serif text-5xl font-medium max-sm:text-4xl'>
        Om oss
      </h1>
      <p className='text-lg leading-relaxed text-[#69736b]'>
        Skell Living handlar om rum att landa i och ett hem som känns som ditt.
        Vi vill göra det enkelt att upptäcka möbler och inredning som ger
        vardagen lite mer värme och personlighet.
      </p>
      <div className='my-10 border-y border-line py-8'>
        <h2 className='font-serif text-3xl font-medium'>Små saker. Stor skillnad.</h2>
        <p className='mt-3 max-w-2xl text-sm leading-relaxed text-[#69736b]'>
          Från möbler till de små detaljerna samlar vi inspiration för ett hem
          att trivas i — med omtanke om både form och känsla.
        </p>
      </div>
      <Link
        className='inline-flex items-center gap-2 border-b border-current pb-1 text-sm text-forest'
        to='/#shop'
      >
        Upptäck sortimentet <ArrowRight size={16} />
      </Link>
    </section>
  </article>
)
