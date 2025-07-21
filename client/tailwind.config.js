/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {    extend: {      colors: {
        primary: {
          50: '#eef8ff',
          100: '#d9efff',
          200: '#bce3ff',
          300: '#8ed4ff',
          400: '#56baff',
          500: '#2596ff',  // Modern medical blue
          600: '#0073e6',
          700: '#0059b3',
          800: '#004a94',
          900: '#003e7a',
        },
        secondary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#b9e5fe',
          300: '#7cd4fd',
          400: '#36bffa',
          500: '#0da2e7',  // Bright cyan
          600: '#0284c7',
          700: '#036ba1',
          800: '#075985',
          900: '#0c4a6e',
        },
        accent: {
          50: '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#8b5cf6',  // Soft purple
          600: '#7c3aed',
          700: '#6d28d9',
          800: '#5b21b6',
          900: '#4c1d95',
        },
        teal: {
          50: '#f0fdfa',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#14b8a6',  // Medical teal
          600: '#0d9488',
          700: '#0f766e',
          800: '#115e59',
          900: '#134e4a',
        },
        accent: {
          50: '#faf5ff',
          100: '#f3e8ff',
          200: '#e9d5ff',
          300: '#d8b4fe',
          400: '#c084fc',
          500: '#a855f7',  // Calming purple
          600: '#9333ea',
          700: '#7e22ce',
          800: '#6b21a8',
          900: '#581c87',
        },
        warm: {
          50: '#fefce8',
          100: '#fef9c3',
          200: '#fef08a',
          300: '#fde047',
          400: '#facc15',
          500: '#eab308',  // Warm gold
          600: '#ca8a04',
          700: '#a16207',
          800: '#854d0e',
          900: '#713f12',
        },
        secondary: {
          50: '#f5f7fa',
          100: '#ebeef3',
          200: '#d7dce5',
          300: '#b3bcd0',
          400: '#8996b8',
          500: '#2c4875',  // Medical navy
          600: '#1e325c',
          700: '#162543',
          800: '#0f1a2e',
          900: '#080d19',
        },
        accent: {
          50: '#f3f8f9',
          100: '#daf5f3',
          200: '#b0ebe7',
          300: '#7ed3d1',
          400: '#20b2aa',  // Medical teal
          500: '#17a2a2',
          600: '#0f8080',
          700: '#0a6666',
          800: '#064d4d',
          900: '#033333',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Montserrat', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
