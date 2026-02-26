import { MessageCircle } from 'lucide-react'

interface WhatsAppButtonProps {
  productName: string
  className?: string
}

export default function WhatsAppButton({ productName, className = '' }: WhatsAppButtonProps) {
  const message = `Hi, I'm interested in ${productName}. Can you share details and pricing?`
  const url = `https://wa.me/919131438300?text=${encodeURIComponent(message)}`

  return (
    <a
      href={url}
      target='_blank'
      rel='noopener noreferrer'
      className={`inline-flex items-center gap-2 bg-green-600 text-white font-semibold px-6 py-3 rounded-full hover:bg-green-700 transition-colors ${className}`}
    >
      <MessageCircle className='w-5 h-5' />
      Enquire on WhatsApp
    </a>
  )
}
