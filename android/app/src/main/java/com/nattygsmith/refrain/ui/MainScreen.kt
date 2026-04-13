package com.nattygsmith.refrain.ui

import androidx.compose.animation.animateColorAsState
import androidx.compose.animation.core.tween
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.text.selection.SelectionContainer
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.style.TextDecoration
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import com.nattygsmith.refrain.clock.QuoteClock
import com.nattygsmith.refrain.clock.Season
import com.nattygsmith.refrain.clock.TimeOfDay
import com.nattygsmith.refrain.data.Quote
import com.nattygsmith.refrain.theme.ImFellEnglish
import com.nattygsmith.refrain.theme.refrainTheme

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun MainScreen(
    clock: QuoteClock,
    quote: Quote?,
    timeOfDay: TimeOfDay,
    season: Season,
    initialLyricsKey: String?,
    initialStanzaIndex: Int?,
    onNavigateAbout: () -> Unit,
) {
    val theme = refrainTheme(timeOfDay, season)
    val pool  by clock.pool.collectAsStateWithLifecycle()

    val animDuration = 1200
    val animBg     by animateColorAsState(theme.bg,     tween(animDuration), label = "bg")
    val animInk    by animateColorAsState(theme.ink,    tween(animDuration), label = "ink")
    val animAccent by animateColorAsState(theme.accent, tween(animDuration), label = "accent")
    val animMist   by animateColorAsState(theme.mist,   tween(animDuration), label = "mist")

    var showLyrics   by rememberSaveable { mutableStateOf(false) }
    var lyricsKey    by rememberSaveable { mutableStateOf<String?>(null) }
    var lyricsStanza by rememberSaveable { mutableStateOf<Int?>(null) }

    LaunchedEffect(initialLyricsKey) {
        if (initialLyricsKey != null) {
            lyricsKey    = initialLyricsKey
            lyricsStanza = initialStanzaIndex
            showLyrics   = true
        }
    }

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(animBg)
    ) {
        Box(
            modifier = Modifier
                .fillMaxSize()
                .background(
                    Brush.radialGradient(
                        colors = listOf(animMist.copy(alpha = 0.55f), Color.Transparent),
                        radius = 900f,
                    )
                )
        )

        Column(modifier = Modifier.fillMaxSize()) {
            Header(
                timeOfDay     = timeOfDay,
                season        = season,
                inkColor      = animInk,
                accentColor   = animAccent,
                onAboutTapped = onNavigateAbout,
            )

            Box(
                modifier = Modifier
                    .weight(1f)
                    .fillMaxWidth(),
                contentAlignment = Alignment.Center,
            ) {
                if (quote != null) {
                    QuoteContent(
                        quote          = quote,
                        inkColor       = animInk,
                        accentColor    = animAccent,
                        onLyricsTapped = {
                            lyricsKey    = quote.lyricsKey
                            lyricsStanza = quote.stanzaIndex
                            showLyrics   = true
                        },
                    )
                }
            }

            Footer(
                poolSize    = pool.size,
                timeOfDay   = timeOfDay,
                inkColor    = animInk,
                accentColor = animAccent,
                onAnother   = { clock.next() },
            )
        }

        if (showLyrics) {
            val key = lyricsKey ?: quote?.lyricsKey
            if (key != null) {
                LyricsSheet(
                    lyricsKey   = key,
                    stanzaIndex = lyricsStanza ?: quote?.stanzaIndex,
                    theme       = theme,
                    onDismiss   = {
                        showLyrics   = false
                        lyricsKey    = null
                        lyricsStanza = null
                    },
                )
            }
        }
    }
}

// ── Header ────────────────────────────────────────────────────────────────────

@Composable
private fun Header(
    timeOfDay: TimeOfDay,
    season: Season,
    inkColor: Color,
    accentColor: Color,
    onAboutTapped: () -> Unit,
) {
    Column(
        modifier = Modifier
            .fillMaxWidth()
            .windowInsetsPadding(WindowInsets.statusBars)
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 28.dp, vertical = 14.dp),
            verticalAlignment = Alignment.CenterVertically,
        ) {
            Text(
                text          = "${timeOfDay.glyph}  ${timeOfDay.label.uppercase()} · ${season.label.uppercase()}",
                fontFamily    = ImFellEnglish,
                fontSize      = 11.sp,
                color         = inkColor.copy(alpha = 0.6f),
                letterSpacing = 0.5.sp,
            )
            Spacer(Modifier.weight(1f))
            TextButton(
                onClick        = onAboutTapped,
                contentPadding = PaddingValues(0.dp),
            ) {
                Text(
                    text          = "ABOUT",
                    fontFamily    = ImFellEnglish,
                    fontSize      = 11.sp,
                    color         = accentColor,
                    letterSpacing = 0.5.sp,
                )
            }
        }
        HorizontalDivider(
            modifier  = Modifier.padding(horizontal = 28.dp),
            color     = accentColor.copy(alpha = 0.3f),
            thickness = 0.5.dp,
        )
    }
}

// ── Quote content ─────────────────────────────────────────────────────────────

@Composable
private fun QuoteContent(
    quote: Quote,
    inkColor: Color,
    accentColor: Color,
    onLyricsTapped: () -> Unit,
) {
    val hasLyrics = quote.lyricsKey != null

    Column(
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 36.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center,
    ) {
        // Quote text is selectable; attribution is kept outside SelectionContainer
        // so its clickable behaviour isn't disrupted by selection gestures.
        SelectionContainer {
            Text(
                text       = quote.text,
                fontFamily = ImFellEnglish,
                fontSize   = 22.sp,
                lineHeight = 32.sp,
                color      = inkColor,
                textAlign  = TextAlign.Center,
            )
        }

        Spacer(Modifier.height(16.dp))

        // Attribution — outside SelectionContainer so tap-to-lyrics works cleanly
        Text(
            text           = "— ${quote.source.uppercase()}",
            fontFamily     = ImFellEnglish,
            fontSize       = 11.sp,
            color          = if (hasLyrics) accentColor else accentColor.copy(alpha = 0.5f),
            textAlign      = TextAlign.Center,
            letterSpacing  = 0.3.sp,
            textDecoration = if (hasLyrics) TextDecoration.Underline else TextDecoration.None,
            modifier       = Modifier
                .then(if (hasLyrics) Modifier.clickable(onClick = onLyricsTapped) else Modifier)
                .padding(horizontal = 12.dp, vertical = 8.dp),
        )
    }
}

// ── Footer ────────────────────────────────────────────────────────────────────

@Composable
private fun Footer(
    poolSize: Int,
    timeOfDay: TimeOfDay,
    inkColor: Color,
    accentColor: Color,
    onAnother: () -> Unit,
) {
    val countLabel = "$poolSize ${if (poolSize == 1) "VERSE" else "VERSES"} FOR THIS ${timeOfDay.label.uppercase()}"

    Column(
        modifier = Modifier
            .fillMaxWidth()
            .windowInsetsPadding(WindowInsets.navigationBars),
        horizontalAlignment = Alignment.CenterHorizontally,
    ) {
        HorizontalDivider(
            modifier  = Modifier.padding(horizontal = 28.dp),
            color     = accentColor.copy(alpha = 0.3f),
            thickness = 0.5.dp,
        )
        Spacer(Modifier.height(4.dp))

        TextButton(onClick = onAnother) {
            Text(
                text          = "ANOTHER",
                fontFamily    = ImFellEnglish,
                fontSize      = 16.sp,
                color         = inkColor.copy(alpha = 0.7f),
                letterSpacing = 1.sp,
            )
        }

        if (poolSize > 0) {
            Text(
                text          = countLabel,
                fontFamily    = ImFellEnglish,
                fontSize      = 10.sp,
                color         = inkColor.copy(alpha = 0.4f),
                letterSpacing = 0.5.sp,
            )
        }

        Spacer(Modifier.height(12.dp))
    }
}
