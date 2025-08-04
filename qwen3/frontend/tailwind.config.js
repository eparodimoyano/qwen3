/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#2F855A', // Verde corporativo (sin azul)
        dark: '#2D3748',
        light: '#F7FAFC',
      },
    },
  },
  plugins: [],
}