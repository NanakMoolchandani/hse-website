import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// ── Types ──────────────────────────────────────────────────────────

export interface CatalogProduct {
  id: number
  name: string | null
  slug: string | null
  category: string | null
  description: string | null
  description_hindi: string | null
  status: string | null
  raw_photo_urls: string[]
  processed_photo_urls: string[]
  thumbnail_url: string | null
  model_url: string | null
  sort_order: number
  is_featured: boolean
  created_at: string
  updated_at: string
}

// ── Data Fetchers ──────────────────────────────────────────────────

export async function fetchProducts(category?: string): Promise<CatalogProduct[]> {
  let query = supabase
    .from('catalog_products')
    .select('*')
    .eq('status', 'PUBLISHED')
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false })

  if (category) {
    query = query.eq('category', category)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching products:', error)
    return []
  }

  return data || []
}

export async function fetchProduct(slug: string): Promise<CatalogProduct | null> {
  const { data, error } = await supabase
    .from('catalog_products')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'PUBLISHED')
    .single()

  if (error) {
    console.error('Error fetching product:', error)
    return null
  }

  return data
}

export async function fetchProductCounts(): Promise<Record<string, number>> {
  const { data, error } = await supabase
    .from('catalog_products')
    .select('category')
    .eq('status', 'PUBLISHED')

  if (error) {
    console.error('Error fetching product counts:', error)
    return {}
  }

  const counts: Record<string, number> = {}
  for (const item of data || []) {
    if (item.category) {
      counts[item.category] = (counts[item.category] || 0) + 1
    }
  }
  return counts
}
