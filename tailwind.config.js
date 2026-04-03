/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0d9488', // teal-600
        },
        income: {
          DEFAULT: '#22c55e', // green-500
        },
        expense: {
          DEFAULT: '#ef4444', // red-500
        },
      }
    },
  },
  plugins: [],
}
