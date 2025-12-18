import React from 'react';

interface SpectrumBarProps {
    scoreA: number;
    scoreB: number;
    gap: number;
    leftLabel: string;
    rightLabel: string;
}

export const SpectrumBar: React.FC<SpectrumBarProps> = ({ scoreA, scoreB, gap, leftLabel, rightLabel }) => {
    // Color Logic
    const getLineColor = (gap: number) => {
        if (gap <= 1) return 'bg-emerald-200';
        if (gap <= 3) return 'bg-amber-200';
        return 'bg-rose-200';
    };


    const lineColorClass = getLineColor(gap);

    // Calculate positions (0% to 100%)
    // Score 1 -> 0%, Score 5 -> 100%
    // Formula: (score - 1) * 25
    const posA = (scoreA - 1) * 25;
    const posB = (scoreB - 1) * 25;

    const leftPos = Math.min(posA, posB);
    const width = Math.abs(posA - posB);

    return (
        <div className="w-full mt-2 mb-1">
            {/* Labels */}
            <div className="flex justify-between text-xs font-medium text-slate-400 mb-2 uppercase tracking-wide">
                <span>{leftLabel}</span>
                <span>{rightLabel}</span>
            </div>

            {/* Bar Container */}
            <div className="relative h-8 w-full flex items-center">
                {/* Background Track */}
                <div className="absolute w-full h-1.5 bg-slate-200 rounded-full" />

                {/* Connection Line */}
                <div
                    className={`absolute h-1.5 rounded-full transition-all duration-500 ${lineColorClass}`}
                    style={{
                        left: `${leftPos}%`,
                        width: `${width}%`
                    }}
                />

                {/* Dot A */}
                <div
                    className={`absolute w-8 h-8 rounded-full border-2 border-slate-50 shadow-sm z-10 transition-all duration-500 flex items-center justify-center -ml-4 bg-slate-800`}
                    style={{ left: `${posA}%` }}
                >
                    <span className="text-xs font-bold text-white">A</span>
                </div>

                {/* Dot B */}
                <div
                    className={`absolute w-8 h-8 rounded-full border-2 border-slate-50 shadow-sm z-10 transition-all duration-500 flex items-center justify-center -ml-4 bg-slate-500`}
                    style={{ left: `${posB}%` }}
                >
                    <span className="text-xs font-bold text-white">B</span>
                </div>
            </div>
        </div>
    );
};
