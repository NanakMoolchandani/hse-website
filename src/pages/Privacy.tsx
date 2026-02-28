import { Link } from 'react-router-dom'

export default function Privacy() {
  return (
    <div className='bg-white'>
      <div className='max-w-3xl mx-auto px-6 lg:px-10 pt-28 pb-20 md:pt-36 md:pb-28'>
        <p className='text-xs font-semibold tracking-widest uppercase text-gray-400 mb-3'>
          Legal
        </p>
        <h1 className='font-display text-3xl md:text-4xl font-bold text-gray-900 mb-2'>
          Privacy Policy
        </h1>
        <p className='text-sm text-gray-400 mb-12'>Last updated: February 2026</p>

        <div className='prose prose-gray max-w-none space-y-8 text-sm text-gray-600 leading-relaxed'>
          <section>
            <h2 className='text-lg font-semibold text-gray-900 mb-3'>1. Introduction</h2>
            <p>
              Hari Shewa Enterprises ("we", "us", "our"), operating under the brand name MVM Aasanam,
              is committed to protecting your privacy. This Privacy Policy explains how we collect, use,
              and safeguard your information when you visit our website or interact with us through
              WhatsApp, phone, or other communication channels.
            </p>
          </section>

          <section>
            <h2 className='text-lg font-semibold text-gray-900 mb-3'>2. Information We Collect</h2>
            <p>We may collect the following types of information:</p>
            <ul className='list-disc pl-6 space-y-2 mt-3'>
              <li><strong>Contact Information:</strong> Name, phone number, email address, and business name when you enquire about our products or request a quotation.</li>
              <li><strong>Order Information:</strong> Product specifications, quantities, delivery addresses, and payment details for processing orders.</li>
              <li><strong>Communication Data:</strong> Messages exchanged through WhatsApp, phone calls, or email in the course of business.</li>
              <li><strong>Website Usage:</strong> Anonymous analytics data such as pages visited, time spent, and device information collected through standard web analytics.</li>
            </ul>
          </section>

          <section>
            <h2 className='text-lg font-semibold text-gray-900 mb-3'>3. How We Use Your Information</h2>
            <p>We use your information to:</p>
            <ul className='list-disc pl-6 space-y-2 mt-3'>
              <li>Respond to enquiries and provide quotations</li>
              <li>Process and fulfil orders</li>
              <li>Communicate about order status, delivery, and after sales support</li>
              <li>Improve our products and services</li>
              <li>Comply with legal and tax obligations (GST, invoicing)</li>
            </ul>
          </section>

          <section>
            <h2 className='text-lg font-semibold text-gray-900 mb-3'>4. Information Sharing</h2>
            <p>
              We do not sell, rent, or trade your personal information to third parties. We may share
              your information only with:
            </p>
            <ul className='list-disc pl-6 space-y-2 mt-3'>
              <li>Logistics and delivery partners for order fulfilment</li>
              <li>Payment processors for transaction processing</li>
              <li>Government authorities when required by law (tax filings, legal compliance)</li>
            </ul>
          </section>

          <section>
            <h2 className='text-lg font-semibold text-gray-900 mb-3'>5. Data Security</h2>
            <p>
              We implement reasonable security measures to protect your information from unauthorized
              access, alteration, or disclosure. However, no method of transmission over the internet
              is 100% secure, and we cannot guarantee absolute security.
            </p>
          </section>

          <section>
            <h2 className='text-lg font-semibold text-gray-900 mb-3'>6. Cookies</h2>
            <p>
              Our website may use cookies and similar technologies for basic functionality and analytics.
              You can control cookie preferences through your browser settings.
            </p>
          </section>

          <section>
            <h2 className='text-lg font-semibold text-gray-900 mb-3'>7. Your Rights</h2>
            <p>
              You have the right to access, correct, or delete your personal information held by us.
              To exercise these rights, contact us at the details provided below.
            </p>
          </section>

          <section>
            <h2 className='text-lg font-semibold text-gray-900 mb-3'>8. Contact Us</h2>
            <p>For any privacy related questions or requests:</p>
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
          <Link to='/terms' className='hover:text-gray-600 transition-colors'>Terms of Service</Link>
        </div>
      </footer>
    </div>
  )
}
