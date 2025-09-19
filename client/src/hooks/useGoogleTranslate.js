import { useEffect, useState } from 'react';

export const useGoogleTranslate = () => {
  const [isTranslateActive, setIsTranslateActive] = useState(false);

  useEffect(() => {
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
    const observer = new MutationObserver(() => {
      checkTranslateStatus();
    });

    // Watch for changes in the document body and head
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

    // Also check periodically as a fallback
    const interval = setInterval(checkTranslateStatus, 1000);

    return () => {
      observer.disconnect();
      clearInterval(interval);
    };
  }, [isTranslateActive]);

  return isTranslateActive;
};

export default useGoogleTranslate;