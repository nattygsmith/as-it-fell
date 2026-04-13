import { useState, useEffect, useCallback } from "react";
import { THEMES } from "./constants.js";
import { getTimeOfDay, getSeason, getPool, pickQuote } from "./helpers.js";

// ============================================================
//  useQuoteClock
//  Owns all clock, time/season, pool, and quote-selection logic.
//
//  Returns:
//    timeOfDay     — "morning" | "afternoon" | "evening" | "night"
//    season        — "spring" | "summer" | "autumn" | "winter"
//    theme         — { bg, ink, accent, mist }
//    quote         — currently displayed quote object (or null on init)
//    pool          — array of matching quotes for current time/season
//    refresh       — fn(lastQuote) → picks a new quote
//    devTime       — current override time value
//    setDevTime    — setter (only takes effect when adminOpen is true)
//    devSeason     — current override season value
//    setDevSeason  — setter (only takes effect when adminOpen is true)
//    adminOpen     — whether admin override is active
//    setAdminOpen  — toggle admin mode on/off
// ============================================================
export function useQuoteClock() {
  const [now, setNow] = useState(new Date());
  const [quote, setQuote] = useState(null);
  const [lastQuote, setLastQuote] = useState(null);
  const [adminOpen, setAdminOpen] = useState(false);
  const [devTime, setDevTime] = useState(getTimeOfDay(new Date().getHours()));
  const [devSeason, setDevSeason] = useState(getSeason(new Date().getMonth()));

  const hour = now.getHours();
  const month = now.getMonth();
  const timeOfDay = adminOpen ? devTime : getTimeOfDay(hour);
  const season    = adminOpen ? devSeason : getSeason(month);
  const theme = THEMES[timeOfDay][season];
  const pool = getPool(timeOfDay, season);

  const refresh = useCallback(
    (currentLastQuote) => {
      const next = pickQuote(pool, currentLastQuote);
      if (next) {
        setQuote(next);
        setLastQuote(next);
      }
    },
    [pool]
  );

  // Initial pick
  useEffect(() => {
    refresh(null);
  }, []);

  // Auto-refresh at the next 15-minute boundary (skipped when admin override active)
  useEffect(() => {
    if (adminOpen) return;
    const next = new Date(now);
    const minsUntilNext = 15 - (next.getMinutes() % 15);
    next.setMinutes(next.getMinutes() + minsUntilNext, 0, 0);
    const ms = next - now;
    const t = setTimeout(() => {
      setNow(new Date());
      refresh(null);
    }, ms);
    return () => clearTimeout(t);
  }, [now, adminOpen]);

  // Re-pick when time slot or season changes
  useEffect(() => {
    if (quote) refresh(null);
  }, [timeOfDay, season]);

  return {
    timeOfDay,
    season,
    theme,
    quote,
    pool,
    refresh,
    lastQuote,
    devTime,
    setDevTime,
    devSeason,
    setDevSeason,
    adminOpen,
    setAdminOpen,
  };
}
