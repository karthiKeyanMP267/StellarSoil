import { useEffect } from 'react';

/**
 * Global hook to prevent all focus behavior across the entire application
 * This provides an additional layer of focus prevention beyond CSS and components
 */
export const useFocusPrevention = (enabled = true) => {
  useEffect(() => {
    if (!enabled) return;

    // Ultra-aggressive global focus prevention
    const globalFocusKiller = (e) => {
      // Prevent all focus events globally
      if (e.type === 'focus' || e.type === 'focusin' || e.type === 'focusout') {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        
        // Force blur on any focused element
        if (e.target && typeof e.target.blur === 'function') {
          try {
            e.target.blur();
          } catch (err) {
            // Ignore blur errors
          }
        }
        
        // Remove focus from document.activeElement
        if (document.activeElement && typeof document.activeElement.blur === 'function') {
          try {
            document.activeElement.blur();
          } catch (err) {
            // Ignore blur errors
          }
        }
        
        return false;
      }
    };

    // Global keyboard navigation prevention
    const globalKeyPrevention = (e) => {
      // Prevent tab navigation and other focus-related keys
      if (['Tab', 'F6', 'F10'].includes(e.key)) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        return false;
      }
      
      // Prevent arrow key navigation in some contexts
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key) && 
          e.target.tagName === 'BUTTON') {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
    };

    // Mouse interaction normalization
    const globalMouseHandler = (e) => {
      // Prevent any focus side-effects from mouse interactions
      if (e.target && typeof e.target.blur === 'function') {
        // Delay blur to allow click to register
        setTimeout(() => {
          try {
            e.target.blur();
          } catch (err) {
            // Ignore
          }
        }, 0);
      }
    };

    // Style enforcement through DOM manipulation
    const styleEnforcer = () => {
      try {
        // Find all potentially focusable elements
        const focusableSelectors = [
          'a[href]',
          'button',
          'input',
          'textarea', 
          'select',
          '[tabindex]',
          '[contenteditable]',
          'iframe',
          'object',
          'embed',
          'area[href]',
          'audio[controls]',
          'video[controls]'
        ].join(',');

        const elements = document.querySelectorAll(focusableSelectors);
        
        elements.forEach(el => {
          // Force styles that prevent focus visualization
          el.style.outline = 'none';
          el.style.outlineWidth = '0';
          el.style.outlineStyle = 'none';
          el.style.outlineColor = 'transparent';
          el.style.boxShadow = 'none';
          el.style.webkitTapHighlightColor = 'transparent';
          el.style.webkitFocusRingColor = 'transparent';
          
          // Set tabindex to -1 for non-essential elements
          if (!el.closest('input, textarea, select')) {
            el.setAttribute('tabindex', '-1');
          }
        });
      } catch (err) {
        // Ignore any DOM errors
      }
    };

    // Initial style enforcement
    styleEnforcer();

    // Add global event listeners with highest priority
    const eventOptions = { capture: true, passive: false };
    
    document.addEventListener('focus', globalFocusKiller, eventOptions);
    document.addEventListener('focusin', globalFocusKiller, eventOptions);
    document.addEventListener('focusout', globalFocusKiller, eventOptions);
    document.addEventListener('keydown', globalKeyPrevention, eventOptions);
    document.addEventListener('keyup', globalKeyPrevention, eventOptions);
    document.addEventListener('click', globalMouseHandler, eventOptions);
    document.addEventListener('mousedown', globalMouseHandler, eventOptions);

    // Periodic style enforcement to override any dynamic changes
    const styleInterval = setInterval(styleEnforcer, 100);

    // Cleanup
    return () => {
      document.removeEventListener('focus', globalFocusKiller, eventOptions);
      document.removeEventListener('focusin', globalFocusKiller, eventOptions);
      document.removeEventListener('focusout', globalFocusKiller, eventOptions);
      document.removeEventListener('keydown', globalKeyPrevention, eventOptions);
      document.removeEventListener('keyup', globalKeyPrevention, eventOptions);
      document.removeEventListener('click', globalMouseHandler, eventOptions);
      document.removeEventListener('mousedown', globalMouseHandler, eventOptions);
      clearInterval(styleInterval);
    };
  }, [enabled]);
};

/**
 * Hook to remove focus from the currently active element
 */
export const useActiveElementBlur = () => {
  useEffect(() => {
    const blurActive = () => {
      if (document.activeElement && 
          typeof document.activeElement.blur === 'function' &&
          document.activeElement !== document.body) {
        try {
          document.activeElement.blur();
        } catch (err) {
          // Ignore
        }
      }
    };

    // Blur on any interaction
    document.addEventListener('click', blurActive);
    document.addEventListener('keydown', blurActive);
    
    // Periodic blur to ensure no element stays focused
    const blurInterval = setInterval(blurActive, 50);

    return () => {
      document.removeEventListener('click', blurActive);
      document.removeEventListener('keydown', blurActive);
      clearInterval(blurInterval);
    };
  }, []);
};

export default useFocusPrevention;
