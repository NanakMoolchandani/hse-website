import { motion } from "framer-motion"
import { cn } from "@/src/lib/utils"

const CATEGORY_GLOW: Record<string, { color: string; colorLight: string }> = {
  EXECUTIVE_CHAIRS: { color: "#f59e0b", colorLight: "#fbbf24" },
  ERGONOMIC_TASK_CHAIRS: { color: "#06b6d4", colorLight: "#22d3ee" },
  CAFETERIA_FURNITURE: { color: "#f97316", colorLight: "#fb923c" },
  VISITOR_RECEPTION: { color: "#8b5cf6", colorLight: "#a78bfa" },
  CONFERENCE_MEETING: { color: "#10b981", colorLight: "#34d399" },
}

const DEFAULT_GLOW = { color: "#06b6d4", colorLight: "#22d3ee" }

interface ProductImageLampProps {
  src: string
  alt: string
  category?: string
  variant?: "card" | "detail"
  className?: string
}

export function ProductImageLamp({
  src,
  alt,
  category,
  variant = "card",
  className,
}: ProductImageLampProps) {
  const { color, colorLight } = CATEGORY_GLOW[category || ""] || DEFAULT_GLOW

  const isCard = variant === "card"
  const barLeft = isCard ? "0.75rem" : "1.5rem"

  // Image has p-4 (1rem) padding. Light wash should reach exactly to the image edge.
  // Bar is at barLeft, image content starts ~1rem from each side → wash width = ~calc(100% - 2rem)
  // But since wash starts from barLeft, we use a percentage that lands at the image boundary.
  const washWidth = isCard ? "calc(100% - 1.75rem)" : "calc(100% - 2.5rem)"

  return (
    <div
      className={cn(
        "relative flex items-center overflow-hidden bg-slate-950 w-full",
        isCard ? "aspect-square rounded-2xl" : "h-[500px] rounded-xl",
        className
      )}
    >
      {/* 1. Vertical light bar — full height, uniform brightness, high beam → low beam */}
      <motion.div
        initial={{ scaleY: 0, opacity: 0 }}
        whileInView={{ scaleY: 1, opacity: [0, 1, 0.6] }}
        transition={{ delay: 0.1, duration: 1.2, ease: "easeOut" }}
        viewport={{ once: true }}
        className="absolute z-30"
        style={{
          left: barLeft,
          top: 0,
          bottom: 0,
          width: "3px",
          background: colorLight,
          boxShadow: `0 0 18px 4px ${color}`,
          transformOrigin: "center center",
        }}
      />

      {/* 2. Glow bloom — full height, perfectly uniform (solid color + blur) */}
      <motion.div
        initial={{ opacity: 0, scaleY: 0 }}
        whileInView={{ opacity: [0, 0.7, 0.35], scaleY: 1 }}
        transition={{ delay: 0.15, duration: 1.2, ease: "easeOut" }}
        viewport={{ once: true }}
        className="absolute z-10 pointer-events-none"
        style={{
          left: barLeft,
          top: 0,
          bottom: 0,
          width: isCard ? "5rem" : "7rem",
          transform: "translateX(-30%)",
          background: color,
          filter: "blur(28px)",
          transformOrigin: "center center",
        }}
      />

      {/* 3. Light wash — uniform full height, fades rightward to the image edge */}
      <motion.div
        initial={{ opacity: 0, scaleX: 0 }}
        whileInView={{ opacity: [0, 0.6, 0.3], scaleX: 1 }}
        transition={{ delay: 0.25, duration: 1.4, ease: "easeOut" }}
        viewport={{ once: true }}
        className="absolute z-[5] pointer-events-none"
        style={{
          left: barLeft,
          top: 0,
          bottom: 0,
          width: washWidth,
          background: `linear-gradient(to right, ${color}30, ${color}12 40%, ${color}04 70%, transparent)`,
          transformOrigin: "left center",
        }}
      />

      {/* 4. Soft uniform side glow — full height, constant intensity */}
      <div
        className="absolute z-[1] pointer-events-none"
        style={{
          left: barLeft,
          top: 0,
          bottom: 0,
          width: washWidth,
          opacity: 0.08,
          background: `linear-gradient(to right, ${color}, transparent 65%)`,
          filter: "blur(30px)",
        }}
      />

      {/* Product image — centered, lit by the left lamp */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5, duration: 0.6, ease: "easeOut" }}
        viewport={{ once: true }}
        className="relative z-20 flex items-center justify-center w-full h-full p-4"
      >
        <img
          src={src}
          alt={alt}
          className={cn(
            "object-contain max-w-full max-h-full",
            isCard ? "transition-transform duration-500 group-hover:scale-110" : ""
          )}
          loading="lazy"
          style={{
            filter: `drop-shadow(0 0 20px ${color}40) drop-shadow(0 4px 12px rgba(0,0,0,0.5))`,
          }}
        />
      </motion.div>
    </div>
  )
}
