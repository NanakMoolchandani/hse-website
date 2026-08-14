/**
 * Shop by category: a row of circular tiles.
 *
 * This is the pattern every large Indian furniture site opens with, and it is
 * there for a reason. A first-time visitor does not know our range, our series
 * names or what "Vintage Revolving" means; they know they want a chair for a
 * cabin, or something for a waiting room. A round photograph of an actual chair
 * answers that faster than any word in a sidebar.
 *
 * The photographs are ours. Each circle takes the first real catalogue photo in
 * that category rather than a stock image, so what a buyer taps is what they
 * get. Categories we have no photograph for fall back to a tinted circle with
 * the initial, which is honest, rather than borrowing someone else's chair.
 *
 * On a phone the row scrolls sideways with snap points, which is the native
 * gesture there. From `sm` up it wraps into a centred row: nine tiles fit two
 * lines on a laptop without a scrollbar nobody would find.
 */

import { useMemo } from 'react'
import type { CatalogProduct } from '@/src/lib/supabase'
import type { CategoryInfo } from '@/src/lib/categories'

/**
 * A tint per category, cycled.
 *
 * Chairs are photographed on white, so a circle of plain white loses its edge
 * against the page. These are all pale enough to sit under a product without
 * competing with its own colour.
 */
const TINTS = [
  'bg-amber-50',
  'bg-slate-100',
  'bg-stone-100',
  'bg-emerald-50',
  'bg-sky-50',
  'bg-rose-50',
  'bg-violet-50',
  'bg-teal-50',
]

export interface CategoryTile {
  key: string
  label: string
  /** Shorter label for the circle, where two words already crowd the width. */
  short?: string
  image: string | null
  count: number
}

/**
 * Build the tiles from what the catalogue actually returned.
 *
 * Kept as a hook so the page owns the fetch and this component owns nothing but
 * the rendering: the same tiles power the row whether the data came from the
 * live catalogue or a cached copy.
 */
export function useCategoryTiles(
  categories: CategoryInfo[],
  byCategory: Record<string, CatalogProduct[]>,
): CategoryTile[] {
  return useMemo(
    () =>
      categories.map((cat) => {
        const products = byCategory[cat.enum] ?? []
        const withPhoto = products.find(
          (p) => p.processed_photo_urls?.[0] || p.raw_photo_urls?.[0],
        )
        return {
          key: cat.enum,
          label: cat.label,
          short: SHORT_LABELS[cat.enum],
          image:
            withPhoto?.processed_photo_urls?.[0] ||
            withPhoto?.raw_photo_urls?.[0] ||
            null,
          count: products.length,
        }
      }),
    [categories, byCategory],
  )
}

/** Where the full category name is too long to read at 96px across. */
const SHORT_LABELS: Record<string, string> = {
  EXECUTIVE_CHAIRS: 'Executive',
  ERGONOMIC_TASK_CHAIRS: 'Ergonomic',
  VISITOR_RECEPTION: 'Visitor',
  CAFETERIA_FURNITURE: 'Cafeteria',
  WARDROBES_ALMIRAHS: 'Wardrobes',
  STUDY_COMPUTER_TABLES: 'Study Tables',
  BOOKSHELVES_DISPLAY: 'Bookshelves',
  OFFICE_WORKSTATIONS: 'Workstations',
  MODULAR_STORAGE: 'Modular Storage',
  TV_UNITS: 'TV Units',
  SHOE_RACKS: 'Shoe Racks',
  KITCHEN_PANTRY: 'Kitchen',
  BEDROOM_FURNITURE: 'Bedroom',
  DRESSING_TABLES: 'Dressing Tables',
  VINTAGE_REVOLVING: 'Vintage',
}

export default function CategoryCircles({
  tiles,
  activeKey,
  onSelect,
  loading,
}: {
  tiles: CategoryTile[]
  activeKey: string
  onSelect: (key: string) => void
  loading?: boolean
}) {
  return (
    <div
      className={
        // Bleeds to the screen edge on a phone so the last tile is visibly cut
        // off, which is the only honest way to say "this scrolls". Padding is
        // put back inside so the first tile still lines up with the page.
        //
        // `scroll-pl-4` is load-bearing, not decoration. Mandatory snapping
        // aligns a `snap-start` child to the container's *padding* edge, so
        // without a matching scroll-padding the browser silently scrolls the
        // row by 16px on load and the first tile ends up flush against the
        // screen edge, half a circle out of line with the heading above it.
        'flex gap-4 sm:gap-6 overflow-x-auto sm:overflow-visible sm:flex-wrap sm:justify-center ' +
        'snap-x snap-mandatory sm:snap-none thumbnail-scroll ' +
        '-mx-4 px-4 scroll-pl-4 sm:mx-0 sm:px-0 sm:scroll-pl-0 pb-2 sm:pb-0'
      }
    >
      {loading
        ? Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className='shrink-0 w-20 sm:w-28 flex flex-col items-center gap-3'>
              <div className='w-20 h-20 sm:w-28 sm:h-28 rounded-full bg-gray-100 animate-pulse' />
              <div className='h-2.5 w-14 rounded bg-gray-100 animate-pulse' />
            </div>
          ))
        : tiles.map((tile, i) => {
            const active = tile.key === activeKey
            return (
              <button
                key={tile.key}
                type='button'
                onClick={() => onSelect(tile.key)}
                aria-pressed={active}
                className='group shrink-0 snap-start w-20 sm:w-28 flex flex-col items-center gap-2.5 sm:gap-3'
              >
                <span
                  className={`relative block w-20 h-20 sm:w-28 sm:h-28 rounded-full overflow-hidden ${
                    TINTS[i % TINTS.length]
                  } transition-transform duration-250 ease-spring group-hover:scale-105 group-active:scale-[0.97] ${
                    // The ring is the selected state, and it sits outside the
                    // circle rather than inside it: an inset ring would crop
                    // the chair, and the chair is the point.
                    active
                      ? 'ring-2 ring-amber-500 ring-offset-2 ring-offset-white'
                      : 'ring-1 ring-black/[0.05]'
                  }`}
                >
                  {tile.image ? (
                    // Filled, not contained. Our catalogue photographs are
                    // lifestyle renders with a room behind the chair, so
                    // `object-contain` drops a square picture into a round
                    // hole and the corners give the game away. Cropping to
                    // the circle is the only way these read as tiles.
                    <img
                      src={tile.image}
                      alt=''
                      loading='lazy'
                      className='w-full h-full object-cover transition-transform duration-400 ease-spring group-hover:scale-[1.08]'
                    />
                  ) : (
                    <span className='w-full h-full grid place-items-center text-2xl font-semibold text-gray-300'>
                      {tile.label[0]}
                    </span>
                  )}
                </span>
                <span
                  className={`text-[11px] sm:text-xs leading-tight text-center transition-colors ${
                    active ? 'font-semibold text-gray-900' : 'font-medium text-gray-600 group-hover:text-gray-900'
                  }`}
                >
                  {tile.short ?? tile.label}
                </span>
              </button>
            )
          })}
    </div>
  )
}
