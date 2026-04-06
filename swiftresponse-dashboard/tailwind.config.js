/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Sora', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
        space: ['Space Mono', 'monospace'],
      },
      colors: {
        bg: {
          base: '#060b14',
          panel: '#0a1120',
          card: 'rgba(255,255,255,0.04)',
        },
        border: {
          DEFAULT: 'rgba(255,255,255,0.08)',
          accent: 'rgba(255,255,255,0.15)',
        },
      },
      animation: {
        pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        glow: 'glow 2s ease-in-out infinite',
        bounce: 'bounce 1s infinite',
      },
    },
  },
  plugins: [],
}
