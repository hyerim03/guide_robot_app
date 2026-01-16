package com.serialapp

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.util.Log

class DirectBootReceiver : BroadcastReceiver() {
  override fun onReceive(context: Context, intent: Intent) {
    if (intent.action == Intent.ACTION_LOCKED_BOOT_COMPLETED) {
      // 여기서 React Native 실행하면 안 됨.
      Log.i("SerialApp", "LOCKED_BOOT_COMPLETED received")
      // 필요하면 아주 최소 작업만 (DE 저장소만)
    }
  }
}
