/** @type {import('tailwindcss').Config} */
export default {

  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],

  theme: {
    extend: {
      colors: {
        // Primary dark backgrounds — Deep midnight tones
        surface: {
          DEFAULT: '#0a0f1e',
          100: '#111827',
          200: '#1e293b',
          300: '#334155',
        },
        // Accent color — Amber/Orange for CTAs and highlights
        accent: {
          DEFAULT: '#f59e0b',
          light: '#fbbf24',
          dark: '#d97706',
          glow: 'rgba(245, 158, 11, 0.15)',
        },
        // Secondary accent — Indigo for secondary actions
        indigo: {
          DEFAULT: '#6366f1',
          light: '#818cf8',
          dark: '#4f46e5',
          glow: 'rgba(99, 102, 241, 0.15)',
        },
      },

      // CUSTOM FONTS — Professional typography
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Outfit', 'system-ui', 'sans-serif'],
      },

      // CUSTOM ANIMATIONS — Micro-interactions that make the app feel alive
      keyframes: {
        // fadeIn: Element fades from invisible to visible
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        // slideUp: Element slides up from below
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        // slideIn: Element slides in from the right (for chat panel)
        slideIn: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        // pulse-glow: Subtle pulsing glow effect for buttons
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(245, 158, 11, 0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(245, 158, 11, 0.6)' },
        },
        // float: Gentle floating motion for hero illustrations
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-15px)' },
        },
      },

      // Animation classes — use these in JSX like className="animate-fadeIn"
      animation: {
        fadeIn: 'fadeIn 0.6s ease-out forwards',
        slideUp: 'slideUp 0.8s ease-out forwards',
        slideIn: 'slideIn 0.3s ease-out forwards',
        'pulse-glow': 'pulse-glow 3s ease-in-out infinite',
        float: 'float 6s ease-in-out infinite',
      },

      // CUSTOM BACKDROP BLUR — For glassmorphism effects
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
};
