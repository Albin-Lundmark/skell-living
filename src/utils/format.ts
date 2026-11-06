const currency = new Intl.NumberFormat('sv-SE', {
  style: 'currency',
  currency: 'SEK',
  maximumFractionDigits: 0
})

export function formatPrice(price: number) {
  return currency.format(price).replace(/\s/g, '\u00a0')
}

export function getCategoryLabel(category: string) {
  if (category === 'furniture') return 'Möbler'
  if (category === 'home-decoration') return 'Inredning'
  return category
}
