import React, { useEffect, useRef, useCallback } from 'react';

const FocusKiller = ({ children, as: Component = 'div', ...props }) => {
  const ref = useRef(null);

  // Enhanced focus removal function
  const removeFocus = useCallback((el) => {
    if (!el || el.nodeType !== Node.ELEMENT_NODE) return;

    try {
      // Set tabindex to prevent tab navigation
      el.setAttribute('tabindex', '-1');
      
      // Remove all focus-related attributes
      const focusAttributes = ['autofocus', 'data-focus', 'aria-activedescendant'];
      focusAttributes.forEach(attr => el.removeAttribute(attr));
      
      // Override styles with maximum specificity
      const focusStyles = {
        outline: 'none',
        outlineWidth: '0',
        outlineStyle: 'none', 
        outlineColor: 'transparent',
        outlineOffset: '0',
        boxShadow: 'none',
        border: 'none',
        borderWidth: '0',
        borderStyle: 'none',
        borderColor: 'transparent',
        webkitTapHighlightColor: 'transparent',
        webkitFocusRingColor: 'transparent',
        webkitAppearance: 'none',
        mozAppearance: 'none',
        appearance: 'none',
        userSelect: 'none',
        webkitUserSelect: 'none',
        mozUserSelect: 'none',
        msUserSelect: 'none'
      };

      Object.assign(el.style, focusStyles);
      
      // Override focus method completely
      if (typeof el.focus === 'function') {
        el.focus = () => {
          if (el.blur && typeof el.blur === 'function') {
            el.blur();
          }
        };
      }

      // Add comprehensive event prevention
      const preventEvent = (e) => {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        if (e.target && typeof e.target.blur === 'function') {
          try {
            e.target.blur();
          } catch (err) {
            // Ignore blur errors
          }
        }
        return false;
      };

      const preventKeyEvent = (e) => {
        if (e.key === 'Tab' || e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          e.stopPropagation();
          e.stopImmediatePropagation();
          return false;
        }
      };

      // Remove existing event listeners first
      el.removeEventListener('focus', preventEvent);
      el.removeEventListener('focusin', preventEvent);
      el.removeEventListener('focusout', preventEvent);
      el.removeEventListener('keydown', preventKeyEvent);

      // Add comprehensive event listeners
      const events = ['focus', 'focusin', 'focusout'];
      events.forEach(event => {
        el.addEventListener(event, preventEvent, { 
          capture: true, 
          passive: false,
          once: false
        });
      });

      el.addEventListener('keydown', preventKeyEvent, { 
        capture: true, 
        passive: false,
        once: false
      });

      // Apply to all children recursively
      if (el.children && el.children.length > 0) {
        Array.from(el.children).forEach(removeFocus);
      }

      // Handle shadow DOM if it exists
      if (el.shadowRoot) {
        Array.from(el.shadowRoot.children).forEach(removeFocus);
      }

    } catch (error) {
      // Silently ignore any errors during focus removal
      console.debug('Focus removal error (safely ignored):', error);
    }
  }, []);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Initial application
    removeFocus(element);

    // Enhanced mutation observer
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        // Handle added nodes
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              removeFocus(node);
            }
          });
        }

        // Handle attribute changes that might restore focus
        if (mutation.type === 'attributes' && 
            ['tabindex', 'style', 'class', 'autofocus'].includes(mutation.attributeName)) {
          removeFocus(mutation.target);
        }
      });
    });

    observer.observe(element, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['tabindex', 'style', 'class', 'autofocus', 'data-focus'],
      attributeOldValue: true
    });

    // Global event interceptors
    const globalPreventFocus = (e) => {
      if (element.contains(e.target)) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        if (e.target && typeof e.target.blur === 'function') {
          try {
            e.target.blur();
          } catch (err) {
            // Ignore
          }
        }
        return false;
      }
    };

    const globalPreventKey = (e) => {
      if (element.contains(e.target) && 
          ['Tab', 'Enter', ' ', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        return false;
      }
    };

    // Add global listeners with high priority
    document.addEventListener('focus', globalPreventFocus, { capture: true, passive: false });
    document.addEventListener('focusin', globalPreventFocus, { capture: true, passive: false });
    document.addEventListener('focusout', globalPreventFocus, { capture: true, passive: false });
    document.addEventListener('keydown', globalPreventKey, { capture: true, passive: false });

    // Periodic reinforcement to prevent any focus restoration
    const reinforcementInterval = setInterval(() => {
      removeFocus(element);
    }, 50);

    // Cleanup
    return () => {
      observer.disconnect();
      document.removeEventListener('focus', globalPreventFocus, { capture: true });
      document.removeEventListener('focusin', globalPreventFocus, { capture: true });
      document.removeEventListener('focusout', globalPreventFocus, { capture: true });
      document.removeEventListener('keydown', globalPreventKey, { capture: true });
      clearInterval(reinforcementInterval);
    };
  }, [removeFocus]);

  return (
    <Component
      ref={ref}
      {...props}
      style={{
        outline: 'none !important',
        outlineWidth: '0 !important',
        outlineStyle: 'none !important',
        outlineColor: 'transparent !important',
        boxShadow: 'none !important',
        border: 'none !important',
        webkitTapHighlightColor: 'transparent !important',
        webkitFocusRingColor: 'transparent !important',
        webkitAppearance: 'none !important',
        mozAppearance: 'none !important',
        appearance: 'none !important',
        userSelect: 'none',
        webkitUserSelect: 'none',
        mozUserSelect: 'none',
        msUserSelect: 'none',
        ...props.style
      }}
      tabIndex="-1"
      onFocus={(e) => {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        if (e.target && typeof e.target.blur === 'function') {
          try {
            e.target.blur();
          } catch (err) {
            // Ignore
          }
        }
        return false;
      }}
      onFocusCapture={(e) => {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        return false;
      }}
      onMouseDown={(e) => {
        // Allow click but prevent any focus side effects
        e.preventDefault();
      }}
      onKeyDown={(e) => {
        if (['Tab', 'Enter', ' '].includes(e.key)) {
          e.preventDefault();
          e.stopPropagation();
          e.stopImmediatePropagation();
          return false;
        }
      }}
      onKeyDownCapture={(e) => {
        if (['Tab', 'Enter', ' '].includes(e.key)) {
          e.preventDefault();
          e.stopPropagation();
          e.stopImmediatePropagation();
          return false;
        }
      }}
    >
      {children}
    </Component>
  );
};

export default FocusKiller;
