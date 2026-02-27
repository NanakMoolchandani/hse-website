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

  return (
    <div
      className={cn(
        "relative flex items-center overflow-hidden bg-slate-950 w-full",
        isCard ? "aspect-square rounded-2xl" : "h-[500px] rounded-xl",
        className
      )}
    >
      {/* 1. Vertical light bar — full height, solid bright edge */}
      <motion.div
        initial={{ scaleY: 0, opacity: 0 }}
        whileInView={{ scaleY: 1, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.8, ease: "easeOut" }}
        viewport={{ once: true }}
        className="absolute z-30"
        style={{
          left: barLeft,
          top: "4%",
          bottom: "4%",
          width: "3px",
          background: `linear-gradient(to bottom, ${colorLight}40, ${colorLight}, ${color}, ${colorLight}, ${colorLight}40)`,
          boxShadow: `0 0 18px 4px ${color}`,
          transformOrigin: "center center",
        }}
      />

      {/* 2. Glow bloom — full height, even spread behind the bar */}
      <motion.div
        initial={{ opacity: 0, scaleY: 0.3 }}
        whileInView={{ opacity: 0.55, scaleY: 1 }}
        transition={{ delay: 0.2, duration: 0.8, ease: "easeOut" }}
        viewport={{ once: true }}
        className="absolute z-10 pointer-events-none"
        style={{
          left: barLeft,
          top: "2%",
          bottom: "2%",
          width: isCard ? "5rem" : "7rem",
          transform: "translateX(-30%)",
          background: `linear-gradient(to bottom, ${color}00, ${color}, ${color}, ${color}00)`,
          filter: "blur(24px)",
        }}
      />

      {/* 3. Light wash — even spread rightward, full height */}
      <motion.div
        initial={{ opacity: 0, scaleX: 0 }}
        whileInView={{ opacity: 1, scaleX: 1 }}
        transition={{ delay: 0.3, duration: 0.9, ease: "easeOut" }}
        viewport={{ once: true }}
        className="absolute z-[5] pointer-events-none"
        style={{
          left: barLeft,
          top: 0,
          bottom: 0,
          width: "75%",
          background: `linear-gradient(to right, ${color}28, ${color}10 35%, ${color}04 60%, transparent 90%)`,
          transformOrigin: "left center",
        }}
      />

      {/* 4. Three even hotspots — top, center, bottom (equal glow spread) */}
      {["15%", "50%", "85%"].map((top, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 0.25 }}
          transition={{ delay: 0.3 + i * 0.1, duration: 0.7, ease: "easeOut" }}
          viewport={{ once: true }}
          className="absolute z-10 pointer-events-none"
          style={{
            left: barLeft,
            top,
            transform: "translate(-10%, -50%)",
            width: isCard ? "8rem" : "14rem",
            height: isCard ? "8rem" : "14rem",
            background: `radial-gradient(circle, ${color}, transparent 65%)`,
            filter: "blur(25px)",
          }}
        />
      ))}

      {/* 5. Fan rays — top, center, bottom (even spread) */}
      {[
        { top: "20%", rotate: -15 },
        { top: "50%", rotate: 0 },
        { top: "80%", rotate: 15 },
      ].map((ray, i) => (
        <motion.div
          key={`ray-${i}`}
          initial={{ opacity: 0, scaleX: 0 }}
          whileInView={{ opacity: 0.12, scaleX: 1 }}
          transition={{ delay: 0.4 + i * 0.08, duration: 0.7, ease: "easeOut" }}
          viewport={{ once: true }}
          className="absolute z-[5] pointer-events-none"
          style={{
            left: barLeft,
            top: ray.top,
            width: isCard ? "65%" : "70%",
            height: "2px",
            background: `linear-gradient(to right, ${colorLight}, transparent 85%)`,
            transformOrigin: "left center",
            transform: `rotate(${ray.rotate}deg)`,
            filter: "blur(3px)",
          }}
        />
      ))}

      {/* Product image — centered */}
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

      {/* Light spill — full height wash from left */}
      <div
        className="absolute z-[1] pointer-events-none"
        style={{
          left: barLeft,
          top: 0,
          bottom: 0,
          width: "85%",
          opacity: 0.12,
          background: `linear-gradient(to right, ${color}, transparent 70%)`,
          filter: "blur(40px)",
        }}
      />
    </div>
  )
}
