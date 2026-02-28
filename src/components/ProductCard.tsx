import { useRef } from 'react'
import { Link } from 'react-router-dom'
import type { CatalogProduct } from '@/src/lib/supabase'
import { getCategoryByEnum } from '@/src/lib/categories'
import { ProductImageLamp } from '@/src/components/ui/product-image-lamp'

interface ProductCardProps {
  product: CatalogProduct
  variant?: 'light' | 'dark'
}

export default function ProductCard({ product, variant = 'light' }: ProductCardProps) {
  const category = getCategoryByEnum(product.category || '')
  const categorySlug = category?.slug || 'executive-chairs'
  const cardRef = useRef<HTMLAnchorElement>(null)

  const image = product.processed_photo_urls?.[0] || product.thumbnail_url || product.raw_photo_urls?.[0]
  const featureCount = product.metadata?.features?.length || 0

  const isDark = variant === 'dark'
  const isTouchDevice = typeof window !== 'undefined' && 'ontouchstart' in window

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
      className={`group block rounded-2xl overflow-hidden border transition-all duration-300 ${
        isDark
          ? 'bg-white/[0.03] border-white/[0.08] hover:border-white/20 hover:bg-white/[0.06] hover:shadow-2xl hover:shadow-white/5 backdrop-blur-sm'
          : 'bg-white border-gray-800/20 hover:border-gray-600/30 hover:shadow-xl hover:shadow-black/20'
      }`}
      onMouseMove={isTouchDevice ? undefined : handleMouseMove}
      onMouseLeave={isTouchDevice ? undefined : handleMouseLeave}
      style={{ transition: 'transform 0.15s ease-out, box-shadow 0.3s ease, border-color 0.3s ease, background-color 0.3s ease' }}
    >
      {image ? (
        <ProductImageLamp
          src={image}
          alt={product.name || 'Product'}
          category={product.category || ''}
          variant='card'
        />
      ) : (
        <div className='aspect-square bg-slate-950 overflow-hidden relative rounded-2xl flex items-center justify-center text-gray-500'>
          <svg className='w-16 h-16' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1} d='M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z' />
          </svg>
        </div>
      )}
      <div className='p-4'>
        {category && (
          <span className={`text-xs font-medium uppercase tracking-wider ${
            isDark ? 'text-gray-500' : 'text-gray-400'
          }`}>
            {category.series}
          </span>
        )}
        <h3 className={`font-semibold mt-0.5 transition-colors ${
          isDark
            ? 'text-gray-100 group-hover:text-white'
            : 'text-gray-900 group-hover:text-gray-700'
        }`}>
          {product.name}
        </h3>
        {featureCount > 0 && (
          <span className={`inline-flex items-center gap-1 text-xs mt-1 ${
            isDark ? 'text-gray-500' : 'text-gray-400'
          }`}>
            {featureCount} features
          </span>
        )}
      </div>
    </Link>
  )
}
