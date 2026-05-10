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
        sf: {
          void: "#020407",
          deep: "#050C17",
          surface: "#080F1E",
          raised: "#0A1628",
          primary: "#00B4FF",
          security: "#00E5CC",
          secondary: "#00E5CC",
          x402: "#A855F7",
          ok: "#00E676",
          warn: "#FFD600",
          danger: "#FF4A4A",
          critical: "#FF1744",
          t1: "#EBF4FF",
          t2: "#6B9AB8",
          t3: "#2A4158"
        },
        guard: {
          bg: "#020407",
          surface: "#080F1E",
          border: "rgba(0, 180, 255, 0.08)",
          cyan: "#00E5CC",
          text: "#EBF4FF",
          muted: "#6B9AB8",
          low: "#00E676",
          medium: "#FFD600",
          high: "#FF4A4A",
          critical: "#FF1744"
        }
      },
      fontFamily: {
        display: ["Syne", "sans-serif"],
        mono: ["IBM Plex Mono", "monospace"],
        sans: ["Outfit", "sans-serif"]
      },
      boxShadow: {}
    }
  },
  plugins: []
};

export default config;
