/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
    },
    extend: {
      colors: {
        surface: {
          DEFAULT: "#0A0A0F",
          light: "#1A1A2E",
          lighter: "#252540",
        },
        accent: {
          DEFAULT: "#00F0FF",
          dim: "#00B8C8",
          glow: "rgba(0, 240, 255, 0.15)",
        },
        positive: "#4ECDC4",
        negative: "#FF6B6B",
        card: "rgba(26, 26, 46, 0.85)",
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', "monospace"],
        sans: ['"Noto Sans SC"', "-apple-system", "sans-serif"],
      },
      backdropBlur: {
        glass: "24px",
      },
      animation: {
        "fade-in-up": "fadeInUp 0.6s ease-out forwards",
        "count-up": "countUp 2s ease-out forwards",
        "slide-up": "slideUp 0.4s ease-out forwards",
        pulse: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      keyframes: {
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(40px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        pulse: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.5" },
        },
      },
    },
  },
  plugins: [],
};