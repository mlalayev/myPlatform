import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';

export const useTutorialTracking = () => {
  const pathname = usePathname();
  const { data: session } = useSession();

  useEffect(() => {
    // Only track if user is authenticated and visiting tutorial pages
    if (!session?.user) return;

    // Check if the current path starts with /[lang]/tutorials
    const isTutorialPage = pathname?.includes('/tutorials');
    
    if (isTutorialPage) {
      // Send activity to backend
      fetch('/api/user/activity', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'LESSON_VIEW',
          description: 'Viewed tutorial page',
          metadata: {
            path: pathname,
            timestamp: new Date().toISOString()
          }
        })
      }).catch(error => {
        console.error('Failed to track tutorial visit:', error);
      });
    }
  }, [pathname, session]);
}; 