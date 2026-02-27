import { Link } from 'react-router-dom'

export default function Terms() {
  return (
    <div className='bg-white'>
      <div className='max-w-3xl mx-auto px-6 lg:px-10 pt-28 pb-20 md:pt-36 md:pb-28'>
        <p className='text-xs font-semibold tracking-widest uppercase text-gray-400 mb-3'>
          Legal
        </p>
        <h1 className='font-display text-3xl md:text-4xl font-bold text-gray-900 mb-2'>
          Terms of Service
        </h1>
        <p className='text-sm text-gray-400 mb-12'>Last updated: February 2026</p>

        <div className='prose prose-gray max-w-none space-y-8 text-sm text-gray-600 leading-relaxed'>
          <section>
            <h2 className='text-lg font-semibold text-gray-900 mb-3'>1. General</h2>
            <p>
              These Terms of Service govern your use of the website operated by Hari Shewa Enterprises
              ("Company"), trading as MVM Aasanam, located in Neemuch, Madhya Pradesh, India. By
              accessing or using this website, you agree to be bound by these terms.
            </p>
          </section>

          <section>
            <h2 className='text-lg font-semibold text-gray-900 mb-3'>2. Products & Services</h2>
            <p>
              We manufacture and supply commercial office and cafeteria furniture. Product images,
              specifications, and descriptions on this website are for reference purposes. Actual
              products may vary slightly in colour, material finish, and dimensions based on
              customization and batch production.
            </p>
          </section>

          <section>
            <h2 className='text-lg font-semibold text-gray-900 mb-3'>3. Pricing & Quotations</h2>
            <ul className='list-disc pl-6 space-y-2'>
              <li>All prices are in Indian Rupees (INR) and are subject to applicable GST (18%).</li>
              <li>Prices are not fixed and may vary based on order volume, customization, and market conditions.</li>
              <li>A formal quotation is provided for every order and is valid for the period stated therein.</li>
              <li>Quotations do not constitute a binding contract until accepted by both parties.</li>
            </ul>
          </section>

          <section>
            <h2 className='text-lg font-semibold text-gray-900 mb-3'>4. Orders & Payment</h2>
            <ul className='list-disc pl-6 space-y-2'>
              <li>Orders are confirmed upon receipt of advance payment as per the agreed terms.</li>
              <li>Payment terms are specified in the quotation and may include advance, milestone, or credit terms for established clients.</li>
              <li>All payments must be made to the designated Hari Shewa Enterprises bank account.</li>
            </ul>
          </section>

          <section>
            <h2 className='text-lg font-semibold text-gray-900 mb-3'>5. Delivery</h2>
            <ul className='list-disc pl-6 space-y-2'>
              <li>Standard delivery timelines are 7 to 15 working days from order confirmation.</li>
              <li>Large institutional orders may require 3 to 4 weeks.</li>
              <li>Delivery timelines are estimates and may vary due to logistics or customization requirements.</li>
              <li>Installation support is available on request and may incur additional charges.</li>
            </ul>
          </section>

          <section>
            <h2 className='text-lg font-semibold text-gray-900 mb-3'>6. Warranty & Returns</h2>
            <ul className='list-disc pl-6 space-y-2'>
              <li>All chairs come with a 1-year warranty on the mechanism (gas lift, tilt, adjustment controls).</li>
              <li>Structural defects identified within the warranty period will be repaired or replaced at no cost.</li>
              <li>Warranty does not cover damage caused by misuse, unauthorised modifications, or normal wear and tear.</li>
              <li>Custom-configured products are non-returnable unless defective.</li>
            </ul>
          </section>

          <section>
            <h2 className='text-lg font-semibold text-gray-900 mb-3'>7. Intellectual Property</h2>
            <p>
              All content on this website — including text, images, logos, and design — is the property
              of Hari Shewa Enterprises. You may not reproduce, distribute, or use any content without
              our prior written consent.
            </p>
          </section>

          <section>
            <h2 className='text-lg font-semibold text-gray-900 mb-3'>8. Limitation of Liability</h2>
            <p>
              To the maximum extent permitted by law, Hari Shewa Enterprises shall not be liable for
              any indirect, incidental, or consequential damages arising from the use of this website
              or our products. Our total liability shall not exceed the amount paid by you for the
              specific product or service in question.
            </p>
          </section>

          <section>
            <h2 className='text-lg font-semibold text-gray-900 mb-3'>9. Governing Law</h2>
            <p>
              These terms shall be governed by and construed in accordance with the laws of India.
              Any disputes arising from these terms shall be subject to the exclusive jurisdiction
              of the courts in Neemuch, Madhya Pradesh.
            </p>
          </section>

          <section>
            <h2 className='text-lg font-semibold text-gray-900 mb-3'>10. Contact</h2>
            <p>For any questions about these terms:</p>
            <ul className='list-none space-y-1 mt-3'>
              <li><strong>Hari Shewa Enterprises</strong></li>
              <li>Neemuch, Madhya Pradesh, India</li>
              <li>Phone: +91 91314 38300</li>
              <li>Email: mvmfurniture.hse@gmail.com</li>
              <li>GSTIN: 23AJUPM2209E1ZD</li>
            </ul>
          </section>
        </div>
      </div>

      <footer className='bg-white border-t border-gray-100 py-8'>
        <div className='max-w-3xl mx-auto px-6 lg:px-10 flex flex-col sm:flex-row justify-between gap-4 text-sm text-gray-400'>
          <Link to='/' className='hover:text-gray-600 transition-colors'>&larr; Back to Home</Link>
          <Link to='/privacy' className='hover:text-gray-600 transition-colors'>Privacy Policy</Link>
        </div>
      </footer>
    </div>
  )
}
