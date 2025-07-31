'use client';

import { useState, useEffect } from 'react';
import { useI18n } from '@/contexts/I18nContext';
import styles from '../ProfileFavorites.module.css';

// Polyfill for AbortSignal.timeout
if (!AbortSignal.timeout) {
  (AbortSignal as any).timeout = function timeout(ms: number) {
    const controller = new AbortController();
    setTimeout(() => controller.abort(), ms);
    return controller.signal;
  };
}

interface Favorite {
  id: number;
  type: 'LESSON' | 'EXERCISE';
  itemId: number;
  title: string;
  description?: string;
  language?: string;
  category?: string;
  createdAt: string;
}

export default function ProfileFavorites() {
  const { t } = useI18n();
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'ALL' | 'LESSON' | 'EXERCISE'>('ALL');

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      setError(null);
      const response = await fetch('/api/user/favorites', {
        signal: AbortSignal.timeout(10000) // 10 second timeout
      });
      
      if (response.ok) {
        const data = await response.json();
        setFavorites(data.favorites || []);
      } else {
        console.warn('Failed to fetch favorites:', response.status);
        setError('Failed to load favorites');
      }
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        console.warn('Request timeout while fetching favorites');
        setError('Request timeout');
      } else {
        console.error('Error fetching favorites:', error);
        setError('Network error');
      }
    } finally {
      setLoading(false);
    }
  };

  const removeFavorite = async (type: string, itemId: number) => {
    try {
      const response = await fetch(`/api/user/favorites?type=${type}&itemId=${itemId}`, {
        method: 'DELETE',
        signal: AbortSignal.timeout(5000) // 5 second timeout
      });
      
      if (response.ok) {
        setFavorites(favorites.filter(fav => !(fav.type === type && fav.itemId === itemId)));
      } else {
        console.warn('Failed to remove favorite:', response.status);
        alert('Failed to remove from favorites');
      }
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        console.warn('Request timeout while removing favorite');
        alert('Request timeout');
      } else {
        console.error('Error removing favorite:', error);
        alert('Network error');
      }
    }
  };

  const navigateToItem = (type: string, itemId: number) => {
    if (type === 'LESSON') {
      // Navigate to lesson page
      window.location.href = `/az/tutorials/languages/${itemId}`;
    } else if (type === 'EXERCISE') {
      // Navigate to exercise page
      window.location.href = `/az/exercises/${itemId}`;
    }
  };

  const filteredFavorites = favorites.filter(fav => {
    if (filter === 'ALL') return true;
    return fav.type === filter;
  });

  const getTypeIcon = (type: string) => {
    return type === 'LESSON' ? '📚' : '💻';
  };

  const getTypeLabel = (type: string) => {
    return type === 'LESSON' ? 'Dərs' : 'Məşq';
  };

  if (loading) {
    return (
      <div className={styles.favoritesContainer}>
        <div className={styles.loading}>Yüklənir...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.favoritesContainer}>
        <div className={styles.loading}>
          <div style={{ color: '#ef4444', marginBottom: '1rem' }}>⚠️</div>
          <h3 style={{ color: '#ef4444', marginBottom: '0.5rem' }}>Xəta baş verdi</h3>
          <p style={{ marginBottom: '1rem' }}>{error}</p>
          <button 
            onClick={() => {
              setLoading(true);
              setError(null);
              fetchFavorites();
            }}
            style={{
              background: '#3b82f6',
              color: 'white',
              border: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '0.9rem'
            }}
          >
            Yenidən cəhd et
          </button>
        </div>
      </div>
    );
  }

                return (
                <div className={styles.favoritesContainer}>
                  {/* Hero Section */}
                  <div className={styles.favoritesHero}>
                    <div className={styles.heroContent}>
                      <div className={styles.heroLeft}>
                        <h1 className={styles.heroTitle}>Sevimlilərim</h1>
                        <p className={styles.heroSubtitle}>Əlavə etdiyin dərs və məşqlər</p>
                      </div>
                      <div className={styles.heroRight}>
                        <div className={styles.favoritesStats}>
                          <div className={styles.statItem}>
                            <span className={styles.statNumber}>{favorites.length}</span>
                            <span className={styles.statLabel}>Ümumi</span>
                          </div>
                          <div className={styles.statItem}>
                            <span className={styles.statNumber}>
                              {favorites.filter(f => f.type === 'LESSON').length}
                            </span>
                            <span className={styles.statLabel}>Dərs</span>
                          </div>
                          <div className={styles.statItem}>
                            <span className={styles.statNumber}>
                              {favorites.filter(f => f.type === 'EXERCISE').length}
                            </span>
                            <span className={styles.statLabel}>Məşq</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

      {/* Filter Section */}
      <div className={styles.filterSection}>
        <div className={styles.filterButtons}>
          <button
            className={`${styles.filterButton} ${filter === 'ALL' ? styles.active : ''}`}
            onClick={() => setFilter('ALL')}
          >
            Hamısı ({favorites.length})
          </button>
          <button
            className={`${styles.filterButton} ${filter === 'LESSON' ? styles.active : ''}`}
            onClick={() => setFilter('LESSON')}
          >
            Dərslər ({favorites.filter(f => f.type === 'LESSON').length})
          </button>
          <button
            className={`${styles.filterButton} ${filter === 'EXERCISE' ? styles.active : ''}`}
            onClick={() => setFilter('EXERCISE')}
          >
            Məşqlər ({favorites.filter(f => f.type === 'EXERCISE').length})
          </button>
        </div>
      </div>

      {/* Favorites Grid */}
      {filteredFavorites.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyStateIcon}>⭐</div>
          <h3>Hələ sevimli əlavə etməmisiniz</h3>
          <p>Dərs və məşqləri sevimlilərə əlavə edərək burada görə bilərsiniz</p>
        </div>
      ) : (
        <div className={styles.favoritesGrid}>
          {filteredFavorites.map((favorite) => (
            <div key={favorite.id} className={styles.favoriteCard}>
              <div className={styles.cardHeader}>
                <div className={styles.typeInfo}>
                  <span className={styles.typeIcon}>{getTypeIcon(favorite.type)}</span>
                  <span className={styles.typeLabel}>{getTypeLabel(favorite.type)}</span>
                </div>
                <button
                  className={styles.removeButton}
                  onClick={() => removeFavorite(favorite.type, favorite.itemId)}
                  title="Sevimlilərdən çıxar"
                >
                  ✕
                </button>
              </div>
              
              <div className={styles.cardContent}>
                <h3 className={styles.favoriteTitle}>{favorite.title}</h3>
                {favorite.description && (
                  <p className={styles.favoriteDescription}>{favorite.description}</p>
                )}
                
                <div className={styles.favoriteMeta}>
                  {favorite.language && (
                    <span className={styles.metaTag}>{favorite.language}</span>
                  )}
                  {favorite.category && (
                    <span className={styles.metaTag}>{favorite.category}</span>
                  )}
                </div>
              </div>
              
              <div className={styles.cardActions}>
                <button
                  className={styles.viewButton}
                  onClick={() => navigateToItem(favorite.type, favorite.itemId)}
                >
                  Bax
                </button>
                <span className={styles.dateAdded}>
                  {new Date(favorite.createdAt).toLocaleDateString('az-AZ')}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 