import { useEffect, useState } from 'react';

export const useGoogleTranslate = () => {
  const [isTranslateActive, setIsTranslateActive] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      return;
    }
    const checkTranslateStatus = () => {
      // Check if the Google Translate banner is visible
      const banner = document.querySelector('.goog-te-banner-frame');
      const isVisible = banner && banner.style.display !== 'none' && banner.offsetHeight > 0;
      
      // Also check for the translated page class that Google adds
      const isTranslated = document.body.classList.contains('translated-ltr') || 
                          document.body.classList.contains('translated-rtl');
      
      const active = isVisible || isTranslated;
      
      if (active !== isTranslateActive) {
        setIsTranslateActive(active);
        
        // Add/remove class to body for CSS targeting
        if (active) {
          document.body.classList.add('translated-page');
        } else {
          document.body.classList.remove('translated-page');
        }
      }
    };

    // Initial check
    checkTranslateStatus();

    // Set up mutation observer to watch for changes
    let observer;
    try {
      observer = new MutationObserver(() => {
      checkTranslateStatus();
      });
    } catch (e) {
      // MutationObserver may not be available in some environments
      observer = null;
    }

    // Watch for changes in the document body and head
    if (observer) {
      try {
        observer.observe(document.body, {
          childList: true,
          subtree: true,
          attributes: true,
          attributeFilter: ['class', 'style']
        });
        observer.observe(document.head, {
          childList: true,
          subtree: true
        });
      } catch (e) {
        // ignore observer errors
      }
    }

    // Also check periodically as a fallback
    const interval = setInterval(checkTranslateStatus, 1000);

    return () => {
      if (observer) {
        observer.disconnect();
      }
      clearInterval(interval);
    };
  }, [isTranslateActive]);

  return isTranslateActive;
};

export default useGoogleTranslate;