/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0A0A0F",
        surface: "#12121A",
        border: "#1E1E2E",
        primary: "#6366F1",
        secondary: "#8B5CF6",
        accent: "#06B6D4",
        success: "#10B981",
        warning: "#F59E0B",
        textPrimary: "#F1F5F9",
        textMuted: "#94A3B8"
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Plus Jakarta Sans', 'sans-serif']
      },
      animation: {
        shimmer: "shimmer 2s linear infinite",
        float: "float 6s ease-in-out infinite",
        pulseGlow: "pulseGlow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite"
      },
      keyframes: {
        shimmer: {
          from: { backgroundPosition: "200% 0" },
          to: { backgroundPosition: "-200% 0" }
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-20px)" }
        },
        pulseGlow: {
          "0%, 100%": { opacity: 1 },
          "50%": { opacity: .5 }
        }
      }
    },
  },
  plugins: [],
}
