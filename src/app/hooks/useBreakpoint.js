'use client';

import { useState, useEffect } from 'react';

export default function useBreakpoint(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    // Function to check if window size is below breakpoint
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < breakpoint);
    };
    
    // Check on initial render (client-side only)
    if (typeof window !== 'undefined') {
      checkIsMobile();
      
      // Add event listener for resize
      window.addEventListener('resize', checkIsMobile);
      
      // Cleanup
      return () => window.removeEventListener('resize', checkIsMobile);
    }
  }, [breakpoint]);
  
  return isMobile;
}