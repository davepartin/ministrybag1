import { useMemo, useState } from 'react';
import { ArrowRightLeft, BookOpen, Compass, Info, Scale } from 'lucide-react';
import { CATEGORY_SETS, CATEGORIES, DENOMINATIONS, type DenominationId } from './data';
import { CategoryAccordion } from './components/CategoryAccordion';
import { DenominationBadge } from './components/DenominationBadge';
import { DenominationPicker } from './components/DenominationPicker';
import { Summary } from './components/Summary';

function getDenomination(id: DenominationId) {
  return DENOMINATIONS.find((denomination) => denomination.id === id) ?? DENOMINATIONS[0];
}

function App() {
  const [denomAId, setDenomAId] = useState<DenominationId>('sbc');
  const [denomBId, setDenomBId] = useState<DenominationId>('umc');

  const denomA = getDenomination(denomAId);
  const denomB = getDenomination(denomBId);
  const comparisonCount = CATEGORIES.length;
  const majorDifferences = useMemo(
    () => CATEGORIES.filter((category) => Math.abs(denomA.scores[category.id] - denomB.scores[category.id]) >= 3).length,
    [denomA, denomB],
  );

  const swap = () => {
    setDenomAId(denomBId);
    setDenomBId(denomAId);
  };

  return (
    <div className="min-h-screen bg-[#f5f2ea] text-stone-900">
      <header className="border-b border-stone-800 bg-stone-950 text-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <a href="#top" className="flex items-center gap-3" aria-label="Denomination Comparison Guide home">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-300 text-stone-950">
              <Compass size={22} strokeWidth={2.5} />
            </span>
            <span>
              <span className="block font-serif text-lg font-bold leading-none">Denomination Comparison Guide</span>
              <span className="mt-1 hidden text-[10px] font-bold uppercase tracking-[0.18em] text-stone-400 sm:block">A clear map of Christian traditions</span>
            </span>
          </a>
          <a href="#method" className="hidden items-center gap-2 text-sm font-semibold text-stone-300 hover:text-white sm:flex">
            <Info size={16} /> How to read this
          </a>
        </div>
      </header>

      <main id="top">
        <section className="relative overflow-hidden bg-stone-950 px-4 pb-28 pt-16 text-white sm:px-6 sm:pb-32 sm:pt-24">
          <div className="absolute left-1/2 top-0 h-[520px] w-[900px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(251,191,36,0.15),transparent_62%)]" />
          <div className="relative mx-auto max-w-4xl text-center">
            <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3.5 py-2 text-xs font-bold uppercase tracking-[0.16em] text-amber-200">
              <Scale size={15} /> Compare 12 familiar U.S. traditions
            </div>
            <h1 className="font-serif text-4xl font-bold leading-[1.04] tracking-tight sm:text-6xl lg:text-7xl">
              Compare Christian denominations, clearly.
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-stone-300 sm:text-lg">
              Choose any two traditions and see where their official teachings align, differ, or need more explanation.
            </p>
          </div>
        </section>

        <section className="relative z-10 mx-auto -mt-16 max-w-5xl px-4 sm:px-6" aria-label="Choose denominations to compare">
          <div className="rounded-[30px] border border-stone-200 bg-[#fffdf8] p-4 shadow-2xl shadow-stone-900/10 sm:p-6">
            <div className="grid items-center gap-3 md:grid-cols-[1fr_auto_1fr]">
              <DenominationPicker label="First tradition" value={denomA} excludedId={denomBId} onChange={setDenomAId} />
              <button
                type="button"
                onClick={swap}
                aria-label="Swap denominations"
                className="mx-auto flex h-11 w-11 items-center justify-center rounded-full border border-stone-200 bg-stone-100 text-stone-600 transition hover:rotate-180 hover:bg-stone-950 hover:text-white focus:outline-none focus-visible:ring-4 focus-visible:ring-amber-200 md:h-12 md:w-12"
              >
                <ArrowRightLeft size={19} />
              </button>
              <DenominationPicker label="Second tradition" value={denomB} excludedId={denomAId} onChange={setDenomBId} />
            </div>
          </div>
        </section>

        <section className="sticky top-0 z-40 mt-7 border-y border-stone-200 bg-[#fffdf8]/95 shadow-sm backdrop-blur-xl">
          <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
            <div className="flex min-w-0 items-center gap-2 sm:gap-3">
              <DenominationBadge denomination={denomA} size="sm" />
              <span className="truncate text-sm font-extrabold text-stone-900 sm:text-base">{denomA.shortName}</span>
            </div>
            <div className="shrink-0 text-center">
              <span className="block text-[9px] font-black uppercase tracking-[0.18em] text-stone-400">Compared with</span>
              <span className="mt-0.5 block text-[10px] font-bold text-stone-600">{majorDifferences} major differences</span>
            </div>
            <div className="flex min-w-0 items-center justify-end gap-2 text-right sm:gap-3">
              <span className="truncate text-sm font-extrabold text-stone-900 sm:text-base">{denomB.shortName}</span>
              <DenominationBadge denomination={denomB} size="sm" />
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
          <div className="mb-12 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.2em] text-amber-700">The comparison</p>
              <h2 className="font-serif text-3xl font-bold text-stone-950 sm:text-4xl">See where each tradition lands</h2>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-stone-600">Each marker uses the denomination’s abbreviation and color, so you never have to remember which side is “A” or “B.”</p>
            </div>
            <span className="shrink-0 rounded-full border border-stone-200 bg-white px-3 py-1.5 text-xs font-bold text-stone-500">{comparisonCount} points of comparison</span>
          </div>

          <div className="space-y-14">
            {CATEGORY_SETS.map((set) => {
              const categories = CATEGORIES.filter((category) => category.setId === set.id);
              return (
                <section key={set.id}>
                  <div className="mb-5 border-l-4 border-amber-400 pl-4">
                    <h2 className="font-serif text-2xl font-bold text-stone-950">{set.name}</h2>
                    <p className="mt-1 text-sm text-stone-500">{set.description}</p>
                  </div>
                  <div className="space-y-4">
                    {categories.map((category) => (
                      <CategoryAccordion key={category.id} category={category} denomA={denomA} denomB={denomB} />
                    ))}
                  </div>
                </section>
              );
            })}
          </div>

          <div className="mt-16">
            <Summary denomA={denomA} denomB={denomB} />
          </div>

          <section id="method" className="mt-16 scroll-mt-24 rounded-[28px] border border-stone-200 bg-white p-6 sm:p-8">
            <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
              <div>
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-amber-100 text-amber-800">
                  <BookOpen size={21} />
                </div>
                <h2 className="font-serif text-2xl font-bold text-stone-950">How to read this guide</h2>
                <p className="mt-3 text-sm leading-relaxed text-stone-600">
                  A spectrum makes differences visible, but it also compresses nuance. Placements summarize official or representative sources at a denominational level. They are a starting point for understanding, not a verdict on every congregation or member.
                </p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl bg-stone-50 p-4">
                  <h3 className="text-sm font-extrabold text-stone-900">Selection</h3>
                  <p className="mt-1 text-xs leading-relaxed text-stone-600">The list follows Pew’s U.S. denominational families and includes prominent Catholic, evangelical, mainline, confessional, Pentecostal, Orthodox, and Restorationist traditions.</p>
                </div>
                <div className="rounded-2xl bg-stone-50 p-4">
                  <h3 className="text-sm font-extrabold text-stone-900">Sources</h3>
                  <p className="mt-1 text-xs leading-relaxed text-stone-600">Official catechisms, confessions, denominational statements, and policy pages guide the placements. Source links appear in the summary above.</p>
                </div>
                <div className="rounded-2xl bg-stone-50 p-4">
                  <h3 className="text-sm font-extrabold text-stone-900">Scale</h3>
                  <p className="mt-1 text-xs leading-relaxed text-stone-600">Left and right are descriptive endpoints only. Neither direction represents “more Christian,” “better,” or politically left and right.</p>
                </div>
                <div className="rounded-2xl bg-stone-50 p-4">
                  <h3 className="text-sm font-extrabold text-stone-900">Local variation</h3>
                  <p className="mt-1 text-xs leading-relaxed text-stone-600">Nondenominational churches and autonomous congregations vary especially widely. Always check a local church’s own beliefs and practice.</p>
                </div>
              </div>
            </div>
          </section>
        </section>
      </main>

      <footer className="border-t border-stone-200 bg-[#fffdf8] px-4 py-8 text-center text-xs leading-relaxed text-stone-500 sm:px-6">
        <p className="font-bold text-stone-700">Denomination Comparison Guide</p>
        <p className="mt-1">Educational overview. Last reviewed July 2026.</p>
      </footer>
    </div>
  );
}

export default App;
