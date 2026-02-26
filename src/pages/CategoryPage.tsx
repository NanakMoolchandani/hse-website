import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getCategoryBySlug, CATEGORIES } from '@/src/lib/categories'
import { fetchProducts, type CatalogProduct } from '@/src/lib/supabase'
import ProductCard from '@/src/components/ProductCard'
import { ChevronRight } from 'lucide-react'

export default function CategoryPage() {
  const { category } = useParams<{ category: string }>()
  const [products, setProducts] = useState<CatalogProduct[]>([])
  const [loading, setLoading] = useState(true)

  const categoryInfo = getCategoryBySlug(category || '')

  useEffect(() => {
    if (!categoryInfo) return
    setLoading(true)
    fetchProducts(categoryInfo.enum).then((data) => {
      setProducts(data)
      setLoading(false)
    })
  }, [categoryInfo?.enum])

  if (!categoryInfo) {
    return (
      <div className='min-h-screen bg-white pt-24'>
        <div className='max-w-7xl mx-auto px-6 lg:px-10 text-center'>
          <h1 className='text-3xl font-bold text-gray-900 mb-4'>Category not found</h1>
          <p className='text-gray-500 mb-8'>The category you're looking for doesn't exist.</p>
          <Link to='/' className='text-gray-900 font-medium hover:underline'>
            Back to Home
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-white pt-20'>
      {/* Breadcrumb */}
      <div className='max-w-7xl mx-auto px-6 lg:px-10 pt-4 pb-2'>
        <nav className='flex items-center gap-1 text-sm text-gray-400'>
          <Link to='/' className='hover:text-gray-700'>Home</Link>
          <ChevronRight className='w-3 h-3' />
          <span className='text-gray-700'>{categoryInfo.label}</span>
        </nav>
      </div>

      {/* Header */}
      <div className='max-w-7xl mx-auto px-6 lg:px-10 py-8'>
        <p className='text-xs font-semibold tracking-widest uppercase text-gray-400 mb-2'>
          {categoryInfo.series}
        </p>
        <h1 className='font-display text-3xl md:text-5xl font-bold text-gray-900 mb-3'>
          {categoryInfo.label}
        </h1>
        <p className='text-gray-500 text-lg max-w-xl'>
          {categoryInfo.description}
        </p>
      </div>

      {/* Category tabs */}
      <div className='max-w-7xl mx-auto px-6 lg:px-10 pb-6'>
        <div className='flex gap-2 overflow-x-auto pb-2'>
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              to={`/products/${cat.slug}`}
              className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                cat.slug === category
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {cat.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Product grid */}
      <div className='max-w-7xl mx-auto px-6 lg:px-10 pb-20'>
        {loading ? (
          <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className='animate-pulse'>
                <div className='aspect-square bg-gray-100 rounded-2xl' />
                <div className='p-4 space-y-2'>
                  <div className='h-3 w-16 bg-gray-100 rounded' />
                  <div className='h-4 w-32 bg-gray-100 rounded' />
                </div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className='text-center py-20'>
            <div className='w-20 h-20 mx-auto mb-4 rounded-full bg-gray-50 flex items-center justify-center'>
              <svg className='w-10 h-10 text-gray-300' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1} d='M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4' />
              </svg>
            </div>
            <h3 className='text-lg font-semibold text-gray-900 mb-2'>No products yet</h3>
            <p className='text-gray-500'>Products in this category will appear here once published.</p>
          </div>
        ) : (
          <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
