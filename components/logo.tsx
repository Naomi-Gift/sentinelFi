import type { SVGProps } from "react";

/**
 * SentinelFi logo mark — a cyan/teal gradient shield with an "S" inside.
 * Use `size` to control width/height (square). Defaults to 32px.
 */
export function SentinelLogo({
  size = 32,
  className = "",
  ...props
}: { size?: number; className?: string } & SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 200 200"
      width={size}
      height={size}
      fill="none"
      aria-label="SentinelFi logo"
      className={className}
      {...props}
    >
      <defs>
        <linearGradient id="sf-shield-grad" x1="100" y1="20" x2="100" y2="180" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#00B4FF" />
          <stop offset="100%" stopColor="#00E5CC" />
        </linearGradient>
        <linearGradient id="sf-fill-grad" x1="100" y1="20" x2="100" y2="180" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#00B4FF" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#00E5CC" stopOpacity="0.06" />
        </linearGradient>
        <filter id="sf-glow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="6" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Shield background */}
      <path
        d="M100 18 L168 46 L168 102 C168 140 138 168 100 182 C62 168 32 140 32 102 L32 46 Z"
        fill="url(#sf-fill-grad)"
        stroke="url(#sf-shield-grad)"
        strokeWidth="2"
        strokeLinejoin="round"
      />

      {/* Glow halo */}
      <path
        d="M100 18 L168 46 L168 102 C168 140 138 168 100 182 C62 168 32 140 32 102 L32 46 Z"
        fill="none"
        stroke="url(#sf-shield-grad)"
        strokeWidth="1"
        strokeLinejoin="round"
        opacity="0.35"
        filter="url(#sf-glow)"
      />

      {/* Inner ring */}
      <path
        d="M100 32 L156 56 L156 102 C156 133 130 157 100 169 C70 157 44 133 44 102 L44 56 Z"
        fill="none"
        stroke="url(#sf-shield-grad)"
        strokeWidth="1"
        strokeLinejoin="round"
        opacity="0.2"
      />

      {/* S letterform */}
      <text
        x="100"
        y="122"
        textAnchor="middle"
        fontFamily="'Syne', 'Arial Black', sans-serif"
        fontWeight="800"
        fontSize="76"
        fill="url(#sf-shield-grad)"
        filter="url(#sf-glow)"
      >
        S
      </text>

      {/* Scan line accents */}
      <line x1="68" y1="152" x2="132" y2="152" stroke="url(#sf-shield-grad)" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
      <line x1="82" y1="160" x2="118" y2="160" stroke="url(#sf-shield-grad)" strokeWidth="1" strokeLinecap="round" opacity="0.25" />
    </svg>
  );
}
