export interface CategoryInfo {
  slug: string
  enum: string
  label: string
  series: string
  description: string
  image: string
}

export const CATEGORIES: CategoryInfo[] = [
  // ── Seating (existing) ────────────────────────────────────────────
  {
    slug: 'executive-chairs',
    enum: 'EXECUTIVE_CHAIRS',
    label: 'Executive Chairs',
    series: 'Boss Series',
    description: 'Premium leather executive chairs for cabins and boardrooms',
    image: 'https://images.unsplash.com/photo-1571624436279-b272aff752b5?w=600&q=80',
  },
  {
    slug: 'ergonomic-task-chairs',
    enum: 'ERGONOMIC_TASK_CHAIRS',
    label: 'Ergonomic Task Chairs',
    series: 'Mesh Pro',
    description: 'All-day comfort with lumbar support, breathable mesh back and full adjustability',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&q=80',
  },
  {
    slug: 'cafeteria-furniture',
    enum: 'CAFETERIA_FURNITURE',
    label: 'Cafeteria Furniture',
    series: 'Cafe Range',
    description: 'Durable cafeteria chairs and tables. Stackable, easy to clean and bulk-ready',
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&q=80',
  },
  {
    slug: 'visitor-and-reception',
    enum: 'VISITOR_RECEPTION',
    label: 'Visitor & Reception',
    series: 'Lobby Collection',
    description: 'Stylish visitor chairs, waiting area sofas and reception counters',
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&q=80',
  },
  {
    slug: 'gaming-chairs',
    enum: 'GAMING_CHAIRS',
    label: 'Gaming Chairs',
    series: 'Arena Series',
    description: 'High-back gaming chairs with full lumbar support, headrest pillows and racing-inspired ergonomics for long sessions',
    image: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?w=600&q=80',
  },
  {
    slug: 'recliners',
    enum: 'RECLINERS',
    label: 'Recliners',
    series: 'Lounge Collection',
    description: 'Premium reclining chairs and sofas with multi-position adjustment for ultimate relaxation at home or office',
    image: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=600&q=80',
  },
  {
    slug: 'salon-chairs',
    enum: 'SALON_CHAIRS',
    label: 'Salon Chairs',
    series: 'Salon Series',
    description: 'Salon and barber chairs — wash units, styling chairs, and grooming seating for professional salons',
    image: 'https://images.unsplash.com/photo-1633681926022-84c23e8cb2d6?w=600&q=80',
  },

  // ── Particle Board Furniture ──────────────────────────────────────
  {
    slug: 'wardrobes-almirahs',
    enum: 'WARDROBES_ALMIRAHS',
    label: 'Wardrobes & Almirahs',
    series: 'Storage Pro',
    description: 'Pre-laminated particle board wardrobes — single door, double door, sliding and mirrored options for every bedroom',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600&q=80',
  },
  {
    slug: 'tv-units',
    enum: 'TV_UNITS',
    label: 'TV Units & Entertainment',
    series: 'Media Series',
    description: 'Modern TV stands, wall-mounted panels and entertainment units with smart cable management',
    image: 'https://images.unsplash.com/photo-1593784991095-a205069470b6?w=600&q=80',
  },
  {
    slug: 'study-computer-tables',
    enum: 'STUDY_COMPUTER_TABLES',
    label: 'Study & Computer Tables',
    series: 'WorkDesk Series',
    description: 'Sturdy study tables, computer desks with keyboard trays and L-shaped workstations for home and office',
    image: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=600&q=80',
  },
  {
    slug: 'bookshelves-display',
    enum: 'BOOKSHELVES_DISPLAY',
    label: 'Bookshelves & Display Units',
    series: 'Shelf Series',
    description: 'Open bookshelves, glass-door display units, ladder shelves and wall-mounted racks for books and décor',
    image: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=600&q=80',
  },
  {
    slug: 'shoe-racks',
    enum: 'SHOE_RACKS',
    label: 'Shoe Racks & Cabinets',
    series: 'Entryway Series',
    description: 'Space-saving shoe racks, flip-down cabinets and shoe benches to keep your entryway organized',
    image: 'https://images.unsplash.com/photo-1600585152220-90363fe7e115?w=600&q=80',
  },
  {
    slug: 'kitchen-pantry',
    enum: 'KITCHEN_PANTRY',
    label: 'Kitchen & Pantry Units',
    series: 'Kitchen Series',
    description: 'Modular kitchen cabinets, trolleys, microwave stands and crockery units in pre-laminated board',
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&q=80',
  },
  {
    slug: 'bedroom-furniture',
    enum: 'BEDROOM_FURNITURE',
    label: 'Bedroom Furniture',
    series: 'Bedroom Series',
    description: 'Beds with hydraulic storage, bedside tables, chest of drawers and complete bedroom sets',
    image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=600&q=80',
  },
  {
    slug: 'dressing-tables',
    enum: 'DRESSING_TABLES',
    label: 'Dressing Tables',
    series: 'Vanity Series',
    description: 'Elegant dressing tables with mirrors, drawers and storage — wall-mounted and freestanding options',
    image: 'https://images.unsplash.com/photo-1616046229478-9901c5536a45?w=600&q=80',
  },
  {
    slug: 'office-workstations',
    enum: 'OFFICE_WORKSTATIONS',
    label: 'Office Desks & Workstations',
    series: 'Office Pro',
    description: 'Executive desks, modular workstations, file cabinets and reception counters for modern offices',
    image: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=600&q=80',
  },
  {
    slug: 'modular-storage',
    enum: 'MODULAR_STORAGE',
    label: 'Modular Storage & Compartments',
    series: 'Cube Series',
    description: 'Versatile cube units, multipurpose cabinets and customizable compartment systems for any room',
    image: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=600&q=80',
  },
]

export function getCategoryBySlug(slug: string): CategoryInfo | undefined {
  return CATEGORIES.find((c) => c.slug === slug)
}

export function getCategoryByEnum(enumVal: string): CategoryInfo | undefined {
  return CATEGORIES.find((c) => c.enum === enumVal)
}

const PARTICLE_BOARD_CATEGORIES = new Set([
  'WARDROBES_ALMIRAHS', 'TV_UNITS', 'STUDY_COMPUTER_TABLES', 'BOOKSHELVES_DISPLAY',
  'SHOE_RACKS', 'KITCHEN_PANTRY', 'BEDROOM_FURNITURE', 'DRESSING_TABLES',
  'OFFICE_WORKSTATIONS', 'MODULAR_STORAGE',
])

export function isParticleBoardCategory(category: string): boolean {
  return PARTICLE_BOARD_CATEGORIES.has(category)
}
