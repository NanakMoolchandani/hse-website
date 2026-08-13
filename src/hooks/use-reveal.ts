/**
 * Rise-into-place on scroll.
 *
 * Deliberately not framer-motion. `/mvm` is the landing route and is loaded
 * eagerly, so pulling the motion library onto that path would put ~125kB in
 * front of the first thing a visitor sees. An IntersectionObserver plus two
 * CSS classes costs nothing and does the same job.
 *
 * Mount this once, high in the tree. It watches every `.reveal` in the
 * document, including ones added later when a fetch resolves, and adds
 * `.is-visible` as each crosses into view. Revealing is one-way: an element
 * that has arrived stays arrived, because re-hiding on scroll-up reads as a
 * glitch rather than as motion.
 */

import { useEffect } from 'react'

export function useReveal(): void {
  useEffect(() => {
    const root = document.documentElement

    // Tells the stylesheet it is safe to hide things, because something is now
    // running that can un-hide them. See the `.js-reveal` note in index.css.
    root.classList.add('js-reveal')

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const show = (el: Element) => el.classList.add('is-visible')

    if (reduced || typeof IntersectionObserver === 'undefined') {
      document.querySelectorAll('.reveal').forEach(show)
      return () => root.classList.remove('js-reveal')
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          show(entry.target)
          observer.unobserve(entry.target)
        }
      },
      // Start the rise slightly before the element's top edge arrives, so it
      // is settling as it enters rather than starting once it is already read.
      { rootMargin: '0px 0px -12% 0px', threshold: 0.05 },
    )

    const observeAll = () => {
      document.querySelectorAll('.reveal:not(.is-visible)').forEach((el) => observer.observe(el))
    }
    observeAll()

    // Grids populate after their fetch lands, long after this effect ran.
    const mutations = new MutationObserver(observeAll)
    mutations.observe(document.body, { childList: true, subtree: true })

    return () => {
      observer.disconnect()
      mutations.disconnect()
      root.classList.remove('js-reveal')
    }
  }, [])
}
