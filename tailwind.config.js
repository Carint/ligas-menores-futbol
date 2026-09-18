/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx,html}",
  ],
  theme: {
    extend: {
      colors: {
        'saddle-brown': {
          50: "#fcf1e9",
          100: "#f8e3d3",
          200: "#f1c7a7",
          300: "#eaab7b",
          400: "#e38f4f",
          500: "#dd7322",
          600: "#b05c1c",
          700: "#844515",
          800: "#582e0e",
          900: "#2c1707",
          950: "#1f1005",
        },
        stadium: {
          bg: '#faf7f4',
          card: '#ffffff',
          elevated: '#f7efe9',
          border: '#eedfd5',
        },
        trophy: {
          gold: '#e38f4f',
          silver: '#94a3b8',
          bronze: '#844515',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'soccer-card': '0 4px 14px -2px rgba(44, 23, 7, 0.05), 0 2px 6px -2px rgba(44, 23, 7, 0.03)',
        'glow-saddle': '0 4px 14px -2px rgba(176, 92, 28, 0.35)',
      }
    },
  },
  plugins: [],
};
