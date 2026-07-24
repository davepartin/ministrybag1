import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Check, ChevronDown, Search, X } from 'lucide-react';
import { DENOMINATIONS, type Denomination, type DenominationId } from '../data';
import { DenominationBadge } from './DenominationBadge';

interface DenominationPickerProps {
  label: string;
  value: Denomination;
  excludedId: DenominationId;
  onChange: (id: DenominationId) => void;
}

export function DenominationPicker({ label, value, excludedId, onChange }: DenominationPickerProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) window.setTimeout(() => inputRef.current?.focus(), 50);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', closeOnEscape);
    return () => document.removeEventListener('keydown', closeOnEscape);
  }, [open]);

  const normalizedQuery = query.trim().toLowerCase();
  const matches = DENOMINATIONS.filter((denomination) =>
    `${denomination.name} ${denomination.shortName} ${denomination.abbreviation} ${denomination.family}`
      .toLowerCase()
      .includes(normalizedQuery),
  );

  const choose = (id: DenominationId) => {
    onChange(id);
    setOpen(false);
    setQuery('');
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="group w-full rounded-2xl border border-stone-200 bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-stone-300 hover:shadow-md focus:outline-none focus-visible:ring-4 focus-visible:ring-amber-200"
        aria-haspopup="dialog"
      >
        <span className="mb-3 block text-[11px] font-bold uppercase tracking-[0.18em] text-stone-500">{label}</span>
        <span className="flex items-center gap-3">
          <DenominationBadge denomination={value} size="lg" />
          <span className="min-w-0 flex-1">
            <span className="block truncate text-base font-extrabold text-stone-950 sm:text-lg">{value.shortName}</span>
            <span className="block truncate text-sm text-stone-500">{value.family}</span>
          </span>
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-stone-100 text-stone-500 transition group-hover:bg-stone-900 group-hover:text-white">
            <ChevronDown size={18} />
          </span>
        </span>
      </button>

      {open &&
        createPortal(
          <div
            className="fixed inset-0 z-[1000] flex items-end justify-center bg-stone-950/55 p-0 backdrop-blur-sm sm:items-center sm:p-6"
            role="dialog"
            aria-modal="true"
            aria-label={`Choose ${label.toLowerCase()}`}
            onMouseDown={(event) => {
              if (event.currentTarget === event.target) setOpen(false);
            }}
          >
            <div className="max-h-[92vh] w-full max-w-3xl overflow-hidden rounded-t-[28px] bg-[#fffdf8] shadow-2xl sm:rounded-[28px]">
              <div className="border-b border-stone-200 p-5 sm:p-7">
                <div className="mb-5 flex items-start justify-between gap-4">
                  <div>
                    <p className="mb-1 text-[11px] font-bold uppercase tracking-[0.2em] text-amber-700">Common U.S. traditions</p>
                    <h2 className="font-serif text-2xl font-bold text-stone-950 sm:text-3xl">Choose a denomination</h2>
                    <p className="mt-1 text-sm text-stone-500">Search by name, abbreviation, or church family.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-stone-100 text-stone-600 hover:bg-stone-200 focus:outline-none focus-visible:ring-4 focus-visible:ring-amber-200"
                    aria-label="Close denomination chooser"
                  >
                    <X size={20} />
                  </button>
                </div>
                <label className="relative block">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={19} />
                  <input
                    ref={inputRef}
                    type="search"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Try Baptist, Lutheran, Catholic…"
                    className="w-full rounded-2xl border border-stone-200 bg-white py-3.5 pl-11 pr-4 text-base text-stone-900 outline-none placeholder:text-stone-400 focus:border-amber-500 focus:ring-4 focus:ring-amber-100"
                  />
                </label>
              </div>

              <div className="max-h-[58vh] overflow-y-auto p-3 sm:p-5">
                <div className="grid gap-2 sm:grid-cols-2">
                  {matches.map((denomination) => {
                    const selected = denomination.id === value.id;
                    const excluded = denomination.id === excludedId;
                    return (
                    <button
                      key={denomination.id}
                      type="button"
                      disabled={excluded}
                      onClick={() => choose(denomination.id)}
                      className="flex items-center gap-3 rounded-2xl border border-transparent p-3 text-left transition hover:border-stone-200 hover:bg-white hover:shadow-sm focus:outline-none focus-visible:ring-4 focus-visible:ring-amber-200 disabled:cursor-not-allowed disabled:opacity-35"
                    >
                      <DenominationBadge denomination={denomination} />
                      <span className="min-w-0 flex-1">
                        <span className="block font-bold leading-tight text-stone-900">{denomination.shortName}</span>
                        <span className="mt-0.5 block text-xs text-stone-500">{denomination.family}</span>
                      </span>
                      {selected && <Check className="shrink-0 text-emerald-600" size={20} />}
                      {excluded && <span className="text-[10px] font-bold uppercase tracking-wide text-stone-500">Other side</span>}
                    </button>
                    );
                  })}
                </div>
                {matches.length === 0 && (
                  <div className="py-12 text-center">
                    <p className="font-bold text-stone-800">No tradition matches “{query}”</p>
                    <p className="mt-1 text-sm text-stone-500">Try a family name such as Baptist, Lutheran, or Reformed.</p>
                  </div>
                )}
              </div>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
