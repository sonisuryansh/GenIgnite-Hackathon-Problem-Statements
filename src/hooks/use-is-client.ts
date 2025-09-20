
'use client';

import { useState, useEffect } from 'react';

/**
 * A hook that returns `true` only after the component has mounted on the client.
 * This is useful for avoiding hydration mismatches when rendering content that
 * relies on browser-specific APIs (e.g., `window`, `localStorage`).
 */
export function useIsClient() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return isClient;
}
