package com.serialapp

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.util.Log

class UserUnlockedReceiver : BroadcastReceiver() {
  override fun onReceive(context: Context, intent: Intent) {
    if (intent.action == Intent.ACTION_USER_UNLOCKED) {
      Log.i("SerialApp", "USER_UNLOCKED received -> launching app")
      val launch = context.packageManager.getLaunchIntentForPackage(context.packageName)
      launch?.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_SINGLE_TOP)
      context.startActivity(launch)
    }
  }
}
