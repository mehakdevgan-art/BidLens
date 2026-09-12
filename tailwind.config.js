/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        maroon: {
          50: '#FDF6F5',
          100: '#FBEBE8',
          200: '#F7D6CF',
          300: '#EFB0A4',
          400: '#E2816E',
          500: '#B3432E', // Primary warm maroon accent
          600: '#9E3824',
          700: '#842D1C',
          800: '#6C2618',
          900: '#592217',
          950: '#300E0A',
        },
        cream: {
          50: '#FAF8F5',  // App background
          100: '#F3EFE9', // Sidebar & table headers background
          200: '#EAE4DC', // Cards hover background
          300: '#DCD5CB',
          400: '#B8AEA2',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
      },
      borderRadius: {
        xl: '0.75rem',
        '2xl': '1rem',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
