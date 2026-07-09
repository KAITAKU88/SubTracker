#!/usr/bin/env bash
# Phát hành APK lên GitHub Releases — link tải về không đổi.
#
# Trước khi chạy:
#   1. Tăng app.json → expo.version và expo.android.versionCode
#   2. Commit thay đổi
#
# Cách dùng:
#   npm run release:apk -- v1.1.0
#   npm run release:apk -- v1.1.0 --notes "Sửa lỗi, thêm tính năng X"
#
# Link tải luôn là:
#   https://github.com/KAITAKU88/SubTracker/releases/latest/download/subtracker.apk

set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
DIST="$ROOT/dist"
APK_NAME="subtracker.apk"
REPO="KAITAKU88/SubTracker"

tag="${1:-}"
shift || true

if [[ -z "$tag" ]]; then
  echo "Cách dùng: npm run release:apk -- <tag> [--notes \"mô tả\"]"
  echo "Ví dụ:     npm run release:apk -- v1.1.0"
  exit 1
fi

notes=""
while [[ $# -gt 0 ]]; do
  case "$1" in
    --notes)
      notes="${2:-}"
      shift 2
      ;;
    *)
      echo "Tham số không hợp lệ: $1"
      exit 1
      ;;
  esac
done

if ! command -v gh >/dev/null 2>&1; then
  echo "❌ Cần GitHub CLI (gh). Cài: https://cli.github.com/"
  exit 1
fi

echo "→ Build APK release..."
bash "$ROOT/scripts/build-apk.sh" release

mkdir -p "$DIST"
cp "$ROOT/android/app/build/outputs/apk/release/app-release.apk" "$DIST/$APK_NAME"

echo ""
echo "✓ APK: $DIST/$APK_NAME"
echo "→ Tạo GitHub Release $tag..."

release_args=(release create "$tag" "$DIST/$APK_NAME" --repo "$REPO" --title "$tag")
if [[ -n "$notes" ]]; then
  release_args+=(--notes "$notes")
else
  release_args+=(--generate-notes)
fi

gh "${release_args[@]}"

echo ""
echo "✅ Xong. Link tải (không đổi):"
echo "   https://github.com/$REPO/releases/latest/download/$APK_NAME"
