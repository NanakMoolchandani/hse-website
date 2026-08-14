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
 * gesture there. From `sm` up it becomes a centred row that wraps if it has
 * to, rather than a scroller with a scrollbar nobody would find. Tile and gap
 * sizes below are chosen so nine of them hold a single line on a laptop.
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
        // Bleeds to the screen edge on a phone so the last tile is visibly cut
        // off, which is the only honest way to say "this scrolls". Padding is
        // put back inside so the first tile still lines up with the page.
        //
        // `scroll-pl-4` is load-bearing, not decoration. Mandatory snapping
        // aligns a `snap-start` child to the container's *padding* edge, so
        // without a matching scroll-padding the browser silently scrolls the
        // row by 16px on load and the first tile ends up flush against the
        // screen edge, half a circle out of line with the heading above it.
        //
        // The gap is sized so nine tiles hold one line on a laptop: 9 x 112
        // plus 8 x 20 of gap is 1168, inside the 1200 the content column
        // gives at 1440. Any wider and the ninth wraps onto a line of its own.
        'flex gap-4 sm:gap-5 overflow-x-auto sm:overflow-visible sm:flex-wrap sm:justify-center ' +
        'snap-x snap-mandatory sm:snap-none thumbnail-scroll ' +
        '-mx-4 px-4 scroll-pl-4 sm:mx-0 sm:px-0 sm:scroll-pl-0 pb-2 sm:pb-0'
      }
    >
      {loading
        ? Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className='shrink-0 w-20 sm:w-24 xl:w-28 flex flex-col items-center gap-3'>
              <div className='w-20 h-20 sm:w-24 sm:h-24 xl:w-28 xl:h-28 rounded-full bg-gray-100 animate-pulse' />
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
                className='group shrink-0 snap-start w-20 sm:w-24 xl:w-28 flex flex-col items-center gap-2.5 sm:gap-3'
              >
                {/* Two rings, one object. The outer span is the coloured
                    circle and its padding is the white gap; the inner one
                    holds the photograph. Doing it with `ring-offset` instead
                    would tie the gap colour to whatever the section
                    background happens to be, and this row sits on white
                    today and may not tomorrow. */}
                <span
                  className={`block w-20 h-20 sm:w-24 sm:h-24 xl:w-28 xl:h-28 rounded-full bg-white p-[5px] transition-[transform,border-color] duration-250 ease-spring group-hover:scale-105 group-active:scale-[0.97] ${
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
