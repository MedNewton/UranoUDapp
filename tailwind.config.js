/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundColor: {
        'dark': 'var(--bg-dark)',
      },
      textColor: {
        'dark': 'var(--text-dark)',
      },
      fontFamily: {
        'conthrax': ['Conthrax', 'sans-serif'],
        'poppins': ['Poppins', 'sans-serif'],
        'sans': ['Poppins', 'sans-serif'],
      },
    },
  },
  plugins: [],
} 