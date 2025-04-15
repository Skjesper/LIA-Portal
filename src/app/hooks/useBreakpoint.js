'use client';

import { useState, useEffect } from 'react';

export default function useBreakpoint(breakpoint = 768) {
  // Undvik att sätta initialt värde som kan skilja sig mellan server och klient
  const [isMobile, setIsMobile] = useState(null);
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    // Markera att vi nu kör på klienten
    setIsClient(true);
    
    // Function to check if window size is below breakpoint
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < breakpoint);
    };
    
    // Check on initial render
    checkIsMobile();
    
    // Add event listener for resize
    window.addEventListener('resize', checkIsMobile);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkIsMobile);
  }, [breakpoint]);
  
  // På servern eller innan effekten har körts, returnera ett default-värde
  // som matchar det serverside rendering skulle använda
  if (!isClient) return false;
  
  return isMobile;
}