// ============================================
// HSE 3D Explosion Website — Main Script
// ============================================

// Configuration
const CONFIG = {
  totalFrames: 240,
  framePrefix: 'frame_',
  frameExtension: '.jpg',
  framePadding: 3,
  scrollMultiplier: 5,
  framesPath: '/frames/',
}

// ============================================
// Frame Animation Controller
// ============================================
class FrameAnimator {
  constructor(canvas, config) {
    this.canvas = canvas
    this.ctx = canvas.getContext('2d')
    this.config = config
    this.frames = []
    this.loadedFrames = 0
    this.currentFrame = 0
    this.isReady = false
    this.usePlaceholder = false

    this.init()
  }

  init() {
    this.resizeCanvas()
    window.addEventListener('resize', () => this.resizeCanvas())

    const spacer = document.getElementById('scroll-spacer')
    if (spacer) {
      spacer.style.height = `${this.config.scrollMultiplier * 100}vh`
    }

    this.loadFrames()
    this.setupScrollListener()
  }

  resizeCanvas() {
    this.canvas.width = window.innerWidth
    this.canvas.height = window.innerHeight

    if (this.isReady) {
      this.drawFrame(this.currentFrame)
    }
  }

  getFramePath(index) {
    const num = String(index + 1).padStart(this.config.framePadding, '0')
    return `${this.config.framesPath}${this.config.framePrefix}${num}${this.config.frameExtension}`
  }

  loadFrames() {
    let firstFailed = false

    for (let i = 0; i < this.config.totalFrames; i++) {
      const img = new Image()
      img.src = this.getFramePath(i)

      img.onload = () => {
        this.loadedFrames++

        if (this.loadedFrames === this.config.totalFrames) {
          this.isReady = true
          this.drawFrame(0)
        } else if (this.loadedFrames === 1) {
          this.drawFrame(0)
        }
      }

      img.onerror = () => {
        if (!firstFailed && i === 0) {
          firstFailed = true
          this.usePlaceholder = true
          this.isReady = false
          this.activateFallbackHero()
        }
      }

      this.frames.push(img)
    }
  }

  activateFallbackHero() {
    // Hide canvas, show CSS animated background
    this.canvas.style.display = 'none'
    const heroBg = document.getElementById('hero-bg')
    if (heroBg) {
      heroBg.classList.add('active')
    }

    // Compact the scroll spacer since there's no frame animation
    const spacer = document.getElementById('scroll-spacer')
    if (spacer) {
      spacer.classList.add('compact')
    }
  }

  drawFrame(index) {
    if (!this.frames[index] || !this.frames[index].complete) return

    const img = this.frames[index]
    const { width: cw, height: ch } = this.canvas

    this.ctx.clearRect(0, 0, cw, ch)
    this.ctx.fillStyle = '#000'
    this.ctx.fillRect(0, 0, cw, ch)

    const imgRatio = img.naturalWidth / img.naturalHeight
    const canvasRatio = cw / ch
    let drawW, drawH, drawX, drawY

    if (canvasRatio > imgRatio) {
      drawW = cw
      drawH = cw / imgRatio
      drawX = 0
      drawY = (ch - drawH) / 2
    } else {
      drawH = ch
      drawW = ch * imgRatio
      drawX = (cw - drawW) / 2
      drawY = 0
    }

    this.ctx.drawImage(img, drawX, drawY, drawW, drawH)
    this.currentFrame = index
  }

  setupScrollListener() {
    const heroSection = document.getElementById('hero')

    window.addEventListener('scroll', () => {
      if (!this.isReady) return

      const heroRect = heroSection.getBoundingClientRect()
      const scrollStart = -heroRect.top
      const scrollRange = window.innerHeight * this.config.scrollMultiplier

      let progress = scrollStart / scrollRange
      progress = Math.max(0, Math.min(1, progress))

      const frameIndex = Math.min(
        Math.floor(progress * this.config.totalFrames),
        this.config.totalFrames - 1
      )

      if (frameIndex !== this.currentFrame && frameIndex >= 0) {
        this.drawFrame(frameIndex)
      }

      // Fade out hero text as user scrolls
      const heroText = document.querySelector('.hero-text-overlay')
      if (heroText) {
        const fadeProgress = Math.min(progress * 4, 1)
        heroText.style.opacity = 1 - fadeProgress
        heroText.style.transform = `translateY(${fadeProgress * -60}px)`
      }

      // Fade out scroll indicator
      const scrollInd = document.querySelector('.scroll-indicator')
      if (scrollInd) {
        scrollInd.style.opacity = progress > 0.02 ? 0 : 1
      }
    })
  }
}

// ============================================
// Loading Screen
// ============================================
function initLoader() {
  const loader = document.getElementById('loader')
  if (!loader) return

  // Dismiss loader after animation completes
  setTimeout(() => {
    loader.classList.add('loaded')
    setTimeout(() => loader.remove(), 800)
  }, 1600)
}

// ============================================
// Mobile Menu
// ============================================
function initMobileMenu() {
  const toggle = document.getElementById('nav-toggle')
  const menu = document.getElementById('mobile-menu')
  const links = menu ? menu.querySelectorAll('.mobile-link') : []

  if (!toggle || !menu) return

  function openMenu() {
    toggle.classList.add('active')
    menu.classList.add('open')
    document.body.style.overflow = 'hidden'
  }

  function closeMenu() {
    toggle.classList.remove('active')
    menu.classList.remove('open')
    document.body.style.overflow = ''
  }

  toggle.addEventListener('click', () => {
    if (menu.classList.contains('open')) {
      closeMenu()
    } else {
      openMenu()
    }
  })

  // Close menu when clicking a link
  links.forEach((link) => {
    link.addEventListener('click', () => {
      closeMenu()
    })
  })

  // Close on escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menu.classList.contains('open')) {
      closeMenu()
    }
  })
}

// ============================================
// Scroll-triggered Animations
// ============================================
function initScrollAnimations() {
  const animElements = document.querySelectorAll('[data-animate]')

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in')
          observer.unobserve(entry.target)
        }
      })
    },
    { threshold: 0.15, rootMargin: '0px 0px -50px 0px' }
  )

  animElements.forEach((el) => observer.observe(el))

  // Also animate section titles and other elements
  document.querySelectorAll('.section-title, .section-eyebrow').forEach((el) => {
    if (!el.hasAttribute('data-animate')) {
      el.setAttribute('data-animate', '')
      observer.observe(el)
    }
  })
}

// ============================================
// Counter Animation (Stats Bar)
// ============================================
function initCounters() {
  const counters = document.querySelectorAll('[data-count]')
  if (!counters.length) return

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target)
          observer.unobserve(entry.target)
        }
      })
    },
    { threshold: 0.5 }
  )

  counters.forEach((el) => observer.observe(el))
}

function animateCounter(el) {
  const target = parseInt(el.getAttribute('data-count'), 10)
  const duration = 2000
  const startTime = performance.now()

  function update(currentTime) {
    const elapsed = currentTime - startTime
    const progress = Math.min(elapsed / duration, 1)

    // Ease out cubic
    const eased = 1 - Math.pow(1 - progress, 3)
    const current = Math.floor(eased * target)

    el.textContent = current.toLocaleString('en-IN')

    if (progress < 1) {
      requestAnimationFrame(update)
    } else {
      el.textContent = target.toLocaleString('en-IN')
    }
  }

  requestAnimationFrame(update)
}

// ============================================
// Product Data — MVM Aasanam Catalogue
// ============================================
const PRODUCTS = [
  {
    id: 'freedom',
    name: 'Freedom',
    tagline: 'DynaFlex Twin-Frame System',
    description: 'Two-piece back design with multi-lock synchro mechanism for personalized comfort. The DynaFlex system adapts to your posture throughout the day, reducing fatigue and improving productivity.',
    variants: ['HB', 'HB Cushioned', 'MB'],
    images: [
      { src: '/products/freedom/view-1.png', label: 'View 1' },
      { src: '/products/freedom/view-2.png', label: 'View 2' },
      { src: '/products/freedom/view-3.png', label: 'View 3' },
      { src: '/products/freedom/view-4.png', label: 'View 4' },
      { src: '/products/freedom/view-5.png', label: 'View 5' },
    ],
  },
  {
    id: 'lifestyle',
    name: 'Lifestyle',
    tagline: 'Dual-Panel Backrest with Retractable Footrest',
    description: 'Premium leather and mesh combination with retractable footrest for executive comfort. Dual-panel backrest provides targeted lumbar and upper back support.',
    variants: ['Mesh HB', 'Mesh MB'],
    images: [
      { src: '/products/lifestyle/view-1.png', label: 'View 1' },
      { src: '/products/lifestyle/view-2.png', label: 'View 2' },
      { src: '/products/lifestyle/view-3.png', label: 'View 3' },
      { src: '/products/lifestyle/view-4.png', label: 'View 4' },
      { src: '/products/lifestyle/view-5.png', label: 'View 5' },
    ],
  },
  {
    id: 'aeris',
    name: 'Aeris',
    tagline: 'Biomorphic Mesh Design',
    description: 'Adjustable lumbar support with synchro mechanism and breathable biomorphic mesh that contours to your spine for natural posture alignment.',
    variants: ['Mesh MB', 'Mesh HB'],
    images: [
      { src: '/products/aeris/view-1.png', label: 'View 1' },
      { src: '/products/aeris/view-2.png', label: 'View 2' },
      { src: '/products/aeris/view-3.png', label: 'View 3' },
      { src: '/products/aeris/view-4.png', label: 'View 4' },
    ],
  },
  {
    id: 'ultra',
    name: 'Ultra',
    tagline: 'Heavy-Duty Powder-Coated Frame',
    description: 'Built for demanding environments with high-density PU cushion, powder-coated steel frame, and reinforced gas lift for extended daily use.',
    variants: ['MB', 'Visitor'],
    images: [
      { src: '/products/ultra/view-1.png', label: 'View 1' },
      { src: '/products/ultra/view-2.png', label: 'View 2' },
    ],
  },
  {
    id: 'matrix',
    name: 'Matrix',
    tagline: 'Minimalist Stainless Steel Accents',
    description: 'Clean, modern aesthetic with torch and bar mechanism. Stainless steel detailing elevates the design while maintaining functional ergonomic support.',
    variants: ['HB', 'MB', 'Visitor'],
    images: [
      { src: '/products/matrix/view-1.png', label: 'View 1' },
      { src: '/products/matrix/view-2.png', label: 'View 2' },
      { src: '/products/matrix/view-3.png', label: 'View 3' },
      { src: '/products/matrix/view-4.png', label: 'View 4' },
    ],
  },
  {
    id: '5-star',
    name: '5-Star',
    tagline: 'Reinforced One-Piece Frame',
    description: 'One-piece upper body construction with reinforced frame for maximum durability. Tilting and synchro mechanism for dynamic sitting comfort.',
    variants: ['HB'],
    images: [
      { src: '/products/5-star/view-1.png', label: 'View 1' },
      { src: '/products/5-star/view-2.png', label: 'View 2' },
      { src: '/products/5-star/view-3.png', label: 'View 3' },
      { src: '/products/5-star/view-4.png', label: 'View 4' },
    ],
  },
  {
    id: 'rio-ecco',
    name: 'Rio / Ecco',
    tagline: 'Endurance-Built with Adjustable Headrest',
    description: 'Designed for endurance with adjustable headrest and fixed back support system. Rio offers high-back comfort while Ecco delivers compact mid-back efficiency.',
    variants: ['Rio HB', 'Ecco MB'],
    images: [
      { src: '/products/rio-ecco/view-1.png', label: 'View 1' },
      { src: '/products/rio-ecco/view-2.png', label: 'View 2' },
      { src: '/products/rio-ecco/view-3.png', label: 'View 3' },
      { src: '/products/rio-ecco/view-4.png', label: 'View 4' },
      { src: '/products/rio-ecco/view-5.png', label: 'View 5' },
    ],
  },
  {
    id: 'spider-vertigo',
    name: 'Spider / Vertigo',
    tagline: 'Intelligent Ergonomics',
    description: 'Breathable fabric technology with intelligent ergonomic design for extended comfort sessions. Flexible backrest follows natural spinal movement.',
    variants: ['HB'],
    images: [
      { src: '/products/spider-vertigo/view-1.png', label: 'View 1' },
      { src: '/products/spider-vertigo/view-2.png', label: 'View 2' },
      { src: '/products/spider-vertigo/view-3.png', label: 'View 3' },
      { src: '/products/spider-vertigo/view-4.png', label: 'View 4' },
      { src: '/products/spider-vertigo/view-5.png', label: 'View 5' },
    ],
  },
  {
    id: 'maze-space',
    name: 'Maze / Space',
    tagline: 'Equilibrium Modelling',
    description: 'Adaptive posture technology with back-fitted handles for easy repositioning. Equilibrium design distributes weight evenly across the seating surface.',
    variants: ['MB'],
    images: [
      { src: '/products/maze-space/view-1.png', label: 'View 1' },
      { src: '/products/maze-space/view-2.png', label: 'View 2' },
      { src: '/products/maze-space/view-3.png', label: 'View 3' },
      { src: '/products/maze-space/view-4.png', label: 'View 4' },
      { src: '/products/maze-space/view-5.png', label: 'View 5' },
      { src: '/products/maze-space/view-6.png', label: 'View 6' },
    ],
  },
  {
    id: 't-bar-vision',
    name: 'T-Bar / Vision',
    tagline: 'Meeting & Conference Chairs',
    description: 'Extra back support with PU cushion comfort designed for meeting rooms and conference areas. Powder-coated frame ensures long-lasting professional appearance.',
    variants: ['MB', 'Visitor'],
    images: [
      { src: '/products/t-bar-vision/view-1.png', label: 'View 1' },
      { src: '/products/t-bar-vision/view-2.png', label: 'View 2' },
      { src: '/products/t-bar-vision/view-3.png', label: 'View 3' },
      { src: '/products/t-bar-vision/view-4.png', label: 'View 4' },
      { src: '/products/t-bar-vision/view-5.png', label: 'View 5' },
    ],
  },
  {
    id: 'decker',
    name: 'Decker',
    tagline: '2-in-1 Back Support System',
    description: 'Adjustable handles and headrest with dual-zone back support for all-day use. The 2-in-1 system lets you switch between focused work and relaxed postures.',
    variants: ['HB'],
    images: [
      { src: '/products/decker/view-1.png', label: 'View 1' },
      { src: '/products/decker/view-2.png', label: 'View 2' },
    ],
  },
  {
    id: 'backpack-swivel',
    name: 'Backpack / Swivel',
    tagline: 'Tension-Controlled Recline',
    description: 'Cushioned back with flexible mesh and precision tension-controlled recline mechanism. Adjusts to your preferred tilt resistance for personalized comfort.',
    variants: ['HB'],
    images: [
      { src: '/products/backpack-swivel/view-1.png', label: 'View 1' },
      { src: '/products/backpack-swivel/view-2.png', label: 'View 2' },
      { src: '/products/backpack-swivel/view-3.png', label: 'View 3' },
      { src: '/products/backpack-swivel/view-4.png', label: 'View 4' },
    ],
  },
  {
    id: 'pears-messy',
    name: 'Pears / Messy',
    tagline: 'Nonstop Heavy-Duty Use',
    description: 'One-piece upper body with reinforced construction built for continuous, demanding use. Ideal for 24/7 operations and shared workspace environments.',
    variants: ['HB', 'MB'],
    images: [
      { src: '/products/pears-messy/view-1.png', label: 'View 1' },
      { src: '/products/pears-messy/view-2.png', label: 'View 2' },
      { src: '/products/pears-messy/view-3.png', label: 'View 3' },
      { src: '/products/pears-messy/view-4.png', label: 'View 4' },
    ],
  },
  {
    id: 'attire-visit',
    name: 'Attire / Visit',
    tagline: 'Student & Visitor Chairs',
    description: 'Movable study board with stainless steel construction and dynamic stacking capability. Space-efficient design for educational and waiting area environments.',
    variants: ['Study', 'Visitor'],
    images: [
      { src: '/products/attire-visit/view-1.png', label: 'View 1' },
      { src: '/products/attire-visit/view-2.png', label: 'View 2' },
      { src: '/products/attire-visit/view-3.png', label: 'View 3' },
      { src: '/products/attire-visit/view-4.png', label: 'View 4' },
    ],
  },
  {
    id: 'steller',
    name: 'Steller',
    tagline: 'Deep Recline, Modern Aesthetic',
    description: 'Added frame for enhanced durability with deep recline capability. Modern aesthetic blends seamlessly into contemporary office and home environments.',
    variants: ['MB'],
    images: [
      { src: '/products/steller/view-1.png', label: 'View 1' },
      { src: '/products/steller/view-2.png', label: 'View 2' },
    ],
  },
]

// ============================================
// Product Viewer
// ============================================
function initProductViewer() {
  const overlay = document.getElementById('product-viewer')
  if (!overlay) return

  const mainImg = document.getElementById('viewer-main-img')
  const thumbsContainer = document.getElementById('viewer-thumbs')
  const nameEl = document.getElementById('viewer-name')
  const taglineEl = document.getElementById('viewer-tagline')
  const descEl = document.getElementById('viewer-description')
  const variantsEl = document.getElementById('viewer-variants')
  const counterEl = document.getElementById('viewer-counter')
  const closeBtn = document.getElementById('viewer-close')
  const backdrop = document.getElementById('viewer-backdrop')
  const prevBtn = document.getElementById('viewer-prev')
  const nextBtn = document.getElementById('viewer-next')

  let currentProductIndex = 0
  let currentImageIndex = 0

  function openViewer(productId) {
    const index = PRODUCTS.findIndex((p) => p.id === productId)
    if (index === -1) return

    currentProductIndex = index
    currentImageIndex = 0
    renderProduct()

    overlay.classList.add('open')
    overlay.setAttribute('aria-hidden', 'false')
    document.body.style.overflow = 'hidden'
  }

  function closeViewer() {
    overlay.classList.remove('open')
    overlay.setAttribute('aria-hidden', 'true')
    document.body.style.overflow = ''
  }

  function renderProduct() {
    const product = PRODUCTS[currentProductIndex]

    // Info
    nameEl.textContent = product.name
    taglineEl.textContent = product.tagline
    descEl.textContent = product.description
    counterEl.textContent = `${currentProductIndex + 1} / ${PRODUCTS.length}`

    // Variants
    variantsEl.innerHTML = product.variants
      .map((v) => `<span class="viewer-variant-tag">${v}</span>`)
      .join('')

    // Main image (with fade)
    switchImage(0)

    // Thumbnails
    thumbsContainer.innerHTML = product.images
      .map(
        (img, i) =>
          `<button class="viewer-thumb ${i === 0 ? 'active' : ''}" data-idx="${i}" aria-label="${img.label}">
            <img src="${img.src}" alt="${img.label}" loading="lazy" />
          </button>`
      )
      .join('')
  }

  function switchImage(idx) {
    const product = PRODUCTS[currentProductIndex]
    if (!product.images[idx]) return

    currentImageIndex = idx

    // Fade transition
    mainImg.classList.add('fading')
    setTimeout(() => {
      mainImg.src = product.images[idx].src
      mainImg.alt = `${product.name} — ${product.images[idx].label}`
      mainImg.classList.remove('fading')
    }, 150)

    // Update active thumbnail
    thumbsContainer.querySelectorAll('.viewer-thumb').forEach((t, i) => {
      t.classList.toggle('active', i === idx)
    })
  }

  function navigateProduct(direction) {
    currentProductIndex =
      (currentProductIndex + direction + PRODUCTS.length) % PRODUCTS.length
    currentImageIndex = 0
    renderProduct()
  }

  // Click handlers for grid cards
  document.querySelectorAll('.product-card[data-product]').forEach((card) => {
    card.addEventListener('click', () => {
      openViewer(card.dataset.product)
    })
  })

  // Close
  closeBtn.addEventListener('click', closeViewer)
  backdrop.addEventListener('click', closeViewer)

  // Thumbnail clicks (event delegation)
  thumbsContainer.addEventListener('click', (e) => {
    const thumb = e.target.closest('.viewer-thumb')
    if (thumb) {
      switchImage(parseInt(thumb.dataset.idx, 10))
    }
  })

  // Product navigation
  prevBtn.addEventListener('click', () => navigateProduct(-1))
  nextBtn.addEventListener('click', () => navigateProduct(1))

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (!overlay.classList.contains('open')) return

    switch (e.key) {
      case 'Escape':
        closeViewer()
        break
      case 'ArrowLeft':
        navigateProduct(-1)
        break
      case 'ArrowRight':
        navigateProduct(1)
        break
      case 'ArrowUp':
        e.preventDefault()
        switchImage(Math.max(0, currentImageIndex - 1))
        break
      case 'ArrowDown':
        e.preventDefault()
        switchImage(
          Math.min(
            PRODUCTS[currentProductIndex].images.length - 1,
            currentImageIndex + 1
          )
        )
        break
    }
  })
}

// ============================================
// Navbar scroll behavior
// ============================================
function initNavbar() {
  const nav = document.querySelector('.nav')
  let lastScrollY = 0

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY

    if (scrollY > 50) {
      nav.classList.add('nav-scrolled')
    } else {
      nav.classList.remove('nav-scrolled')
    }

    if (scrollY > lastScrollY && scrollY > 200) {
      nav.classList.add('nav-hidden')
    } else {
      nav.classList.remove('nav-hidden')
    }

    lastScrollY = scrollY
  })

  // Smooth scroll for nav links
  document.querySelectorAll('.nav-links a').forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault()
      const targetId = link.getAttribute('href')
      const target = document.querySelector(targetId)
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' })
      }
    })
  })
}

// ============================================
// Initialize Everything
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  initLoader()

  const canvas = document.getElementById('hero-canvas')
  if (canvas) {
    new FrameAnimator(canvas, CONFIG)
  }

  initMobileMenu()
  initScrollAnimations()
  initCounters()
  initNavbar()
  initProductViewer()
})
