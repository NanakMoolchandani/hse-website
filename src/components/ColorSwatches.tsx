import type { ProductColor } from '@/src/lib/supabase'

interface ColorSwatchesProps {
  colors: ProductColor[]
  materials: string[]
}

export default function ColorSwatches({ colors, materials }: ColorSwatchesProps) {
  if (colors.length === 0 && materials.length === 0) return null

  return (
    <div className='space-y-4'>
      {/* Color swatches */}
      {colors.length > 0 && (
        <div>
          <p className='text-xs text-gray-400 uppercase tracking-wider mb-2'>Colors</p>
          <div className='flex gap-3'>
            {colors.map((color, i) => (
              <div key={i} className='flex items-center gap-2 group cursor-default'>
                <div
                  className='w-7 h-7 rounded-full border-2 border-white shadow-md ring-1 ring-gray-200 group-hover:ring-gray-400 transition-all group-hover:scale-110'
                  style={{ backgroundColor: color.hex }}
                  title={color.name}
                />
                <span className='text-xs text-gray-600 font-medium'>{color.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Material tags */}
      {materials.length > 0 && (
        <div>
          <p className='text-xs text-gray-400 uppercase tracking-wider mb-2'>Materials</p>
          <div className='flex flex-wrap gap-2'>
            {materials.map((material, i) => (
              <span
                key={i}
                className='text-xs font-medium text-gray-600 bg-gray-100 px-3 py-1.5 rounded-full hover:bg-gray-200 transition-colors'
              >
                {material}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
