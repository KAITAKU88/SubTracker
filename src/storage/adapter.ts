import { Platform } from 'react-native';

interface StorageBackend {
  getItem(key: string): Promise<string | null>;
  setItem(key: string, value: string): Promise<void>;
  removeItem(key: string): Promise<void>;
}

function createWebStorage(): StorageBackend {
  return {
    getItem: async (key) => localStorage.getItem(key),
    setItem: async (key, value) => localStorage.setItem(key, value),
    removeItem: async (key) => localStorage.removeItem(key),
  };
}

function createMemoryStorage(): StorageBackend {
  const store: Record<string, string> = {};
  return {
    getItem: async (key) => store[key] ?? null,
    setItem: async (key, value) => {
      store[key] = value;
    },
    removeItem: async (key) => {
      delete store[key];
    },
  };
}

function createNativeStorage(): StorageBackend {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    return require('@react-native-async-storage/async-storage').default;
  } catch {
    return createMemoryStorage();
  }
}

function getStorage(): StorageBackend {
  if (Platform.OS === 'web' && typeof localStorage !== 'undefined') {
    return createWebStorage();
  }
  return createNativeStorage();
}

const storage = getStorage();

export async function getStoredItem(key: string): Promise<string | null> {
  return storage.getItem(key);
}

export async function setStoredItem(key: string, value: string): Promise<void> {
  await storage.setItem(key, value);
}

export async function removeStoredItem(key: string): Promise<void> {
  await storage.removeItem(key);
}
