import React, { useState } from 'react';

const DEFAULT_MEMBERS = [
  { name: "Rahul", budget: 25000, interests: ["adventure", "nightlife"] },
  { name: "Priya", budget: 30000, interests: ["culture", "photography"] },
  { name: "Ananya", budget: 22000, interests: ["relaxation", "shopping"] },
  { name: "Arjun", budget: 28000, interests: ["local food", "trekking"] },
];

export default function GroupTravelModal({ destination, isOpen, onClose }) {
  if (!isOpen) return null;

  const [members, setMembers] = useState(DEFAULT_MEMBERS);
  const [consensusResult, setConsensusResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  function handleAddMember() {
    if (members.length >= 10) return;
    const idx = members.length + 1;
    setMembers([
      ...members,
      { name: `Traveler ${idx}`, budget: 25000, interests: ["sightseeing", "food"] }
    ]);
  }

  function handleUpdateMember(index, field, value) {
    const updated = [...members];
    updated[index][field] = value;
    setMembers(updated);
  }

  async function handleComputeConsensus() {
    setIsLoading(true);
    try {
      const payload = {
        group_name: "Wanderlust Crew",
        members: members.map(m => ({
          name: m.name,
          budget_limit: Number(m.budget) || 25000,
          interests: m.interests || ["culture", "sightseeing"],
          dietary_preferences: ["Vegetarian / Mixed"],
          preferred_activity_pace: "moderate"
        })),
        destination: destination,
        duration_days: 5
      };

      const res = await fetch('/api/group/consensus', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        const data = await res.json();
        setConsensusResult(data);
      }
    } catch (err) {
      console.warn("Group consensus failed:", err);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-brand-600 to-sky-600 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-lg">
              <i className="fa-solid fa-users"></i>
            </div>
            <div>
              <h3 className="font-extrabold text-base sm:text-lg">Group Travel & Preference Consensus</h3>
              <p className="text-xs text-white/80">AI Voting Harmonization · Shared Budgeting · Expense Splitting</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition"
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        {/* Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6">
          
          {/* Members List */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-800">
                Group Members ({members.length})
              </span>
              <button 
                onClick={handleAddMember}
                className="px-3 py-1 bg-brand-50 text-brand-600 hover:bg-brand-100 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
              >
                <i className="fa-solid fa-plus text-[10px]"></i>
                <span>Add Member</span>
              </button>
            </div>

            <div className="space-y-2">
              {members.map((m, idx) => (
                <div 
                  key={idx}
                  className="p-3 bg-slate-50 border border-slate-200/80 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-2.5 font-bold text-slate-800">
                    <span className="w-6 h-6 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center text-[11px] font-extrabold">
                      {idx + 1}
                    </span>
                    <input 
                      type="text" 
                      value={m.name}
                      onChange={(e) => handleUpdateMember(idx, 'name', e.target.value)}
                      className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg font-bold text-slate-800 w-28 focus:outline-brand-500"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <label className="text-[10px] uppercase font-bold text-slate-400">Budget (₹):</label>
                    <input 
                      type="number" 
                      value={m.budget}
                      onChange={(e) => handleUpdateMember(idx, 'budget', Number(e.target.value))}
                      className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg font-bold text-slate-800 w-28 focus:outline-brand-500"
                      step="1000"
                    />
                  </div>

                  <div className="flex items-center gap-1 text-[10px]">
                    {m.interests.map((it, itIdx) => (
                      <span key={itIdx} className="px-2 py-0.5 bg-brand-50 text-brand-700 rounded-md font-semibold">
                        {it}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <button 
              onClick={handleComputeConsensus}
              disabled={isLoading}
              className="w-full py-3 bg-brand-600 hover:bg-brand-700 active:scale-95 text-white font-extrabold text-xs rounded-2xl shadow-md shadow-brand-600/20 transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isLoading ? (
                <i className="fa-solid fa-spinner fa-spin"></i>
              ) : (
                <i className="fa-solid fa-scale-balanced"></i>
              )}
              <span>Harmonize Group Consensus & Compute Expenses</span>
            </button>
          </div>

          {/* Consensus Results Section */}
          {consensusResult && (
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-4">
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
                <span className="text-[10px] uppercase font-extrabold text-emerald-700 block">Consensus Verdict</span>
                <p className="text-xs text-slate-700 font-semibold mt-0.5">{consensusResult.consensus_summary}</p>
                <span className="text-xs font-black text-emerald-800 mt-1 block">
                  Harmonized Budget: ₹{consensusResult.harmonized_budget_limit?.toLocaleString()} total
                </span>
              </div>

              {/* Accommodations */}
              <div>
                <h5 className="font-extrabold text-xs text-slate-800 uppercase tracking-wider mb-2">
                  🏨 Group Accommodation Recommendations:
                </h5>
                <div className="space-y-2">
                  {consensusResult.recommended_accommodations?.map((acc, aIdx) => (
                    <div key={aIdx} className="p-3 bg-white border border-slate-200 rounded-xl flex items-center justify-between text-xs">
                      <div>
                        <strong>{acc.name}</strong> ({acc.type})
                        <p className="text-[11px] text-slate-500">{acc.suitability_rating}</p>
                      </div>
                      <span className="font-bold text-emerald-700">₹{acc.price_per_night?.toLocaleString()} / night</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Transportation */}
              <div>
                <h5 className="font-extrabold text-xs text-slate-800 uppercase tracking-wider mb-2">
                  🚐 Group Transportation Optimization:
                </h5>
                <div className="space-y-2">
                  {consensusResult.transportation_options?.map((tr, tIdx) => (
                    <div key={tIdx} className="p-3 bg-white border border-slate-200 rounded-xl flex items-center justify-between text-xs">
                      <div>
                        <strong>{tr.mode}</strong>
                        <p className="text-[11px] text-slate-500">{tr.recommendation_verdict}</p>
                      </div>
                      <span className="font-bold text-brand-600">₹{tr.estimated_cost_per_person?.toLocaleString()} / person</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
