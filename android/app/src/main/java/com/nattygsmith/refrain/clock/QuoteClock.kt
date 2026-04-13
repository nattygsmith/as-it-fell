package com.nattygsmith.refrain.clock

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.nattygsmith.refrain.data.DataStore
import com.nattygsmith.refrain.data.Quote
import kotlinx.coroutines.Job
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import java.util.Calendar
import java.util.concurrent.TimeUnit

/**
 * Tracks the current time and season, maintains the active quote pool,
 * and handles manual refresh ("Another") and automatic 15-minute rotation.
 *
 * Mirrors QuoteClock.swift (iOS) and useQuoteClock.js (web).
 *
 * Exposed as a ViewModel so it survives recomposition and configuration changes.
 */
class QuoteClock : ViewModel() {

    private val _timeOfDay = MutableStateFlow(TimeOfDay.current())
    val timeOfDay: StateFlow<TimeOfDay> = _timeOfDay.asStateFlow()

    private val _season = MutableStateFlow(Season.current())
    val season: StateFlow<Season> = _season.asStateFlow()

    private val _quote = MutableStateFlow<Quote?>(null)
    val quote: StateFlow<Quote?> = _quote.asStateFlow()

    private val _pool = MutableStateFlow<List<Quote>>(emptyList())
    val pool: StateFlow<List<Quote>> = _pool.asStateFlow()

    private var lastQuoteId: Int? = null
    private var timerJob: Job? = null

    init {
        refresh(updateTimeSeason = true)
        scheduleTimer()
    }

    // ── Public interface ──────────────────────────────────────────────────────

    /**
     * Advance to a new random quote from the current pool.
     * Called when the user taps "Another".
     */
    fun next() {
        lastQuoteId = _quote.value?.id
        _quote.value = pickQuote(_pool.value, excluding = lastQuoteId)
    }

    /**
     * Navigate directly to a specific quote by ID.
     * Used when the app is opened from a widget tap deep link.
     */
    fun navigateTo(id: Int) {
        val target = _pool.value.firstOrNull { it.id == id }
        if (target != null) _quote.value = target
    }

    /**
     * Called when the app returns to the foreground.
     * Re-evaluates time and season in case the slot has changed.
     */
    fun appDidBecomeActive() {
        refresh(updateTimeSeason = true)
    }

    // ── Internal ──────────────────────────────────────────────────────────────

    private fun refresh(updateTimeSeason: Boolean) {
        if (updateTimeSeason) {
            val newTime = TimeOfDay.current()
            val newSeason = Season.current()
            // Clear lastQuoteId when the slot changes so we don't exclude a
            // quote that may not even be in the new pool.
            if (newTime != _timeOfDay.value || newSeason != _season.value) {
                lastQuoteId = null
            }
            _timeOfDay.value = newTime
            _season.value = newSeason
        }
        val newPool = DataStore.quotesFor(_timeOfDay.value, _season.value)
        _pool.value = newPool
        _quote.value = pickQuote(newPool, excluding = lastQuoteId)
    }

    private fun pickQuote(pool: List<Quote>, excluding: Int?): Quote? {
        if (pool.isEmpty()) return null
        val candidates = pool.filter { it.id != excluding }
        return (if (candidates.isEmpty()) pool else candidates).random()
    }

    /**
     * Schedules automatic quote rotation every 15 minutes, aligned to the
     * clock (i.e. fires at :00, :15, :30, :45).
     * Mirrors the aligned timer in iOS QuoteClock.swift.
     */
    private fun scheduleTimer() {
        timerJob?.cancel()
        timerJob = viewModelScope.launch {
            val intervalMs = TimeUnit.MINUTES.toMillis(15)
            val now = System.currentTimeMillis()
            val nextBoundary = ((now / intervalMs) + 1) * intervalMs
            delay(nextBoundary - now)
            while (true) {
                refresh(updateTimeSeason = true)
                delay(intervalMs)
            }
        }
    }

    override fun onCleared() {
        super.onCleared()
        timerJob?.cancel()
    }
}
