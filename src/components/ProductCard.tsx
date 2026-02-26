import { Link } from 'react-router-dom'
import type { CatalogProduct } from '@/src/lib/supabase'
import { getCategoryByEnum } from '@/src/lib/categories'

interface ProductCardProps {
  product: CatalogProduct
}

export default function ProductCard({ product }: ProductCardProps) {
  const category = getCategoryByEnum(product.category || '')
  const categorySlug = category?.slug || 'executive-chairs'

  const image = product.thumbnail_url || product.processed_photo_urls?.[0] || product.raw_photo_urls?.[0]

  return (
    <Link
      to={`/products/${categorySlug}/${product.slug}`}
      className='group block bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-gray-200 hover:shadow-lg transition-all duration-300'
    >
      <div className='aspect-square bg-gray-50 overflow-hidden'>
        {image ? (
          <img
            src={image}
            alt={product.name || 'Product'}
            className='w-full h-full object-contain p-4 transition-transform duration-300 group-hover:scale-105'
            loading='lazy'
          />
        ) : (
          <div className='w-full h-full flex items-center justify-center text-gray-300'>
            <svg className='w-16 h-16' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1} d='M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z' />
            </svg>
          </div>
        )}
      </div>
      <div className='p-4'>
        {category && (
          <span className='text-xs font-medium text-gray-400 uppercase tracking-wider'>
            {category.series}
          </span>
        )}
        <h3 className='font-semibold text-gray-900 mt-0.5 group-hover:text-gray-700 transition-colors'>
          {product.name}
        </h3>
        {product.model_url && (
          <span className='inline-flex items-center gap-1 text-xs text-blue-600 mt-1'>
            <svg className='w-3 h-3' fill='currentColor' viewBox='0 0 20 20'>
              <path d='M10 12a2 2 0 100-4 2 2 0 000 4z' />
              <path fillRule='evenodd' d='M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z' clipRule='evenodd' />
            </svg>
            3D Available
          </span>
        )}
      </div>
    </Link>
  )
}
