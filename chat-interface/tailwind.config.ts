/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      animation: {
        bounce: 'bounce 1s infinite',
      },
    },
  },
  plugins: [
    require('tailwind-scrollbar'),
  ],
} 