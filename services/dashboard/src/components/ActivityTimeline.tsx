export function ActivityTimeline({ events }: { events: { event_type: string; occurred_at: string }[] }) {
  return <ul>{events.map((e, i) => <li key={i}>{e.occurred_at} — {e.event_type}</li>)}</ul>;
}
