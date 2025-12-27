import { load, save, clear } from "./storage.js";

const defaults = {
  user: { name: "", username: "", email: "" },
  onboarding: { goal: null },
  dashboard: { mode: null },
  settings: {
    sound: true,
    animations: true,
    motivational: true,
    listening: false,
  },
};

function merge(base, patch) {
  const out = Array.isArray(base) ? [...base] : { ...base };
  for (const k of Object.keys(patch || {})) {
    const bv = base?.[k];
    const pv = patch[k];
    if (bv && typeof bv === "object" && !Array.isArray(bv) && pv && typeof pv === "object" && !Array.isArray(pv)) {
      out[k] = merge(bv, pv);
    } else {
      out[k] = pv;
    }
  }
  return out;
}

let state = merge(defaults, load() || {});

export function getState() {
  return state;
}

export function setState(patch) {
  state = merge(state, patch);
  save(state);
  return state;
}

export function resetState() {
  state = merge(defaults, {});
  clear();
  save(state);
  return state;
}
