/**
 * Fabric & Leatherette color options for MVM Aasanam cushioned chairs.
 * Displayed on product pages for chairs that support customization.
 */

export interface CustomColor {
  name: string
  hex: string
}

// ── Fabric Colors ──────────────────────────────────────

export const FABRIC_COLORS: CustomColor[] = [
  { name: 'Charcoal Black', hex: '#2D2D2D' },
  { name: 'Jet Black', hex: '#0A0A0A' },
  { name: 'Slate Grey', hex: '#6B7280' },
  { name: 'Ash Grey', hex: '#9CA3AF' },
  { name: 'Silver Mist', hex: '#C0C0C0' },
  { name: 'Navy Blue', hex: '#1E3A5F' },
  { name: 'Royal Blue', hex: '#2563EB' },
  { name: 'Ocean Blue', hex: '#0EA5E9' },
  { name: 'Sky Blue', hex: '#7DD3FC' },
  { name: 'Teal', hex: '#0D9488' },
  { name: 'Emerald Green', hex: '#059669' },
  { name: 'Forest Green', hex: '#166534' },
  { name: 'Olive', hex: '#65A30D' },
  { name: 'Burgundy', hex: '#7F1D1D' },
  { name: 'Wine Red', hex: '#991B1B' },
  { name: 'Crimson', hex: '#DC2626' },
  { name: 'Rust Orange', hex: '#C2410C' },
  { name: 'Tangerine', hex: '#EA580C' },
  { name: 'Mustard Yellow', hex: '#CA8A04' },
  { name: 'Cream', hex: '#FEF3C7' },
  { name: 'Ivory', hex: '#FFFBEB' },
  { name: 'Sand Beige', hex: '#D4B896' },
  { name: 'Lavender', hex: '#A78BFA' },
  { name: 'Plum', hex: '#7C3AED' },
  { name: 'Mauve', hex: '#C084FC' },
]

// ── Leatherette Colors ─────────────────────────────────

export const LEATHERETTE_COLORS: CustomColor[] = [
  { name: 'Onyx Black', hex: '#111111' },
  { name: 'Carbon Black', hex: '#1C1C1C' },
  { name: 'Espresso', hex: '#3C1414' },
  { name: 'Dark Brown', hex: '#4A2C2A' },
  { name: 'Chocolate', hex: '#5C3317' },
  { name: 'Walnut', hex: '#6B4423' },
  { name: 'Tan', hex: '#B87333' },
  { name: 'Camel', hex: '#C19A6B' },
  { name: 'Cognac', hex: '#9A4E1C' },
  { name: 'Saddle Brown', hex: '#8B4513' },
  { name: 'Maroon', hex: '#5B1A1A' },
  { name: 'Ox Blood', hex: '#6A0D0D' },
  { name: 'Deep Navy', hex: '#0F172A' },
  { name: 'Midnight Blue', hex: '#1E2D4A' },
  { name: 'Slate', hex: '#475569' },
  { name: 'Pearl Grey', hex: '#A8A8A8' },
  { name: 'Ivory White', hex: '#F5F5DC' },
  { name: 'Off White', hex: '#FAF0E6' },
  { name: 'Cream Beige', hex: '#E8D5B7' },
  { name: 'Olive Green', hex: '#3D4F2F' },
  { name: 'Hunter Green', hex: '#2D5016' },
  { name: 'Burgundy Wine', hex: '#6B2737' },
  { name: 'Champagne', hex: '#F7E7CE' },
  { name: 'Rose Gold', hex: '#B76E79' },
  { name: 'Pewter', hex: '#8F8F8F' },
]

/** Check if a product is a cushioned chair (not mesh/plastic) */
export function isCushionedChair(
  category: string,
  materials?: string[],
  features?: { label: string }[],
): boolean {
  if (category === 'ERGONOMIC_TASK_CHAIRS') return false
  if (category === 'EXECUTIVE_CHAIRS') return true

  const allText = [
    ...(materials || []),
    ...(features || []).map((f) => f.label),
  ].join(' ').toLowerCase()

  if (/mesh|plastic|polypropylene|moulded|stackable plastic/i.test(allText)) return false
  if (/cushion|foam|leather|leatherette|fabric|upholster|pu\s/i.test(allText)) return true

  return category === 'VISITOR_RECEPTION'
}
