/**
 * URL công khai — cố định, không đổi khi phát hành bản mới.
 *
 * APK: GitHub luôn redirect /releases/latest/download/<tên-file> → bản Release mới nhất.
 * Điều kiện: mỗi lần release phải upload file cùng tên APK_ASSET_NAME (vd. subtracker.apk).
 * Xem: npm run release:apk -- v1.1.0
 */
export const LANDING_PAGE_URL =
  'https://kaitaku88.github.io/SubTracker/';

/** Tên file APK trên GitHub Releases — phải giữ nguyên mọi phiên bản. */
export const APK_ASSET_NAME = 'subtracker.apk';

/** Link tải APK cố định (trỏ tới release mới nhất). */
export const APK_DOWNLOAD_URL =
  `https://github.com/KAITAKU88/SubTracker/releases/latest/download/${APK_ASSET_NAME}`;

/** Namespace CountAPI — dùng chung giữa landing page và app. */
export const COUNT_API_NAMESPACE = 'subtracker';

export const SHARE_TITLE = 'SubTracker';

export const SHARE_MESSAGE =
  'SubTracker — theo dõi chi phí subscription hàng tháng. Miễn phí, không quảng cáo.';
