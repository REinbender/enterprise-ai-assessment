// ─────────────────────────────────────────────────────────────────────────────
// Agent loop — handles the tool-use cycle until the model decides it's done.
//
// Anthropic's tool-use protocol: model returns either an end_turn (final
// answer) or a tool_use block (wants to call one or more tools). We execute
// the requested tools, send results back, and loop. The web_search tool is
// server-managed by Anthropic — we don't execute it ourselves; results come
// back inside the assistant message as web_search_tool_result content blocks.
//
// `onEvent` is a streaming callback so the UI can show the agent's reasoning
// step-by-step.
// ─────────────────────────────────────────────────────────────────────────────

import { buildClient, AGENT_MODEL } from './anthropicClient'
import { TOOL_DEFINITIONS, buildExecutors } from './tools'
import { buildSystemPrompt } from './systemPrompt'

const MAX_TURNS = 10  // Hard cap to prevent runaway loops.

export async function runAgent({ userMessage, engagement, composite, recommendations, onEvent }) {
  const client = buildClient()
  const executors = buildExecutors({ engagement, composite, recommendations })
  const systemPrompt = buildSystemPrompt({ engagement, composite })

  const messages = [{ role: 'user', content: userMessage }]
  const events = []

  const emit = (evt) => {
    events.push(evt)
    if (onEvent) onEvent(evt)
  }

  emit({ type: 'agent_start', message: userMessage })

  for (let turn = 0; turn < MAX_TURNS; turn++) {
    let response
    try {
      response = await client.messages.create({
        model: AGENT_MODEL,
        max_tokens: 4096,
        system: systemPrompt,
        tools: TOOL_DEFINITIONS,
        messages,
      })
    } catch (e) {
      emit({ type: 'error', message: e?.message || String(e) })
      throw e
    }

    // Emit assistant text blocks (the model's reasoning / final answer).
    for (const block of response.content) {
      if (block.type === 'text' && block.text) {
        emit({ type: 'assistant_text', text: block.text })
      } else if (block.type === 'tool_use') {
        emit({
          type: 'tool_use',
          name: block.name,
          input: block.input,
          id: block.id,
        })
      } else if (block.type === 'server_tool_use') {
        emit({
          type: 'server_tool_use',
          name: block.name,
          input: block.input,
          id: block.id,
        })
      } else if (block.type === 'web_search_tool_result') {
        emit({
          type: 'web_search_result',
          tool_use_id: block.tool_use_id,
          content: block.content,
        })
      }
    }

    if (response.stop_reason === 'end_turn' || response.stop_reason === 'stop_sequence') {
      emit({ type: 'agent_end', turns: turn + 1, events })
      return { events, finalContent: response.content }
    }

    if (response.stop_reason === 'tool_use') {
      // Append the assistant turn verbatim, then execute any client-side tools
      // and append the tool results as a user-role message.
      messages.push({ role: 'assistant', content: response.content })

      const toolUseBlocks = response.content.filter(b => b.type === 'tool_use')
      const toolResults = []

      for (const tu of toolUseBlocks) {
        const executor = executors[tu.name]
        if (!executor) {
          toolResults.push({
            type: 'tool_result',
            tool_use_id: tu.id,
            content: JSON.stringify({ error: `Unknown tool "${tu.name}"` }),
            is_error: true,
          })
          continue
        }
        try {
          const result = executor(tu.input || {})
          emit({ type: 'tool_result', name: tu.name, result })
          toolResults.push({
            type: 'tool_result',
            tool_use_id: tu.id,
            content: JSON.stringify(result),
          })
        } catch (e) {
          emit({ type: 'tool_error', name: tu.name, message: e?.message || String(e) })
          toolResults.push({
            type: 'tool_result',
            tool_use_id: tu.id,
            content: JSON.stringify({ error: e?.message || String(e) }),
            is_error: true,
          })
        }
      }

      messages.push({ role: 'user', content: toolResults })
      continue
    }

    // Unexpected stop_reason — bail out.
    emit({ type: 'unexpected_stop', stop_reason: response.stop_reason })
    break
  }

  emit({ type: 'agent_end', turns: MAX_TURNS, events, truncated: true })
  return { events, truncated: true }
}
