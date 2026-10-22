import React, { useState, useEffect } from 'react';

const DEFAULT_MEMBERS = [
  { name: "Rahul", budget: 25000, interests: ["adventure", "nightlife"] },
  { name: "Priya", budget: 30000, interests: ["culture", "photography"] },
  { name: "Ananya", budget: 22000, interests: ["relaxation", "shopping"] },
  { name: "Arjun", budget: 28000, interests: ["local food", "trekking"] },
];

export default function GroupTravelModal({ 
  destination, 
  duration = 5, 
  isOpen, 
  onClose,
  onApplyGroupPlan 
}) {
  if (!isOpen) return null;

  const [members, setMembers] = useState(DEFAULT_MEMBERS);
  const [groupDays, setGroupDays] = useState(duration || 5);
  const [consensusResult, setConsensusResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (duration) setGroupDays(duration);
  }, [duration, isOpen]);

  function handleAddMember() {
    if (members.length >= 12) return;
    const idx = members.length + 1;
    setMembers([
      ...members,
      { name: `Traveler ${idx}`, budget: 25000, interests: ["sightseeing", "food"] }
    ]);
  }

  function handleRemoveMember(index) {
    if (members.length <= 1) return;
    setMembers(members.filter((_, i) => i !== index));
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
        duration_days: groupDays
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

  function handleApplyGroupToItinerary() {
    if (onApplyGroupPlan) {
      onApplyGroupPlan(members.length, groupDays);
    } else {
      onClose();
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-fadeIn">
      <div className="bg-white w-full max-w-3xl rounded-[2.2rem] shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-brand-600 via-indigo-600 to-purple-600 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-lg shadow-inner">
              <i className="fa-solid fa-users"></i>
            </div>
            <div>
              <h3 className="font-heading font-black text-base sm:text-lg">Group Travel & Preference Consensus</h3>
              <p className="text-xs text-white/80 font-medium">Harmonized Voting · Room Sharing Lodges · Split Expenses</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition cursor-pointer"
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        {/* Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6">
          
          {/* Days & Group Summary Bar */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-wrap items-center justify-between gap-4">
            
            {/* Days Selector */}
            <div className="flex items-center gap-3">
              <span className="text-xs font-black text-slate-700 uppercase tracking-wider">
                <i className="fa-regular fa-calendar-days text-brand-600 mr-1.5"></i>Trip Duration:
              </span>
              <div className="flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-xl border border-slate-200 shadow-2xs">
                <button
                  type="button"
                  onClick={() => setGroupDays(Math.max(1, groupDays - 1))}
                  className="w-6 h-6 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center"
                >
                  -
                </button>
                <span className="text-xs font-black text-slate-900 px-1">{groupDays} Days</span>
                <button
                  type="button"
                  onClick={() => setGroupDays(Math.min(15, groupDays + 1))}
                  className="w-6 h-6 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center"
                >
                  +
                </button>
              </div>
            </div>

            {/* Total Travelers */}
            <div className="flex items-center gap-2 text-xs font-black text-slate-800">
              <i className="fa-solid fa-user-group text-emerald-600"></i>
              <span>{members.length} Group Members</span>
            </div>

          </div>

          {/* Members List */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-slate-800">
                Group Member Preferences:
              </span>
              <button 
                type="button"
                onClick={handleAddMember}
                className="px-3 py-1.5 bg-brand-50 text-brand-600 hover:bg-brand-100 rounded-xl text-xs font-black transition flex items-center gap-1.5 cursor-pointer"
              >
                <i className="fa-solid fa-plus text-[10px]"></i>
                <span>Add Member</span>
              </button>
            </div>

            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {members.map((m, idx) => (
                <div 
                  key={idx}
                  className="p-3 bg-slate-50 border border-slate-200/80 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-2.5 font-bold text-slate-800">
                    <span className="w-6 h-6 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center text-[11px] font-black">
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

                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 text-[10px]">
                      {m.interests.map((it, itIdx) => (
                        <span key={itIdx} className="px-2 py-0.5 bg-brand-50 text-brand-700 rounded-md font-semibold">
                          {it}
                        </span>
                      ))}
                    </div>

                    {members.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveMember(idx)}
                        className="text-slate-400 hover:text-rose-500 text-xs px-1"
                        title="Remove member"
                      >
                        <i className="fa-solid fa-trash-can"></i>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Harmonize Button */}
            <button 
              type="button"
              onClick={handleComputeConsensus}
              disabled={isLoading}
              className="w-full py-3.5 bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-700 hover:to-indigo-700 active:scale-98 text-white font-black text-xs rounded-2xl shadow-lg shadow-brand-500/25 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <i className="fa-solid fa-spinner fa-spin"></i>
                  <span>Harmonizing Multi-Member Preferences...</span>
                </>
              ) : (
                <>
                  <i className="fa-solid fa-scale-balanced text-amber-300"></i>
                  <span>Harmonize Consensus ({members.length} Members · {groupDays} Days)</span>
                </>
              )}
            </button>
          </div>

          {/* Consensus Results Section with ENTER Button */}
          {consensusResult && (
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-slate-50 to-brand-50/40 border border-brand-200 space-y-4 animate-fadeIn">
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
                <span className="text-[10px] uppercase font-black text-emerald-700 block">Consensus Verdict</span>
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
                    <div key={aIdx} className="p-3 bg-white border border-slate-200 rounded-xl flex items-center justify-between text-xs shadow-2xs">
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
                    <div key={tIdx} className="p-3 bg-white border border-slate-200 rounded-xl flex items-center justify-between text-xs shadow-2xs">
                      <div>
                        <strong>{tr.mode}</strong>
                        <p className="text-[11px] text-slate-500">{tr.recommendation_verdict}</p>
                      </div>
                      <span className="font-bold text-brand-600">₹{tr.estimated_cost_per_person?.toLocaleString()} / person</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* PROPER ENTER & APPLY GROUP PLAN BUTTON */}
              <button
                type="button"
                onClick={handleApplyGroupToItinerary}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-brand-600 hover:from-emerald-700 hover:to-brand-700 active:scale-98 text-white font-black text-xs sm:text-sm shadow-xl shadow-emerald-600/25 flex items-center justify-center gap-2.5 transition duration-200 uppercase tracking-wider cursor-pointer group"
              >
                <span className="w-6 h-6 rounded-lg bg-white/20 flex items-center justify-center text-xs font-mono font-bold group-hover:scale-110 transition">⏎</span>
                <span>ENTER & APPLY TO ITINERARY ({members.length} Travelers · {groupDays} Days)</span>
                <i className="fa-solid fa-arrow-right text-xs group-hover:translate-x-1 transition"></i>
              </button>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
