import { useEffect, useState } from 'react'
import { runAgent } from '../agent/agentLoop'
import { CAPABILITIES } from '../agent/capabilities'
import { getApiKey, setApiKey, hasApiKey, clearApiKey } from '../agent/anthropicClient'

// ─────────────────────────────────────────────────────────────────────────────
// Insights Agent — slide-out panel.
//
// V1 scope:
//   - BYO Anthropic API key (stored in localStorage)
//   - Four capability buttons (2 live, 2 "coming next")
//   - Live event stream from the agent loop (tool calls, web searches, text)
//   - Output renderer with markdown-light formatting and source citations
//
// Audience: Logic20/20 consultants only. Not client-facing.
// ─────────────────────────────────────────────────────────────────────────────

const PANEL_W = 460

export default function InsightsAgentPanel({ open, onClose, engagement, composite, recommendations }) {
  const [events, setEvents]               = useState([])
  const [running, setRunning]             = useState(false)
  const [error, setError]                 = useState(null)
  const [activeCapability, setActive]     = useState(null)
  const [keyConfigured, setKeyConfigured] = useState(hasApiKey())
  const [showSettings, setShowSettings]   = useState(false)
  // Conversation messages — persisted across turns so chat can continue from where a
  // capability run left off. Cleared on Back / new capability click.
  const [conversation, setConversation]   = useState([])
  const [chatInput, setChatInput]         = useState('')

  // Re-evaluate key status whenever the settings modal closes
  useEffect(() => { if (!showSettings) setKeyConfigured(hasApiKey()) }, [showSettings])

  // Shared submit path used by both capability buttons and the chat textbox.
  // When `priorMessages` is provided, the agent loop continues from that state;
  // otherwise it starts fresh.
  const submitToAgent = async (userMessage, { priorMessages = [], isCapability = false } = {}) => {
    if (!hasApiKey()) { setShowSettings(true); return }
    if (!userMessage?.trim()) return

    if (!isCapability && priorMessages.length === 0) {
      // First chat message with no prior capability — clear panel state.
      setEvents([])
      setError(null)
    }
    setRunning(true)

    try {
      const result = await runAgent({
        userMessage,
        priorMessages,
        engagement,
        composite,
        recommendations,
        onEvent: (evt) => setEvents(prev => [...prev, evt]),
      })
      // Persist updated conversation so follow-up chat can continue from here.
      if (result?.messages) setConversation(result.messages)
    } catch (e) {
      setError(e?.message || String(e))
    } finally {
      setRunning(false)
    }
  }

  const runCapability = async (key) => {
    const cap = CAPABILITIES[key]
    if (!cap || cap.status !== 'live' || !cap.prompt) return
    setActive(key)
    setEvents([])
    setConversation([])
    setError(null)
    await submitToAgent(cap.prompt, { isCapability: true })
  }

  const sendChat = async () => {
    const text = chatInput.trim()
    if (!text || running) return
    setChatInput('')
    await submitToAgent(text, { priorMessages: conversation, isCapability: false })
  }

  const resetPanel = () => {
    setEvents([])
    setConversation([])
    setError(null)
    setActive(null)
    setChatInput('')
  }

  if (!open) return null

  return (
    <>
      {/* Backdrop — click to close */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.4)',
          zIndex: 200,
        }}
      />

      {/* Panel */}
      <aside
        style={{
          position: 'fixed', top: 0, right: 0, bottom: 0, width: PANEL_W,
          background: '#FFFFFF', zIndex: 201,
          boxShadow: '-8px 0 24px rgba(15,23,42,0.18)',
          display: 'flex', flexDirection: 'column',
          fontFamily: 'inherit',
        }}
        aria-label="Insights Agent"
        role="complementary"
      >
        {/* Header */}
        <div style={{
          padding: '14px 18px',
          background: 'linear-gradient(135deg, #003D7A 0%, #5C2D91 100%)',
          color: 'white',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8,
        }}>
          <div>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', opacity: 0.85 }}>
              INSIGHTS AGENT  ·  INTERNAL TOOL
            </div>
            <div style={{ fontSize: 15, fontWeight: 700, marginTop: 2 }}>
              {engagement.company.name}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 4 }}>
            <button
              onClick={() => setShowSettings(true)}
              title="API key settings"
              style={iconBtnStyle}
              aria-label="Settings"
            >
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="3"/>
                <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 11-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 11-4 0v-.09a1.65 1.65 0 00-1-1.51 1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 11-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 110-4h.09a1.65 1.65 0 001.51-1 1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 112.83-2.83l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 114 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 112.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 110 4h-.09a1.65 1.65 0 00-1.51 1z"/>
              </svg>
            </button>
            <button onClick={onClose} title="Close panel" style={iconBtnStyle} aria-label="Close">
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* No-key state */}
        {!keyConfigured && !showSettings && (
          <div style={{ padding: 18 }}>
            <div style={{
              padding: 14, background: '#FEF3C7', border: '1px solid #FDE68A',
              borderRadius: 6, fontSize: 12, color: '#78350F', lineHeight: 1.5,
            }}>
              <strong>API key needed.</strong> Paste your Anthropic API key in settings to enable the agent. (BYO key for V1 — internal Logic20/20 tool.)
            </div>
            <button
              onClick={() => setShowSettings(true)}
              style={{
                ...primaryBtnStyle, marginTop: 12, width: '100%',
              }}
            >
              Open settings
            </button>
          </div>
        )}

        {/* Capability list — shown when idle and no events */}
        {keyConfigured && !running && events.length === 0 && (
          <div style={{ padding: '14px 16px', overflowY: 'auto', flex: 1 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#64748B', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 8 }}>
              Pick a workflow
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {Object.entries(CAPABILITIES).map(([key, cap]) => {
                const live = cap.status === 'live'
                return (
                  <button
                    key={key}
                    onClick={() => runCapability(key)}
                    disabled={!live}
                    style={{
                      textAlign: 'left',
                      padding: '12px 14px',
                      border: `1px solid ${live ? '#BFDBFE' : '#E2E8F0'}`,
                      background: live ? '#F0F9FF' : '#F8FAFC',
                      borderRadius: 6,
                      cursor: live ? 'pointer' : 'not-allowed',
                      fontFamily: 'inherit',
                      transition: 'all 0.15s',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: live ? '#0F172A' : '#94A3B8' }}>
                        {cap.label}
                      </div>
                      <span style={{
                        padding: '1px 6px', borderRadius: 99, fontSize: 9, fontWeight: 700,
                        background: live ? '#D1FAE5' : '#F1F5F9',
                        color:      live ? '#065F46' : '#94A3B8',
                      }}>
                        {live ? 'READY' : 'COMING NEXT'}
                      </span>
                    </div>
                    <div style={{ fontSize: 11, color: '#64748B', lineHeight: 1.45 }}>
                      {cap.description}
                    </div>
                  </button>
                )
              })}
            </div>

            {/* Free-text starter — alternative to capability buttons */}
            <div style={{ marginTop: 14, padding: 12, background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 6 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#64748B', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 6 }}>
                Or ask anything
              </div>
              <ChatInput
                value={chatInput}
                onChange={setChatInput}
                onSubmit={sendChat}
                disabled={running}
                placeholder="e.g. What's our biggest blindspot? Counter-argue our Operations rec."
              />
            </div>

            <div style={{ fontSize: 10, color: '#94A3B8', marginTop: 14, lineHeight: 1.5, fontStyle: 'italic' }}>
              The agent uses your engagement data + live web search. Output is for internal use only — review and edit before sharing with the client.
            </div>
          </div>
        )}

        {/* Running / output / chat-continuation */}
        {keyConfigured && (running || events.length > 0) && (
          <>
            <div style={{
              padding: '10px 16px', borderBottom: '1px solid #E2E8F0',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8,
              background: '#F8FAFC',
            }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#0F172A' }}>
                {CAPABILITIES[activeCapability]?.label || 'Conversation'}
                {running && <span style={{ marginLeft: 8, fontSize: 10, color: '#64748B', fontWeight: 500 }}>running…</span>}
              </div>
              <button
                onClick={resetPanel}
                disabled={running}
                style={{ ...ghostBtnStyle, fontSize: 11 }}
              >
                ← Back
              </button>
            </div>

            <div style={{ overflowY: 'auto', flex: 1, padding: '12px 16px' }}>
              <AgentEventStream events={events} running={running} />
              {error && (
                <div style={{
                  marginTop: 12, padding: 10,
                  background: '#FEF2F2', border: '1px solid #FECACA',
                  borderRadius: 6, fontSize: 12, color: '#991B1B',
                }}>
                  <strong>Error:</strong> {error}
                </div>
              )}
            </div>

            {/* Chat continuation input — pinned to bottom of panel */}
            <div style={{
              padding: '10px 12px',
              borderTop: '1px solid #E2E8F0',
              background: '#FFFFFF',
            }}>
              <ChatInput
                value={chatInput}
                onChange={setChatInput}
                onSubmit={sendChat}
                disabled={running}
                placeholder={running ? 'Agent is working…' : 'Ask a follow-up question…'}
              />
            </div>
          </>
        )}

        {/* Settings modal */}
        {showSettings && (
          <APIKeySettings
            onClose={() => setShowSettings(false)}
          />
        )}
      </aside>
    </>
  )
}

// ─── Agent event stream renderer ────────────────────────────────────────────

function AgentEventStream({ events, running }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {events.map((evt, i) => <AgentEvent key={i} evt={evt} />)}
      {running && (
        <div style={{ fontSize: 11, color: '#94A3B8', fontStyle: 'italic', padding: '6px 4px' }}>
          <span className="thinking-dots">●●●</span> thinking…
        </div>
      )}
      <style>{`
        @keyframes thinking-pulse {
          0%, 100% { opacity: 0.3 }
          50%      { opacity: 1 }
        }
        .thinking-dots {
          letter-spacing: 4px;
          animation: thinking-pulse 1.2s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}

function AgentEvent({ evt }) {
  if (evt.type === 'agent_start')   return null
  if (evt.type === 'agent_end')     return null

  if (evt.type === 'user_message') {
    return (
      <div style={{
        marginTop: 8,
        padding: '8px 12px',
        background: '#003D7A',
        color: 'white',
        borderRadius: 6,
        fontSize: 12.5,
        fontWeight: 500,
        lineHeight: 1.5,
        alignSelf: 'flex-end',
        maxWidth: '92%',
      }}>
        <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.06em', opacity: 0.7, textTransform: 'uppercase', marginBottom: 3 }}>
          You
        </div>
        {/* Show only the first line for long capability prompts; full text on demand */}
        {evt.text.length > 240 ? (
          <details>
            <summary style={{ cursor: 'pointer' }}>{evt.text.slice(0, 180)}…</summary>
            <div style={{ marginTop: 6, whiteSpace: 'pre-wrap' }}>{evt.text}</div>
          </details>
        ) : (
          <div style={{ whiteSpace: 'pre-wrap' }}>{evt.text}</div>
        )}
      </div>
    )
  }

  if (evt.type === 'tool_use') {
    return (
      <div style={agentStepStyle('#1E40AF', '#DBEAFE')}>
        <div style={agentStepLabelStyle('#1E40AF')}>📊 Calling tool: {evt.name}</div>
        {evt.input && Object.keys(evt.input).length > 0 && (
          <div style={agentStepDetailStyle}>{JSON.stringify(evt.input)}</div>
        )}
      </div>
    )
  }

  if (evt.type === 'server_tool_use') {
    return (
      <div style={agentStepStyle('#9A3412', '#FFEDD5')}>
        <div style={agentStepLabelStyle('#9A3412')}>🌐 Web search: {evt.input?.query || evt.name}</div>
      </div>
    )
  }

  if (evt.type === 'tool_result') {
    return (
      <div style={agentStepStyle('#065F46', '#D1FAE5')}>
        <div style={agentStepLabelStyle('#065F46')}>✓ {evt.name} returned</div>
        <details style={{ marginTop: 4 }}>
          <summary style={{ fontSize: 10, color: '#065F46', cursor: 'pointer' }}>view data</summary>
          <pre style={{
            margin: '4px 0 0', padding: 6,
            background: '#F0FDF4', borderRadius: 4,
            fontSize: 10, color: '#065F46',
            overflowX: 'auto', whiteSpace: 'pre-wrap', wordBreak: 'break-word',
            maxHeight: 200,
          }}>{JSON.stringify(evt.result, null, 2)}</pre>
        </details>
      </div>
    )
  }

  if (evt.type === 'web_search_result') {
    const count = Array.isArray(evt.content) ? evt.content.length : 0
    return (
      <div style={agentStepStyle('#9A3412', '#FFEDD5')}>
        <div style={agentStepLabelStyle('#9A3412')}>✓ Web search returned {count} result{count !== 1 ? 's' : ''}</div>
      </div>
    )
  }

  if (evt.type === 'assistant_text') {
    return (
      <div style={{
        padding: '10px 12px', background: 'white',
        border: '1px solid #E2E8F0', borderRadius: 6,
        fontSize: 12.5, lineHeight: 1.65, color: '#0F172A',
        whiteSpace: 'pre-wrap',
      }}>
        {renderInlineMarkdown(evt.text)}
      </div>
    )
  }

  if (evt.type === 'error' || evt.type === 'tool_error') {
    return (
      <div style={agentStepStyle('#991B1B', '#FEE2E2')}>
        <div style={agentStepLabelStyle('#991B1B')}>⚠ {evt.type === 'tool_error' ? `Tool error (${evt.name})` : 'Error'}</div>
        <div style={agentStepDetailStyle}>{evt.message}</div>
      </div>
    )
  }

  return null
}

// Lightweight markdown: bold (**text**), italics (*text*), bullets (- ), headers (## )
function renderInlineMarkdown(text) {
  // Split into lines, then per line do inline transforms
  return text.split('\n').map((line, i) => {
    if (line.startsWith('## ')) {
      return <div key={i} style={{ fontSize: 14, fontWeight: 800, color: '#0F172A', margin: '8px 0 4px' }}>{transformInline(line.slice(3))}</div>
    }
    if (line.startsWith('# ')) {
      return <div key={i} style={{ fontSize: 15, fontWeight: 800, color: '#0F172A', margin: '8px 0 4px' }}>{transformInline(line.slice(2))}</div>
    }
    if (/^(-|•)\s/.test(line)) {
      return <div key={i} style={{ paddingLeft: 14, position: 'relative' }}>
        <span style={{ position: 'absolute', left: 4, color: '#64748B' }}>•</span>
        {transformInline(line.replace(/^(-|•)\s/, ''))}
      </div>
    }
    return <div key={i}>{transformInline(line)}</div>
  })
}

function transformInline(text) {
  // Bold + italic naively — split on **...** and *...* and produce React nodes
  const parts = []
  let remaining = text
  let i = 0
  while (remaining.length) {
    const bold = remaining.match(/^\*\*([^*]+)\*\*/)
    if (bold) {
      parts.push(<strong key={i++}>{bold[1]}</strong>)
      remaining = remaining.slice(bold[0].length)
      continue
    }
    const italic = remaining.match(/^\*([^*]+)\*/)
    if (italic) {
      parts.push(<em key={i++}>{italic[1]}</em>)
      remaining = remaining.slice(italic[0].length)
      continue
    }
    // Take next chunk of plain text up to the next * or end
    const next = remaining.search(/\*/)
    if (next === -1) {
      parts.push(<span key={i++}>{remaining}</span>)
      break
    }
    parts.push(<span key={i++}>{remaining.slice(0, next)}</span>)
    remaining = remaining.slice(next)
  }
  return parts
}

// ─── Chat input ────────────────────────────────────────────────────────────
//
// Auto-growing textarea with Enter-to-send (Shift+Enter for newline).
// Submit button is disabled while the agent is running or input is empty.

function ChatInput({ value, onChange, onSubmit, disabled, placeholder }) {
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      if (!disabled) onSubmit()
    }
  }

  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end' }}>
      <textarea
        value={value}
        onChange={e => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={disabled}
        rows={2}
        style={{
          flex: 1,
          padding: '8px 10px',
          fontSize: 12.5,
          fontFamily: 'inherit',
          border: '1px solid #CBD5E1',
          borderRadius: 6,
          resize: 'vertical',
          minHeight: 36,
          maxHeight: 160,
          background: disabled ? '#F1F5F9' : 'white',
          color: '#0F172A',
          lineHeight: 1.5,
          outline: 'none',
        }}
      />
      <button
        onClick={onSubmit}
        disabled={disabled || !value.trim()}
        style={{
          padding: '8px 12px',
          border: 'none',
          borderRadius: 6,
          background: disabled || !value.trim() ? '#CBD5E1' : '#003D7A',
          color: 'white',
          fontSize: 12,
          fontWeight: 700,
          cursor: disabled || !value.trim() ? 'not-allowed' : 'pointer',
          fontFamily: 'inherit',
          whiteSpace: 'nowrap',
        }}
        title="Send (Enter)"
      >
        Send
      </button>
    </div>
  )
}

// ─── API key settings ──────────────────────────────────────────────────────

function APIKeySettings({ onClose }) {
  const [val, setVal] = useState(getApiKey())
  const [saved, setSaved] = useState(false)

  const save = () => {
    setApiKey(val)
    setSaved(true)
    setTimeout(() => onClose(), 700)
  }

  return (
    <>
      <div
        onClick={onClose}
        style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.5)', zIndex: 300 }}
      />
      <div style={{
        position: 'fixed', top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        background: 'white', borderRadius: 10,
        padding: 20, width: 420, zIndex: 301,
        boxShadow: '0 12px 32px rgba(15,23,42,0.3)',
      }}>
        <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>Anthropic API Key</div>
        <div style={{ fontSize: 12, color: '#64748B', marginBottom: 14, lineHeight: 1.5 }}>
          V1 stores your key in browser localStorage. Internal Logic20/20 use only — do not enable on a shared machine.
        </div>
        <input
          type="password"
          value={val}
          onChange={e => setVal(e.target.value)}
          placeholder="sk-ant-..."
          style={{
            width: '100%', padding: '8px 12px', boxSizing: 'border-box',
            border: '1px solid #CBD5E1', borderRadius: 6,
            fontFamily: 'monospace', fontSize: 13,
          }}
        />
        <div style={{ display: 'flex', gap: 8, marginTop: 14, justifyContent: 'space-between' }}>
          <button
            onClick={() => { clearApiKey(); setVal(''); }}
            style={{ ...ghostBtnStyle, color: '#991B1B' }}
          >
            Clear
          </button>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={onClose} style={ghostBtnStyle}>Cancel</button>
            <button onClick={save} style={primaryBtnStyle} disabled={!val.trim()}>
              {saved ? '✓ Saved' : 'Save'}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

// ─── shared styles ─────────────────────────────────────────────────────────

const iconBtnStyle = {
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  width: 28, height: 28, borderRadius: 6,
  background: 'rgba(255,255,255,0.15)', border: 'none', color: 'white',
  cursor: 'pointer',
}

const primaryBtnStyle = {
  padding: '8px 14px', border: 'none', borderRadius: 6,
  background: '#003D7A', color: 'white',
  fontSize: 13, fontWeight: 700, cursor: 'pointer',
  fontFamily: 'inherit',
}

const ghostBtnStyle = {
  padding: '8px 14px', border: '1px solid #CBD5E1', borderRadius: 6,
  background: 'white', color: '#475569',
  fontSize: 12, fontWeight: 600, cursor: 'pointer',
  fontFamily: 'inherit',
}

function agentStepStyle(color, bg) {
  return {
    padding: '6px 10px', background: bg, borderRadius: 5,
    borderLeft: `3px solid ${color}`,
    fontSize: 11, color, fontFamily: 'inherit',
  }
}

function agentStepLabelStyle(color) {
  return { fontWeight: 700, color, fontSize: 11 }
}

const agentStepDetailStyle = {
  fontSize: 10, color: '#475569', marginTop: 2, fontFamily: 'monospace',
  whiteSpace: 'pre-wrap', wordBreak: 'break-word',
}
