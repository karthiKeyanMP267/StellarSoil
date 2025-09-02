// Professional Beige Theme Configuration
export const theme = {
  colors: {
    // Primary beige palette
    beige: {
      50: '#fefdfb',
      100: '#fef9f0',
      200: '#fcf1e0',
      300: '#f9e6c8',
      400: '#f5d7a5',
      500: '#efc373',  // Primary
      600: '#d4a958',
      700: '#b08d46',
      800: '#8f7138',
      900: '#745d2f',
    },
    // Complementary colors
    sage: {
      50: '#f6f8f6',
      100: '#e8f0e8',
      200: '#d1e0d1',
      300: '#acc9ac',
      400: '#7da87d',
      500: '#5a8a5a',  // Accent
      600: '#4a734a',
      700: '#3e5e3e',
      800: '#344d34',
      900: '#2b3f2b',
    },
    cream: {
      50: '#fffef9',
      100: '#fffcf0',
      200: '#fef7de',
      300: '#fdefc4',
      400: '#fbe49f',
      500: '#f7d572',  // Secondary
      600: '#e6c045',
      700: '#c9a338',
      800: '#a4852f',
      900: '#856c29',
    },
    earth: {
      50: '#f9f7f4',
      100: '#f0ebe3',
      200: '#e0d5c7',
      300: '#ccb8a3',
      400: '#b39478',
      500: '#9d7955',  // Tertiary
      600: '#856147',
      700: '#6f4e3d',
      800: '#5d4136',
      900: '#4f3730',
    }
  },
  gradients: {
    primary: 'from-beige-400 via-beige-500 to-cream-500',
    secondary: 'from-sage-400 via-sage-500 to-sage-600',
    background: 'from-beige-50 via-cream-50 to-sage-50',
    card: 'from-white via-beige-50 to-cream-50',
    button: 'from-beige-500 to-cream-500',
    buttonHover: 'from-beige-600 to-cream-600',
    hero: 'from-beige-100 via-cream-100 to-sage-100',
    overlay: 'from-beige-900/80 via-earth-900/60 to-sage-900/80',
  },
  shadows: {
    soft: 'shadow-[0_2px_15px_-3px_rgba(239,195,115,0.1),0_10px_20px_-2px_rgba(239,195,115,0.04)]',
    medium: 'shadow-[0_4px_25px_-5px_rgba(239,195,115,0.15),0_10px_20px_-5px_rgba(239,195,115,0.08)]',
    strong: 'shadow-[0_10px_40px_-10px_rgba(239,195,115,0.2),0_20px_25px_-5px_rgba(239,195,115,0.1)]',
    glow: 'shadow-[0_0_30px_rgba(239,195,115,0.3)]',
    inset: 'inset_0_2px_4px_rgba(239,195,115,0.1)',
  },
  borderRadius: {
    button: 'rounded-xl',
    card: 'rounded-2xl',
    input: 'rounded-xl',
    modal: 'rounded-3xl',
  },
  animation: {
    transition: 'transition-all duration-300 ease-in-out',
    transitionFast: 'transition-all duration-200 ease-in-out',
    transitionSlow: 'transition-all duration-500 ease-in-out',
    bounce: 'animate-bounce-gentle',
    float: 'animate-float',
    glow: 'animate-glow',
    fadeIn: 'animate-fade-in',
    slideIn: 'animate-slide-in-left',
  },
  spacing: {
    section: 'py-20 px-4 sm:px-6 lg:px-8',
    container: 'max-w-7xl mx-auto',
    cardPadding: 'p-6 sm:p-8',
  }
};

// Component style configurations
export const components = {
  button: {
    primary: `
      bg-gradient-to-r ${theme.gradients.button} 
      text-white font-semibold 
      ${theme.borderRadius.button} 
      ${theme.shadows.medium} 
      hover:${theme.gradients.buttonHover} 
      hover:${theme.shadows.strong} 
      ${theme.animation.transition}
      transform hover:scale-105 active:scale-95
    `,
    secondary: `
      border-2 border-beige-500 text-beige-700 bg-white 
      ${theme.borderRadius.button} 
      hover:bg-beige-50 hover:border-beige-600 hover:text-beige-800 
      ${theme.animation.transition}
      ${theme.shadows.soft}
      transform hover:scale-105 active:scale-95
    `,
    ghost: `
      text-beige-700 bg-transparent 
      ${theme.borderRadius.button} 
      hover:bg-beige-100 hover:text-beige-800 
      ${theme.animation.transition}
    `,
    danger: `
      bg-gradient-to-r from-red-500 to-red-600 
      text-white font-semibold 
      ${theme.borderRadius.button} 
      ${theme.shadows.medium} 
      hover:from-red-600 hover:to-red-700 
      ${theme.animation.transition}
      transform hover:scale-105 active:scale-95
    `,
  },
  input: {
    base: `
      w-full px-4 py-3 border-2 border-beige-300 
      ${theme.borderRadius.input} 
      bg-white placeholder-beige-400 text-gray-900
      ${theme.animation.transition}
      ${theme.shadows.soft}
    `,
    error: `
      border-red-300
    `,
  },
  card: {
    base: `
      bg-gradient-to-br ${theme.gradients.card} 
      ${theme.borderRadius.card} 
      ${theme.shadows.medium} 
      hover:${theme.shadows.strong} 
      ${theme.animation.transition}
      border border-beige-200/50
      backdrop-blur-sm
    `,
    elevated: `
      bg-white 
      ${theme.borderRadius.card} 
      ${theme.shadows.strong} 
      border border-beige-300/50
      transform hover:scale-102 
      ${theme.animation.transition}
    `,
    glass: `
      bg-white/80 backdrop-blur-lg 
      ${theme.borderRadius.card} 
      ${theme.shadows.medium} 
      border border-white/20
      ${theme.animation.transition}
    `,
  },
  heading: {
    hero: `
      text-5xl md:text-7xl font-black 
      text-transparent bg-clip-text 
      bg-gradient-to-r ${theme.gradients.primary}
      tracking-tight leading-tight
    `,
    section: `
      text-3xl md:text-4xl font-bold 
      text-beige-800 
      tracking-wide
    `,
    card: `
      text-xl md:text-2xl font-semibold 
      text-beige-700
    `,
  },
  text: {
    body: 'text-gray-700 leading-relaxed',
    muted: 'text-beige-600',
    emphasis: 'text-beige-800 font-medium',
  },
  layout: {
    section: `${theme.spacing.section} ${theme.spacing.container}`,
    hero: `
      min-h-screen flex items-center justify-center 
      bg-gradient-to-br ${theme.gradients.hero}
      relative overflow-hidden
    `,
    container: theme.spacing.container,
  },
  effects: {
    hover: 'transform hover:scale-105 hover:rotate-1',
    float: 'animate-float',
    glow: 'hover:shadow-glow-beige',
    shimmer: `
      relative overflow-hidden
      before:absolute before:inset-0 
      before:bg-gradient-to-r before:from-transparent 
      before:via-white/20 before:to-transparent 
      before:translate-x-[-100%] 
      hover:before:translate-x-[100%] 
      before:transition-transform before:duration-700
    `,
  }
};

// Animation variants for Framer Motion
export const animations = {
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.6 }
  },
  slideUp: {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, ease: "easeOut" }
  },
  slideInLeft: {
    initial: { opacity: 0, x: -30 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.8, ease: "easeOut" }
  },
  slideInRight: {
    initial: { opacity: 0, x: 30 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.8, ease: "easeOut" }
  },
  scaleIn: {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.5, ease: "easeOut" }
  },
  stagger: {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  },
  float: {
    animate: {
      y: [-5, 5, -5],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  },
  glow: {
    animate: {
      boxShadow: [
        "0 0 20px rgba(239, 195, 115, 0.3)",
        "0 0 30px rgba(239, 195, 115, 0.6)",
        "0 0 20px rgba(239, 195, 115, 0.3)"
      ],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  }
};

export { theme as default };
