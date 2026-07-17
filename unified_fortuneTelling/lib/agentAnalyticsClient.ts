export function trackAgentEvent(
  programName: string,
  eventType: 'impression' | 'click',
  opts?: { diagnoseId?: string | null; source?: string }
) {
  fetch('/api/analytics/track-agent', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      program_name: programName,
      event_type: eventType,
      diagnose_id: opts?.diagnoseId ?? undefined,
      source: opts?.source,
    }),
    keepalive: true,
  }).catch(() => {})
}
