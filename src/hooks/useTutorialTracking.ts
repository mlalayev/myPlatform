import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';

// OPTIMIZED: Debounced tracking with cooldown to prevent excessive API calls
export const useTutorialTracking = () => {
  const pathname = usePathname();
  const { data: session } = useSession();
  const lastTrackedRef = useRef<string | null>(null);
  const cooldownRef = useRef<boolean>(false);

  useEffect(() => {
    // Only track if user is authenticated and visiting tutorial pages
    if (!session?.user) return;

    // Check if the current path is a specific tutorial lesson (not just the tutorials list)
    const isTutorialLessonPage = pathname?.match(/\/tutorials\/.*\/\d+$/);
    
    if (isTutorialLessonPage && pathname !== lastTrackedRef.current && !cooldownRef.current) {
      // Set cooldown to prevent rapid tracking
      cooldownRef.current = true;
      lastTrackedRef.current = pathname;
      
      // Delay tracking to ensure page is actually viewed (not just passing through)
      const timeoutId = setTimeout(() => {
        fetch('/api/user/activity', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            type: 'LESSON_VIEW',
            description: 'Viewed tutorial lesson',
            metadata: {
              path: pathname,
              timestamp: new Date().toISOString()
            }
          })
        }).catch(error => {
          console.error('Failed to track tutorial visit:', error);
        });
        
        // Reset cooldown after 5 seconds
        setTimeout(() => {
          cooldownRef.current = false;
        }, 5000);
      }, 2000); // Wait 2 seconds before tracking

      return () => clearTimeout(timeoutId);
    }
  }, [pathname, session]);
}; 