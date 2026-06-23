/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        govBlue: {
          light: '#eff6ff', // Soft blue tint
          DEFAULT: '#2563eb', // Royal blue
          dark: '#1e3a8a', // Deep navy
        },
        govGreen: {
          light: '#ecfdf5', // Soft green tint
          DEFAULT: '#10b981', // Emerald green
          dark: '#047857', // Dark emerald
        },
        govMatte: {
          bg: '#f8fafc', // Slate-50 off-white
          darkBg: '#f8fafc',
          card: '#ffffff', // Pure white card
          darkCard: '#ffffff',
          border: '#e2e8f0', // Slate-200 border
          darkBorder: '#e2e8f0',
          text: '#1e293b', // Slate-800 dark text
          darkText: '#1e293b',
          muted: '#64748b', // Slate-500 muted text
          darkMuted: '#64748b',
        }
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'sans-serif'],
      },
      animation: {
        'shimmer': 'shimmer 1.5s infinite linear',
        'fade-in': 'fadeIn 0.3s ease-out forwards',
        'slide-up': 'slideUp 0.4s ease-out forwards',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(15px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        }
      }
    },
  },
  plugins: [],
}
