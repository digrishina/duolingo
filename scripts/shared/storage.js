const KEY = "duolino_app_v1";

export function load() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function save(data) {
  localStorage.setItem(KEY, JSON.stringify(data));
}

export function clear() {
  localStorage.removeItem(KEY);
}
