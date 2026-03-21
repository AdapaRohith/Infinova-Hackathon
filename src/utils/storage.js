const STORAGE_KEY = 'powf-candidates'

export const loadCandidates = () => {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    return JSON.parse(raw)
  } catch {
    return []
  }
}

export const saveCandidates = (candidates) => {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(candidates))
  } catch {
    // ignore storage errors
  }
}
