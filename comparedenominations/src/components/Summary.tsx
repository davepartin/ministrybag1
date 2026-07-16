import { ArrowUpRight, Equal, Split } from 'lucide-react';
import { CATEGORIES, type Denomination } from '../data';

interface SummaryProps {
  denomA: Denomination;
  denomB: Denomination;
}

export function Summary({ denomA, denomB }: SummaryProps) {
  const ranked = CATEGORIES.map((category) => ({
    category,
    gap: Math.abs(denomA.scores[category.id] - denomB.scores[category.id]),
  }));
  const closest = [...ranked].sort((a, b) => a.gap - b.gap).slice(0, 3);
  const furthest = [...ranked].sort((a, b) => b.gap - a.gap).filter((item) => item.gap > 0).slice(0, 3);

  return (
    <section className="overflow-hidden rounded-[30px] bg-stone-950 text-white shadow-xl">
      <div className="grid gap-8 p-6 sm:p-8 lg:grid-cols-[1.2fr_1fr] lg:p-10">
        <div>
          <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.2em] text-amber-300">At a glance</p>
          <h2 className="font-serif text-3xl font-bold leading-tight sm:text-4xl">Where they’re closest. Where they’re not.</h2>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-stone-300">
            This overview compares official or representative positions. It does not measure faithfulness, and individual churches or members may land differently.
          </p>
        </div>
        <div className="grid gap-3">
          <div className="rounded-2xl bg-white/8 p-4">
            <div className="mb-3 flex items-center gap-2 text-emerald-300">
              <Equal size={18} />
              <h3 className="text-xs font-bold uppercase tracking-wider">Closest alignment</h3>
            </div>
            <p className="text-sm leading-relaxed text-stone-200">{closest.map((item) => item.category.name).join(' · ')}</p>
          </div>
          <div className="rounded-2xl bg-white/8 p-4">
            <div className="mb-3 flex items-center gap-2 text-rose-300">
              <Split size={18} />
              <h3 className="text-xs font-bold uppercase tracking-wider">Clearest differences</h3>
            </div>
            <p className="text-sm leading-relaxed text-stone-200">{furthest.length ? furthest.map((item) => item.category.name).join(' · ') : 'No major differences in this overview'}</p>
          </div>
        </div>
      </div>
      <div className="grid border-t border-white/10 sm:grid-cols-2">
        {[denomA, denomB].map((denomination, index) => (
          <div key={denomination.id} className={`p-6 sm:p-8 ${index === 1 ? 'border-t border-white/10 sm:border-l sm:border-t-0' : ''}`}>
            <div className="mb-2 flex items-center gap-2">
              <span className="h-3 w-3 rounded-full" style={{ backgroundColor: denomination.color }} />
              <h3 className="font-bold">{denomination.shortName}</h3>
            </div>
            <p className="mb-4 text-sm leading-relaxed text-stone-400">{denomination.description}</p>
            {denomination.variation && <p className="mb-4 rounded-xl bg-amber-300/10 p-3 text-xs leading-relaxed text-amber-100">{denomination.variation}</p>}
            <a href={denomination.sourceUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-300 hover:text-amber-200">
              Read the source <ArrowUpRight size={14} />
            </a>
          </div>
        ))}
      </div>
    </section>
  );
}
