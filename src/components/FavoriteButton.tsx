'use client';

import { useState, useEffect } from 'react';
import { FiHeart } from 'react-icons/fi';

// Polyfill for AbortSignal.timeout
if (!AbortSignal.timeout) {
  (AbortSignal as any).timeout = function timeout(ms: number) {
    const controller = new AbortController();
    setTimeout(() => controller.abort(), ms);
    return controller.signal;
  };
}

interface FavoriteButtonProps {
  type: 'LESSON' | 'EXERCISE';
  itemId: string | number;
  title: string;
  description?: string;
  language?: string;
  category?: string;
  className?: string;
}

export default function FavoriteButton({
  type,
  itemId,
  title,
  description,
  language,
  category,
  className = ''
}: FavoriteButtonProps) {
  const [isFavorited, setIsFavorited] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    checkFavoriteStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type, itemId]);

  const checkFavoriteStatus = async () => {
    // Skip if itemId is invalid
    if (!itemId || itemId === '') {
      return;
    }

    try {
      setError(null);
      const response = await fetch(`/api/user/favorites/check?type=${type}&itemId=${itemId}`, {
        signal: AbortSignal.timeout(5000) // 5 second timeout
      });
      
      if (response.ok) {
        const data = await response.json();
        setIsFavorited(data.isFavorited);
      } else {
        console.warn('Failed to check favorite status:', response.status);
      }
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        console.warn('Request timeout while checking favorite status');
      } else {
        console.error('Error checking favorite status:', error);
        setError('Network error');
      }
    }
  };

  const toggleFavorite = async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      if (isFavorited) {
        // Remove from favorites
        const response = await fetch(`/api/user/favorites?type=${type}&itemId=${itemId}`, {
          method: 'DELETE',
          signal: AbortSignal.timeout(5000) // 5 second timeout
        });
        
        if (response.ok) {
          setIsFavorited(false);
        } else {
          console.warn('Failed to remove favorite:', response.status);
          setError('Failed to remove from favorites');
        }
      } else {
        // Add to favorites
        const response = await fetch('/api/user/favorites', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            type,
            itemId,
            title,
            description,
            language,
            category
          }),
          signal: AbortSignal.timeout(5000) // 5 second timeout
        });
        
        if (response.ok) {
          setIsFavorited(true);
        } else {
          console.warn('Failed to add favorite:', response.status);
          setError('Failed to add to favorites');
        }
      }
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        console.warn('Request timeout while toggling favorite');
        setError('Request timeout');
      } else {
        console.error('Error toggling favorite:', error);
        setError('Network error');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Don't render if itemId is invalid
  if (!itemId || itemId === '') {
    console.log('FavoriteButton: Invalid itemId:', { itemId, type, title });
    return null;
  }

  console.log('FavoriteButton: Rendering with:', { itemId, type, title });

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={toggleFavorite}
        disabled={isLoading}
        className={`favorite-button ${className} ${isFavorited ? 'favorited' : ''}`}
        title={isFavorited ? 'Sevimlilərdən çıxar' : 'Sevimlilərə əlavə et'}
        style={{
          background: 'none',
          border: 'none',
          cursor: isLoading ? 'not-allowed' : 'pointer',
          padding: '8px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.2s ease',
          color: isFavorited ? '#ef4444' : '#64748b',
          backgroundColor: isFavorited ? '#fef2f2' : 'transparent',
          fontSize: '1.2rem',
          opacity: isLoading ? 0.6 : 1
        }}
      >
        <FiHeart 
          style={{
            fill: isFavorited ? '#ef4444' : 'none',
            stroke: isFavorited ? '#ef4444' : '#64748b',
            transition: 'all 0.2s ease'
          }}
        />
      </button>
      
      {error && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            left: '50%',
            transform: 'translateX(-50%)',
            background: '#ef4444',
            color: 'white',
            padding: '4px 8px',
            borderRadius: '4px',
            fontSize: '0.75rem',
            whiteSpace: 'nowrap',
            zIndex: 1000,
            marginTop: '4px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
          }}
        >
          {error}
        </div>
      )}
    </div>
  );
} 