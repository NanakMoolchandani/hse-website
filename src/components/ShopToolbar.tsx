/**
 * The filter and sort bar that sits above the grid.
 *
 * It replaced a 256px sidebar of category links. The sidebar had two problems:
 * it existed only on desktop, so a phone got a different shop from a laptop,
 * and it spent a quarter of the page on a list that a buyer uses once and then
 * scrolls past. A horizontal bar costs one row, stays with you as you scroll,
 * and is the same control on every screen.
 *
 * Everything that changes what you see is here: filters on the left, the count
 * in the middle, sort on the right, and a row of chips underneath naming the
 * filters currently on. The chips matter more than they look: a grid that has
 * silently dropped two thirds of the range is the fastest way to make a shop
 * seem empty.
 */

import { useEffect, useRef, useState, type ReactNode } from 'react'
import { SlidersHorizontal, ChevronDown, X, Check } from 'lucide-react'
import type { CategoryInfo } from '@/src/lib/categories'

// ── The shape of a filtered, sorted shop ─────────────────────────────────────

export type SortKey = 'featured' | 'price-asc' | 'price-desc' | 'name-asc'

export const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: 'featured', label: 'Featured' },
  { key: 'price-asc', label: 'Price: low to high' },
  { key: 'price-desc', label: 'Price: high to low' },
  { key: 'name-asc', label: 'Name: A to Z' },
]

export interface PriceBand {
  id: string
  label: string
  min: number
  max: number | null
}

/**
 * Bands rather than a slider.
 *
 * A two-handle range slider is a fiddly control on a phone and produces
 * arbitrary numbers ("₹4,730 to ₹18,220") that mean nothing to anyone. These
 * are the brackets people actually shop in.
 */
export const PRICE_BANDS: PriceBand[] = [
  { id: 'u5', label: 'Under ₹5,000', min: 0, max: 5000 },
  { id: '5-10', label: '₹5,000 to ₹10,000', min: 5000, max: 10000 },
  { id: '10-20', label: '₹10,000 to ₹20,000', min: 10000, max: 20000 },
  { id: 'o20', label: 'Above ₹20,000', min: 20000, max: null },
]

export interface ShopFilters {
  inStockOnly: boolean
  priceBands: string[]
  hasColours: boolean
}

export const EMPTY_FILTERS: ShopFilters = {
  inStockOnly: false,
  priceBands: [],
  hasColours: false,
}

export function countActiveFilters(f: ShopFilters): number {
  return (f.inStockOnly ? 1 : 0) + (f.hasColours ? 1 : 0) + f.priceBands.length
}

/** Does a price fall inside any of the selected bands? No bands means no filter. */
export function priceInBands(price: number, bandIds: string[]): boolean {
  if (bandIds.length === 0) return true
  return bandIds.some((id) => {
    const band = PRICE_BANDS.find((b) => b.id === id)
    if (!band) return true
    return price >= band.min && (band.max === null || price < band.max)
  })
}

// ── The bar ──────────────────────────────────────────────────────────────────

export default function ShopToolbar({
  total,
  filters,
  onFiltersChange,
  sort,
  onSortChange,
  categories,
  madeToOrderCategories,
  activeCategory,
  onCategoryChange,
  counts,
  allLabel,
  allCount,
}: {
  total: number
  filters: ShopFilters
  onFiltersChange: (f: ShopFilters) => void
  sort: SortKey
  onSortChange: (s: SortKey) => void
  categories: CategoryInfo[]
  madeToOrderCategories: CategoryInfo[]
  activeCategory: string
  onCategoryChange: (enumVal: string) => void
  counts: Record<string, number>
  allLabel: string
  allCount: number
}) {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [sortOpen, setSortOpen] = useState(false)
  const sortRef = useRef<HTMLDivElement>(null)

  const activeCount = countActiveFilters(filters)
  const sortLabel = SORT_OPTIONS.find((o) => o.key === sort)?.label ?? 'Featured'

  // Escape closes whichever surface is open, in the order a user expects: the
  // thing they opened last.
  useEffect(() => {
    if (!drawerOpen && !sortOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return
      if (sortOpen) setSortOpen(false)
      else setDrawerOpen(false)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [drawerOpen, sortOpen])

  // The drawer covers the page on a phone, so the page behind it must not
  // scroll under the finger.
  useEffect(() => {
    if (!drawerOpen) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prev }
  }, [drawerOpen])

  useEffect(() => {
    if (!sortOpen) return
    const onClick = (e: MouseEvent) => {
      if (!sortRef.current?.contains(e.target as Node)) setSortOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [sortOpen])

  const toggleBand = (id: string) => {
    onFiltersChange({
      ...filters,
      priceBands: filters.priceBands.includes(id)
        ? filters.priceBands.filter((b) => b !== id)
        : [...filters.priceBands, id],
    })
  }

  return (
    <>
      {/* Sticky under the header, not under the top of the window: the two are
          one piece of chrome and a gap between them shows the grid sliding
          through it. Full width, because a bar that stops at the content
          margin reads as a floating box rather than as chrome.

          Opaque, not frosted. Glass works over a photograph you are meant to
          see through it; over a scrolling grid of chairs it just looks like
          the bar and the products are printed on top of each other. */}
      <div className='sticky top-32 md:top-40 z-30 px-4 sm:px-6 lg:px-10 bg-white border-y border-black/[0.06] shadow-[0_4px_16px_-8px_rgba(0,0,0,0.15)]'>
        <div className='max-w-7xl mx-auto flex items-center justify-between gap-3 h-14'>
          <button
            type='button'
            onClick={() => setDrawerOpen(true)}
            className='pressable inline-flex items-center gap-2 h-10 px-4 rounded-full border border-black/[0.12] text-xs font-semibold uppercase tracking-[0.12em] text-gray-800 hover:bg-black/[0.03]'
          >
            <SlidersHorizontal className='w-3.5 h-3.5' />
            <span className='hidden sm:inline'>All filters</span>
            <span className='sm:hidden'>Filters</span>
            {activeCount > 0 && (
              <span className='ml-0.5 min-w-5 h-5 px-1.5 grid place-items-center rounded-full bg-amber-500 text-[10px] font-bold text-white tabular-nums'>
                {activeCount}
              </span>
            )}
          </button>

          <p className='hidden sm:block text-xs text-gray-500 tabular-nums'>
            {total} {total === 1 ? 'piece' : 'pieces'}
          </p>

          <div className='relative' ref={sortRef}>
            <button
              type='button'
              onClick={() => setSortOpen((o) => !o)}
              className='pressable inline-flex items-center gap-2 h-10 px-4 rounded-full border border-black/[0.12] text-xs font-semibold uppercase tracking-[0.12em] text-gray-800 hover:bg-black/[0.03]'
            >
              <span className='hidden sm:inline text-gray-400'>Sort by</span>
              <span className='max-w-[9rem] truncate normal-case tracking-normal font-medium'>
                {sortLabel}
              </span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-250 ease-spring ${sortOpen ? 'rotate-180' : ''}`} />
            </button>

            {sortOpen && (
              // Grows from the button that opened it, so the menu and the
              // control read as the same object.
              <div className='animate-menu-in absolute right-0 top-full mt-2 w-60 origin-top-right rounded-xl bg-white border border-black/[0.08] shadow-xl py-1.5 z-50'>
                {SORT_OPTIONS.map((opt) => (
                  <button
                    key={opt.key}
                    type='button'
                    onClick={() => { onSortChange(opt.key); setSortOpen(false) }}
                    className={`w-full flex items-center justify-between gap-2 px-4 py-2.5 text-sm text-left hover:bg-black/[0.04] ${
                      opt.key === sort ? 'font-semibold text-gray-900' : 'text-gray-600'
                    }`}
                  >
                    {opt.label}
                    {opt.key === sort && <Check className='w-3.5 h-3.5 text-amber-600' />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {activeCount > 0 && (
          <div className='max-w-7xl mx-auto flex items-center gap-2 overflow-x-auto thumbnail-scroll pb-3 -mt-0.5'>
            {filters.inStockOnly && (
              <Chip label='In stock' onRemove={() => onFiltersChange({ ...filters, inStockOnly: false })} />
            )}
            {filters.hasColours && (
              <Chip label='Multiple colours' onRemove={() => onFiltersChange({ ...filters, hasColours: false })} />
            )}
            {filters.priceBands.map((id) => (
              <Chip
                key={id}
                label={PRICE_BANDS.find((b) => b.id === id)?.label ?? id}
                onRemove={() => toggleBand(id)}
              />
            ))}
            <button
              type='button'
              onClick={() => onFiltersChange(EMPTY_FILTERS)}
              className='shrink-0 text-xs font-semibold text-amber-600 hover:text-amber-700 px-2 whitespace-nowrap'
            >
              Clear all
            </button>
          </div>
        )}
      </div>

      {/* ── Filter drawer ─────────────────────────────────────────────────── */}
      {drawerOpen && (
        <div className='fixed inset-0 z-[60] flex'>
          <div
            className='animate-fade-in absolute inset-0 bg-black/40'
            onClick={() => setDrawerOpen(false)}
          />
          {/* From the left, and it leaves the same way. It is standing in for
              the sidebar that used to live on that edge. */}
          <aside className='animate-drawer-in relative w-full sm:w-[22rem] h-full bg-white shadow-2xl flex flex-col'>
            <header className='flex items-center justify-between h-16 px-5 border-b border-black/[0.06] shrink-0'>
              <h2 className='text-title text-gray-900'>Filters</h2>
              <button
                type='button'
                onClick={() => setDrawerOpen(false)}
                aria-label='Close filters'
                className='pressable w-11 h-11 -mr-2 grid place-items-center rounded-full text-gray-500 hover:bg-black/[0.05]'
              >
                <X className='w-5 h-5' />
              </button>
            </header>

            <div className='flex-1 overflow-y-auto px-5 py-6 space-y-8'>
              <FilterGroup label='Category'>
                <RadioRow
                  label={allLabel}
                  count={allCount}
                  checked={activeCategory === ''}
                  onChange={() => onCategoryChange('')}
                />
                {categories.map((cat) => (
                  <RadioRow
                    key={cat.enum}
                    label={cat.label}
                    count={counts[cat.enum]}
                    checked={activeCategory === cat.enum}
                    onChange={() => onCategoryChange(cat.enum)}
                  />
                ))}
              </FilterGroup>

              <FilterGroup
                label='Made to order'
                hint='Built to your sizes and finish. Quoted per order.'
              >
                {madeToOrderCategories.map((cat) => (
                  <RadioRow
                    key={cat.enum}
                    label={cat.label}
                    count={counts[cat.enum]}
                    checked={activeCategory === cat.enum}
                    onChange={() => onCategoryChange(cat.enum)}
                  />
                ))}
              </FilterGroup>

              <FilterGroup label='Price'>
                {PRICE_BANDS.map((band) => (
                  <CheckRow
                    key={band.id}
                    label={band.label}
                    checked={filters.priceBands.includes(band.id)}
                    onChange={() => toggleBand(band.id)}
                  />
                ))}
              </FilterGroup>

              <FilterGroup label='Availability'>
                <CheckRow
                  label='In stock, ships now'
                  checked={filters.inStockOnly}
                  onChange={() => onFiltersChange({ ...filters, inStockOnly: !filters.inStockOnly })}
                />
                <CheckRow
                  label='Available in more than one colour'
                  checked={filters.hasColours}
                  onChange={() => onFiltersChange({ ...filters, hasColours: !filters.hasColours })}
                />
              </FilterGroup>
            </div>

            <footer className='shrink-0 border-t border-black/[0.06] p-4 flex items-center gap-3'>
              <button
                type='button'
                onClick={() => onFiltersChange(EMPTY_FILTERS)}
                className='pressable h-12 px-5 rounded-full border border-black/[0.12] text-sm font-semibold text-gray-700 hover:bg-black/[0.03]'
              >
                Clear
              </button>
              <button
                type='button'
                onClick={() => setDrawerOpen(false)}
                className='pressable flex-1 h-12 rounded-full bg-gray-900 text-sm font-semibold text-white hover:bg-gray-800'
              >
                Show {total} {total === 1 ? 'piece' : 'pieces'}
              </button>
            </footer>
          </aside>
        </div>
      )}
    </>
  )
}

// ── Pieces ───────────────────────────────────────────────────────────────────

function Chip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className='animate-pop-in shrink-0 inline-flex items-center gap-1.5 h-8 pl-3 pr-1.5 rounded-full bg-amber-50 border border-amber-200 text-xs font-medium text-amber-900 whitespace-nowrap'>
      {label}
      <button
        type='button'
        onClick={onRemove}
        aria-label={`Remove filter: ${label}`}
        className='w-5 h-5 grid place-items-center rounded-full hover:bg-amber-200/70'
      >
        <X className='w-3 h-3' />
      </button>
    </span>
  )
}

function FilterGroup({
  label, hint, children,
}: {
  label: string
  hint?: string
  children: ReactNode
}) {
  return (
    <div>
      <p className='text-[10px] font-semibold uppercase tracking-[0.22em] text-gray-400'>{label}</p>
      {hint && <p className='mt-1.5 text-[11px] leading-relaxed text-gray-400'>{hint}</p>}
      <div className='mt-3 space-y-0.5'>{children}</div>
    </div>
  )
}

function RadioRow({
  label, count, checked, onChange,
}: {
  label: string
  count?: number
  checked: boolean
  onChange: () => void
}) {
  return (
    <label className='flex items-center gap-3 py-2.5 cursor-pointer group'>
      <span
        className={`w-[18px] h-[18px] shrink-0 rounded-full border-2 grid place-items-center transition-colors ${
          checked ? 'border-amber-500' : 'border-gray-300 group-hover:border-gray-400'
        }`}
      >
        {checked && <span className='w-2.5 h-2.5 rounded-full bg-amber-500' />}
      </span>
      <input type='radio' checked={checked} onChange={onChange} className='sr-only' />
      <span className={`flex-1 text-sm ${checked ? 'font-semibold text-gray-900' : 'text-gray-700'}`}>
        {label}
      </span>
      {count !== undefined && count > 0 && (
        <span className='text-[11px] tabular-nums text-gray-300'>{count}</span>
      )}
    </label>
  )
}

function CheckRow({
  label, checked, onChange,
}: {
  label: string
  checked: boolean
  onChange: () => void
}) {
  return (
    <label className='flex items-center gap-3 py-2.5 cursor-pointer group'>
      <span
        className={`w-[18px] h-[18px] shrink-0 rounded-[5px] border-2 grid place-items-center transition-colors ${
          checked ? 'bg-amber-500 border-amber-500' : 'border-gray-300 group-hover:border-gray-400'
        }`}
      >
        {checked && <Check className='w-3 h-3 text-white' strokeWidth={3} />}
      </span>
      <input type='checkbox' checked={checked} onChange={onChange} className='sr-only' />
      <span className={`flex-1 text-sm ${checked ? 'font-semibold text-gray-900' : 'text-gray-700'}`}>
        {label}
      </span>
    </label>
  )
}
