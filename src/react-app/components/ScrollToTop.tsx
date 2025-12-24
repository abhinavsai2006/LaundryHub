import { useEffect } from 'react';
import { useLocation } from 'react-router';

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Scroll to top when route changes
    // Use setTimeout to ensure DOM is updated after route change
    const scrollToTop = () => {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'instant' // Use instant for immediate scroll to top
      });

      // Also try scrolling the document element for better mobile support
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    };

    // Small delay to ensure the page has rendered
    setTimeout(scrollToTop, 0);
  }, [pathname]);

  return null;
}