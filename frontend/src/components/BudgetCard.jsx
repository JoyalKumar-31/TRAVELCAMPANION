import React from 'react';

export default function BudgetCard({ totalBudget, usedBudget, travelersCount }) {
  const total = totalBudget || 120000;
  const used = usedBudget || 85000;
  const remaining = Math.max(0, total - used);
  const percentage = Math.min(100, Math.round((used / total) * 100));
  const perPerson = Math.round(total / (travelersCount || 1));

  // Category breakdown estimates in ₹ INR
  const lodgingSpend = Math.round(used * 0.45);
  const activitiesSpend = Math.round(used * 0.28);
  const diningSpend = Math.round(used * 0.18);
  const transitSpend = Math.round(used * 0.09);

  return (
    <div className="bg-white rounded-[2rem] p-5 sm:p-6 border border-slate-200/80 shadow-sm space-y-5">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-white flex items-center justify-center font-bold text-sm shadow-md shadow-emerald-500/20">
            <i className="fa-solid fa-wallet"></i>
          </div>
          <div>
            <h4 className="font-heading font-black text-slate-900 text-sm sm:text-base">Real-Time Travel Budget</h4>
            <span className="text-[10px] text-slate-400 font-black uppercase tracking-wider">Indian Rupees (₹ INR)</span>
          </div>
        </div>

        <span className="text-base font-black text-emerald-700 bg-emerald-50 px-3 py-1 rounded-xl border border-emerald-200 shadow-2xs">
          ₹{total.toLocaleString()}
        </span>
      </div>

      {/* Progress Bar & Planned vs Buffer */}
      <div className="space-y-2">
        <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200/60">
          <div 
            className="h-full bg-gradient-to-r from-brand-500 via-blue-500 to-emerald-500 rounded-full transition-all duration-700"
            style={{ width: `${percentage}%` }}
          />
        </div>

        <div className="flex justify-between text-xs font-bold text-slate-600">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-brand-500"></span>
            <span>₹{used.toLocaleString()} planned ({percentage}%)</span>
          </span>
          <span className="text-emerald-700 font-extrabold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>₹{remaining.toLocaleString()} buffer</span>
          </span>
        </div>
      </div>

      {/* Category Breakdown Chips */}
      <div className="space-y-2 pt-1">
        <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">
          Estimated Cost Distribution:
        </span>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-[10px] text-slate-400 block font-bold">🏨 Lodging & Stays</span>
            <strong className="text-slate-800 font-extrabold">₹{lodgingSpend.toLocaleString()}</strong>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-[10px] text-slate-400 block font-bold">🎟️ Sights & Tickets</span>
            <strong className="text-slate-800 font-extrabold">₹{activitiesSpend.toLocaleString()}</strong>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-[10px] text-slate-400 block font-bold">🍽️ Food & Dining</span>
            <strong className="text-slate-800 font-extrabold">₹{diningSpend.toLocaleString()}</strong>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-[10px] text-slate-400 block font-bold">🚕 Local Transit</span>
            <strong className="text-slate-800 font-extrabold">₹{transitSpend.toLocaleString()}</strong>
          </div>
        </div>
      </div>

      {/* Per Person Breakdown Footer */}
      <div className="p-3.5 bg-gradient-to-r from-emerald-50/60 to-slate-50 rounded-2xl border border-emerald-100 flex items-center justify-between text-xs">
        <div>
          <span className="text-slate-500 font-medium block">Per Person Estimate:</span>
          <span className="text-[10px] text-slate-400">for {travelersCount || 1} traveler{(travelersCount || 1) > 1 ? 's' : ''}</span>
        </div>
        <span className="font-heading font-black text-slate-900 text-sm">
          ₹{perPerson.toLocaleString()} <span className="text-slate-500 font-normal text-xs">/ person</span>
        </span>
      </div>

    </div>
  );
}
