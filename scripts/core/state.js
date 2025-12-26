import { loadJSON, saveJSON } from "./storage.js";

const KEY = "duo_state_v1";

const defaultState = {
  user: { name: "", username: "", email: "", signedIn: false },
  settings: {
    soundEffects: true,
    animations: true,
    motivationalMessages: true,
    listeningExercises: false,
  },
  onboarding: { goal: null },
  dashboard: { mode: null, streak: 0 },
};

export function getState() {
  return loadJSON(KEY, defaultState);
}

export function setState(patch) {
  const prev = getState();
  const next = deepMerge(prev, patch);
  saveJSON(KEY, next);
  return next;
}

export function resetState() {
  saveJSON(KEY, defaultState);
  return defaultState;
}

function deepMerge(a, b) {
  if (Array.isArray(a) || Array.isArray(b)) return b ?? a;
  if (typeof a !== "object" || a === null) return b ?? a;
  if (typeof b !== "object" || b === null) return a;

  const out = { ...a };
  for (const k of Object.keys(b)) {
    out[k] = deepMerge(a[k], b[k]);
  }
  return out;
}
