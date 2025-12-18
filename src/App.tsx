import { useState } from 'react';
import { DENOMINATIONS, CATEGORY_SETS, CATEGORIES, type DenominationId } from './data';
import { CategoryAccordion } from './components/CategoryAccordion';
import { Summary } from './components/Summary';
import { Scale, ChevronDown } from 'lucide-react';

function App() {
  const [denomAId, setDenomAId] = useState<DenominationId | ''>('');
  const [denomBId, setDenomBId] = useState<DenominationId | ''>('');

  const denomA = DENOMINATIONS.find(d => d.id === denomAId);
  const denomB = DENOMINATIONS.find(d => d.id === denomBId);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20">
      {/* Navbar / Brand */}
      <div className="bg-slate-900 text-white py-4 px-4 shadow-md z-50 relative">
        <div className="max-w-3xl mx-auto flex items-center justify-center gap-3">
          <Scale className="text-indigo-400" />
          <h1 className="text-xl font-bold tracking-tight">Denomivs <span className="text-slate-400 font-normal text-sm ml-2">Theological Comparison Engine</span></h1>
        </div>
      </div>

      {/* Sticky Header for Selections */}
      <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-200 transition-all">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            {/* Denom A Selector */}
            <div className="flex-1">
              <label className="block text-xs font-bold text-slate-400 mb-1 uppercase tracking-wider">Tradition A</label>
              <div className="relative">
                <select
                  className="w-full bg-slate-100 border border-slate-200 text-slate-800 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-2.5 pr-8 font-semibold appearance-none cursor-pointer hover:bg-slate-50 transition-colors"
                  value={denomAId}
                  onChange={(e) => setDenomAId(e.target.value as DenominationId)}
                >
                  <option value="" disabled>Choose Denomination</option>
                  {DENOMINATIONS.map(d => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-slate-500">
                  <ChevronDown size={16} />
                </div>
              </div>
            </div>

            {/* VS Badge */}
            <div className="flex flex-col items-center justify-center pt-5">
              <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-black text-xs shadow-inner">
                VS
              </div>
            </div>

            {/* Denom B Selector */}
            <div className="flex-1 text-right">
              <label className="block text-xs font-bold text-slate-400 mb-1 uppercase tracking-wider">Tradition B</label>
              <div className="relative">
                <select
                  dir="rtl"
                  className="w-full bg-slate-100 border border-slate-200 text-slate-800 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-2.5 pr-8 font-semibold appearance-none cursor-pointer hover:bg-slate-50 transition-colors text-right"
                  value={denomBId}
                  onChange={(e) => setDenomBId(e.target.value as DenominationId)}
                >
                  <option value="" disabled>Choose Denomination</option>
                  {DENOMINATIONS.map(d => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-slate-500 left-0 right-auto">
                  {/* Note: User asked for arrows. The previous input had dir="rtl", so the arrow should be on the left? 
                       Standard select arrows are usually on the right. 
                       But the original was text-right aligned.
                       Let's put the arrow on the LEFT if it's RTL text, or standard right.
                       Actually, for the second one, it's tradition B, aligned right. 
                       The label is right aligned.
                       The select text is right aligned.
                       The User said "inside the box to the right of the denominaion label"... wait.
                       "add an arrow triangle icon inside the box to the right of the denominaion label"
                       For Trad B, the label is on the right? 
                       Let's just put it on the side that makes sense. 
                       Typically custom arrows are on the right (end) of the input.
                       But if text is RTL, the 'start' is right and 'end' is left.
                       Let's stick to standard UI: arrow on the right.
                       However, the user said "inside the box to the right of the denominaion label".
                       Let's just place it on the right side for both for consistency unless it overlaps text.
                       The styled component I'm replacing had 'dir="rtl"'. 
                       If I put the arrow on the right, it might overlap the text if the text is right-aligned.
                       Wait, the original code had `dir="rtl"` on the select.
                       Let's keep the arrow on the left for the RTL input to mimic standard RTL behavior, 
                       OR just keep it on the right and add padding-right.
                       The user's prompt "inside the box to the right of the denominaion label" is slightly ambiguous for the layout.
                       I will place the arrow on the right for both, adding pr-8 to both selects.
                   */}
                  {/* Wait, for the SECOND select, I will put the arrow on the LEFT because the text is on the RIGHT. 
                       Original code: <div className="flex-1 text-right">
                       So everything is right aligned.
                       Let's put arrow on LEFT for B.
                   */}
                  <ChevronDown size={16} />
                </div>
                {/* Re-doing the arrow positioning for B properly */}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content: Categories */}
      <main className="max-w-3xl mx-auto px-4 py-8 space-y-12">
        {!denomA || !denomB ? (
          <div className="text-center py-20 animate-in fade-in zoom-in duration-500">
            <div className="inline-flex items-center justify-center p-4 bg-indigo-50 text-indigo-200 rounded-full mb-4">
              <Scale size={48} />
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Select Traditions to Compare</h2>
            <p className="text-slate-500">Choose two denominations from the dropdowns above to see their theological differences.</p>
          </div>
        ) : (
          <>
            {CATEGORY_SETS.map(set => {
              const setCategories = CATEGORIES.filter(c => c.setId === set.id);

              return (
                <div key={set.id} className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                  <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 border-b border-slate-200 pb-2">
                    {set.name}
                  </h2>
                  <div className="space-y-4">
                    {setCategories.map(cat => (
                      <CategoryAccordion
                        key={cat.id}
                        category={cat}
                        denomA={denomA}
                        denomB={denomB}
                      />
                    ))}
                  </div>
                </div>
              );
            })}

            {/* Dynamic Summary */}
            <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
              <Summary denomA={denomA} denomB={denomB} />
            </div>
          </>
        )}

        {/* Footer */}
        <div className="text-center text-slate-400 text-xs mt-12 pb-8">
          <p>© 2024 Denomivs. Theological data is approximate for educational purposes.</p>
        </div>
      </main>

      {/* Floating Action Button for Swap (Mobile optimization maybe?) - Optional */}
      {/* <button 
        className="fixed bottom-6 right-6 bg-indigo-600 text-white p-4 rounded-full shadow-lg hover:bg-indigo-700 transition-all z-50 md:hidden"
        onClick={() => {
          const temp = denomAId;
          setDenomAId(denomBId);
          setDenomBId(temp);
        }}
      >
        <ArrowRightLeft size={20} />
      </button> */}
    </div>
  );
}

export default App;
