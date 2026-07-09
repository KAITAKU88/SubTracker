#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
# shellcheck source=/dev/null
source "$ROOT/scripts/android-env.sh"
ANDROID_DIR="$ROOT/android"
APK_DEBUG="$ANDROID_DIR/app/build/outputs/apk/debug/app-debug.apk"
APK_RELEASE="$ANDROID_DIR/app/build/outputs/apk/release/app-release.apk"

pick_sdk() {
  if [[ -n "${ANDROID_HOME:-}" && -d "$ANDROID_HOME" ]]; then
    echo "$ANDROID_HOME"
    return
  fi
  if [[ -n "${ANDROID_SDK_ROOT:-}" && -d "$ANDROID_SDK_ROOT" ]]; then
    echo "$ANDROID_SDK_ROOT"
    return
  fi
  local candidates=(
    "$HOME/Android/Sdk"
    "/mnt/c/Users/$USER/AppData/Local/Android/Sdk"
    "/mnt/c/Android/Sdk"
  )
  for path in "${candidates[@]}"; do
    if [[ -d "$path" ]]; then
      echo "$path"
      return
    fi
  done
  return 1
}

require_java() {
  if ! command -v java >/dev/null 2>&1; then
    echo "❌ Chưa có Java. Cài JDK 17:"
    echo "   sudo apt install openjdk-17-jdk"
    echo "   Hoặc cài Android Studio (kèm JDK)."
    exit 1
  fi
}

write_local_properties() {
  local sdk
  if ! sdk="$(pick_sdk)"; then
    echo "❌ Chưa tìm thấy Android SDK."
    echo "   1) Cài Android Studio: https://developer.android.com/studio"
    echo "   2) Mở SDK Manager, cài Android SDK Platform 35 + Build-Tools"
    echo "   3) Đặt biến môi trường:"
    echo "      export ANDROID_HOME=\$HOME/Android/Sdk"
    echo "      export PATH=\$PATH:\$ANDROID_HOME/platform-tools"
    exit 1
  fi
  printf 'sdk.dir=%s\n' "$(echo "$sdk" | sed 's/\\/\\\\/g')" > "$ANDROID_DIR/local.properties"
  echo "✓ ANDROID SDK: $sdk"
}

build_variant="${1:-release}"

require_java

if [[ ! -d "$ANDROID_DIR" ]]; then
  echo "→ Chạy expo prebuild..."
  (cd "$ROOT" && npx expo prebuild --platform android)
fi

write_local_properties

echo "→ Build APK ($build_variant)..."
if [[ "$build_variant" == "debug" ]]; then
  (cd "$ANDROID_DIR" && ./gradlew assembleDebug)
  echo ""
  echo "✅ Xong: $APK_DEBUG"
else
  (cd "$ANDROID_DIR" && ./gradlew assembleRelease)
  echo ""
  echo "✅ Xong: $APK_RELEASE"
fi

echo ""
echo "Cài lên điện thoại (bật USB debugging):"
echo "  adb install -r <đường-dẫn-apk>"
