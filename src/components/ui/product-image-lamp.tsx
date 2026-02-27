import { motion } from "framer-motion"
import { cn } from "@/src/lib/utils"

/**
 * Category → glow color mapping (CSS hex values).
 * Executive = warm gold, Ergonomic = cyan, Cafeteria = orange, Visitor = violet.
 */
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
  /** card = grid cards, detail = product page hero */
  variant?: "card" | "detail"
  className?: string
}

/**
 * Product image with a vertical lamp light on the LEFT side.
 * Light shines rightward onto the chair. Color matches product category.
 */
export function ProductImageLamp({
  src,
  alt,
  category,
  variant = "card",
  className,
}: ProductImageLampProps) {
  const { color, colorLight } = CATEGORY_GLOW[category || ""] || DEFAULT_GLOW

  const isCard = variant === "card"

  return (
    <div
      className={cn(
        "relative flex items-center overflow-hidden bg-slate-950 w-full",
        isCard ? "aspect-square rounded-2xl" : "h-[500px] rounded-xl",
        className
      )}
    >
      {/* 1. Vertical light bar — sharp bright edge on left */}
      <motion.div
        initial={{ height: "0%", opacity: 0 }}
        whileInView={{ height: isCard ? "60%" : "70%", opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.8, ease: "easeOut" }}
        viewport={{ once: true }}
        className="absolute left-0 top-1/2 z-30"
        style={{
          width: "3px",
          background: `linear-gradient(to bottom, transparent, ${colorLight}, ${color}, ${colorLight}, transparent)`,
          transform: "translateY(-50%)",
          boxShadow: `0 0 15px 3px ${color}`,
        }}
      />

      {/* 2. Glow bloom — soft wide glow behind the bar */}
      <motion.div
        initial={{ opacity: 0, scaleY: 0.3 }}
        whileInView={{ opacity: 0.6, scaleY: 1 }}
        transition={{ delay: 0.2, duration: 0.8, ease: "easeOut" }}
        viewport={{ once: true }}
        className="absolute left-0 top-1/2 z-10 pointer-events-none"
        style={{
          width: isCard ? "4rem" : "6rem",
          height: isCard ? "70%" : "80%",
          transform: "translate(-30%, -50%)",
          background: `radial-gradient(ellipse at center, ${color}, transparent 70%)`,
          filter: "blur(20px)",
        }}
      />

      {/* 3. Cone of light — spreads rightward from bar onto the chair */}
      <motion.div
        initial={{ opacity: 0, scaleX: 0 }}
        whileInView={{ opacity: 1, scaleX: 1 }}
        transition={{ delay: 0.3, duration: 0.9, ease: "easeOut" }}
        viewport={{ once: true }}
        className="absolute left-0 top-0 bottom-0 z-[5] pointer-events-none"
        style={{
          width: "70%",
          background: `linear-gradient(to right, ${color}22, ${color}08 40%, transparent 80%)`,
          transformOrigin: "left center",
        }}
      />

      {/* 4. Bright hotspot — concentrated light near the bar */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 0.35 }}
        transition={{ delay: 0.3, duration: 0.7, ease: "easeOut" }}
        viewport={{ once: true }}
        className="absolute z-10 pointer-events-none"
        style={{
          left: 0,
          top: "50%",
          transform: "translate(-10%, -50%)",
          width: isCard ? "10rem" : "16rem",
          height: isCard ? "10rem" : "16rem",
          background: `radial-gradient(circle, ${color}, transparent 60%)`,
          filter: "blur(30px)",
        }}
      />

      {/* 5. Upper fan ray */}
      <motion.div
        initial={{ opacity: 0, rotate: 0 }}
        whileInView={{ opacity: 0.15, rotate: -25 }}
        transition={{ delay: 0.4, duration: 0.7, ease: "easeOut" }}
        viewport={{ once: true }}
        className="absolute z-[5] pointer-events-none"
        style={{
          left: 0,
          top: "50%",
          width: isCard ? "60%" : "65%",
          height: "3px",
          background: `linear-gradient(to right, ${colorLight}, transparent 80%)`,
          transformOrigin: "left center",
          filter: "blur(4px)",
        }}
      />

      {/* 6. Lower fan ray */}
      <motion.div
        initial={{ opacity: 0, rotate: 0 }}
        whileInView={{ opacity: 0.15, rotate: 25 }}
        transition={{ delay: 0.4, duration: 0.7, ease: "easeOut" }}
        viewport={{ once: true }}
        className="absolute z-[5] pointer-events-none"
        style={{
          left: 0,
          top: "50%",
          width: isCard ? "60%" : "65%",
          height: "3px",
          background: `linear-gradient(to right, ${colorLight}, transparent 80%)`,
          transformOrigin: "left center",
          filter: "blur(4px)",
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

      {/* Light spill — horizontal glow washing over the chair from left */}
      <div
        className="absolute left-0 top-1/2 -translate-y-1/2 z-[1] rounded-full opacity-15 blur-3xl pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at left, ${color}, transparent 70%)`,
          width: "80%",
          height: "60%",
        }}
      />
    </div>
  )
}
