import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEYS = {
  RECENT_VIEWS: 'CLICKERS_RECENT_VIEWS',
  RECENT_SEARCHES: 'CLICKERS_RECENT_SEARCHES',
};

const MAX_ITEMS = 10;

/**
 * Strips down book payload to prevent blowing localStorage quota
 */
function sanitizeBook(book: any) {
  if (!book) return null;
  return {
    id: book.id,
    title_ar: book.title_ar,
    title_en: book.title_en,
    cover_url: book.cover_url,
    price: book.price,
    author: book.author || book.authors?.name_ar || book.authors?.name_en || '',
    genre: book.genre,
  };
}

/**
 * Smart discovery Hook
 * Operates entirely on the client side to provide instant "Netflix-style"
 * recommendations without eating into Supabase quotas.
 */
export function useDiscovery() {
  const [recentViews, setRecentViews] = useState<any[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  useEffect(() => {
    try {
      const savedViews = localStorage.getItem(STORAGE_KEYS.RECENT_VIEWS);
      const savedSearches = localStorage.getItem(STORAGE_KEYS.RECENT_SEARCHES);
      
      if (savedViews) setRecentViews(JSON.parse(savedViews));
      if (savedSearches) setRecentSearches(JSON.parse(savedSearches));
    } catch (e) {
      console.warn('Failed to read discovery data from localStorage:', e);
    }
  }, []);

  const trackView = useCallback((book: any) => {
    if (!book || !book.id) return;
    const cleanBook = sanitizeBook(book);

    setRecentViews((prev) => {
      const filtered = prev.filter(b => b.id !== book.id);
      const updated = [cleanBook, ...filtered].slice(0, MAX_ITEMS);
      try {
        localStorage.setItem(STORAGE_KEYS.RECENT_VIEWS, JSON.stringify(updated));
      } catch (err) {
        console.warn('Failed to store recent view in localStorage (quota exceeded?):', err);
        // Clear old key if corrupted or bloated
        try {
          localStorage.removeItem(STORAGE_KEYS.RECENT_VIEWS);
        } catch {}
      }
      return updated;
    });
  }, []);

  const trackSearch = useCallback((query: string) => {
    if (!query || query.length < 3) return;
    setRecentSearches((prev) => {
      const filtered = prev.filter(q => q.toLowerCase() !== query.toLowerCase());
      const updated = [query, ...filtered].slice(0, 5);
      try {
        localStorage.setItem(STORAGE_KEYS.RECENT_SEARCHES, JSON.stringify(updated));
      } catch (err) {
        console.warn('Failed to store recent search in localStorage:', err);
      }
      return updated;
    });
  }, []);

  return {
    recentViews,
    recentSearches,
    trackView,
    trackSearch
  };
}
