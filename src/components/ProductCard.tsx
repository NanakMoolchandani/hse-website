import { useRef } from 'react'
import { Link } from 'react-router-dom'
import type { CatalogProduct } from '@/src/lib/supabase'
import { getCategoryByEnum } from '@/src/lib/categories'

interface ProductCardProps {
  product: CatalogProduct
}

export default function ProductCard({ product }: ProductCardProps) {
  const category = getCategoryByEnum(product.category || '')
  const categorySlug = category?.slug || 'executive-chairs'
  const cardRef = useRef<HTMLAnchorElement>(null)

  const image = product.processed_photo_urls?.[0] || product.thumbnail_url || product.raw_photo_urls?.[0]
  const featureCount = product.metadata?.features?.length || 0

  // Premium 3D tilt effect on mouse move
  const handleMouseMove = (e: React.MouseEvent) => {
    const card = cardRef.current
    if (!card) return
    const rect = card.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width
    const y = (e.clientY - rect.top) / rect.height
    const rotateX = (y - 0.5) * -8
    const rotateY = (x - 0.5) * 8
    card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`
  }

  const handleMouseLeave = () => {
    const card = cardRef.current
    if (card) card.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) scale(1)'
  }

  return (
    <Link
      ref={cardRef}
      to={`/products/${categorySlug}/${product.slug}`}
      className='group block bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-gray-200 hover:shadow-xl transition-all duration-300'
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ transition: 'transform 0.15s ease-out, box-shadow 0.3s ease, border-color 0.3s ease' }}
    >
      <div className='aspect-square bg-gray-50 overflow-hidden relative'>
        {image ? (
          <img
            src={image}
            alt={product.name || 'Product'}
            className='w-full h-full object-contain transition-transform duration-500 group-hover:scale-110'
            loading='lazy'
          />
        ) : (
          <div className='w-full h-full flex items-center justify-center text-gray-300'>
            <svg className='w-16 h-16' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1} d='M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z' />
            </svg>
          </div>
        )}
        {/* Subtle shine effect on hover */}
        <div className='absolute inset-0 bg-gradient-to-br from-white/0 via-white/0 to-white/0 group-hover:from-white/10 group-hover:via-white/5 group-hover:to-white/0 transition-all duration-500 pointer-events-none' />
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
        {featureCount > 0 && (
          <span className='inline-flex items-center gap-1 text-xs text-gray-400 mt-1'>
            {featureCount} features
          </span>
        )}
      </div>
    </Link>
  )
}
