export function LiveFeedViewer({ sessionId }: { sessionId: string }) {
  return <div><div>Session {sessionId}</div><video autoPlay muted style={{ width: 480 }} /></div>;
}
