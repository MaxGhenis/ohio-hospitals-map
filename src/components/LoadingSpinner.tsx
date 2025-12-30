export function LoadingSpinner() {
  return (
    <div className="absolute inset-0 bg-paper flex flex-col items-center justify-center z-50">
      <div className="w-10 h-10 border-[3px] border-paper-warm border-t-teal-600 rounded-full animate-spin" />
      <p className="mt-4 text-sm text-ink-muted">Loading hospitals...</p>
    </div>
  );
}
