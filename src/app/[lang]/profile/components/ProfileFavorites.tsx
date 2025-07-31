'use client';

import { useState, useEffect } from 'react';
import { useI18n } from '@/contexts/I18nContext';
import styles from '../ProfileFavorites.module.css';

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
  const [filter, setFilter] = useState<'ALL' | 'LESSON' | 'EXERCISE'>('ALL');

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      const response = await fetch('/api/user/favorites');
      if (response.ok) {
        const data = await response.json();
        setFavorites(data.favorites || []);
      }
    } catch (error) {
      console.error('Error fetching favorites:', error);
    } finally {
      setLoading(false);
    }
  };

  const removeFavorite = async (type: string, itemId: number) => {
    try {
      const response = await fetch(`/api/user/favorites?type=${type}&itemId=${itemId}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        setFavorites(favorites.filter(fav => !(fav.type === type && fav.itemId === itemId)));
      }
    } catch (error) {
      console.error('Error removing favorite:', error);
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
      <div className={styles.container}>
        <div className={styles.loading}>Yüklənir...</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Hero Section */}
      <div className={styles.hero}>
        <div className={styles.heroContent}>
          <h1>Sevimlilərim</h1>
          <p>Əlavə etdiyin dərs və məşqlər</p>
        </div>
        <div className={styles.heroStats}>
          <div className={styles.statCard}>
            <span className={styles.statNumber}>{favorites.length}</span>
            <span className={styles.statLabel}>Ümumi</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statNumber}>
              {favorites.filter(f => f.type === 'LESSON').length}
            </span>
            <span className={styles.statLabel}>Dərs</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statNumber}>
              {favorites.filter(f => f.type === 'EXERCISE').length}
            </span>
            <span className={styles.statLabel}>Məşq</span>
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