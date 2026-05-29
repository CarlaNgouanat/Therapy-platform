import { useEffect, useState } from 'react';

/**
 * Hook nécessaire pour shadcn/ui (détection mobile)
 * @returns Renvoie un boolean
 */
export function useIsMobile(): boolean {
  // --- DATA ---
  const MOBILE_BREAKPOINT = 768;
  const [isMobile, setIsMobile] = useState<boolean | undefined>(undefined);

  // --- USEEFFECT ---
  useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };
    mql.addEventListener('change', onChange);
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    return () => mql.removeEventListener('change', onChange);
  }, []);

  return !!isMobile;
}
