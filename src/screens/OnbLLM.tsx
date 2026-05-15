import React, { useState } from 'react'
import { Icon } from '../components/Icon'
import { ProgressDots } from '../components/ProgressDots'
import { SegmentedToggle } from '../components/Toggle'
import type { Setup } from '../types'

interface OnbLLMProps {
  onBack: () => void
  onFinish: (data: Partial<Setup>) => void
}

export function OnbLLM({ onBack, onFinish }: OnbLLMProps) {
  const [mode, setMode] = useState<'cloud' | 'local'>('cloud')
  const [provider, setProvider] = useState<'claude' | 'openai'>('claude')
  const [ollamaModel, setOllamaModel] = useState('mistral')

  function handleFinish() {
    onFinish({
      provider,
      useLocal: mode === 'local',
      ollamaModel: ollamaModel.trim() || 'mistral',
    })
  }

  return (
    <div
      style={{
        minHeight: '100dvh',
        backgroundColor: 'var(--bg)',
        display: 'flex',
        flexDirection: 'column',
        animation: 'st-fade-in 0.3s ease both',
      }}
    >
      {/* Top bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px 20px',
        }}
      >
        <button onClick={onBack} style={{ padding: 4 }}>
          <Icon name="chevron-left" size={24} color="var(--ink70)" />
        </button>
        <ProgressDots total={3} filled={3} />
        <div style={{ width: 32 }} />
      </div>

      {/* Content */}
      <div style={{ flex: 1, padding: '12px 24px 40px', overflowY: 'auto' }}>
        <div
          style={{
            fontFamily: "var(--sans)",
            fontSize: 11,
            fontWeight: 500,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: 'var(--ink50)',
            marginBottom: 10,
          }}
        >
          Step 3 of 3
        </div>
        <h1
          style={{
            fontFamily: "var(--serif)",
            fontSize: 30,
            fontWeight: 400,
            lineHeight: 1.15,
            color: 'var(--ink)',
            marginBottom: 8,
          }}
        >
          Where should stories come from?
        </h1>
        <p
          style={{
            fontFamily: "var(--serif)",
            fontSize: 16,
            color: 'var(--ink50)',
            lineHeight: 1.5,
            marginBottom: 28,
          }}
        >
          Connect an AI to generate stories. Everything else stays on your device.
        </p>

        {/* Mode toggle */}
        <div style={{ marginBottom: 28 }}>
          <SegmentedToggle
            options={[
              { label: 'Cloud (API)', value: 'cloud' },
              { label: 'Local (Ollama)', value: 'local' },
            ]}
            value={mode}
            onChange={v => setMode(v as 'cloud' | 'local')}
          />
        </div>

        {mode === 'cloud' ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            {/* Provider */}
            <div>
              <label
                style={{
                  display: 'block',
                  fontFamily: "var(--sans)",
                  fontSize: 12,
                  fontWeight: 500,
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  color: 'var(--ink50)',
                  marginBottom: 8,
                }}
              >
                Provider
              </label>
              <select
                value={provider}
                onChange={e => setProvider(e.target.value as 'claude' | 'openai')}
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  borderRadius: 12,
                  border: '1px solid var(--ink15)',
                  backgroundColor: 'var(--bg2)',
                  fontFamily: "var(--sans)",
                  fontSize: 15,
                  color: 'var(--ink)',
                  appearance: 'none',
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2376705f' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 14px center',
                }}
              >
                <option value="claude">Anthropic · Claude Sonnet</option>
                <option value="openai">OpenAI · GPT-4o</option>
              </select>
            </div>
          </div>
        ) : (
          <div>
            <div style={{ marginTop: 0 }}>
              <label
                style={{
                  display: 'block',
                  fontFamily: "var(--sans)",
                  fontSize: 12,
                  fontWeight: 500,
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  color: 'var(--ink50)',
                  marginBottom: 8,
                }}
              >
                Model name
              </label>
              <input
                type="text"
                value={ollamaModel}
                onChange={e => setOllamaModel(e.target.value)}
                placeholder="mistral"
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  borderRadius: 12,
                  border: '1px solid var(--ink15)',
                  backgroundColor: 'var(--bg2)',
                  fontFamily: "var(--sans)",
                  fontSize: 15,
                  color: 'var(--ink)',
                }}
              />
              <div style={{ marginTop: 6, fontFamily: "var(--sans)", fontSize: 12, color: 'var(--ink50)' }}>
                Must match exactly what `ollama list` shows — e.g. mistral:latest, llama3.1, qwen2.5-coder:7b
              </div>
            </div>
          </div>
        )}

        {/* Privacy card */}
        <div
          style={{
            marginTop: 28,
            padding: '16px',
            borderRadius: 14,
            backgroundColor: 'var(--bg2)',
            display: 'flex',
            gap: 12,
            alignItems: 'flex-start',
          }}
        >
          <Icon name="eye" size={20} color="var(--accent2)" style={{ flexShrink: 0, marginTop: 1 }} />
          <p
            style={{
              fontFamily: "var(--sans)",
              fontSize: 13,
              lineHeight: 1.5,
              color: 'var(--ink70)',
            }}
          >
            Stories are generated through the app server on this network. Your data never leaves your home.
          </p>
        </div>

        {/* Finish button */}
        <button
          onClick={handleFinish}
          style={{
            width: '100%',
            height: 54,
            borderRadius: 14,
            background: 'var(--cta)',
            color: 'var(--bg)',
            fontFamily: "var(--sans)",
            fontSize: 16,
            fontWeight: 500,
            border: 'none',
            cursor: 'pointer',
            marginTop: 28,
          }}
        >
          Finish setup
        </button>
      </div>
    </div>
  )
}
