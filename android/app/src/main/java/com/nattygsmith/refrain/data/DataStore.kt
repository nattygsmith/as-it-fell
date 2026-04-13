package com.nattygsmith.refrain.data

import android.content.Context
import android.util.Log
import com.google.gson.Gson
import com.google.gson.reflect.TypeToken
import com.nattygsmith.refrain.clock.Season
import com.nattygsmith.refrain.clock.TimeOfDay

/**
 * Singleton that reads quotes.json and lyrics.json from assets/ once and
 * indexes them for fast lookup by time + season.
 *
 * ⚠️  IMPORTANT — Updating quote content:
 * The Android app bundles quotes.json and lyrics.json in assets/.
 * Unlike the web app, content updates require a new Play Store build.
 * After running generate_quotes.py and generate_lyrics.py, copy the
 * generated JSON files into android/app/src/main/assets/ before building.
 *
 * Mirrors DataStore.shared in the iOS app.
 */
object DataStore {

    private var quotes: List<Quote> = emptyList()
    private var lyrics: Map<String, LyricsEntry> = emptyMap()

    // Indexed as [TimeOfDay][Season] → list of matching quotes
    private var index: Map<TimeOfDay, Map<Season, List<Quote>>> = emptyMap()

    private var initialised = false

    /** Must be called once at app startup (from RefrainApplication). */
    fun init(context: Context) {
        if (initialised) return
        try {
            val gson = Gson()

            // Load quotes
            val rawQuotes: List<Map<String, Any>> = gson.fromJson(
                context.assets.open("quotes.json").bufferedReader(),
                object : TypeToken<List<Map<String, Any>>>() {}.type
            )
            quotes = rawQuotes.mapIndexed { i, map ->
                Quote(
                    id = i,
                    text = map["text"] as? String ?: "",
                    source = map["source"] as? String ?: "",
                    time = (map["time"] as? List<*>)?.filterIsInstance<String>() ?: emptyList(),
                    season = (map["season"] as? List<*>)?.filterIsInstance<String>() ?: emptyList(),
                    lyricsKey = map["lyricsKey"] as? String,
                    stanzaIndex = (map["stanzaIndex"] as? Double)?.toInt(),
                )
            }

            // Load lyrics
            val rawLyrics: Map<String, Map<String, Any>> = gson.fromJson(
                context.assets.open("lyrics.json").bufferedReader(),
                object : TypeToken<Map<String, Map<String, Any>>>() {}.type
            )
            lyrics = rawLyrics.mapValues { (_, map) ->
                LyricsEntry(
                    title = map["title"] as? String ?: "",
                    version = map["version"] as? String ?: "",
                    stanzas = (map["stanzas"] as? List<*>)?.filterIsInstance<String>() ?: emptyList(),
                    childNumber = map["childNumber"] as? String,
                    sharpNumber = map["sharpNumber"] as? String,
                    collectionNumber = map["collectionNumber"] as? String,
                )
            }

            // Build index
            index = TimeOfDay.entries.associateWith { time ->
                Season.entries.associateWith { season ->
                    quotes.filter {
                        it.time.contains(time.value) && (it.season.isEmpty() || it.season.contains(season.value))
                    }
                }
            }

            val total = index.values.sumOf { it.values.sumOf { pool -> pool.size } }
            Log.d("Refrain", "Loaded " + quotes.size + " quotes, indexed " + total)

            initialised = true

        } catch (e: Exception) {
            Log.e("Refrain", "DataStore init failed: " + e.message)
            Log.e("Refrain", "Cause: " + e.cause?.message)
        }
    }

    /** Returns all approved quotes matching the given time and season. */
    fun quotesFor(time: TimeOfDay, season: Season): List<Quote> =
        index[time]?.get(season) ?: emptyList()

    /** Returns the lyrics entry for [key], or null if not found. */
    fun lyricsFor(key: String): LyricsEntry? = lyrics[key]

    /** Returns the quote with the given [id], or null. */
    fun quoteById(id: Int): Quote? = quotes.getOrNull(id)
}
