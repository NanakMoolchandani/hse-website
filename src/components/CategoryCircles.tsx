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
 * On a phone the tiles wrap four to a row, so the whole range is on the page
 * the buyer is already scrolling through. From `sm` up it becomes a centred
 * row sized so nine of them hold a single line on a laptop.
 */

import { useMemo } from 'react'
import type { CatalogProduct } from '@/src/lib/supabase'
import type { CategoryInfo } from '@/src/lib/categories'

/**
 * A colour per category, cycled.
 *
 * `tint` sits behind the photograph and `ring` draws a coloured circle around
 * it, separated by a ring of white so the two never touch: a border drawn hard
 * against the edge of a photograph reads as a frame around a picture, while one
 * held off it reads as a badge around an object. The gap is the whole effect.
 *
 * Nine hues, deliberately unsaturated. A row of nine fully saturated rings is a
 * colour wheel, and the eye stops reading the chairs.
 */
const PALETTE = [
  { tint: 'bg-amber-50', ring: 'border-amber-300' },
  { tint: 'bg-sky-50', ring: 'border-sky-300' },
  { tint: 'bg-rose-50', ring: 'border-rose-300' },
  { tint: 'bg-emerald-50', ring: 'border-emerald-300' },
  { tint: 'bg-violet-50', ring: 'border-violet-300' },
  { tint: 'bg-orange-50', ring: 'border-orange-300' },
  { tint: 'bg-teal-50', ring: 'border-teal-300' },
  { tint: 'bg-fuchsia-50', ring: 'border-fuchsia-300' },
  { tint: 'bg-lime-50', ring: 'border-lime-300' },
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
        // A wrapping grid on a phone, four across, not a sideways scroller.
        // The scroller was the native gesture but it hid two thirds of the
        // range behind a swipe nobody was told about: a cut-off circle at the
        // right edge is a hint, and a hint is not navigation. Four to a row
        // wrapping downward puts every category on the screen the buyer is
        // already scrolling through.
        //
        // From `sm` up it is a centred flex row instead, with fixed tile
        // widths, because nine tiles across a laptop should sit on one line
        // rather than be forced into a four-column grid: 9 x 112 plus 8 x 20
        // of gap is 1168, inside the 1200 the content column gives at 1440.
        'grid grid-cols-4 gap-x-3 gap-y-5 ' +
        'sm:flex sm:flex-wrap sm:justify-center sm:gap-5'
      }
    >
      {loading
        ? Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className='w-full sm:w-24 xl:w-28 sm:shrink-0 flex flex-col items-center gap-3'>
              <div className='w-full aspect-square sm:w-24 sm:h-24 sm:aspect-auto xl:w-28 xl:h-28 rounded-full bg-gray-100 animate-pulse' />
              <div className='h-2.5 w-14 rounded bg-gray-100 animate-pulse' />
            </div>
          ))
        : tiles.map((tile, i) => {
            const active = tile.key === activeKey
            const { tint, ring } = PALETTE[i % PALETTE.length]
            return (
              <button
                key={tile.key}
                type='button'
                onClick={() => onSelect(tile.key)}
                aria-pressed={active}
                className='group w-full sm:w-24 xl:w-28 sm:shrink-0 flex flex-col items-center gap-2.5 sm:gap-3'
              >
                {/* Two rings, one object. The outer span is the coloured
                    circle and its padding is the white gap; the inner one
                    holds the photograph. Doing it with `ring-offset` instead
                    would tie the gap colour to whatever the section
                    background happens to be, and this row sits on white
                    today and may not tomorrow. */}
                <span
                  className={`block w-full aspect-square sm:w-24 sm:h-24 sm:aspect-auto xl:w-28 xl:h-28 rounded-full bg-white p-[5px] transition-[transform,border-color] duration-250 ease-spring group-hover:scale-105 group-active:scale-[0.97] ${
                    active ? 'border-[3px] border-gray-900' : `border-2 ${ring}`
                  }`}
                >
                  <span className={`relative block w-full h-full rounded-full overflow-hidden ${tint}`}>
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
