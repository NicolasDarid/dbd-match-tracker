/**
 * Système de cache simple en mémoire pour les données de statistiques
 * Utilise le cache natif de Node.js avec TTL (Time To Live)
 */

interface CacheItem<T> {
  data: T;
  timestamp: number;
  ttl: number; // Time to live en millisecondes
}

class MemoryCache {
  private cache = new Map<string, CacheItem<unknown>>();
  private defaultTTL = 5 * 60 * 1000; // 5 minutes par défaut

  /**
   * Récupère une valeur du cache
   */
  get<T>(key: string): T | null {
    const item = this.cache.get(key);

    if (!item) {
      return null;
    }

    // Vérifier si l'item a expiré
    if (Date.now() - item.timestamp > item.ttl) {
      this.cache.delete(key);
      return null;
    }

    return item.data as T;
  }

  /**
   * Stocke une valeur dans le cache
   */
  set<T>(key: string, data: T, ttl?: number): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl: ttl || this.defaultTTL,
    });
  }

  /**
   * Supprime une clé du cache
   */
  delete(key: string): void {
    this.cache.delete(key);
  }

  /**
   * Supprime toutes les clés qui correspondent à un pattern
   */
  deletePattern(pattern: string): void {
    const regex = new RegExp(pattern);
    for (const key of this.cache.keys()) {
      if (regex.test(key)) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * Vide tout le cache
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Nettoie les éléments expirés
   */
  cleanup(): void {
    const now = Date.now();
    for (const [key, item] of this.cache.entries()) {
      if (now - item.timestamp > item.ttl) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * Retourne la taille du cache
   */
  size(): number {
    return this.cache.size;
  }

  /**
   * Retourne les clés du cache (pour debug)
   */
  keys(): string[] {
    return Array.from(this.cache.keys());
  }
}

// Instance globale du cache
export const cache = new MemoryCache();

/**
 * Fonction utilitaire pour wrapper les fonctions de base de données avec cache
 */
export async function withCache<T>(
  key: string,
  fn: () => Promise<T>,
  ttl?: number
): Promise<T> {
  // Essayer de récupérer depuis le cache
  const cached = cache.get<T>(key);
  if (cached !== null) {
    return cached;
  }

  // Si pas en cache, exécuter la fonction et mettre en cache
  const result = await fn();
  cache.set(key, result, ttl);
  return result;
}

/**
 * Clés de cache prédéfinies pour éviter les erreurs de typage
 */
export const CACHE_KEYS = {
  GLOBAL_STATS: "global_stats",
  TOP_KILLERS: "top_killers",
  TOP_SURVIVORS: "top_survivors",
  RECENT_KILLERS: "recent_killers",
  RECENT_SURVIVORS: "recent_survivors",
  KILLER_STATS: (id: string) => `killer_stats_${id}`,
  SURVIVOR_STATS: (id: string) => `survivor_stats_${id}`,
  KILLER_PERK_COMBOS: (id: string) => `killer_perk_combos_${id}`,
  SURVIVOR_PERK_COMBOS: (id: string) => `survivor_perk_combos_${id}`,
  MATCH_DATA: "match_data", // Pour les données du formulaire d'ajout
} as const;

/**
 * Invalide le cache lié aux statistiques (à appeler après ajout/suppression de matchs)
 */
export function invalidateStatsCache(): void {
  cache.deletePattern(
    "^(global_stats|top_killers|top_survivors|recent_killers|recent_survivors|killer_stats_|survivor_stats_|killer_perk_combos_|survivor_perk_combos_)"
  );
}

/**
 * Invalide tout le cache
 */
export function invalidateAllCache(): void {
  cache.clear();
}

// Nettoyage automatique du cache toutes les 10 minutes
if (typeof window === "undefined") {
  setInterval(() => {
    cache.cleanup();
  }, 10 * 60 * 1000);
}
