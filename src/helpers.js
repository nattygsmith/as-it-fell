import { QUOTES } from "./quotes.js";

// ============================================================
//  TIME & SEASON
// ============================================================

export function getTimeOfDay(hour) {
  if (hour >= 5 && hour < 12) return "morning";
  if (hour >= 12 && hour < 17) return "afternoon";
  if (hour >= 17 && hour < 21) return "evening";
  return "night";
}

export function getSeason(month) {
  // Meteorological seasons, Northern Hemisphere, 0-indexed month
  if (month >= 2 && month <= 4) return "spring";
  if (month >= 5 && month <= 7) return "summer";
  if (month >= 8 && month <= 10) return "autumn";
  return "winter";
}

// ============================================================
//  QUOTE SELECTION
// ============================================================

export function getPool(timeOfDay, season) {
  // Match on time first; season is a bonus filter if enough matches exist
  const timeMatch = QUOTES.filter((q) => q.time.includes(timeOfDay));
  const seasonMatch = timeMatch.filter(
    (q) => q.season.length === 0 || q.season.includes(season)
  );
  // Prefer season-aware matches; fall back to time-only if pool is too small
  return seasonMatch.length >= 2 ? seasonMatch : timeMatch;
}

export function pickQuote(pool, lastQuote) {
  if (pool.length === 0) return null;
  const candidates = pool.length > 1 ? pool.filter((q) => q !== lastQuote) : pool;
  return candidates[Math.floor(Math.random() * candidates.length)];
}
