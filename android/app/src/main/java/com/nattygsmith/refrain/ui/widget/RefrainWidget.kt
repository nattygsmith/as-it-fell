package com.nattygsmith.refrain.ui.widget

import android.content.Context
import android.content.Intent
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.glance.*
import androidx.glance.action.clickable
import androidx.glance.appwidget.GlanceAppWidget
import androidx.glance.appwidget.action.actionStartActivity
import androidx.glance.appwidget.provideContent
import androidx.glance.layout.*
import androidx.glance.text.*
import androidx.glance.unit.ColorProvider
import com.nattygsmith.refrain.MainActivity
import com.nattygsmith.refrain.clock.Season
import com.nattygsmith.refrain.clock.TimeOfDay
import com.nattygsmith.refrain.data.DataStore
import com.nattygsmith.refrain.data.Quote
import com.nattygsmith.refrain.theme.refrainTheme

/**
 * Home screen widget — displays the current quote on the themed background.
 *
 * Tapping opens the main app screen showing that quote. No lyrics sheet is
 * opened — the deep link carries only the quote ID so the app can navigate
 * to the right quote without opening lyrics.
 *
 * Note: Glance does not support custom fonts. The widget uses the system
 * serif font as the closest available fallback to IM Fell English.
 */
class RefrainWidget : GlanceAppWidget() {

    override suspend fun provideGlance(context: Context, id: GlanceId) {
        DataStore.init(context)

        val timeOfDay = TimeOfDay.current()
        val season    = Season.current()
        val theme     = refrainTheme(timeOfDay, season)
        val quote     = pickQuote(timeOfDay, season)

        provideContent {
            WidgetContent(
                context   = context,
                quote     = quote,
                bgColor   = theme.bg,
                inkColor  = theme.ink,
            )
        }
    }

    private fun pickQuote(time: TimeOfDay, season: Season): Quote {
        val pool = DataStore.quotesFor(time, season)
        return pool.randomOrNull() ?: Quote.placeholder
    }
}

@Composable
private fun WidgetContent(
    context: Context,
    quote: Quote,
    bgColor: Color,
    inkColor: Color,
) {
    // Launch intent carries the quote ID so MainActivity can navigate to it.
    // No lyrics key — tapping opens the main screen only, not the lyrics sheet.
    val launchIntent = actionStartActivity(
        Intent(context, MainActivity::class.java).apply {
            putExtra("widgetQuoteId", quote.id)
            flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TOP
        }
    )

    Box(
        modifier = GlanceModifier
            .fillMaxSize()
            .background(bgColor)
            .clickable(launchIntent),
        contentAlignment = Alignment.Center,
    ) {
        Column(
            modifier = GlanceModifier
                .fillMaxSize()
                .padding(horizontal = 16.dp, vertical = 14.dp),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalAlignment   = Alignment.CenterVertically,
        ) {
            // Quote text — as large as fits, centred
            Text(
                text  = quote.text,
                style = TextStyle(
                    color     = ColorProvider(inkColor),
                    fontSize  = 16.sp,
                    textAlign = TextAlign.Center,
                ),
                maxLines = 8,
            )

            Spacer(GlanceModifier.height(8.dp))

            // Attribution
            Text(
                text  = "— ${quote.source.uppercase()}",
                style = TextStyle(
                    color     = ColorProvider(inkColor.copy(alpha = 0.65f)),
                    fontSize  = 9.sp,
                    textAlign = TextAlign.Center,
                ),
                maxLines = 2,
            )
        }
    }
}
