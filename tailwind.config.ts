import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        guard: {
          bg: "#080B10",
          surface: "#0D1117",
          border: "#1C2333",
          cyan: "#00E5FF",
          text: "#C9D1D9",
          muted: "#6E7681",
          low: "#00FF87",
          medium: "#FFB300",
          high: "#FF6B35",
          critical: "#FF2D55"
        }
      },
      fontFamily: {
        mono: ["JetBrains Mono", "monospace"],
        sans: ["DM Sans", "system-ui", "sans-serif"]
      },
      boxShadow: {
        cyan: "0 0 30px rgba(0, 229, 255, 0.22)",
        critical: "0 0 38px rgba(255, 45, 85, 0.28)"
      },
      keyframes: {
        scanline: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100vh)" }
        },
        gaugeDraw: {
          "0%": { strokeDashoffset: "314" }
        },
        pulseGlow: {
          "0%, 100%": { opacity: "0.55" },
          "50%": { opacity: "1" }
        }
      },
      animation: {
        scanline: "scanline 7s linear infinite",
        pulseGlow: "pulseGlow 1.8s ease-in-out infinite"
      }
    }
  },
  plugins: []
};

export default config;
