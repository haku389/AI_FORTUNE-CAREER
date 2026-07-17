'use client'

import { useEffect } from 'react'
import { trackEvent } from '@/lib/gtag'
import { trackAgentEvent } from '@/lib/agentAnalyticsClient'
import { MatchedAgent } from '@/lib/affiliateAgents'

export default function AgentLink({
  agent,
  diagnoseId,
  source = 'premium_saved',
}: {
  agent: MatchedAgent
  diagnoseId?: string
  source?: string
}) {
  useEffect(() => {
    trackAgentEvent(agent.programName, 'impression', { diagnoseId, source })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [agent.programName])

  return (
    <a
      href={agent.destinationUrl}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => {
        trackEvent('affiliate_click', { name: agent.programName, source })
        trackAgentEvent(agent.programName, 'click', { diagnoseId, source })
      }}
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
