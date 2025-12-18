import React, { useState } from 'react';
import { type Category, type Denomination } from '../data';
import { SpectrumBar } from './SpectrumBar';
import { ChevronDown, ChevronUp, AlertCircle, CheckCircle2, AlertTriangle } from 'lucide-react';

interface CategoryAccordionProps {
    category: Category;
    denomA: Denomination;
    denomB: Denomination;
}

export const CategoryAccordion: React.FC<CategoryAccordionProps> = ({ category, denomA, denomB }) => {
    const [isOpen, setIsOpen] = useState(false);

    const scoreA = denomA.scores[category.id];
    const scoreB = denomB.scores[category.id];
    const gap = Math.abs(scoreA - scoreB);

    const getStatus = (gap: number) => {
        if (gap <= 1) return { label: 'Core Agreement', icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' };
        if (gap <= 3) return { label: 'Distinction', icon: AlertCircle, color: 'text-amber-600', bg: 'bg-amber-50' };
        return { label: 'Major Divergence', icon: AlertTriangle, color: 'text-rose-600', bg: 'bg-rose-50' };
    };

    const status = getStatus(gap);
    const StatusIcon = status.icon;

    return (
        <div className="border border-slate-200 rounded-xl mb-3 overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow">
            <div
                className="p-4 cursor-pointer select-none"
                onClick={() => setIsOpen(!isOpen)}
            >
                {/* Header Row */}
                <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-slate-800 text-lg">{category.name}</h3>
                    <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${status.color} ${status.bg}`}>
                        <StatusIcon size={14} />
                        <span>{status.label}</span>
                    </div>
                </div>

                {/* Visual Bar */}
                <SpectrumBar
                    scoreA={scoreA}
                    scoreB={scoreB}
                    gap={gap}
                    leftLabel={category.leftLabel}
                    rightLabel={category.rightLabel}
                />

                {/* Hint for expansion */}
                <div className="flex justify-center mt-2 group">
                    {isOpen ? <ChevronUp className="text-slate-300" size={16} /> : <ChevronDown className="text-slate-300 group-hover:text-slate-400" size={16} />}
                </div>
            </div>

            {/* Expanded Content */}
            {isOpen && (
                <div className="bg-slate-50 px-5 py-4 border-t border-slate-100 text-sm text-slate-600 space-y-2">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <span className="block text-xs font-bold text-slate-400 mb-1 uppercase tracking-wider">{denomA.name}</span>
                            <p>Believes towards <span className="font-semibold text-slate-700">{scoreA <= 2 ? category.leftLabel : scoreA >= 4 ? category.rightLabel : 'a moderate view'}</span>.</p>
                        </div>
                        <div>
                            <span className="block text-xs font-bold text-slate-400 mb-1 uppercase tracking-wider">{denomB.name}</span>
                            <p>Believes towards <span className="font-semibold text-slate-700">{scoreB <= 2 ? category.leftLabel : scoreB >= 4 ? category.rightLabel : 'a moderate view'}</span>.</p>
                        </div>
                    </div>
                    <div className="mt-3 pt-3 border-t border-slate-200">
                        <p className="italic text-slate-500">
                            {gap <= 1
                                ? "These traditions are largely aligned in this area."
                                : gap >= 4
                                    ? "This is a fundamental point of separation between these traditions."
                                    : "Visualizing the nuance shows distinct emphases despite some common ground."}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};
