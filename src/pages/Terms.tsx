import Footer from '@/src/components/Footer'

export default function Terms() {
  return (
    <div className='bg-white min-h-screen flex flex-col'>
      <div className='max-w-3xl mx-auto px-4 sm:px-6 lg:px-10 pt-28 pb-20 md:pt-36 md:pb-28 flex-1'>
        <p className='text-xs font-semibold tracking-widest uppercase text-gray-400 mb-3'>
          Legal
        </p>
        <h1 className='font-display text-3xl md:text-4xl font-bold text-gray-900 mb-2'>
          Terms and Conditions
        </h1>
        <p className='text-sm text-gray-400 mb-12'>Effective date: 1 February 2026 &middot; Last updated: 28 February 2026</p>

        <div className='prose prose-gray max-w-none space-y-10 text-sm text-gray-600 leading-relaxed'>

          {/* Preamble */}
          <section>
            <div className='bg-gray-50 rounded-xl p-5 mb-6'>
              <p className='text-xs text-gray-500'>
                This document is an electronic record in terms of the Information Technology Act, 2000 and the
                rules made thereunder, and does not require any physical or digital signatures.
              </p>
            </div>
          </section>

          {/* 1. General */}
          <section>
            <h2 className='text-lg font-semibold text-gray-900 mb-3'>1. Definitions and Interpretation</h2>
            <p className='mb-3'>In these Terms and Conditions, unless the context otherwise requires:</p>
            <ul className='list-disc pl-6 space-y-2'>
              <li><strong>"Company" / "Seller"</strong> means Hari Shewa Enterprises, a proprietorship firm operating under the brand name MVM Aasanam, located in Neemuch, Madhya Pradesh, India (GSTIN: 23AJUPM2209E1ZD).</li>
              <li><strong>"Buyer" / "Customer"</strong> means any individual, firm, company, or institution that places an order or engages with the Company for the purchase of goods.</li>
              <li><strong>"Goods"</strong> means the furniture products manufactured, supplied, or sold by the Company, classified under HSN Code 9403.</li>
              <li><strong>"Order"</strong> means a confirmed request from the Buyer for the supply of Goods, accepted by the Company.</li>
              <li><strong>"Quotation"</strong> means a formal price estimate issued by the Company in response to a Buyer's enquiry.</li>
              <li><strong>"Website"</strong> means mvm-furniture.com and any associated subdomains.</li>
            </ul>
          </section>

          {/* 2. Applicability */}
          <section>
            <h2 className='text-lg font-semibold text-gray-900 mb-3'>2. Applicability and Acceptance</h2>
            <p>
              These Terms and Conditions govern all transactions between the Company and the Buyer, including
              the use of our website, the purchase of goods, and all related communications. By accessing our
              website, requesting a quotation, or placing an order, you agree to be bound by these terms.
            </p>
            <p className='mt-3'>
              These terms may be supplemented by specific terms stated in individual quotations or order
              confirmations. In the event of a conflict, the specific terms in the quotation or order
              confirmation shall prevail over these general terms.
            </p>
          </section>

          {/* 3. Products */}
          <section>
            <h2 className='text-lg font-semibold text-gray-900 mb-3'>3. Products and Descriptions</h2>
            <ul className='list-disc pl-6 space-y-2'>
              <li>We manufacture and supply commercial office and cafeteria furniture, including executive chairs, ergonomic task chairs, visitor seating, cafeteria tables and chairs, reception furniture, and related accessories.</li>
              <li>Product images, specifications, and descriptions on our website are for reference purposes only. Actual products may vary in colour, material finish, texture, and dimensions based on customization, batch production, and display settings.</li>
              <li>We reserve the right to modify product designs, materials, and specifications without prior notice, provided such modifications do not materially alter the agreed product specifications in a confirmed order.</li>
            </ul>
          </section>

          {/* 4. Quotations */}
          <section>
            <h2 className='text-lg font-semibold text-gray-900 mb-3'>4. Quotations and Pricing</h2>
            <ul className='list-disc pl-6 space-y-2'>
              <li>All prices are quoted in Indian Rupees (INR).</li>
              <li>Prices quoted are exclusive of Goods and Services Tax (GST) unless explicitly stated otherwise. GST at the applicable rate (currently 18% under HSN 9403: 9% CGST + 9% SGST for intra state, or 18% IGST for inter state supply) will be charged in addition to the quoted price.</li>
              <li>A formal quotation is provided for every order. Each quotation is valid for the period stated therein. If no validity period is stated, the quotation shall be valid for 15 days from the date of issue.</li>
              <li>Quotations do not constitute a binding contract. A binding contract is formed only upon written acceptance of the quotation by the Buyer and acknowledgement of the order by the Company.</li>
              <li>Prices are subject to change based on order volume, customization requirements, raw material costs, and prevailing market conditions. The Company reserves the right to revise prices prior to order confirmation.</li>
            </ul>
          </section>

          {/* 5. Orders */}
          <section>
            <h2 className='text-lg font-semibold text-gray-900 mb-3'>5. Orders and Confirmation</h2>
            <ul className='list-disc pl-6 space-y-2'>
              <li>Orders are confirmed only upon receipt of advance payment as specified in the quotation and written confirmation from the Company.</li>
              <li>The Company reserves the right to accept, reject, or modify any order at its sole discretion, including limiting order quantities.</li>
              <li>Any modification to a confirmed order must be communicated in writing and is subject to the Company's approval. Additional charges or revised timelines may apply.</li>
              <li>Cancellation of confirmed orders is permitted only with the written consent of the Company. If production has commenced on custom or made to order goods, cancellation charges may apply up to the full order value.</li>
            </ul>
          </section>

          {/* 6. Payment */}
          <section>
            <h2 className='text-lg font-semibold text-gray-900 mb-3'>6. Payment Terms</h2>
            <ul className='list-disc pl-6 space-y-2'>
              <li>Payment terms are specified in the quotation and order confirmation. These may include advance payment, milestone payments, or credit terms for established business clients.</li>
              <li>All payments must be made in Indian Rupees to the designated Hari Shewa Enterprises bank account (HDFC Bank). Payment by cheque, NEFT, RTGS, UPI, or demand draft is accepted.</li>
              <li>In the event of delayed payment beyond the agreed due date, the Company reserves the right to charge interest at the rate of 18% per annum on the outstanding amount, calculated from the due date until the date of actual payment.</li>
              <li>Non payment of any outstanding amount may result in suspension of further deliveries, withholding of pending orders, and initiation of recovery proceedings.</li>
              <li>All prices on invoices are inclusive of packing and exclusive of freight and installation unless otherwise stated in the quotation.</li>
            </ul>
          </section>

          {/* 7. Delivery */}
          <section>
            <h2 className='text-lg font-semibold text-gray-900 mb-3'>7. Delivery and Risk of Loss</h2>
            <ul className='list-disc pl-6 space-y-2'>
              <li>Standard delivery timelines are 7 to 15 working days from the date of order confirmation and advance payment receipt. Large institutional orders (500+ units) may require 3 to 4 weeks depending on customization.</li>
              <li>Delivery timelines are estimates and may vary due to production schedules, logistics, customization requirements, or circumstances beyond our control. The Company shall not be liable for delays caused by force majeure events.</li>
              <li>Risk of loss and damage to goods passes to the Buyer upon delivery at the specified destination or upon handover to the Buyer's appointed carrier, whichever is earlier.</li>
              <li>The Buyer must inspect goods upon delivery and report any visible damage or discrepancy within 3 working days of receipt. Failure to report within this period shall constitute acceptance of the goods in satisfactory condition.</li>
              <li>Installation support is available on request and may incur additional charges. Installation terms will be specified in the quotation where applicable.</li>
              <li>For bulk or institutional orders, the Company may deliver in instalments. Each instalment shall be treated as a separate delivery for the purposes of inspection, acceptance, and payment.</li>
            </ul>
          </section>

          {/* 8. Warranty */}
          <section>
            <h2 className='text-lg font-semibold text-gray-900 mb-3'>8. Warranty</h2>
            <ul className='list-disc pl-6 space-y-2'>
              <li>All seating products come with a <strong>1 year warranty on the mechanism</strong> (gas lift, tilt mechanism, and adjustment controls) from the date of delivery.</li>
              <li>Structural defects in the frame, base, or armrests identified within the warranty period will be repaired or replaced at no additional cost to the Buyer, at the Company's discretion.</li>
              <li className='font-medium text-gray-700'>The warranty does NOT cover:</li>
            </ul>
            <ul className='list-disc pl-10 space-y-1 mt-2'>
              <li>Damage caused by misuse, overloading, negligence, or unauthorised modifications</li>
              <li>Normal wear and tear, including fading or pilling of fabric and minor scratches</li>
              <li>Damage caused by improper assembly, storage, or environmental conditions</li>
              <li>Natural variations in material appearance (wood grain, leather texture, fabric colour shading)</li>
              <li>Products that have been repaired or altered by parties other than the Company</li>
            </ul>
            <p className='mt-3'>
              Warranty claims must be reported via WhatsApp or email with supporting photographs. The Company
              will assess the claim and communicate the resolution within 7 working days.
            </p>
          </section>

          {/* 9. Returns */}
          <section>
            <h2 className='text-lg font-semibold text-gray-900 mb-3'>9. Returns and Replacements</h2>
            <ul className='list-disc pl-6 space-y-2'>
              <li>Returns are accepted only for goods that are damaged during transit, have manufacturing defects, or do not match the confirmed order specifications.</li>
              <li>Return requests must be raised within 7 days of delivery, accompanied by photographs of the issue.</li>
              <li>Custom configured and made to order products are non returnable unless they are defective or do not conform to the agreed specifications.</li>
              <li>Change of mind, colour preference, or design preference is not grounds for return after order confirmation.</li>
              <li>Where a return is accepted, the Company will, at its discretion, either replace the defective goods, repair them, or issue a credit note for the invoiced value.</li>
            </ul>
          </section>

          {/* 10. Intellectual Property */}
          <section>
            <h2 className='text-lg font-semibold text-gray-900 mb-3'>10. Intellectual Property</h2>
            <p>
              All content on this website, including text, product descriptions, images, photographs, graphics,
              logos, brand names, design elements, and software, is the exclusive intellectual property of
              Hari Shewa Enterprises and is protected under applicable Indian intellectual property laws.
            </p>
            <p className='mt-3'>
              You may not reproduce, distribute, modify, publicly display, or commercially exploit any content
              from this website without prior written consent from the Company. Architects, interior designers,
              and procurement professionals may download product images and specifications solely for the
              purpose of preparing project proposals and tender documentation, provided the Company is credited
              as the source.
            </p>
          </section>

          {/* 11. Limitation of Liability */}
          <section>
            <h2 className='text-lg font-semibold text-gray-900 mb-3'>11. Limitation of Liability</h2>
            <p className='font-medium text-gray-700 uppercase text-xs tracking-wide mb-3'>
              PLEASE READ THIS SECTION CAREFULLY
            </p>
            <ul className='list-disc pl-6 space-y-2'>
              <li>To the maximum extent permitted by applicable law, the Company's total aggregate liability arising from or related to the supply of goods under any order shall not exceed the invoice value of the specific goods giving rise to the claim.</li>
              <li>In no event shall the Company be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to loss of profits, loss of business, business interruption, or loss of goodwill, even if the Company has been advised of the possibility of such damages.</li>
              <li>The Company shall not be liable for any delay or failure to perform its obligations where such delay or failure results from events beyond its reasonable control, including but not limited to natural disasters, epidemics, government actions, strikes, labour disputes, shortage of raw materials, transportation disruptions, or any other force majeure event.</li>
            </ul>
          </section>

          {/* 12. Confidentiality */}
          <section>
            <h2 className='text-lg font-semibold text-gray-900 mb-3'>12. Confidentiality</h2>
            <p>
              All pricing, discount structures, commercial terms, and business information shared between the
              Company and the Buyer in the course of transactions are confidential. Neither party shall disclose
              such information to any third party without the prior written consent of the other party, except
              as required by law or regulation.
            </p>
          </section>

          {/* 13. Governing Law */}
          <section>
            <h2 className='text-lg font-semibold text-gray-900 mb-3'>13. Governing Law and Dispute Resolution</h2>
            <p className='mb-3'>
              These Terms and Conditions shall be governed by and construed in accordance with the laws of India,
              including but not limited to:
            </p>
            <ul className='list-disc pl-6 space-y-1 mb-4'>
              <li>The Indian Contract Act, 1872</li>
              <li>The Sale of Goods Act, 1930</li>
              <li>The Central Goods and Services Tax Act, 2017</li>
              <li>The Information Technology Act, 2000</li>
            </ul>
            <p>
              Any disputes arising out of or in connection with these terms shall first be attempted to be
              resolved amicably through negotiation. If no resolution is reached within 30 days, the dispute
              shall be subject to the exclusive jurisdiction of the competent courts at Neemuch, District
              Neemuch, Madhya Pradesh, India.
            </p>
          </section>

          {/* 14. General Provisions */}
          <section>
            <h2 className='text-lg font-semibold text-gray-900 mb-3'>14. General Provisions</h2>
            <ul className='list-disc pl-6 space-y-2'>
              <li><strong>Severability:</strong> If any provision of these terms is held to be invalid or unenforceable by a court of competent jurisdiction, the remaining provisions shall continue in full force and effect.</li>
              <li><strong>Entire Agreement:</strong> These terms, together with the applicable quotation and order confirmation, constitute the entire agreement between the parties with respect to the subject matter hereof.</li>
              <li><strong>Waiver:</strong> No failure or delay by the Company in exercising any right under these terms shall constitute a waiver of that right.</li>
              <li><strong>Assignment:</strong> The Buyer may not assign or transfer any rights or obligations under these terms without the prior written consent of the Company.</li>
              <li><strong>Notices:</strong> All notices under these terms shall be in writing and sent to the contact details specified in the order confirmation or as updated by either party in writing.</li>
              <li><strong>Amendments:</strong> The Company reserves the right to amend these terms at any time. The amended terms will be published on this website. Continued engagement with the Company after such amendments constitutes acceptance of the revised terms.</li>
            </ul>
          </section>

          {/* 15. Contact */}
          <section>
            <h2 className='text-lg font-semibold text-gray-900 mb-3'>15. Contact Information</h2>
            <p className='mb-4'>For any questions, concerns, or correspondence regarding these terms:</p>
            <div className='bg-gray-50 rounded-xl p-5'>
              <ul className='list-none space-y-1 text-sm text-gray-600'>
                <li><strong>Hari Shewa Enterprises</strong></li>
                <li>Trading as MVM Aasanam</li>
                <li>Neemuch, Madhya Pradesh, India</li>
                <li><strong>Phone:</strong> +91 91314 38300</li>
                <li><strong>Email:</strong> mvmfurniture.hse@gmail.com</li>
                <li><strong>GSTIN:</strong> 23AJUPM2209E1ZD</li>
                <li><strong>HSN:</strong> 9403 (Furniture)</li>
              </ul>
            </div>
          </section>

        </div>
      </div>

      <Footer />
    </div>
  )
}
