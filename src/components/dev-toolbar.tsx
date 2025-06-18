export const DevToolbar = ({
  loadTime,
  requestCount,
  renderType,
  cacheStatus,
  cacheHitCount,
}: {
  loadTime: number;
  requestCount: number;
  renderType: string;
  cacheStatus?: string;
  cacheHitCount?: number;
}) => {
  return (
    <div className="fixed top-0 left-0 right-0 bg-green-500 text-white p-2 text-sm z-50 flex justify-between">
      <span>Render: {renderType}</span>
      <span>Load Time: {loadTime.toFixed(0)} ms</span>
      <span>Request Count: {requestCount}</span>
      {cacheStatus && <span>Cache Status: {cacheStatus}</span>}
      {cacheHitCount !== undefined && (
        <span>Cache Hit Count: {cacheHitCount}</span>
      )}
    </div>
  );
};
