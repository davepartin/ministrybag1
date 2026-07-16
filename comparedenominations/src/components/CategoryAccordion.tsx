import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import type { Category, Denomination } from '../data';
import { SpectrumBar } from './SpectrumBar';

interface CategoryAccordionProps {
  category: Category;
  denomA: Denomination;
  denomB: Denomination;
}

export function CategoryAccordion({ category, denomA, denomB }: CategoryAccordionProps) {
  const [isOpen, setIsOpen] = useState(false);
  const scoreA = denomA.scores[category.id];
  const scoreB = denomB.scores[category.id];
  const gap = Math.abs(scoreA - scoreB);
  const alignment = gap === 0 ? 'Same placement' : gap === 1 ? 'Closely aligned' : gap === 2 ? 'Meaningful difference' : 'Major difference';

  return (
    <article className="overflow-hidden rounded-3xl border border-stone-200 bg-[#fffdf8] shadow-[0_1px_2px_rgba(28,25,23,0.04)] transition hover:border-stone-300 hover:shadow-md">
      <button
        type="button"
        className="w-full p-5 text-left focus:outline-none focus-visible:ring-4 focus-visible:ring-inset focus-visible:ring-amber-200 sm:p-6"
        onClick={() => setIsOpen((current) => !current)}
        aria-expanded={isOpen}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="font-serif text-xl font-bold text-stone-950 sm:text-2xl">{category.name}</h3>
            <p className="mt-1 text-sm leading-relaxed text-stone-500">{category.question}</p>
          </div>
          <span className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${gap <= 1 ? 'bg-emerald-50 text-emerald-700' : gap === 2 ? 'bg-amber-50 text-amber-800' : 'bg-rose-50 text-rose-700'}`}>
            {alignment}
          </span>
        </div>

        <SpectrumBar
          scoreA={scoreA}
          scoreB={scoreB}
          denomA={denomA}
          denomB={denomB}
          leftLabel={category.leftLabel}
          rightLabel={category.rightLabel}
        />

        <span className="mt-1 flex items-center justify-center gap-1 text-xs font-bold text-stone-500">
          {isOpen ? 'Hide placement notes' : 'Explain these placements'}
          <ChevronDown size={15} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </span>
      </button>

      {isOpen && (
        <div className="grid border-t border-stone-200 bg-stone-50/70 sm:grid-cols-2">
          {[{ denomination: denomA, score: scoreA }, { denomination: denomB, score: scoreB }].map(({ denomination, score }, index) => (
            <div key={denomination.id} className={`p-5 sm:p-6 ${index === 1 ? 'border-t border-stone-200 sm:border-l sm:border-t-0' : ''}`}>
              <div className="mb-3 flex items-center gap-2">
                <span className="h-3 w-3 rounded-full" style={{ backgroundColor: denomination.color }} />
                <h4 className="text-sm font-extrabold text-stone-900">{denomination.shortName}</h4>
              </div>
              <p className="text-sm leading-relaxed text-stone-600">{category.steps[score - 1]}</p>
            </div>
          ))}
        </div>
      )}
    </article>
  );
}
