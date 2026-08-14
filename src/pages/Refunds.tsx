/**
 * Refunds and cancellations.
 *
 * Two audiences, one page. A buyer wants to know what happens if the chair
 * turns up broken; a payment aggregator reviewing us for activation wants a
 * clearly labelled, linked policy with timelines in it. Both are served by
 * saying plainly what we actually do.
 *
 * Every clause here has to agree with the Terms, with the replacement cover
 * sold at checkout, and with what actually happens in the workshop. A policy
 * that promises something the factory does not do is worse than no policy.
 */

import { Link } from 'react-router-dom'
import Footer from '@/src/components/Footer'
import SEO from '@/src/components/SEO'

const WHATSAPP = '919981516171'

export default function Refunds() {
  return (
    <div className='bg-white min-h-screen flex flex-col'>
      <SEO
        title='Refund and Cancellation Policy'
        description='How cancellations, replacements and refunds work on orders placed with MVM Aasanam.'
        canonical='/refunds'
      />

      <div className='max-w-3xl mx-auto px-4 sm:px-6 lg:px-10 pt-28 pb-20 md:pt-36 md:pb-28 flex-1'>
        <p className='text-xs font-semibold tracking-widest uppercase text-gray-400 mb-3'>Legal</p>
        <h1 className='font-display text-3xl md:text-4xl font-bold text-gray-900 mb-2'>
          Refund and Cancellation Policy
        </h1>
        <p className='text-sm text-gray-400 mb-12'>
          Applies to orders placed on mvm-furniture.com &middot; Last updated: 14 August 2026
        </p>

        <div className='prose prose-gray max-w-none space-y-10 text-sm text-gray-600 leading-relaxed'>

          <section>
            <div className='bg-gray-50 rounded-xl p-5'>
              <p className='text-xs text-gray-500'>
                In short: cancel any time before dispatch for a full refund. If what arrives is
                damaged or faulty, tell us within 48 hours and we replace it at our cost. We do
                not take chairs back because someone changed their mind about the colour.
              </p>
            </div>
          </section>

          <section>
            <h2 className='text-lg font-semibold text-gray-900 mb-3'>1. Cancelling an order</h2>
            <ul className='list-disc pl-6 space-y-2'>
              <li><strong>Before dispatch.</strong> Message us on WhatsApp with your order number and we cancel it. The full amount, including any replacement cover you bought, is refunded. Nothing is deducted.</li>
              <li><strong>After dispatch.</strong> The goods are with the transporter and already on their way, so a cancellation at this stage is treated as a return: see section 3.</li>
              <li><strong>Made to order goods.</strong> Items built to your own size, fabric or finish cannot be cancelled once production has started, because they cannot be sold to anyone else. We will always tell you before we start.</li>
            </ul>
          </section>

          <section>
            <h2 className='text-lg font-semibold text-gray-900 mb-3'>2. Damaged, faulty or wrong goods</h2>
            <p className='mb-3'>
              Check the packaging before you sign for the delivery. If a carton is torn, crushed or
              open, note it on the transporter&rsquo;s receipt and photograph it.
            </p>
            <ul className='list-disc pl-6 space-y-2'>
              <li>Report the problem within <strong>48 hours of delivery</strong>, on WhatsApp or by phone, with photographs of the item and the packaging.</li>
              <li>If the goods reached you damaged, are defective in manufacture, or are not what you ordered, we <strong>replace them free of charge</strong> and we pay the freight both ways.</li>
              <li>Where a replacement is not possible, we refund the amount you paid for that item in full.</li>
              <li>Manufacturing defects that appear later are handled under the warranty in our <Link to='/terms' className='underline underline-offset-2'>Terms</Link>, or under the replacement cover if you bought it.</li>
            </ul>
          </section>

          <section>
            <h2 className='text-lg font-semibold text-gray-900 mb-3'>3. Returns for any other reason</h2>
            <ul className='list-disc pl-6 space-y-2'>
              <li>Furniture is bulky and fragile in transit, so we do not accept returns simply because you changed your mind, ordered the wrong model, or no longer need the item.</li>
              <li>If we do agree to take goods back as a goodwill exception, they must be unused, in original packaging, and the two way freight is deducted from the refund.</li>
              <li>Goods that have been assembled, used, modified or damaged after delivery cannot be returned.</li>
            </ul>
          </section>

          <section>
            <h2 className='text-lg font-semibold text-gray-900 mb-3'>4. Replacement cover</h2>
            <p>
              Care and Care Plus are optional add ons bought at checkout. They are a replacement
              undertaking, not a refund scheme: within the cover period we send a new item rather
              than returning your money. The fee for the cover itself is refundable only while the
              order can still be cancelled under section 1.
            </p>
          </section>

          <section>
            <h2 className='text-lg font-semibold text-gray-900 mb-3'>5. How refunds are paid</h2>
            <ul className='list-disc pl-6 space-y-2'>
              <li>Refunds go back to the <strong>same method you paid with</strong>: the same UPI ID, the same card, the same bank account. We cannot send a refund somewhere else.</li>
              <li>We start the refund within <strong>2 working days</strong> of approving it.</li>
              <li>It then takes <strong>5 to 7 working days</strong> to appear, depending on your bank. That part is with your bank and the payment gateway, not with us.</li>
              <li>You get the reference number on WhatsApp as soon as the refund is raised.</li>
            </ul>
          </section>

          <section>
            <h2 className='text-lg font-semibold text-gray-900 mb-3'>6. Raising a request</h2>
            <p className='mb-3'>
              Quote your order number, which starts with WEB, and the number the order was placed
              with.
            </p>
            <ul className='list-disc pl-6 space-y-2'>
              <li>WhatsApp: <a href={`https://wa.me/${WHATSAPP}`} className='underline underline-offset-2'>+91 99815 16171</a></li>
              <li>Phone: <a href='tel:+919981516171' className='underline underline-offset-2'>+91 99815 16171</a></li>
              <li>Email: <a href='mailto:mvmfurniture.hse@gmail.com' className='underline underline-offset-2'>mvmfurniture.hse@gmail.com</a></li>
              <li>Post: Hari Shewa Enterprises, 01 Ambedkar Road, Neemuch, Madhya Pradesh 458441</li>
            </ul>
          </section>
        </div>
      </div>

      <Footer />
    </div>
  )
}
