package com.nattygsmith.refrain.clock

import java.util.Calendar

// ── TimeOfDay ─────────────────────────────────────────────────────────────────

/**
 * The four time-of-day slots. [value] is the string used in quotes.json
 * and matches the iOS/web convention exactly.
 *
 * Boundaries match iOS QuoteClock and web getTimeOfDay():
 *   05:00–11:59 → morning
 *   12:00–16:59 → afternoon
 *   17:00–20:59 → evening
 *   21:00–04:59 → night
 */
enum class TimeOfDay(val value: String, val label: String, val glyph: String) {
    MORNING("morning", "Morning", "☀"),
    AFTERNOON("afternoon", "Afternoon", "◑"),
    EVENING("evening", "Evening", "☽"),
    NIGHT("night", "Night", "✦");

    companion object {
        fun current(): TimeOfDay {
            val hour = Calendar.getInstance().get(Calendar.HOUR_OF_DAY)
            return when (hour) {
                in 5..11  -> MORNING
                in 12..16 -> AFTERNOON
                in 17..20 -> EVENING
                else      -> NIGHT
            }
        }

        fun fromValue(value: String): TimeOfDay =
            entries.firstOrNull { it.value == value } ?: MORNING
    }
}

// ── Season ────────────────────────────────────────────────────────────────────

/**
 * The four meteorological seasons. [value] is the string used in quotes.json.
 * Matches iOS Season and web getSeason() exactly.
 *
 *   March–May   → spring
 *   June–August → summer
 *   Sept–Nov    → autumn
 *   Dec–Feb     → winter
 */
enum class Season(val value: String, val label: String) {
    SPRING("spring", "Spring"),
    SUMMER("summer", "Summer"),
    AUTUMN("autumn", "Autumn"),
    WINTER("winter", "Winter");

    companion object {
        fun current(): Season {
            val month = Calendar.getInstance().get(Calendar.MONTH) + 1 // Calendar.MONTH is 0-based
            return when (month) {
                in 3..5  -> SPRING
                in 6..8  -> SUMMER
                in 9..11 -> AUTUMN
                else     -> WINTER
            }
        }

        fun fromValue(value: String): Season =
            entries.firstOrNull { it.value == value } ?: SPRING
    }
}
