import * as React from "react"
import { Card } from "@/src/components/ui/card"
import { Button } from "@/src/components/ui/button"
import { ScrollArea } from "@/src/components/ui/scroll-area"
import { AspectRatio } from "@/src/components/ui/aspect-ratio"
import { Separator } from "@/src/components/ui/separator"
import { cn } from "@/src/lib/utils"
import { ArrowLeft, Heart, ChevronLeft, ChevronRight } from "lucide-react"
import { Link } from "react-router-dom"

export type ProductImage = {
  src: string
  alt?: string
  thumbSrc?: string
}

export interface ProductImageCardProps {
  title?: string
  backHref?: string
  images: ProductImage[]
  initialIndex?: number
  onIndexChange?: (index: number) => void
  className?: string
}

export function ProductImageCard({
  title = "Product Details",
  backHref = "/",
  images,
  initialIndex = 0,
  onIndexChange,
  className,
}: ProductImageCardProps) {
  const [index, setIndex] = React.useState(initialIndex)

  const setSafeIndex = (i: number) => {
    const next = (i + images.length) % images.length
    setIndex(next)
    onIndexChange?.(next)
  }

  const prev = () => setSafeIndex(index - 1)
  const next = () => setSafeIndex(index + 1)

  // keyboard support
  React.useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prev()
      if (e.key === "ArrowRight") next()
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, images.length])

  if (!images?.length) return null

  return (
    <Card
      className={cn(
        "relative mx-auto w-full max-w-3xl rounded-3xl border-gray-200 bg-white/70 p-4 shadow-sm",
        className
      )}
    >
      {/* Header row */}
      <div className="flex items-center justify-between">
        <Button asChild size="icon" variant="outline" className="rounded-full border-gray-200">
          <Link to={backHref} aria-label="Back">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>

        <h2 className="text-xl font-semibold text-gray-900 sm:text-2xl">{title}</h2>

        <Button size="icon" variant="outline" className="rounded-full border-gray-200" aria-label="Favorite">
          <Heart className="h-4 w-4" />
        </Button>
      </div>

      <Separator className="my-4 bg-gray-200" />

      {/* Content grid */}
      <div className="grid grid-cols-12 gap-4">
        {/* Thumbnails */}
        <div className="order-2 col-span-12 sm:order-1 sm:col-span-3">
          <ScrollArea className="h-auto sm:h-[420px]">
            <div className="flex gap-3 sm:flex-col">
              {images.map((img, i) => {
                const active = i === index
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setSafeIndex(i)}
                    aria-pressed={active}
                    className={cn(
                      "relative overflow-hidden rounded-xl border p-0 outline-none transition",
                      "focus-visible:ring-2 focus-visible:ring-gray-400",
                      active
                        ? "border-gray-900"
                        : "border-gray-200 hover:border-gray-400"
                    )}
                  >
                    <img
                      src={img.thumbSrc ?? img.src}
                      alt={img.alt ?? `Thumbnail ${i + 1}`}
                      className="h-20 w-20 object-cover sm:h-16 sm:w-full"
                      loading={i === 0 ? "eager" : "lazy"}
                    />
                  </button>
                )
              })}
            </div>
          </ScrollArea>
        </div>

        {/* Main image */}
        <div className="order-1 col-span-12 sm:order-2 sm:col-span-9">
          <div className="relative">
            <AspectRatio ratio={4 / 5}>
              <div className="h-full w-full overflow-hidden rounded-3xl bg-gray-50">
                <img
                  src={images[index].src}
                  alt={images[index].alt ?? "Selected view"}
                  className="h-full w-full rounded-3xl object-contain"
                />
              </div>
            </AspectRatio>

            {/* Next/Prev controls */}
            {images.length > 1 && (
              <div className="absolute bottom-3 right-3 flex gap-2">
                <Button
                  size="icon"
                  variant="secondary"
                  className="rounded-full bg-white/80 backdrop-blur border border-gray-200 hover:bg-white"
                  onClick={prev}
                  aria-label="Previous image"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  size="icon"
                  variant="secondary"
                  className="rounded-full bg-white/80 backdrop-blur border border-gray-200 hover:bg-white"
                  onClick={next}
                  aria-label="Next image"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  )
}
