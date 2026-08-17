import { MessageCircle } from 'lucide-react'
import { track } from '@/src/lib/analytics'

/**
 * The one WhatsApp entry point that follows you down the page. The navbar and
 * footer each have their own "WhatsApp us" button, but both scroll out of
 * view; this is the fixed, always-reachable one, the way a showroom keeps a
 * salesperson within arm's reach rather than only at the door.
 */
const WHATSAPP_NUMBER = '919981516171'

export default function WhatsAppFloat() {
  return (
    <a
      href={`https://wa.me/${WHATSAPP_NUMBER}`}
      target='_blank'
      rel='noopener noreferrer'
      onClick={() => track('WHATSAPP_CLICK', { meta: { context: 'floating-button' } })}
      aria-label='Chat with us on WhatsApp'
      className='pressable fixed bottom-5 right-5 z-40 flex items-center justify-center w-14 h-14 rounded-full bg-green-600 text-white shadow-lg hover:bg-green-700 transition-colors'
    >
      <MessageCircle className='w-7 h-7' />
    </a>
  )
}
