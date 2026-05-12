// ─────────────────────────────────────────────────────────────────────────────
// Anthropic API client (V1 — BYO key, browser-side).
//
// V1 stores the API key in localStorage and uses dangerouslyAllowBrowser. This
// is acceptable for internal Logic20/20 consultant use, NOT for any client-
// facing scenario. V2 will move to a small server-side proxy with a central
// key + rate limiting + audit logging.
// ─────────────────────────────────────────────────────────────────────────────

import Anthropic from '@anthropic-ai/sdk'

const STORAGE_KEY = 'logic2020_anthropic_api_key'

// Default to the Sonnet model for the agent loop. Sonnet is the right balance
// of speed and capability for tool-use workflows. Opus is reserved for V2
// synthesis tasks where the longer context window pays off.
export const AGENT_MODEL = 'claude-sonnet-4-6'

export function getApiKey() {
  try { return localStorage.getItem(STORAGE_KEY) || '' }
  catch { return '' }
}

export function setApiKey(key) {
  try { localStorage.setItem(STORAGE_KEY, key.trim()) }
  catch { /* ignore */ }
}

export function clearApiKey() {
  try { localStorage.removeItem(STORAGE_KEY) }
  catch { /* ignore */ }
}

export function hasApiKey() {
  return !!getApiKey()
}

// Build a fresh Anthropic client. Always returns a client; throws if no key.
export function buildClient() {
  const apiKey = getApiKey()
  if (!apiKey) throw new Error('No Anthropic API key configured. Set one in Insights Agent settings.')
  return new Anthropic({ apiKey, dangerouslyAllowBrowser: true })
}
