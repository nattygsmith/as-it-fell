package com.nattygsmith.refrain.data

import com.google.gson.annotations.SerializedName

// ── Quote ─────────────────────────────────────────────────────────────────────

/**
 * A single displayable verse, loaded from assets/quotes.json.
 * Mirrors the Quote struct in Quote.swift exactly.
 *
 * The [id] field is assigned from the array index at load time by [DataStore];
 * it is not stored in the JSON file.
 */
data class Quote(
    val id: Int = 0,
    val text: String,
    val source: String,
    val time: List<String>,
    val season: List<String>,
    val lyricsKey: String?,
    val stanzaIndex: Int?,
) {
    companion object {
        /** Shown when no quote is available (e.g. widget placeholder). */
        val placeholder = Quote(
            id = -1,
            text = "The water is wide,\nI cannot get o'er.",
            source = "The Water is Wide (Child 204)",
            time = emptyList(),
            season = emptyList(),
            lyricsKey = null,
            stanzaIndex = null,
        )
    }
}

// ── LyricsEntry ───────────────────────────────────────────────────────────────

/**
 * Full song lyrics for one entry, loaded from assets/lyrics.json.
 * Mirrors the LyricsEntry struct in Quote.swift exactly.
 */
data class LyricsEntry(
    val title: String,
    val version: String,
    val stanzas: List<String>,
    val childNumber: String?,
    val sharpNumber: String?,
    val collectionNumber: String?,
) {
    /** Whichever collection identifier field is present. */
    val collectionLabel: String?
        get() = childNumber ?: sharpNumber ?: collectionNumber
}
