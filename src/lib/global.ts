// src/lib/global.ts

/**
 * Returns the base URL for API requests.
 * @returns A string URL
 */
export function global_base_url(): string {
  const urlLocal = "http://127.0.0.1:8000";
  // const urlRemote = "https://oriented-frank-airedale.ngrok-free.app";
  const serverUrl = "";

  // For now we always return the local URL.
  return urlLocal;
}