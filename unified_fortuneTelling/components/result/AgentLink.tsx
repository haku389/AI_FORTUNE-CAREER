'use client'

import { trackEvent } from '@/lib/gtag'

type AgentMatch = { name: string; url: string; desc: string; luna: string }

export default function AgentLink({ agent }: { agent: AgentMatch }) {
  return (
    <a
      href={agent.url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => trackEvent('affiliate_click', { name: agent.name, source: 'premium_saved' })}
      style={{
        display: 'block',
        background: '#111c36',
        border: '1px solid #2a3f72',
        borderRadius: 10,
        padding: '12px 14px',
        textDecoration: 'none',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
        <span style={{ fontSize: 13, color: '#a898f8', fontWeight: 700 }}>{agent.name}</span>
        <span style={{ fontSize: 10, color: '#3a4870' }}>→ 詳細を見る</span>
      </div>
      <div style={{ fontSize: 10, color: '#7888b8', marginBottom: 6 }}>{agent.desc}</div>
      <div style={{ fontSize: 11, color: '#dde4f8', lineHeight: 1.6 }}>🌙 {agent.luna}</div>
    </a>
  )
}
