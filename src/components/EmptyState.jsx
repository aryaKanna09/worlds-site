export default function EmptyState() {
  return (
    <div className="flex flex-col items-center gap-3 border border-hairline px-6 py-20">
      <p className="label-mono text-sm text-gray-mid">NO WORLDS MATCH</p>
      <p className="font-mono text-xs tracking-[0.08em] text-gray-mid">
        Try a different search or clear the filters.
      </p>
    </div>
  );
}
