import { GenerationHistoryItem } from '../types/tts';

const DB_NAME = 'AuraVoiceDB';
const DB_VERSION = 1;
const STORE_NAME = 'generations';
const MAX_STORED_ITEMS = 30;

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB not supported'));
      return;
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Safely saves a generation history item into IndexedDB.
 * Retains audioData without exceeding browser LocalStorage 5MB quota.
 */
export async function saveHistoryItemToDB(item: GenerationHistoryItem): Promise<void> {
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);

    store.put(item);

    return new Promise((resolve, reject) => {
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch (err) {
    console.warn('Could not save audio to IndexedDB:', err);
  }
}

/**
 * Loads all generation items sorted by timestamp descending.
 */
export async function loadHistoryFromDB(): Promise<GenerationHistoryItem[]> {
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const request = store.getAll();

    return new Promise((resolve) => {
      request.onsuccess = () => {
        const results: GenerationHistoryItem[] = request.result || [];
        results.sort((a, b) => b.timestamp - a.timestamp);
        resolve(results.slice(0, MAX_STORED_ITEMS));
      };
      request.onerror = () => resolve([]);
    });
  } catch (err) {
    console.warn('Could not load history from IndexedDB:', err);
    return [];
  }
}

/**
 * Deletes a single item by ID from IndexedDB.
 */
export async function deleteHistoryItemFromDB(id: string): Promise<void> {
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    tx.objectStore(STORE_NAME).delete(id);
  } catch (err) {
    console.warn('Could not delete from IndexedDB:', err);
  }
}

/**
 * Clears all stored generations from IndexedDB.
 */
export async function clearHistoryFromDB(): Promise<void> {
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    tx.objectStore(STORE_NAME).clear();
  } catch (err) {
    console.warn('Could not clear IndexedDB:', err);
  }
}

/**
 * Strips huge audio data for safe localStorage backup (metadata only).
 * Ensures localStorage never throws quota exceeded errors.
 */
export function safeSaveMetadataToLocalStorage(items: GenerationHistoryItem[]): void {
  try {
    // Only store lightweight metadata, omitting big base64 audioData
    const lightweightItems = items.slice(0, 15).map(({ audioData: _omit, ...meta }) => meta);
    localStorage.setItem('elevenvoice_history_meta', JSON.stringify(lightweightItems));
    // Clean up old oversized item if present
    localStorage.removeItem('elevenvoice_history');
  } catch (e) {
    // Silently ignore or clean up if even metadata exceeds storage
    try {
      localStorage.removeItem('elevenvoice_history');
      localStorage.removeItem('elevenvoice_history_meta');
    } catch {
      // Ignore
    }
  }
}
