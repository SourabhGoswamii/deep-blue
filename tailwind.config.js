/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        chatbg: 'var(--color-chatbg)',
        chatSecondary: 'var(--color-chatSecondary)',
        chatBorder: 'var(--color-chatBorder)',
        chatInput: 'var(--color-chatInput)',
      },
    },
  },
  plugins: [],
}