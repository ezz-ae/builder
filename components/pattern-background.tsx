"use client"

interface PatternBackgroundProps {
  type: "dots" | "grid" | "waves" | "diagonal" | "cross"
  color: string
  size: number
  opacity: number
}

export function PatternBackground({ type, color, size, opacity }: PatternBackgroundProps) {
  const getPatternSVG = () => {
    switch (type) {
      case "dots":
        return (
          <pattern id="pattern-dots" x="0" y="0" width={size} height={size} patternUnits="userSpaceOnUse">
            <circle cx={size / 2} cy={size / 2} r={size / 10} fill={color} />
          </pattern>
        )
      case "grid":
        return (
          <pattern id="pattern-grid" x="0" y="0" width={size} height={size} patternUnits="userSpaceOnUse">
            <path d={`M ${size} 0 L 0 0 0 ${size}`} fill="none" stroke={color} strokeWidth="1" />
          </pattern>
        )
      case "waves":
        return (
          <pattern id="pattern-waves" x="0" y="0" width={size * 2} height={size} patternUnits="userSpaceOnUse">
            <path
              d={`M 0 ${size / 2} Q ${size / 2} 0, ${size} ${size / 2} T ${size * 2} ${size / 2}`}
              fill="none"
              stroke={color}
              strokeWidth="1"
            />
          </pattern>
        )
      case "diagonal":
        return (
          <pattern id="pattern-diagonal" x="0" y="0" width={size} height={size} patternUnits="userSpaceOnUse">
            <path d={`M 0 ${size} L ${size} 0`} fill="none" stroke={color} strokeWidth="1" />
          </pattern>
        )
      case "cross":
        return (
          <pattern id="pattern-cross" x="0" y="0" width={size} height={size} patternUnits="userSpaceOnUse">
            <path
              d={`M ${size / 2} 0 L ${size / 2} ${size} M 0 ${size / 2} L ${size} ${size / 2}`}
              fill="none"
              stroke={color}
              strokeWidth="1"
            />
          </pattern>
        )
      default:
        return null
    }
  }

  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ opacity }} preserveAspectRatio="none">
      <defs>{getPatternSVG()}</defs>
      <rect width="100%" height="100%" fill={`url(#pattern-${type})`} />
    </svg>
  )
}
