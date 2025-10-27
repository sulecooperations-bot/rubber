/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Sri Lankan Rubber Plantation Theme
        primary: {
          50: '#f0f9f0',
          100: '#dcf2dc',
          200: '#bce5bc',
          300: '#8dd18d',
          400: '#5bb85b',
          500: '#3C7A44', // Rubber Green
          600: '#2f5f35',
          700: '#264d2a',
          800: '#213e24',
          900: '#1e3421',
        },
        secondary: {
          50: '#fefdf8',
          100: '#fdf9e8',
          200: '#fbf2d1',
          300: '#f7e6b1', // Latex Beige
          400: '#f2d680',
          500: '#ecc94b',
          600: '#d69e2e',
          700: '#b7791f',
          800: '#975a16',
          900: '#744210',
        },
        accent: {
          50: '#f7f3f0',
          100: '#ede4dd',
          200: '#d9c7ba',
          300: '#c2a590',
          400: '#8B5E3C', // Tree Bark Brown
          500: '#6b4c2f',
          600: '#5a3f28',
          700: '#4a3321',
          800: '#3d2a1c',
          900: '#322218',
        },
        neutral: {
          50: '#f8f8f8',
          100: '#f0f0f0',
          200: '#e4e4e4',
          300: '#d1d1d1',
          400: '#b4b4b4',
          500: '#9a9a9a',
          600: '#818181',
          700: '#6a6a6a',
          800: '#5a5a5a',
          900: '#1c1c1c',
        },
        // Dark mode colors
        dark: {
          50: '#f8f9fa',
          100: '#e9ecef',
          200: '#dee2e6',
          300: '#ced4da',
          400: '#adb5bd',
          500: '#6c757d',
          600: '#495057',
          700: '#343a40',
          800: '#212529',
          900: '#121212',
        }
      },
      fontFamily: {
        'heading': ['Poppins', 'sans-serif'],
        'body': ['Inter', 'sans-serif'],
      },
      animation: {
        'rubber-leaf': 'rubber-leaf 2s ease-in-out infinite',
        'fade-in': 'fade-in 0.5s ease-in-out',
        'slide-up': 'slide-up 0.3s ease-out',
        'bounce-gentle': 'bounce-gentle 2s infinite',
      },
      keyframes: {
        'rubber-leaf': {
          '0%, 100%': { transform: 'rotate(-5deg)' },
          '50%': { transform: 'rotate(5deg)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'slide-up': {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'bounce-gentle': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
      },
      backgroundImage: {
        'rubber-pattern': "url('/images/rubber-plantation-bg.jpg')",
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
}
