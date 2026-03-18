/**
 * Post-build step: add CSS preload hints and optimize resource loading order
 * in all prerendered HTML pages.
 *
 * Strategy: Instead of inlining ALL critical CSS (which bloats HTML and hurts LCP),
 * we preload the CSS file so it starts downloading immediately, and ensure the
 * hero image has the highest fetch priority.
 *
 * Run: npx tsx scripts/critical-css.ts
 * Must run AFTER vite build (reads from dist/)
 */

import { readdirSync, readFileSync, writeFileSync, statSync } from 'fs'
import { resolve, join } from 'path'

const DIST_DIR = resolve(import.meta.dirname, '..', 'dist')

function findHtmlFiles(dir: string): string[] {
  const files: string[] = []
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry)
    const stat = statSync(full)
    if (stat.isDirectory() && entry !== 'assets') {
      files.push(...findHtmlFiles(full))
    } else if (entry === 'index.html') {
      files.push(full)
    }
  }
  return files
}

async function main() {
  const htmlFiles = findHtmlFiles(DIST_DIR)
  const rootHtml = join(DIST_DIR, 'index.html')
  if (!htmlFiles.includes(rootHtml)) htmlFiles.unshift(rootHtml)

  console.log(`[critical-css] Processing ${htmlFiles.length} HTML files...`)

  // Find the CSS filename from dist/assets/
  const assetsDir = join(DIST_DIR, 'assets')
  const cssFile = readdirSync(assetsDir).find(f => f.endsWith('.css'))
  if (!cssFile) {
    console.warn('[critical-css] No CSS file found in dist/assets/, skipping')
    return
  }

  let processed = 0
  for (const file of htmlFiles) {
    try {
      let html = readFileSync(file, 'utf-8')

      // 1. Add preload hint for CSS right after <head> (before anything else)
      //    This makes the browser start downloading CSS immediately
      if (!html.includes(`preload" as="style" href="/assets/${cssFile}"`)) {
        html = html.replace(
          '<head>',
          `<head>\n  <link rel="preload" as="style" href="/assets/${cssFile}" crossorigin>`
        )
      }

      // 2. Add preload for main JS bundle (so it downloads in parallel with CSS)
      const jsFiles = readdirSync(assetsDir).filter(f => f.startsWith('vendor-react') && f.endsWith('.js'))
      for (const js of jsFiles) {
        if (!html.includes(`modulepreload" href="/assets/${js}"`)) {
          html = html.replace(
            '</head>',
            `  <link rel="modulepreload" href="/assets/${js}">\n</head>`
          )
        }
      }

      // 3. Ensure hero image preload has fetchpriority="high" and is early in <head>
      //    Move existing hero preload to right after CSS preload
      const heroPreload = html.match(/<link[^>]*rel="preload"[^>]*hero\.jpg[^>]*>/)?.[0]
      if (heroPreload) {
        // Remove from current position
        html = html.replace(heroPreload, '')
        // Insert right after <head> line (before CSS preload)
        html = html.replace(
          '<head>',
          `<head>\n  ${heroPreload.includes('fetchpriority') ? heroPreload : heroPreload.replace('>', ' fetchpriority="high">')}`
        )
      }

      writeFileSync(file, html, 'utf-8')
      processed++
    } catch (e) {
      console.warn(`  [skip] ${file.replace(DIST_DIR, '')}: ${(e as Error).message}`)
    }
  }

  console.log(`[critical-css] Done — ${processed}/${htmlFiles.length} files optimized`)
}

main()
