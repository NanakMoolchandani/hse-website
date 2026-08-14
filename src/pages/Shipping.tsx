/**
 * Shipping and delivery.
 *
 * Required in its own right by any payment aggregator reviewing the site, and
 * useful anyway: the single most asked question before someone pays is "when
 * will it reach me, and what does delivery cost?"
 *
 * The answer to the second one is nothing, and that is not a promotion. The
 * freight is already inside every price on the shop, which is why no delivery
 * line ever appears at checkout. Saying that plainly here is what stops it
 * reading as a hidden charge later.
 */

import { Link } from 'react-router-dom'
import Footer from '@/src/components/Footer'
import SEO from '@/src/components/SEO'

const WHATSAPP = '919981516171'

export default function Shipping() {
  return (
    <div className='bg-white min-h-screen flex flex-col'>
      <SEO
        title='Shipping and Delivery Policy'
        description='Delivery timelines, coverage and charges for orders placed with MVM Aasanam.'
        canonical='/shipping'
      />

      <div className='max-w-3xl mx-auto px-4 sm:px-6 lg:px-10 pt-28 pb-20 md:pt-36 md:pb-28 flex-1'>
        <p className='text-xs font-semibold tracking-widest uppercase text-gray-400 mb-3'>Legal</p>
        <h1 className='font-display text-3xl md:text-4xl font-bold text-gray-900 mb-2'>
          Shipping and Delivery Policy
        </h1>
        <p className='text-sm text-gray-400 mb-12'>
          Applies to orders placed on mvm-furniture.com &middot; Last updated: 14 August 2026
        </p>

        <div className='prose prose-gray max-w-none space-y-10 text-sm text-gray-600 leading-relaxed'>

          <section>
            <div className='bg-gray-50 rounded-xl p-5'>
              <p className='text-xs text-gray-500'>
                In short: delivery anywhere in India is included in the price you see. Ready stock
                leaves our factory within 2 to 3 working days and typically reaches you within a
                week.
              </p>
            </div>
          </section>

          <section>
            <h2 className='text-lg font-semibold text-gray-900 mb-3'>1. What delivery costs</h2>
            <ul className='list-disc pl-6 space-y-2'>
              <li>Nothing extra. Freight is already built into every price on the shop, which is why your total at checkout is the price of the goods and nothing else.</li>
              <li>This applies to every serviceable PIN code in India. We do not charge more for a distant address.</li>
              <li>Prices shown include GST. The tax split, CGST and SGST or IGST, is decided by the delivery state and is printed on your invoice.</li>
            </ul>
          </section>

          <section>
            <h2 className='text-lg font-semibold text-gray-900 mb-3'>2. How long it takes</h2>
            <ul className='list-disc pl-6 space-y-2'>
              <li><strong>Dispatch.</strong> Items in stock leave the factory in Neemuch within 2 to 3 working days of your payment clearing.</li>
              <li><strong>Made to order.</strong> Items built to your own size, fabric or finish take 10 to 15 working days to produce before dispatch. We confirm the date with you on WhatsApp.</li>
              <li><strong>In transit.</strong> Madhya Pradesh and neighbouring states, usually 2 to 4 working days from dispatch. Rest of India, usually 4 to 8 working days.</li>
              <li>These are working days and exclude Sundays and public holidays. Transporter strikes, floods and similar disruptions are outside our control, and we tell you as soon as we know.</li>
            </ul>
          </section>

          <section>
            <h2 className='text-lg font-semibold text-gray-900 mb-3'>3. Where we deliver</h2>
            <ul className='list-disc pl-6 space-y-2'>
              <li>Across India, by surface transport. We do not ship outside India.</li>
              <li>A few remote PIN codes are not reachable by our transporters. If yours is one of them we will call you after the order and either arrange an alternative or refund you in full.</li>
              <li>Delivery is made to the address you entered at checkout. Please give a landmark and a number that will be answered, because the driver will call.</li>
            </ul>
          </section>

          <section>
            <h2 className='text-lg font-semibold text-gray-900 mb-3'>4. Receiving the goods</h2>
            <ul className='list-disc pl-6 space-y-2'>
              <li>Delivery is to the doorstep at ground level. Carrying items up a staircase or into a lift is at the driver&rsquo;s discretion and is not part of the service.</li>
              <li>Chairs ship partly knocked down in cartons and need simple assembly. Instructions are in the box, and we will walk you through it on a video call if you want.</li>
              <li>Check the cartons before you sign. If anything is torn, crushed or open, write it on the transporter&rsquo;s receipt and photograph it. See the <Link to='/refunds' className='underline underline-offset-2'>Refund and Cancellation Policy</Link> for what happens next.</li>
              <li>Installation of large or bulk orders is arranged case by case. Ask us before you order.</li>
            </ul>
          </section>

          <section>
            <h2 className='text-lg font-semibold text-gray-900 mb-3'>5. Tracking your order</h2>
            <ul className='list-disc pl-6 space-y-2'>
              <li>We send updates on WhatsApp to the number you gave at checkout: order confirmed, dispatched, and the transporter&rsquo;s docket number.</li>
              <li>You can look the order up any time at <Link to='/order/track' className='underline underline-offset-2'>Track your order</Link> with the order number and that same phone number.</li>
            </ul>
          </section>

          <section>
            <h2 className='text-lg font-semibold text-gray-900 mb-3'>6. Getting in touch</h2>
            <ul className='list-disc pl-6 space-y-2'>
              <li>WhatsApp: <a href={`https://wa.me/${WHATSAPP}`} className='underline underline-offset-2'>+91 99815 16171</a></li>
              <li>Phone: <a href='tel:+919981516171' className='underline underline-offset-2'>+91 99815 16171</a></li>
              <li>Email: <a href='mailto:mvmfurniture.hse@gmail.com' className='underline underline-offset-2'>mvmfurniture.hse@gmail.com</a></li>
              <li>Factory: Hari Shewa Enterprises, 01 Ambedkar Road, Neemuch, Madhya Pradesh 458441</li>
            </ul>
          </section>
        </div>
      </div>

      <Footer />
    </div>
  )
}
