package com.serialapp

import android.accessibilityservice.AccessibilityService
import android.view.accessibility.AccessibilityEvent
import android.view.accessibility.AccessibilityNodeInfo

class UsbAutoConfirmService : AccessibilityService() {

  override fun onAccessibilityEvent(event: AccessibilityEvent?) {
    if (event == null) return

    // SystemUI에서 뜨는 권한 팝업만 타겟
    val pkg = event.packageName?.toString() ?: return
    if (pkg != "com.android.systemui") return

    val root = rootInActiveWindow ?: return

    val keywords = listOf(
      "허용", "확인", "항상 허용", // 한국어
      "Allow", "OK", "Always"      // 영어 대비
    )

    for (k in keywords) {
      val nodes: List<AccessibilityNodeInfo> = root.findAccessibilityNodeInfosByText(k) ?: emptyList()
      for (n in nodes) {
        // 노드 자체가 클릭 가능하면 클릭
        if (n.isClickable) {
          n.performAction(AccessibilityNodeInfo.ACTION_CLICK)
          return
        }
        // 부모가 클릭 가능할 수도 있어서 위로 탐색
        var p = n.parent
        while (p != null) {
          if (p.isClickable) {
            p.performAction(AccessibilityNodeInfo.ACTION_CLICK)
            return
          }
          p = p.parent
        }
      }
    }
  }

  override fun onInterrupt() {
    // no-op
  }
}
