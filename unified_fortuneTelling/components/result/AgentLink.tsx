'use client'

import { trackEvent } from '@/lib/gtag'
import { MatchedAgent } from '@/lib/affiliateAgents'

export default function AgentLink({ agent }: { agent: MatchedAgent }) {
  return (
    <a
      href={agent.destinationUrl}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => trackEvent('affiliate_click', { name: agent.programName, source: 'premium_saved' })}
      style={{
        display: 'block',
        background: '#111c36',
        border: '1px solid #2a3f72',
        borderRadius: 10,
        padding: '12px 14px',
        textDecoration: 'none',
      }}
    >
      <div style={{ fontSize: 13, color: '#a898f8', fontWeight: 700, marginBottom: 4 }}>{agent.programName}</div>
      <p style={{ fontSize: 11, color: '#dde4f8', lineHeight: 1.6, margin: 0 }}>{agent.recommendReason}</p>
    </a>
  )
}
