export function readStorage(key, fallback) {
  try { const value = localStorage.getItem(key); return value ? JSON.parse(value) : fallback; } catch { return fallback; }
}
export function writeStorage(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* localStorage can be unavailable in strict modes */ }
}
