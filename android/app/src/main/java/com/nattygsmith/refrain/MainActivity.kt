package com.nattygsmith.refrain

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.activity.viewModels
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import com.nattygsmith.refrain.clock.QuoteClock
import com.nattygsmith.refrain.theme.refrainTheme
import com.nattygsmith.refrain.ui.AboutScreen
import com.nattygsmith.refrain.ui.MainScreen

class MainActivity : ComponentActivity() {

    private val clock: QuoteClock by viewModels()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()

        // Widget deep link: carries only a quote ID, no lyrics key.
        // Tapping the widget navigates to that quote on the main screen.
        val widgetQuoteId = intent?.getIntExtra("widgetQuoteId", -1)
            ?.takeIf { it >= 0 }

// Only parse URL deep links if this is NOT a widget launch
        val deepLink = if (widgetQuoteId == null) intent?.data else null
        val pendingLyricsKey   = deepLink?.pathSegments?.getOrNull(0)
        val pendingStanzaIndex = deepLink?.pathSegments?.getOrNull(1)?.toIntOrNull()
        val pendingQuoteId     = deepLink?.pathSegments?.getOrNull(2)?.toIntOrNull()

        setContent {
            val navController = rememberNavController()
            val quote     by clock.quote.collectAsStateWithLifecycle()
            val timeOfDay by clock.timeOfDay.collectAsStateWithLifecycle()
            val season    by clock.season.collectAsStateWithLifecycle()
            val theme     = refrainTheme(timeOfDay, season)

            // Navigate to the widget's quote on launch, without opening lyrics
            LaunchedEffect(widgetQuoteId) {
                if (widgetQuoteId != null) {
                    clock.navigateTo(widgetQuoteId)
                }
            }

            // Legacy deep link handler (lyrics sheet)
            LaunchedEffect(pendingQuoteId) {
                if (pendingQuoteId != null) {
                    clock.navigateTo(pendingQuoteId)
                }
            }

            Box(
                modifier = Modifier
                    .fillMaxSize()
                    .background(theme.bg)
            ) {
                NavHost(navController = navController, startDestination = "main") {
                    composable(route = "main") {
                        MainScreen(
                            clock              = clock,
                            quote              = quote,
                            timeOfDay          = timeOfDay,
                            season             = season,
                            // Only open lyrics sheet for legacy URL deep links, not widget taps
                            initialLyricsKey   = pendingLyricsKey,
                            initialStanzaIndex = pendingStanzaIndex,
                            onNavigateAbout    = { navController.navigate("about") },
                        )
                    }
                    composable(route = "about") {
                        AboutScreen(
                            timeOfDay = timeOfDay,
                            season    = season,
                            onBack    = { navController.popBackStack() },
                        )
                    }
                }
            }
        }
    }

    override fun onResume() {
        super.onResume()
        clock.appDidBecomeActive()
    }
}
