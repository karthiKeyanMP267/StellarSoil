/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Professional Beige & Earth Tones
        beige: {
          50: '#fefdfb',
          100: '#fef9f0',
          200: '#fcf1e0',
          300: '#f9e6c8',
          400: '#f5d7a5',
          500: '#efc373',  // Primary beige
          600: '#d4a958',
          700: '#b08d46',
          800: '#8f7138',
          900: '#745d2f',
        },
        cream: {
          50: '#fffef9',
          100: '#fffcf0',
          200: '#fef7de',
          300: '#fdefc4',
          400: '#fbe49f',
          500: '#f7d572',  // Warm cream
          600: '#e6c045',
          700: '#c9a338',
          800: '#a4852f',
          900: '#856c29',
        },
        sage: {
          50: '#f6f8f6',
          100: '#e8f0e8',
          200: '#d1e0d1',
          300: '#acc9ac',
          400: '#7da87d',
          500: '#5a8a5a',  // Sage green
          600: '#4a734a',
          700: '#3e5e3e',
          800: '#344d34',
          900: '#2b3f2b',
        },
        terracotta: {
          50: '#fdf6f4',
          100: '#fbeae6',
          200: '#f6d7d0',
          300: '#efb8a9',
          400: '#e59078',
          500: '#d86d4f',  // Terracotta
          600: '#c4542f',
          700: '#a44325',
          800: '#883a23',
          900: '#713424',
        },
        sand: {
          50: '#fefcfa',
          100: '#fdf7f0',
          200: '#faede0',
          300: '#f5dcc6',
          400: '#edc49f',
          500: '#e1a574',  // Sand
          600: '#d18951',
          700: '#af6d3b',
          800: '#8f5832',
          900: '#75492b',
        },
        earth: {
          50: '#f9f7f4',
          100: '#f0ebe3',
          200: '#e0d5c7',
          300: '#ccb8a3',
          400: '#b39478',
          500: '#9d7955',  // Earth brown
          600: '#856147',
          700: '#6f4e3d',
          800: '#5d4136',
          900: '#4f3730',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Montserrat', 'Inter', 'system-ui', 'sans-serif'],
        serif: ['Playfair Display', 'Georgia', 'serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-in-out',
        'fade-in-up': 'fadeInUp 0.8s ease-out',
        'fade-in-down': 'fadeInDown 0.8s ease-out',
        'slide-in-left': 'slideInLeft 0.8s ease-out',
        'slide-in-right': 'slideInRight 0.8s ease-out',
        'scale-in': 'scaleIn 0.5s ease-out',
        'bounce-gentle': 'bounceGentle 2s infinite',
        'float': 'float 3s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'shimmer': 'shimmer 2s linear infinite',
        'wiggle': 'wiggle 1s ease-in-out infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 3s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInDown: {
          '0%': { opacity: '0', transform: 'translateY(-20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInLeft: {
          '0%': { opacity: '0', transform: 'translateX(-30px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(30px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        bounceGentle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 20px rgba(239, 195, 115, 0.3)' },
          '100%': { boxShadow: '0 0 30px rgba(239, 195, 115, 0.6)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
      },
      backdropBlur: {
        'xs': '2px',
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        'medium': '0 4px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 20px -5px rgba(0, 0, 0, 0.04)',
        'strong': '0 10px 40px -10px rgba(0, 0, 0, 0.15), 0 20px 25px -5px rgba(0, 0, 0, 0.1)',
        'glow-beige': '0 0 30px rgba(239, 195, 115, 0.3)',
        'glow-sage': '0 0 30px rgba(90, 138, 90, 0.3)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'beige-gradient': 'linear-gradient(135deg, #fef9f0 0%, #f9e6c8 100%)',
        'earth-gradient': 'linear-gradient(135deg, #f0ebe3 0%, #e0d5c7 50%, #ccb8a3 100%)',
        'sage-gradient': 'linear-gradient(135deg, #f6f8f6 0%, #e8f0e8 100%)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio'),
  ],
}
