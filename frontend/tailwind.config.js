/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ivory: {
          50: '#FDFBF7',
          100: '#FAF6ED',
          200: '#F3ECE0',
          300: '#E6D9C5',
          400: '#D5C1A3',
          500: '#BFA47F',
        },
        teal: {
          50: '#F0F9FA',
          100: '#D6F0F2',
          200: '#B0E2E7',
          300: '#7BCCD6',
          400: '#3AAEC0',
          500: '#148F9E',
          600: '#0E7382',
          700: '#0B5C68',
          800: '#084852',
          900: '#053139',
          950: '#031E23',
        },
        royal: {
          gold: '#C59B27',
          amber: '#E5A93C',
          sand: '#EADBCA',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        serif: ['Playfair Display', 'Merriweather', 'serif'],
      },
      boxShadow: {
        'subtle': '0 2px 10px rgba(11, 92, 104, 0.04)',
        'card': '0 10px 30px -5px rgba(11, 92, 104, 0.08), 0 4px 6px -2px rgba(11, 92, 104, 0.03)',
        'elevated': '0 20px 40px -10px rgba(11, 92, 104, 0.12), 0 8px 12px -3px rgba(11, 92, 104, 0.05)',
      }
    },
  },
  plugins: [],
};
