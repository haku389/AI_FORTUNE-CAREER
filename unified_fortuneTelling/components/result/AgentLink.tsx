'use client'

import { trackEvent } from '@/lib/gtag'
import { MatchedAgent } from '@/lib/affiliateAgents'

export default function AgentLink({ agent }: { agent: MatchedAgent }) {
  return (
    <div
      onClick={() => trackEvent('affiliate_click', { name: agent.programName, source: 'premium_saved' })}
      style={{
        background: '#111c36',
        border: '1px solid #2a3f72',
        borderRadius: 10,
        padding: '12px 14px',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
        <span style={{ fontSize: 13, color: '#a898f8', fontWeight: 700 }}>{agent.advertiserName}</span>
        {agent.rewardText && <span style={{ fontSize: 10, color: '#3a4870' }}>{agent.rewardText}</span>}
      </div>
      <div dangerouslySetInnerHTML={{ __html: agent.adLink.rawCode }} />
    </div>
  )
}
