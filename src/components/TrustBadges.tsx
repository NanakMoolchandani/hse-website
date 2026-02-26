import { Shield, Award, MapPin, Package } from 'lucide-react'

const BADGES = [
  { icon: Shield, label: 'ISO 9001', detail: 'Certified Quality' },
  { icon: Award, label: '1 Year Warranty', detail: 'On Mechanism' },
  { icon: MapPin, label: 'Made in India', detail: 'Neemuch, MP' },
  { icon: Package, label: 'Bulk Ready', detail: '10 to 10,000 units' },
]

export default function TrustBadges() {
  return (
    <div className='grid grid-cols-4 gap-3'>
      {BADGES.map((badge) => (
        <div
          key={badge.label}
          className='text-center p-3 rounded-xl bg-gradient-to-b from-gray-50 to-white border border-gray-100'
        >
          <badge.icon className='w-5 h-5 text-gray-700 mx-auto mb-1.5' />
          <p className='text-xs font-bold text-gray-900 leading-tight'>{badge.label}</p>
          <p className='text-[10px] text-gray-400 mt-0.5'>{badge.detail}</p>
        </div>
      ))}
    </div>
  )
}
