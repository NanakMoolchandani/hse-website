import Footer from '@/src/components/Footer'

export default function Privacy() {
  return (
    <div className='bg-white min-h-screen flex flex-col'>
      <div className='max-w-3xl mx-auto px-4 sm:px-6 lg:px-10 pt-28 pb-20 md:pt-36 md:pb-28 flex-1'>
        <p className='text-xs font-semibold tracking-widest uppercase text-gray-400 mb-3'>
          Legal
        </p>
        <h1 className='font-display text-3xl md:text-4xl font-bold text-gray-900 mb-2'>
          Privacy Policy
        </h1>
        <p className='text-sm text-gray-400 mb-12'>Effective date: 1 February 2026 &middot; Last updated: 28 February 2026</p>

        <div className='prose prose-gray max-w-none space-y-10 text-sm text-gray-600 leading-relaxed'>

          {/* 1. Introduction */}
          <section>
            <h2 className='text-lg font-semibold text-gray-900 mb-3'>1. Introduction and Scope</h2>
            <p>
              This Privacy Policy explains how <strong>Hari Shewa Enterprises</strong> ("Company", "we", "us", "our"),
              operating under the brand name <strong>MVM Aasanam</strong>, collects, uses, stores, and protects
              your personal data. This policy applies to all interactions with us, including but not limited to our
              website (mvm-furniture.com), WhatsApp, telephone, email, and any other communication channels.
            </p>
            <p className='mt-3'>
              Hari Shewa Enterprises is the Data Fiduciary as defined under the Digital Personal Data Protection
              Act, 2023 (DPDPA). We are committed to processing your personal data in accordance with applicable
              Indian law, including the Information Technology Act, 2000 and the DPDPA.
            </p>
            <div className='bg-gray-50 rounded-xl p-5 mt-4'>
              <p className='text-xs text-gray-500 uppercase tracking-wider font-semibold mb-2'>Company Details</p>
              <ul className='list-none space-y-1 text-sm text-gray-600'>
                <li><strong>Registered Name:</strong> Hari Shewa Enterprises</li>
                <li><strong>Brand:</strong> MVM Aasanam</li>
                <li><strong>Location:</strong> Neemuch, Madhya Pradesh, India</li>
                <li><strong>GSTIN:</strong> 23AJUPM2209E1ZD</li>
              </ul>
            </div>
          </section>

          {/* 2. Definitions */}
          <section>
            <h2 className='text-lg font-semibold text-gray-900 mb-3'>2. Definitions</h2>
            <ul className='list-disc pl-6 space-y-2'>
              <li><strong>"Personal Data"</strong> means any data about an individual who is identifiable by or in relation to such data, as defined under the DPDPA, 2023.</li>
              <li><strong>"Data Principal"</strong> means the individual to whom the personal data relates (you, the user).</li>
              <li><strong>"Data Fiduciary"</strong> means the entity that determines the purpose and means of processing personal data (Hari Shewa Enterprises).</li>
              <li><strong>"Processing"</strong> means any operation performed on personal data, including collection, storage, use, sharing, and deletion.</li>
            </ul>
          </section>

          {/* 3. Data We Collect */}
          <section>
            <h2 className='text-lg font-semibold text-gray-900 mb-3'>3. Personal Data We Collect</h2>
            <p className='mb-4'>We collect personal data through the following means:</p>

            <h3 className='text-sm font-semibold text-gray-800 mb-2'>3.1 Information You Provide Directly</h3>
            <ul className='list-disc pl-6 space-y-2 mb-4'>
              <li><strong>Identity and Contact Data:</strong> Name, phone number, email address, business name, designation, and postal address when you enquire about products, request a quotation, or place an order.</li>
              <li><strong>Business Data:</strong> GSTIN, company registration details, and billing information for B2B transactions.</li>
              <li><strong>Order Data:</strong> Product specifications, quantities, customization preferences, delivery addresses, and payment details.</li>
              <li><strong>Communication Data:</strong> Messages, voice notes, and media exchanged through WhatsApp, Telegram, phone calls, or email in the course of business.</li>
            </ul>

            <h3 className='text-sm font-semibold text-gray-800 mb-2'>3.2 Information Collected Automatically</h3>
            <ul className='list-disc pl-6 space-y-2'>
              <li><strong>Device and Usage Data:</strong> IP address, browser type, operating system, pages visited, time spent on pages, and referring URLs collected through standard web analytics.</li>
              <li><strong>Cookies:</strong> Small data files stored on your device to enable basic website functionality and analyse usage patterns. See Section 7 for details.</li>
            </ul>
          </section>

          {/* 4. How We Use Data */}
          <section>
            <h2 className='text-lg font-semibold text-gray-900 mb-3'>4. How We Use Your Personal Data</h2>
            <p className='mb-3'>We process your personal data for the following purposes:</p>
            <div className='overflow-x-auto'>
              <table className='w-full text-sm border-collapse'>
                <thead>
                  <tr className='border-b border-gray-200'>
                    <th className='text-left py-2 pr-4 font-semibold text-gray-900'>Purpose</th>
                    <th className='text-left py-2 font-semibold text-gray-900'>Legal Basis</th>
                  </tr>
                </thead>
                <tbody className='text-gray-600'>
                  <tr className='border-b border-gray-100'>
                    <td className='py-2 pr-4'>Responding to enquiries and providing quotations</td>
                    <td className='py-2'>Consent / Contractual necessity</td>
                  </tr>
                  <tr className='border-b border-gray-100'>
                    <td className='py-2 pr-4'>Processing and fulfilling orders</td>
                    <td className='py-2'>Contractual necessity</td>
                  </tr>
                  <tr className='border-b border-gray-100'>
                    <td className='py-2 pr-4'>Generating invoices and tax documentation</td>
                    <td className='py-2'>Legal obligation (GST Act)</td>
                  </tr>
                  <tr className='border-b border-gray-100'>
                    <td className='py-2 pr-4'>Communicating order status, delivery updates, and support</td>
                    <td className='py-2'>Contractual necessity</td>
                  </tr>
                  <tr className='border-b border-gray-100'>
                    <td className='py-2 pr-4'>Improving products, services, and website experience</td>
                    <td className='py-2'>Legitimate use (DPDPA S.7)</td>
                  </tr>
                  <tr className='border-b border-gray-100'>
                    <td className='py-2 pr-4'>Complying with tax, legal, and regulatory obligations</td>
                    <td className='py-2'>Legal obligation</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* 5. Sharing */}
          <section>
            <h2 className='text-lg font-semibold text-gray-900 mb-3'>5. Who We Share Your Data With</h2>
            <p className='mb-3'>
              We do not sell, rent, or trade your personal data to any third party. We may share your data only
              with the following categories of recipients, and only to the extent necessary:
            </p>
            <ul className='list-disc pl-6 space-y-2'>
              <li><strong>Logistics and Transport Partners:</strong> For order delivery and installation services.</li>
              <li><strong>Payment Processors and Banks:</strong> For processing payments against invoices. All payments are made to our designated HDFC Bank account.</li>
              <li><strong>Technology Service Providers:</strong> Cloud hosting, analytics, and communication platforms that assist in our business operations. These providers are contractually bound to protect your data.</li>
              <li><strong>Government and Tax Authorities:</strong> When required by law, including GST return filings, tax audits, and compliance with court orders or regulatory directions.</li>
              <li><strong>Professional Advisors:</strong> Auditors, legal counsel, and accountants as necessary for business operations.</li>
            </ul>
          </section>

          {/* 6. Data Retention */}
          <section>
            <h2 className='text-lg font-semibold text-gray-900 mb-3'>6. Data Retention</h2>
            <p>We retain your personal data only for as long as necessary to fulfil the purposes for which it was collected:</p>
            <ul className='list-disc pl-6 space-y-2 mt-3'>
              <li><strong>Transaction and Invoice Records:</strong> 8 years from the end of the relevant financial year, as required under Indian tax law.</li>
              <li><strong>Communication Records:</strong> Up to 3 years from the date of last interaction, unless a longer retention is required for ongoing business or legal purposes.</li>
              <li><strong>Website Analytics Data:</strong> Up to 26 months in anonymised or aggregated form.</li>
              <li><strong>Account and Contact Data:</strong> Until you request deletion or until the data is no longer required for business purposes.</li>
            </ul>
            <p className='mt-3'>
              When personal data is no longer required, we will securely delete or anonymise it in accordance with
              our data retention procedures.
            </p>
          </section>

          {/* 7. Cookies */}
          <section>
            <h2 className='text-lg font-semibold text-gray-900 mb-3'>7. Cookies and Tracking Technologies</h2>
            <p className='mb-3'>Our website uses the following categories of cookies:</p>
            <ul className='list-disc pl-6 space-y-2'>
              <li><strong>Essential Cookies:</strong> Required for basic website functionality such as page navigation and secure access. These cannot be disabled.</li>
              <li><strong>Analytics Cookies:</strong> Help us understand how visitors interact with our website by collecting information anonymously. You can opt out of analytics cookies through your browser settings.</li>
            </ul>
            <p className='mt-3'>
              We do not use advertising or behavioural tracking cookies. You can manage your cookie preferences
              through your browser settings. Disabling essential cookies may affect website functionality.
            </p>
          </section>

          {/* 8. Data Security */}
          <section>
            <h2 className='text-lg font-semibold text-gray-900 mb-3'>8. Data Security</h2>
            <p>
              We implement appropriate technical and organisational security measures to protect your personal data
              from unauthorised access, alteration, disclosure, or destruction. These measures include encrypted
              data transmission (SSL/TLS), access controls, and secure cloud infrastructure.
            </p>
            <p className='mt-3'>
              In the event of a data breach that is likely to cause harm to Data Principals, we will notify the
              Data Protection Board of India within 72 hours and take immediate remedial action, as required under
              the DPDPA.
            </p>
          </section>

          {/* 9. Your Rights */}
          <section>
            <h2 className='text-lg font-semibold text-gray-900 mb-3'>9. Your Rights as a Data Principal</h2>
            <p className='mb-3'>Under the DPDPA 2023 and applicable Indian law, you have the following rights:</p>
            <ul className='list-disc pl-6 space-y-2'>
              <li><strong>Right to Access:</strong> You may request a summary of your personal data being processed by us and the processing activities undertaken.</li>
              <li><strong>Right to Correction:</strong> You may request correction of inaccurate or incomplete personal data.</li>
              <li><strong>Right to Erasure:</strong> You may request deletion of your personal data, subject to applicable legal retention requirements.</li>
              <li><strong>Right to Withdraw Consent:</strong> Where processing is based on your consent, you may withdraw consent at any time. Withdrawal of consent will not affect the lawfulness of processing done prior to the withdrawal.</li>
              <li><strong>Right to Grievance Redressal:</strong> You may raise a grievance with our Grievance Officer (see Section 12). If unsatisfied with the resolution, you may escalate to the Data Protection Board of India.</li>
              <li><strong>Right to Nominate:</strong> You may nominate another individual to exercise your rights in the event of your death or incapacity.</li>
            </ul>
            <p className='mt-3'>
              To exercise any of these rights, please contact us at the details provided in Section 12 below.
              We will respond to your request within 30 days.
            </p>
          </section>

          {/* 10. Children */}
          <section>
            <h2 className='text-lg font-semibold text-gray-900 mb-3'>10. Children's Privacy</h2>
            <p>
              Our products and services are directed at businesses and institutional buyers. We do not knowingly
              collect personal data from individuals under the age of 18. If we become aware that we have collected
              data from a child without verifiable parental consent, we will take steps to delete such information promptly.
            </p>
          </section>

          {/* 11. Changes */}
          <section>
            <h2 className='text-lg font-semibold text-gray-900 mb-3'>11. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time to reflect changes in our practices, technology,
              legal requirements, or other factors. The updated policy will be posted on this page with a revised
              "Last updated" date. We encourage you to review this policy periodically. Your continued use of our
              website or services after any changes constitutes your acceptance of the updated policy.
            </p>
          </section>

          {/* 12. Grievance Officer & Contact */}
          <section>
            <h2 className='text-lg font-semibold text-gray-900 mb-3'>12. Grievance Officer and Contact Information</h2>
            <p className='mb-4'>
              In accordance with the Information Technology Act, 2000 and the DPDPA, 2023, the details of our
              Grievance Officer are as follows:
            </p>
            <div className='bg-gray-50 rounded-xl p-5'>
              <p className='text-xs text-gray-500 uppercase tracking-wider font-semibold mb-3'>Grievance Officer</p>
              <ul className='list-none space-y-1 text-sm text-gray-600'>
                <li><strong>Name:</strong> Mohanlal Moolchandani (Proprietor)</li>
                <li><strong>Company:</strong> Hari Shewa Enterprises</li>
                <li><strong>Address:</strong> Neemuch, Madhya Pradesh, India</li>
                <li><strong>Phone:</strong> +91 91314 38300</li>
                <li><strong>Email:</strong> mvmfurniture.hse@gmail.com</li>
              </ul>
            </div>
            <p className='mt-4'>
              We will acknowledge your grievance within 48 hours and endeavour to resolve it within 30 days
              from the date of receipt. If you are not satisfied with our response, you may file a complaint
              with the Data Protection Board of India as established under the DPDPA, 2023.
            </p>
          </section>

          {/* 13. Legal Framework */}
          <section>
            <h2 className='text-lg font-semibold text-gray-900 mb-3'>13. Applicable Law</h2>
            <p>
              This Privacy Policy is governed by and construed in accordance with the laws of India, including
              the Digital Personal Data Protection Act, 2023, the Information Technology Act, 2000, and the
              rules and regulations made thereunder. Any disputes arising from this policy shall be subject to
              the exclusive jurisdiction of the courts in Neemuch, Madhya Pradesh.
            </p>
          </section>

        </div>
      </div>

      <Footer />
    </div>
  )
}
