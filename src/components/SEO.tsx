import { Helmet } from 'react-helmet-async'

const SITE_NAME = 'MVM Aasanam by Hari Shewa Enterprises'
const BASE_URL = 'https://mvm-furniture.com'
const DEFAULT_OG_IMAGE = `${BASE_URL}/og-default.jpg`

interface SEOProps {
  title: string
  description: string
  canonical?: string
  ogImage?: string
  ogType?: 'website' | 'product'
  keywords?: string
  jsonLd?: Record<string, unknown> | Record<string, unknown>[]
  noindex?: boolean
}

export default function SEO({
  title,
  description,
  canonical,
  ogImage = DEFAULT_OG_IMAGE,
  ogType = 'website',
  keywords,
  jsonLd,
  noindex = false,
}: SEOProps) {
  const fullTitle = `${title} | ${SITE_NAME}`
  const canonicalUrl = canonical ? `${BASE_URL}${canonical}` : undefined

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      {noindex && <meta name="robots" content="noindex,nofollow" />}
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}

      {/* Open Graph */}
      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      {canonicalUrl && <meta property="og:url" content={canonicalUrl} />}
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:locale" content="en_IN" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {/* Geo tags for local SEO */}
      <meta name="geo.region" content="IN-MP" />
      <meta name="geo.placename" content="Neemuch, Madhya Pradesh" />
      <meta name="geo.position" content="24.4764;74.8625" />
      <meta name="ICBM" content="24.4764, 74.8625" />

      {/* Language */}
      <meta httpEquiv="content-language" content="en-IN" />
      <link rel="alternate" hrefLang="en-in" href={canonicalUrl || BASE_URL} />
      <link rel="alternate" hrefLang="hi" href={canonicalUrl || BASE_URL} />

      {/* JSON-LD Structured Data */}
      {jsonLd && (
        <script type="application/ld+json">
          {JSON.stringify(Array.isArray(jsonLd) ? jsonLd : jsonLd)}
        </script>
      )}
    </Helmet>
  )
}

// ── Reusable JSON-LD schemas ──────────────────────────────────────────────

export const LOCAL_BUSINESS_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'FurnitureStore',
  '@id': `${BASE_URL}/#business`,
  name: 'Hari Shewa Enterprises',
  alternateName: 'MVM Aasanam',
  description:
    'Office furniture manufacturer and wholesale supplier in Neemuch, Madhya Pradesh. Executive chairs, ergonomic task chairs, cafeteria furniture, and visitor seating. ISO certified, GeM empanelled. Serving corporates across Central India since 1997.',
  url: BASE_URL,
  telephone: ['+919981516171', '+917999970552'],
  email: 'mvmfurniture.hse@gmail.com',
  foundingDate: '1997',
  priceRange: '₹₹',
  currenciesAccepted: 'INR',
  paymentAccepted: 'Bank Transfer, UPI, Cheque, Demand Draft',
  areaServed: [
    { '@type': 'State', name: 'Madhya Pradesh' },
    { '@type': 'State', name: 'Rajasthan' },
    { '@type': 'State', name: 'Gujarat' },
    { '@type': 'State', name: 'Maharashtra' },
    { '@type': 'State', name: 'Chhattisgarh' },
    { '@type': 'Country', name: 'India' },
  ],
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Industrial Area',
    addressLocality: 'Neemuch',
    addressRegion: 'Madhya Pradesh',
    postalCode: '458441',
    addressCountry: 'IN',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 24.4764,
    longitude: 74.8625,
  },
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Office & Cafeteria Furniture',
    itemListElement: [
      { '@type': 'OfferCatalog', name: 'Executive Chairs' },
      { '@type': 'OfferCatalog', name: 'Ergonomic Task Chairs' },
      { '@type': 'OfferCatalog', name: 'Cafeteria Furniture' },
      { '@type': 'OfferCatalog', name: 'Visitor & Reception Furniture' },
    ],
  },
  sameAs: [],
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      opens: '09:00',
      closes: '19:00',
    },
  ],
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.8',
    reviewCount: '500',
    bestRating: '5',
  },
}

export const ORGANIZATION_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': `${BASE_URL}/#organization`,
  name: 'Hari Shewa Enterprises',
  legalName: 'Hari Shewa Enterprises',
  alternateName: 'MVM Aasanam',
  url: BASE_URL,
  foundingDate: '1997',
  description:
    'Office furniture manufacturer in Neemuch, Madhya Pradesh. ISO 9001, ISO 14001, ISO 45001 certified. GeM empanelled. BIFMA certified.',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Neemuch',
    addressRegion: 'Madhya Pradesh',
    addressCountry: 'IN',
  },
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+919981516171',
    contactType: 'sales',
    availableLanguage: ['English', 'Hindi'],
  },
  taxID: '23AJUPM2209E1ZD',
  hasCredential: [
    { '@type': 'EducationalOccupationalCredential', credentialCategory: 'ISO 9001:2015' },
    { '@type': 'EducationalOccupationalCredential', credentialCategory: 'ISO 14001:2015' },
    { '@type': 'EducationalOccupationalCredential', credentialCategory: 'ISO 45001:2018' },
    { '@type': 'EducationalOccupationalCredential', credentialCategory: 'BIFMA Certified' },
    { '@type': 'EducationalOccupationalCredential', credentialCategory: 'GeM Empanelled' },
    { '@type': 'EducationalOccupationalCredential', credentialCategory: 'ZED Certified' },
  ],
}

export function createProductSchema(product: {
  name: string | null
  description: string | null
  slug: string | null
  category: string | null
  processed_photo_urls: string[]
  raw_photo_urls: string[]
}) {
  const categorySlug = product.category
    ? product.category.toLowerCase().replace(/_/g, '-')
    : 'executive-chairs'
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.processed_photo_urls?.length > 0
      ? product.processed_photo_urls
      : product.raw_photo_urls || [],
    url: `${BASE_URL}/mvm/${categorySlug}/${product.slug}`,
    brand: { '@type': 'Brand', name: 'MVM Aasanam' },
    manufacturer: {
      '@type': 'Organization',
      name: 'Hari Shewa Enterprises',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Neemuch',
        addressRegion: 'Madhya Pradesh',
        addressCountry: 'IN',
      },
    },
    offers: {
      '@type': 'Offer',
      availability: 'https://schema.org/InStock',
      priceCurrency: 'INR',
      seller: {
        '@type': 'Organization',
        name: 'Hari Shewa Enterprises',
      },
    },
    category: product.category?.replace(/_/g, ' ').toLowerCase(),
  }
}

export function createBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: `${BASE_URL}${item.url}`,
    })),
  }
}

export function createFAQSchema(faqs: { q: string; a: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.a,
      },
    })),
  }
}
