import { Link } from 'react-router-dom'
import type { CatalogProduct } from '@/src/lib/supabase'
import { getCategoryByEnum } from '@/src/lib/categories'

interface CompareTableProps {
  current: CatalogProduct
  related: CatalogProduct[]
}

export default function CompareTable({ current, related }: CompareTableProps) {
  if (related.length === 0) return null

  // Compare current + up to 2 related products
  const products = [current, ...related.slice(0, 2)]

  const getFeatureCount = (p: CatalogProduct) => p.metadata?.features?.length || 0
  const getMaterials = (p: CatalogProduct) => p.metadata?.materials?.join(', ') || '-'
  const getPhotoCount = (p: CatalogProduct) => p.processed_photo_urls?.length || 0

  const rows = [
    { label: 'Photos', getValue: (p: CatalogProduct) => `${getPhotoCount(p)} angles` },
    { label: 'Features', getValue: (p: CatalogProduct) => `${getFeatureCount(p)} detected` },
    { label: 'Materials', getValue: getMaterials },
    { label: 'Lifestyle View', getValue: (p: CatalogProduct) => p.lifestyle_photo_url ? 'Yes' : 'No' },
    { label: 'Supply', getValue: () => 'Pan Central India' },
  ]

  return (
    <div className='overflow-x-auto'>
      <table className='w-full text-sm'>
        <thead>
          <tr className='border-b border-gray-200'>
            <th className='text-left py-3 pr-4 text-xs text-gray-400 uppercase tracking-wider font-medium w-28'>
              Feature
            </th>
            {products.map((p) => {
              const cat = getCategoryByEnum(p.category || '')
              return (
                <th key={p.id} className='text-left py-3 px-3'>
                  {p.id === current.id ? (
                    <span className='font-bold text-gray-900'>{p.name}</span>
                  ) : (
                    <Link
                      to={`/products/${cat?.slug || 'executive-chairs'}/${p.slug}`}
                      className='font-medium text-gray-600 hover:text-gray-900 hover:underline'
                    >
                      {p.name}
                    </Link>
                  )}
                </th>
              )
            })}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.label} className='border-b border-gray-50'>
              <td className='py-2.5 pr-4 text-xs text-gray-500 font-medium'>{row.label}</td>
              {products.map((p) => (
                <td
                  key={p.id}
                  className={`py-2.5 px-3 text-xs ${p.id === current.id ? 'text-gray-900 font-medium' : 'text-gray-500'}`}
                >
                  {row.getValue(p)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
