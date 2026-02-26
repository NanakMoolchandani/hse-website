import type { ProductFeature } from '@/src/lib/supabase'
import {
  Armchair,
  Wind,
  Settings,
  Move,
  Shield,
  Layers,
  Gauge,
  RotateCcw,
  Star,
  Zap,
  type LucideIcon,
} from 'lucide-react'

const ICON_MAP: Record<string, LucideIcon> = {
  armchair: Armchair,
  wind: Wind,
  settings: Settings,
  move: Move,
  shield: Shield,
  layers: Layers,
  gauge: Gauge,
  'rotate-3d': RotateCcw,
  star: Star,
  zap: Zap,
}

interface FeatureHighlightsProps {
  features: ProductFeature[]
}

export default function FeatureHighlights({ features }: FeatureHighlightsProps) {
  if (features.length === 0) return null

  return (
    <div className='grid grid-cols-2 md:grid-cols-3 gap-4'>
      {features.map((feature, i) => {
        const Icon = ICON_MAP[feature.icon] || Star
        return (
          <div
            key={i}
            className='group relative bg-gray-50 rounded-xl p-4 hover:bg-gray-900 transition-all duration-300 cursor-default'
          >
            <div className='flex items-start gap-3'>
              <div className='w-9 h-9 rounded-lg bg-white group-hover:bg-white/10 flex items-center justify-center shrink-0 transition-colors'>
                <Icon className='w-4.5 h-4.5 text-gray-700 group-hover:text-white transition-colors' />
              </div>
              <div className='min-w-0'>
                <p className='text-sm font-semibold text-gray-900 group-hover:text-white transition-colors'>
                  {feature.label}
                </p>
                <p className='text-xs text-gray-500 group-hover:text-gray-400 mt-0.5 leading-relaxed transition-colors'>
                  {feature.detail}
                </p>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
