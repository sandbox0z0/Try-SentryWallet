/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        primary: '#38BDF8',
        accent: '#1E293B',
        background: '#F9FAFB',
      },
      fontFamily: {
        'inter': ['Inter', 'sans-serif'],
        'dm-sans': ['DM Sans', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '1rem',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
      }
    },
  },
  plugins: [],
};