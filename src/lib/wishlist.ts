/**
 * The wishlist.
 *
 * Deliberately account-free, like the cart and the order lookup. A chair is
 * bought once every few years, so asking someone to make a password before
 * they are allowed to remember a chair is friction with nothing behind it.
 * This is a list of catalogue slugs in localStorage: it survives a closed tab
 * and a dead battery, which covers the real case (browse on the sofa tonight,
 * decide on Saturday) without a login, a server table or a privacy question.
 *
 * It stores the slug rather than a numeric id on purpose. Most of the
 * catalogue is not published for sale and therefore has no `web_products` row
 * and no id, so an id-keyed list could only ever hold the buyable slice.
 *
 * Same module-store shape as `cart.ts`, for the same reason: the header badge,
 * the cards and the wishlist page all read one source without a provider
 * threaded through a route tree that is mostly marketing pages.
 */

import { useSyncExternalStore } from 'react'

const KEY = 'mvm_wishlist'

export interface WishlistEntry {
  slug: string
  /** Everything needed to draw a card without re-fetching the catalogue. */
  name: string
  image: string | null
  href: string
  addedAt: number
}

let entries: WishlistEntry[] = read()
const listeners = new Set<() => void>()

function read(): WishlistEntry[] {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as WishlistEntry[]
    if (!Array.isArray(parsed)) return []
    return parsed.filter((e) => e && typeof e.slug === 'string')
  } catch {
    return []
  }
}

function write(next: WishlistEntry[]): void {
  entries = next
  try {
    localStorage.setItem(KEY, JSON.stringify(next))
  } catch {
    /* private mode: it still works for this visit */
  }
  listeners.forEach((l) => l())
}

export function isSaved(slug: string): boolean {
  return entries.some((e) => e.slug === slug)
}

/** Add or remove. Returns true when the product ended up saved. */
export function toggleWishlist(entry: Omit<WishlistEntry, 'addedAt'>): boolean {
  if (isSaved(entry.slug)) {
    write(entries.filter((e) => e.slug !== entry.slug))
    return false
  }
  // Newest first: the list is a shortlist, not an archive.
  write([{ ...entry, addedAt: Date.now() }, ...entries])
  return true
}

export function removeFromWishlist(slug: string): void {
  write(entries.filter((e) => e.slug !== slug))
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener)
  // Saved on the phone, opened on the laptop is not a case we cover, but two
  // tabs on one device is: keep them in step.
  const onStorage = (e: StorageEvent) => {
    if (e.key === KEY) {
      entries = read()
      listeners.forEach((l) => l())
    }
  }
  window.addEventListener('storage', onStorage)
  return () => {
    listeners.delete(listener)
    window.removeEventListener('storage', onStorage)
  }
}

const EMPTY: WishlistEntry[] = []

export function useWishlist(): WishlistEntry[] {
  return useSyncExternalStore(
    subscribe,
    () => entries,
    () => EMPTY, // the prerenderer has no localStorage
  )
}
