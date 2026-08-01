import type { Denomination } from '../data';

interface DenominationBadgeProps {
  denomination: Denomination;
  size?: 'sm' | 'md' | 'lg';
}

export function DenominationBadge({ denomination, size = 'md' }: DenominationBadgeProps) {
  const sizeClasses = {
    sm: 'h-8 min-w-8 px-2 text-[10px]',
    md: 'h-10 min-w-10 px-2.5 text-xs',
    lg: 'h-14 min-w-14 px-3 text-sm',
  };

  return (
    <span
      aria-hidden="true"
      className={`inline-flex shrink-0 items-center justify-center rounded-xl font-black tracking-tight text-white shadow-sm ${sizeClasses[size]}`}
      style={{ backgroundColor: denomination.color }}
    >
      {denomination.abbreviation}
    </span>
  );
}
