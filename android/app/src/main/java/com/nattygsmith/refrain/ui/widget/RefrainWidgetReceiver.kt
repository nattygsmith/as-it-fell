package com.nattygsmith.refrain.ui.widget

import android.content.Context
import androidx.glance.appwidget.GlanceAppWidget
import androidx.glance.appwidget.GlanceAppWidgetReceiver
import androidx.glance.appwidget.updateAll
import androidx.work.*
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import java.util.Calendar
import java.util.concurrent.TimeUnit

// ── Widget receiver ───────────────────────────────────────────────────────────

/**
 * BroadcastReceiver that connects the AppWidget framework to our GlanceAppWidget.
 * Also schedules the 15-minute refresh worker on first install.
 */
class RefrainWidgetReceiver : GlanceAppWidgetReceiver() {
    override val glanceAppWidget: GlanceAppWidget = RefrainWidget()

    override fun onEnabled(context: Context) {
        super.onEnabled(context)
        WidgetRefreshWorker.schedule(context)
    }

    override fun onDisabled(context: Context) {
        super.onDisabled(context)
        WidgetRefreshWorker.cancel(context)
    }
}

// ── Refresh worker ────────────────────────────────────────────────────────────

/**
 * WorkManager worker that triggers a widget update every 15 minutes,
 * aligned to the clock (:00, :15, :30, :45).
 *
 * Android's AppWidget framework has a minimum update interval of 30 minutes,
 * so WorkManager is used instead — matching the iOS approach of a custom
 * aligned timer in QuoteClock.
 *
 * The worker is scheduled as a periodic task. On each run it calls
 * [RefrainWidget.updateAll] which re-invokes [RefrainWidget.provideGlance]
 * and picks a fresh quote.
 */
class WidgetRefreshWorker(
    private val context: Context,
    workerParams: WorkerParameters,
) : CoroutineWorker(context, workerParams) {

    override suspend fun doWork(): Result {
        return withContext(Dispatchers.IO) {
            try {
                RefrainWidget().updateAll(context)
                Result.success()
            } catch (e: Exception) {
                Result.retry()
            }
        }
    }

    companion object {
        private const val WORK_NAME = "refrain_widget_refresh"

        /**
         * Schedules a periodic 15-minute update, with an initial delay aligned
         * to the next :00/:15/:30/:45 boundary.
         */
        fun schedule(context: Context) {
            val intervalMs     = TimeUnit.MINUTES.toMillis(15)
            val now            = System.currentTimeMillis()
            val nextBoundaryMs = ((now / intervalMs) + 1) * intervalMs
            val initialDelayMs = nextBoundaryMs - now

            val request = PeriodicWorkRequestBuilder<WidgetRefreshWorker>(
                15, TimeUnit.MINUTES,
            )
                .setInitialDelay(initialDelayMs, TimeUnit.MILLISECONDS)
                .setConstraints(Constraints.Builder().build())
                .build()

            WorkManager.getInstance(context).enqueueUniquePeriodicWork(
                WORK_NAME,
                ExistingPeriodicWorkPolicy.UPDATE,
                request,
            )
        }

        fun cancel(context: Context) {
            WorkManager.getInstance(context).cancelUniqueWork(WORK_NAME)
        }
    }
}
