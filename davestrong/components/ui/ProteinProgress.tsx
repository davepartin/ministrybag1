export function ProteinProgress({ total, target }: { total: number; target: number }) {
  const percent = Math.min(100, Math.round((total / target) * 100));
  const remaining = Math.max(0, target - total);

  return (
    <div className="space-y-3">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="label">Protein today</p>
          <p className="mt-1 text-3xl font-bold text-ink">{total}g</p>
        </div>
        <p className="text-sm font-semibold text-stone-600">{remaining}g remaining</p>
      </div>
      <div className="h-3 overflow-hidden rounded-full bg-stone-200">
        <div className="h-full rounded-full bg-moss transition-all" style={{ width: `${percent}%` }} />
      </div>
      <p className="text-sm text-stone-600">Protein helps rebuild strength. Hit the protein target before worrying about perfect dieting.</p>
    </div>
  );
}
