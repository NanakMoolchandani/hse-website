import { motion } from "framer-motion"
import { cn } from "@/src/lib/utils"

const CATEGORY_GLOW: Record<string, {
  left: string; leftLight: string
  right: string; rightLight: string
}> = {
  EXECUTIVE_CHAIRS:      { left: "#f59e0b", leftLight: "#fbbf24", right: "#8b5cf6", rightLight: "#a78bfa" },
  ERGONOMIC_TASK_CHAIRS: { left: "#06b6d4", leftLight: "#22d3ee", right: "#f43f5e", rightLight: "#fb7185" },
  CAFETERIA_FURNITURE:   { left: "#f97316", leftLight: "#fb923c", right: "#3b82f6", rightLight: "#60a5fa" },
  VISITOR_RECEPTION:     { left: "#8b5cf6", leftLight: "#a78bfa", right: "#f59e0b", rightLight: "#fbbf24" },
  CONFERENCE_MEETING:    { left: "#10b981", leftLight: "#34d399", right: "#f43f5e", rightLight: "#fb7185" },
}

const DEFAULT_GLOW = { left: "#06b6d4", leftLight: "#22d3ee", right: "#f43f5e", rightLight: "#fb7185" }

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
  const glow = CATEGORY_GLOW[category || ""] || DEFAULT_GLOW

  const isCard = variant === "card"
  const barOffset = isCard ? "0.75rem" : "1.5rem"
  const washWidth = isCard ? "calc(50% - 0.75rem)" : "calc(50% - 1.5rem)"
  const bloomWidth = isCard ? "5rem" : "7rem"

  return (
    <div
      className={cn(
        "relative flex items-center overflow-hidden bg-slate-950 w-full",
        isCard ? "aspect-square rounded-2xl" : "h-[500px] rounded-xl",
        className
      )}
    >
      {/* ——— LEFT LAMP ——— */}

      {/* Left light bar */}
      <motion.div
        initial={{ scaleY: 0, opacity: 0 }}
        whileInView={{ scaleY: 1, opacity: [0, 1, 0.6] }}
        transition={{ delay: 0.1, duration: 1.2, ease: "easeOut" }}
        viewport={{ once: true }}
        className="absolute z-30"
        style={{
          left: barOffset,
          top: 0,
          bottom: 0,
          width: "3px",
          background: glow.leftLight,
          boxShadow: `0 0 18px 4px ${glow.left}`,
          transformOrigin: "center center",
        }}
      />

      {/* Left glow bloom */}
      <motion.div
        initial={{ opacity: 0, scaleY: 0 }}
        whileInView={{ opacity: [0, 0.7, 0.35], scaleY: 1 }}
        transition={{ delay: 0.15, duration: 1.2, ease: "easeOut" }}
        viewport={{ once: true }}
        className="absolute z-10 pointer-events-none"
        style={{
          left: barOffset,
          top: 0,
          bottom: 0,
          width: bloomWidth,
          transform: "translateX(-30%)",
          background: glow.left,
          filter: "blur(28px)",
          transformOrigin: "center center",
        }}
      />

      {/* Left light wash — fades rightward to center */}
      <motion.div
        initial={{ opacity: 0, scaleX: 0 }}
        whileInView={{ opacity: [0, 0.6, 0.3], scaleX: 1 }}
        transition={{ delay: 0.25, duration: 1.4, ease: "easeOut" }}
        viewport={{ once: true }}
        className="absolute z-[5] pointer-events-none"
        style={{
          left: barOffset,
          top: 0,
          bottom: 0,
          width: washWidth,
          background: `linear-gradient(to right, ${glow.left}30, ${glow.left}12 40%, ${glow.left}04 70%, transparent)`,
          transformOrigin: "left center",
        }}
      />

      {/* Left soft glow */}
      <div
        className="absolute z-[1] pointer-events-none"
        style={{
          left: barOffset,
          top: 0,
          bottom: 0,
          width: washWidth,
          opacity: 0.08,
          background: `linear-gradient(to right, ${glow.left}, transparent 65%)`,
          filter: "blur(30px)",
        }}
      />

      {/* ——— RIGHT LAMP ——— */}

      {/* Right light bar */}
      <motion.div
        initial={{ scaleY: 0, opacity: 0 }}
        whileInView={{ scaleY: 1, opacity: [0, 1, 0.6] }}
        transition={{ delay: 0.2, duration: 1.2, ease: "easeOut" }}
        viewport={{ once: true }}
        className="absolute z-30"
        style={{
          right: barOffset,
          top: 0,
          bottom: 0,
          width: "3px",
          background: glow.rightLight,
          boxShadow: `0 0 18px 4px ${glow.right}`,
          transformOrigin: "center center",
        }}
      />

      {/* Right glow bloom */}
      <motion.div
        initial={{ opacity: 0, scaleY: 0 }}
        whileInView={{ opacity: [0, 0.7, 0.35], scaleY: 1 }}
        transition={{ delay: 0.25, duration: 1.2, ease: "easeOut" }}
        viewport={{ once: true }}
        className="absolute z-10 pointer-events-none"
        style={{
          right: barOffset,
          top: 0,
          bottom: 0,
          width: bloomWidth,
          transform: "translateX(30%)",
          background: glow.right,
          filter: "blur(28px)",
          transformOrigin: "center center",
        }}
      />

      {/* Right light wash — fades leftward to center */}
      <motion.div
        initial={{ opacity: 0, scaleX: 0 }}
        whileInView={{ opacity: [0, 0.6, 0.3], scaleX: 1 }}
        transition={{ delay: 0.35, duration: 1.4, ease: "easeOut" }}
        viewport={{ once: true }}
        className="absolute z-[5] pointer-events-none"
        style={{
          right: barOffset,
          top: 0,
          bottom: 0,
          width: washWidth,
          background: `linear-gradient(to left, ${glow.right}30, ${glow.right}12 40%, ${glow.right}04 70%, transparent)`,
          transformOrigin: "right center",
        }}
      />

      {/* Right soft glow */}
      <div
        className="absolute z-[1] pointer-events-none"
        style={{
          right: barOffset,
          top: 0,
          bottom: 0,
          width: washWidth,
          opacity: 0.08,
          background: `linear-gradient(to left, ${glow.right}, transparent 65%)`,
          filter: "blur(30px)",
        }}
      />

      {/* ——— PRODUCT IMAGE ——— */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
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
            filter: `drop-shadow(-8px 0 15px ${glow.left}30) drop-shadow(8px 0 15px ${glow.right}30) drop-shadow(0 4px 12px rgba(0,0,0,0.5))`,
          }}
        />
      </motion.div>
    </div>
  )
}
