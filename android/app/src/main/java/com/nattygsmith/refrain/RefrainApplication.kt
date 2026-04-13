package com.nattygsmith.refrain

import android.app.Application
import com.nattygsmith.refrain.data.DataStore

/**
 * Application subclass — initialises the DataStore singleton once at startup
 * so quotes and lyrics are ready before any Activity or widget is shown.
 */
class RefrainApplication : Application() {
    override fun onCreate() {
        super.onCreate()
        DataStore.init(this)
    }
}
