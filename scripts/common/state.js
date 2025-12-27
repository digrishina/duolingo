const KEY = 'duo_state_v1';

export const DEFAULT_STATE = {
  profile: { name: '', username: '', email: '' },
  settings: {
    sound: true,
    animations: true,
    motivational: true,
    listening: false
  },
  onboarding: { goal: '' },
  auth: { signedIn: false }
};

export const loadState = () => {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return structuredClone(DEFAULT_STATE);
    const parsed = JSON.parse(raw);
    return {
      ...structuredClone(DEFAULT_STATE),
      ...parsed,
      profile: { ...DEFAULT_STATE.profile, ...(parsed.profile || {}) },
      settings: { ...DEFAULT_STATE.settings, ...(parsed.settings || {}) },
      onboarding: { ...DEFAULT_STATE.onboarding, ...(parsed.onboarding || {}) },
      auth: { ...DEFAULT_STATE.auth, ...(parsed.auth || {}) }
    };
  } catch {
    return structuredClone(DEFAULT_STATE);
  }
};

export const saveState = (state) => {
  localStorage.setItem(KEY, JSON.stringify(state));
};

export const updateState = (patch) => {
  const current = loadState();
  const next = {
    ...current,
    ...patch,
    profile: { ...current.profile, ...(patch.profile || {}) },
    settings: { ...current.settings, ...(patch.settings || {}) },
    onboarding: { ...current.onboarding, ...(patch.onboarding || {}) },
    auth: { ...current.auth, ...(patch.auth || {}) }
  };
  saveState(next);
  return next;
};

export const resetState = () => {
  saveState(structuredClone(DEFAULT_STATE));
};
