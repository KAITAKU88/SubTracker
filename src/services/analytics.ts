import { COUNT_API_NAMESPACE } from '../config/app';
import { getStoredItem, setStoredItem } from '../storage/adapter';

const INSTALL_REGISTERED_KEY = '@subtracker/install_registered';

function countApiUrl(action: 'hit' | 'get', key: string): string {
  return `https://api.countapi.xyz/${action}/${COUNT_API_NAMESPACE}/${key}`;
}

/** Ghi nhận 1 người dùng mới (gọi khi thêm subscription lần đầu trên thiết bị). */
export async function registerActiveUserIfNew(): Promise<void> {
  const registered = await getStoredItem(INSTALL_REGISTERED_KEY);
  if (registered === '1') return;

  try {
    const res = await fetch(countApiUrl('hit', 'active-users'));
    if (res.ok) {
      await setStoredItem(INSTALL_REGISTERED_KEY, '1');
    }
  } catch {
    // Không chặn luồng chính nếu mạng lỗi
  }
}
