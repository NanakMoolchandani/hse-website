export interface CategoryInfo {
  slug: string
  enum: string
  label: string
  series: string
  description: string
  image: string
}

export const CATEGORIES: CategoryInfo[] = [
  {
    slug: 'executive-chairs',
    enum: 'EXECUTIVE_CHAIRS',
    label: 'Executive Chairs',
    series: 'Boss Series',
    description: 'Premium leather executive chairs for cabins and boardrooms',
    image: 'https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=600&q=80',
  },
  {
    slug: 'ergonomic-task-chairs',
    enum: 'ERGONOMIC_TASK_CHAIRS',
    label: 'Ergonomic Task Chairs',
    series: 'Mesh Pro',
    description: 'All-day comfort with lumbar support, breathable mesh back and full adjustability',
    image: 'https://images.unsplash.com/photo-1497366754035-f200968a7db3?w=600&q=80',
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
    slug: 'conference-and-meeting',
    enum: 'CONFERENCE_MEETING',
    label: 'Conference & Meeting',
    series: 'Board Room',
    description: 'Coordinated seating solutions for meeting rooms and training halls',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&q=80',
  },
  {
    slug: 'visitor-and-reception',
    enum: 'VISITOR_RECEPTION',
    label: 'Visitor & Reception',
    series: 'Lobby Collection',
    description: 'Stylish visitor chairs, waiting area sofas and reception counters',
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&q=80',
  },
]

export function getCategoryBySlug(slug: string): CategoryInfo | undefined {
  return CATEGORIES.find((c) => c.slug === slug)
}

export function getCategoryByEnum(enumVal: string): CategoryInfo | undefined {
  return CATEGORIES.find((c) => c.enum === enumVal)
}
