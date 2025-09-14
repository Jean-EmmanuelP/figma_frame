/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        inter: ['var(--font-inter)', 'sans-serif'],
      },
      colors: {
        primary: {
          bg: '#0A0A0A',
          card: '#111111',
          border: '#1F1F1F',
          'border-hover': '#333333',
        },
        text: {
          primary: '#EAEAEA',
          secondary: '#A3A3A3',
          muted: '#666666',
        },
        accent: {
          blue: '#3B82F6',
          green: '#22C55E',
        }
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'fade-out': 'fadeOut 0.3s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
      }
    },
  },
  plugins: [],
}