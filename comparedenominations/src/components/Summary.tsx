import React from 'react';
import { type Denomination, CATEGORIES } from '../data';

interface SummaryProps {
    denomA: Denomination;
    denomB: Denomination;
}

export const Summary: React.FC<SummaryProps> = ({ denomA, denomB }) => {
    const agreements: string[] = [];
    const divergences: string[] = [];

    CATEGORIES.forEach(cat => {
        const gap = Math.abs(denomA.scores[cat.id] - denomB.scores[cat.id]);
        if (gap <= 1) agreements.push(cat.name);
        if (gap >= 4) divergences.push(cat.name);
    });

    const formatList = (items: string[]) => {
        if (items.length === 0) return "few areas";
        if (items.length <= 3) return items.join(", ");
        return `${items.slice(0, 3).join(", ")} and ${items.length - 3} others`;
    };

    return (
        <div className="bg-slate-900 text-slate-50 p-6 rounded-2xl shadow-xl mt-8">
            <h2 className="text-xl font-bold mb-4 bg-gradient-to-r from-indigo-200 to-cyan-200 bg-clip-text text-transparent">
                Comparison Insight
            </h2>
            <p className="text-lg leading-relaxed text-slate-300">
                <span className="font-semibold text-white">{denomA.name}</span> and <span className="font-semibold text-white">{denomB.name}</span> agree on the Essentials ({formatList(agreements)})
                {divergences.length > 0 ? (
                    <> but diverge significantly on <span className="text-rose-300">{formatList(divergences)}</span>.</>
                ) : (
                    <> and have very few major theological divergences.</>
                )}
            </p>
        </div>
    );
};
