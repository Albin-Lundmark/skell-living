import type { CategoryFilter, ProductResponse } from '../types'

const API_URL = 'https://dummyjson.com/products/category'
const PRODUCTS_API_URL = 'https://dummyjson.com/products'
const categories = ['furniture', 'home-decoration'] as const
export const PRODUCTS_PER_PAGE = 6

export interface ProductPage {
  products: ProductResponse['products']
  total: number
  pageCount: number
}

async function fetchCategoryPage(
  category: string,
  limit: number,
  skip: number,
  signal?: AbortSignal
): Promise<ProductResponse> {
  const params = new URLSearchParams({
    limit: String(limit),
    skip: String(skip)
  })
  const response = await fetch(`${API_URL}/${category}?${params}`, { signal })

  if (!response.ok) {
    throw new Error(
      `Kunde inte hämta ${category === 'furniture' ? 'möbler' : 'inredning'} (${response.status}).`
    )
  }

  return (await response.json()) as ProductResponse
}

export async function fetchProductsPage(
  category: CategoryFilter,
  page: number,
  signal?: AbortSignal
): Promise<ProductPage> {
  const offset = (page - 1) * PRODUCTS_PER_PAGE

  if (category !== 'all') {
    const result = await fetchCategoryPage(
      category,
      PRODUCTS_PER_PAGE,
      offset,
      signal
    )
    return {
      products: result.products,
      total: result.total,
      pageCount: Math.max(1, Math.ceil(result.total / PRODUCTS_PER_PAGE))
    }
  }

  const categoryTotals = await Promise.all(
    categories.map(category => fetchCategoryPage(category, 1, 0, signal))
  )
  const total = categoryTotals.reduce((sum, result) => sum + result.total, 0)
  let categoryOffset = 0

  const pageResults = await Promise.all(
    categoryTotals.map((result, index) => {
      const start = Math.max(offset, categoryOffset)
      const end = Math.min(
        offset + PRODUCTS_PER_PAGE,
        categoryOffset + result.total
      )
      const skip = Math.max(0, start - categoryOffset)
      categoryOffset += result.total
      const limit = Math.max(0, end - start)

      return limit > 0
        ? fetchCategoryPage(categories[index], limit, skip, signal)
        : null
    })
  )

  return {
    products: pageResults.flatMap(result => result?.products ?? []),
    total,
    pageCount: Math.max(1, Math.ceil(total / PRODUCTS_PER_PAGE))
  }
}

export async function fetchProductById(
  id: number,
  signal?: AbortSignal
): Promise<ProductResponse['products'][number]> {
  const response = await fetch(`${PRODUCTS_API_URL}/${id}`, { signal })

  if (response.status === 404) {
    throw new Error('Produkten kunde inte hittas.')
  }

  if (!response.ok) {
    throw new Error(`Kunde inte hämta produkten (${response.status}).`)
  }

  return (await response.json()) as ProductResponse['products'][number]
}

export async function fetchProductCatalog(
  signal?: AbortSignal
): Promise<ProductResponse['products']> {
  const results = await Promise.all(
    categories.map(category => fetchCategoryPage(category, 100, 0, signal))
  )
  return results
    .flatMap(result => result.products)
    .sort((first, second) => first.id - second.id)
}
