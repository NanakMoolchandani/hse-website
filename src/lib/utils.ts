import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Rupees, in the Indian grouping (₹1,20,000, not ₹120,000).
 *
 * No paise: every price in this business is a whole rupee, and a trailing ".00"
 * on a price tag reads as a system talking to itself.
 */
export function inr(amount: number): string {
  return `₹${Math.round(amount).toLocaleString('en-IN')}`
}

