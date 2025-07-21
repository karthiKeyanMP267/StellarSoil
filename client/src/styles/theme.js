// Theme configuration for StellarSoil
const theme = {
  colors: {
    primary: {
      50: '#f0fdf4',
      100: '#dcfce7',
      200: '#bbf7d0',
      300: '#86efac',
      400: '#4ade80',
      500: '#22c55e',
      600: '#16a34a',
      700: '#15803d',
      800: '#166534',
      900: '#14532d',
    },
    secondary: {
      50: '#fffbeb',
      100: '#fef3c7',
      200: '#fde68a',
      300: '#fcd34d',
      400: '#fbbf24',
      500: '#f59e0b',
      600: '#d97706',
      700: '#b45309',
      800: '#92400e',
      900: '#78350f',
    },
    accent: {
      50: '#ecfdf5',
      100: '#d1fae5',
      200: '#a7f3d0',
      300: '#6ee7b7',
      400: '#34d399',
      500: '#10b981',
      600: '#059669',
      700: '#047857',
      800: '#065f46',
      900: '#064e3b',
    }
  },
  gradients: {
    primary: 'from-green-600 to-emerald-600',
    hover: 'from-green-700 to-emerald-700',
    background: 'from-green-50 via-amber-50 to-emerald-50',
  },
  shadows: {
    button: 'shadow-lg shadow-green-500/25',
    buttonHover: 'shadow-lg shadow-green-500/35',
    card: 'shadow-md',
    cardHover: 'shadow-lg',
  },
  borderRadius: {
    button: 'rounded-full',
    card: 'rounded-lg',
    input: 'rounded-lg',
  },
  animation: {
    transition: 'transition-all duration-300',
  }
};

// Common component styles
const components = {
  button: {
    primary: `bg-gradient-to-r ${theme.gradients.primary} text-white ${theme.borderRadius.button} ${theme.shadows.button} hover:${theme.gradients.hover} hover:${theme.shadows.buttonHover} ${theme.animation.transition}`,
    secondary: `border-2 border-green-500 text-green-600 bg-white ${theme.borderRadius.button} hover:bg-green-50 hover:border-green-600 hover:text-green-700 ${theme.animation.transition}`,
    outline: `border-2 border-green-500 text-green-600 ${theme.borderRadius.button} hover:bg-green-50 ${theme.animation.transition}`,
  },
  input: {
    base: `w-full px-4 py-2 border ${theme.borderRadius.input} focus:ring-2 focus:ring-green-500 focus:border-transparent ${theme.animation.transition}`,
  },
  card: {
    base: `bg-white ${theme.borderRadius.card} ${theme.shadows.card} hover:${theme.shadows.cardHover} ${theme.animation.transition}`,
  },
  heading: {
    gradient: 'bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-amber-600',
  }
};

export { theme, components };
