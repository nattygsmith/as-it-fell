// ============================================================
//  THEME TOKENS  (time × season)
//  Each theme exposes four CSS custom property values:
//    --aif-bg      background colour
//    --aif-ink     text colour
//    --aif-accent  accent / highlight colour
//    --aif-mist    soft gradient colour for background radials
// ============================================================
export const THEMES = {
  morning: {
    spring: { bg: "#f0ebe0", ink: "#2c2416", accent: "#577144", mist: "#d4e8c2" },
    summer: { bg: "#fdf3d0", ink: "#2c2416", accent: "#9b6322", mist: "#fae89a" },
    autumn: { bg: "#f5e6cc", ink: "#2c2416", accent: "#a84e1b", mist: "#e8c998" },
    winter: { bg: "#eaf0f5", ink: "#1a2530", accent: "#447190", mist: "#c8dde8" },
  },
  afternoon: {
    spring: { bg: "#e8f0dc", ink: "#1e2d14", accent: "#4d7631", mist: "#c5dba8" },
    summer: { bg: "#fef0b0", ink: "#2a2010", accent: "#926417", mist: "#fad870" },
    autumn: { bg: "#f0dcc0", ink: "#2a1e10", accent: "#a04a18", mist: "#ddb880" },
    winter: { bg: "#dde8f0", ink: "#182230", accent: "#3a6888", mist: "#b0cede" },
  },
  evening: {
    spring: { bg: "#2a3520", ink: "#e8f0d8", accent: "#90c060", mist: "#405030" },
    summer: { bg: "#302818", ink: "#f8e8c0", accent: "#e0a040", mist: "#504028" },
    autumn: { bg: "#2e2010", ink: "#f0d8b0", accent: "#d56d25", mist: "#503020" },
    winter: { bg: "#181e28", ink: "#c8d8e8", accent: "#6090b8", mist: "#283040" },
  },
  night: {
    spring: { bg: "#121c10", ink: "#d0e8c0", accent: "#70a850", mist: "#1e2e18" },
    summer: { bg: "#181408", ink: "#f0e0a0", accent: "#c89030", mist: "#282010" },
    autumn: { bg: "#140e08", ink: "#e8c890", accent: "#b76727", mist: "#221408" },
    winter: { bg: "#080c14", ink: "#b0c8e0", accent: "#4d7dad", mist: "#101828" },
  },
};

export const TIME_LABELS = {
  morning: "Morning",
  afternoon: "Afternoon",
  evening: "Evening",
  night: "Night",
};

export const SEASON_LABELS = {
  spring: "Spring",
  summer: "Summer",
  autumn: "Autumn",
  winter: "Winter",
};

// Decorative glyphs per time of day — plain Unicode, not emoji.
// The variation selector \uFE0E forces text rendering (no emoji colour).
export const TIME_GLYPHS = {
  morning: "☀\uFE0E",
  afternoon: "◑\uFE0E",
  evening: "☽\uFE0E",
  night: "✦\uFE0E",
};
