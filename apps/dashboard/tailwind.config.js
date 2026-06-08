/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "../../packages/ui/src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0051c3', // Cloudflare Blue
        secondary: '#64748b',
        background: '#f3f4f6', // cf-bg
        surface: '#ffffff',
        'cf-border': '#e5e7eb',
        'cf-text': '#1f2937',
        'cf-gray-text': '#6b7280',
        'cf-hover': '#f9fafb'
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
