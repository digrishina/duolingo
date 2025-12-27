const API_BASE = "http://localhost:3001/api";

async function request(url, options) {
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(data?.message || "API error");
  }

  return data;
}

export const getGoals = () => request(`${API_BASE}/goals`);

export const getOnboarding = () => request(`${API_BASE}/onboarding`);

export const saveGoal = (goal) =>
  request(`${API_BASE}/onboarding/goal`, {
    method: "PUT",
    body: JSON.stringify({ goal }),
  });
