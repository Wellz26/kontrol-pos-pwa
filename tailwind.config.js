/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#22C55E',
        secondary: '#374151',
        accent: '#F97316', // Optional orange accent for buttons/alerts
        background: '#F9FAFB', // Light gray background
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'], // Clean Google Font
      },
      borderRadius: {
        xl: '1rem',
        '2xl': '1.5rem',
      },
      boxShadow: {
        card: '0 4px 14px 0 rgba(0,0,0,0.1)',
        button: '0 2px 8px rgba(34, 197, 94, 0.5)',
      },
      transitionTimingFunction: {
        'in-expo': 'cubic-bezier(0.95, 0.05, 0.795, 0.035)',
        'out-expo': 'cubic-bezier(0.19, 1, 0.22, 1)',
      },
    },
  },
  plugins: [],
}
