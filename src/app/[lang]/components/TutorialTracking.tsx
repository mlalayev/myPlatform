'use client';

import { useTutorialTracking } from '@/hooks/useTutorialTracking';

export default function TutorialTracking() {
  useTutorialTracking();
  
  // This component doesn't render anything, it just tracks tutorial visits
  return null;
} 