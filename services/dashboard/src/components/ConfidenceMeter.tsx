export function ConfidenceMeter({ value, autoMerge = 0.86, review = 0.62 }: { value: number; autoMerge?: number; review?: number }) {
  return <div style={{ width: 240, height: 8, background: "#eee", position: "relative" }}>
    <div style={{ width: `${value * 100}%`, height: "100%", background: value >= autoMerge ? "#1aae5a" : value >= review ? "#e8a30b" : "#c93232" }} />
  </div>;
}
