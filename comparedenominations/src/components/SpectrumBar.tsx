import type { Denomination } from '../data';

interface SpectrumBarProps {
  scoreA: number;
  scoreB: number;
  denomA: Denomination;
  denomB: Denomination;
  leftLabel: string;
  rightLabel: string;
}

export function SpectrumBar({ scoreA, scoreB, denomA, denomB, leftLabel, rightLabel }: SpectrumBarProps) {
  const posA = (scoreA - 1) * 25;
  const posB = (scoreB - 1) * 25;
  const connectionLeft = Math.min(posA, posB);
  const connectionWidth = Math.abs(posA - posB);

  return (
    <div className="mt-4">
      <div className="mb-2 flex justify-between gap-6 text-[10px] font-bold uppercase leading-tight tracking-[0.12em] text-stone-500 sm:text-xs">
        <span className="max-w-[44%] text-left">{leftLabel}</span>
        <span className="max-w-[44%] text-right">{rightLabel}</span>
      </div>
      <div className="relative h-[92px] px-5">
        <div className="absolute left-5 right-5 top-[45px] h-2 rounded-full bg-stone-200" />
        <div
          className="absolute top-[45px] h-2 rounded-full opacity-35"
          style={{
            left: `calc(1.25rem + (100% - 2.5rem) * ${connectionLeft / 100})`,
            width: `calc((100% - 2.5rem) * ${connectionWidth / 100})`,
            background: `linear-gradient(90deg, ${posA <= posB ? denomA.color : denomB.color}, ${posA <= posB ? denomB.color : denomA.color})`,
          }}
        />
        {[0, 25, 50, 75, 100].map((position) => (
          <span
            key={position}
            className="absolute top-[42px] h-4 w-1 -translate-x-1/2 rounded-full bg-[#fffdf8]"
            style={{ left: `calc(1.25rem + (100% - 2.5rem) * ${position / 100})` }}
          />
        ))}

        <div
          className="absolute top-0 -translate-x-1/2 transition-[left] duration-500"
          style={{ left: `calc(1.25rem + (100% - 2.5rem) * ${posA / 100})` }}
          aria-label={`${denomA.name}: position ${scoreA} of 5`}
        >
          <span className="mx-auto block h-5 w-0.5" style={{ backgroundColor: denomA.color }} />
          <span
            className="flex h-8 min-w-9 items-center justify-center rounded-lg border-2 border-white px-1.5 text-[10px] font-black text-white shadow-md"
            style={{ backgroundColor: denomA.color }}
          >
            {denomA.abbreviation}
          </span>
        </div>

        <div
          className="absolute top-[47px] -translate-x-1/2 transition-[left] duration-500"
          style={{ left: `calc(1.25rem + (100% - 2.5rem) * ${posB / 100})` }}
          aria-label={`${denomB.name}: position ${scoreB} of 5`}
        >
          <span
            className="flex h-8 min-w-9 items-center justify-center rounded-lg border-2 border-white px-1.5 text-[10px] font-black text-white shadow-md"
            style={{ backgroundColor: denomB.color }}
          >
            {denomB.abbreviation}
          </span>
          <span className="mx-auto block h-4 w-0.5" style={{ backgroundColor: denomB.color }} />
        </div>
      </div>
    </div>
  );
}
