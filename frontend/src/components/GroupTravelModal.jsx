import React, { useState, useEffect } from 'react';
import { DESTINATION_CONFIG, getDestinationKey } from '../data/destinationData';

const DEFAULT_MEMBERS = [
  { name: "Rahul", budget: 34000, interests: ["adventure", "nightlife"] },
  { name: "Priya", budget: 30000, interests: ["culture", "photography"] },
  { name: "Ananya", budget: 22000, interests: ["relaxation", "shopping"] },
  { name: "Arjun", budget: 28000, interests: ["local food", "trekking"] },
];

export default function GroupTravelModal({ 
  destination, 
  duration = 6, 
  isOpen, 
  onClose,
  onApplyGroupPlan 
}) {
  if (!isOpen) return null;

  const destKey = getDestinationKey(destination);
  const config = DESTINATION_CONFIG[destKey] || DESTINATION_CONFIG["switzerland"];
  const baseRatePerDay = config?.baseRatePerDay || 3500;
  const cleanCity = (destination || "Destination").split("(")[0].split(",")[0].trim();

  const [members, setMembers] = useState(DEFAULT_MEMBERS);
  const [groupDays, setGroupDays] = useState(duration || 6);
  const [consensusResult, setConsensusResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  // Sync initial duration and calculate destination benchmark
  useEffect(() => {
    if (duration) setGroupDays(duration);
  }, [duration, isOpen]);

  // Destination benchmark per person for this duration
  const benchmarkPerPerson = Math.round(baseRatePerDay * groupDays * 0.82);
  const benchmarkTotalGroup = benchmarkPerPerson * members.length;

  function handleAddMember() {
    if (members.length >= 12) return;
    const idx = members.length + 1;
    setMembers([
      ...members,
      { name: `Traveler ${idx}`, budget: benchmarkPerPerson, interests: ["sightseeing", "food"] }
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

  // Quick reset member budgets to match this destination's realistic cost
  function handleSyncBudgetsToDestination() {
    const updated = members.map((m, idx) => {
      // Add a slight natural variance (+- 10%)
      const variance = [1.1, 0.95, 0.85, 1.05, 0.9, 1.15][idx % 6];
      return {
        ...m,
        budget: Math.round(benchmarkPerPerson * variance / 500) * 500
      };
    });
    setMembers(updated);
  }

  async function handleComputeConsensus() {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const payload = {
        destination: destination,
        duration_days: Number(groupDays) || 6,
        members: members.map(m => ({
          name: m.name,
          max_budget: Number(m.budget) || benchmarkPerPerson,
          budget_limit: Number(m.budget) || benchmarkPerPerson,
          interests: m.interests && m.interests.length > 0 ? m.interests : ["sightseeing", "culture"]
        }))
      };

      const res = await fetch('/api/group/consensus', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const data = await res.json();
        setConsensusResult(data);
      } else {
        const errText = await res.text();
        console.warn("Consensus error response:", errText);
        setErrorMessage("Could not harmonize group budget. Using live destination calculator.");
        generateFallbackConsensus();
      }
    } catch (err) {
      console.warn("Group consensus failed:", err);
      setErrorMessage("Network issue connecting to server. Using local calculation.");
      generateFallbackConsensus();
    } finally {
      setIsLoading(false);
    }
  }

  function generateFallbackConsensus() {
    const totalMemberBudget = members.reduce((sum, m) => sum + (Number(m.budget) || 0), 0);
    const avgMemberBudget = Math.round(totalMemberBudget / members.length);
    const fairPerPerson = Math.round((benchmarkPerPerson * 0.55) + (avgMemberBudget * 0.45));
    const totalShared = fairPerPerson * members.length;

    setConsensusResult({
      destination: destination,
      duration_days: groupDays,
      group_size: members.length,
      recommended_shared_budget: totalShared,
      harmonized_budget_limit: totalShared,
      cost_per_person: fairPerPerson,
      consensus_summary: `Calculated for ${cleanCity} (${groupDays} Days): Group total of ₹${totalShared.toLocaleString()} split equally into ₹${fairPerPerson.toLocaleString()} per member across ${members.length} travelers.`,
      voting_compromises: [
        "Shared twin-room lodging cuts accommodation expenses by 22% per member.",
        "Split minivan/tempo transit provides door-to-door group flexibility."
      ],
      expense_breakdown: [
        { category: "🏨 Shared Lodging & Rooms", amount_total: Math.round(totalShared * 0.35), amount_per_person: Math.round(fairPerPerson * 0.35), percentage: 35, note: "Double occupancy or private group villa" },
        { category: "🍽️ Group Dining & Meals", amount_total: Math.round(totalShared * 0.25), amount_per_person: Math.round(fairPerPerson * 0.25), percentage: 25, note: "Family-style meals & local cuisine" },
        { category: "🎟️ Sightseeing & Entry Passes", amount_total: Math.round(totalShared * 0.25), amount_per_person: Math.round(fairPerPerson * 0.25), percentage: 25, note: "Monument passes & guided excursions" },
        { category: "🚐 Shared Local Transit", amount_total: Math.round(totalShared * 0.15), amount_per_person: Math.round(fairPerPerson * 0.15), percentage: 15, note: "Split AC tempo van or private cabs" }
      ],
      member_splits: members.map(m => {
        const stated = Number(m.budget) || 0;
        const bal = stated - fairPerPerson;
        return {
          name: m.name,
          stated_budget: stated,
          fair_share: fairPerPerson,
          balance: bal,
          status: bal > 500 ? `Surplus (+₹${Math.round(bal).toLocaleString()})` : (bal < -500 ? `Shortfall (-₹${Math.round(Math.abs(bal)).toLocaleString()})` : "Fully Balanced")
        };
      })
    });
  }

  function handleApplyGroupToItinerary() {
    if (onApplyGroupPlan) {
      onApplyGroupPlan(members.length, groupDays);
    } else {
      onClose();
    }
  }

  const effectiveTotal = consensusResult?.recommended_shared_budget || consensusResult?.harmonized_budget_limit || benchmarkTotalGroup;
  const effectivePerPerson = consensusResult?.cost_per_person || Math.round(effectiveTotal / members.length);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/75 backdrop-blur-md animate-fadeIn">
      <div className="bg-white w-full max-w-3xl rounded-[2.2rem] shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-brand-600 via-indigo-600 to-purple-600 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-lg shadow-inner">
              <i className="fa-solid fa-users"></i>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-heading font-black text-base sm:text-lg">Group Travel & Split Budget</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-400 text-slate-950">
                  {cleanCity}
                </span>
              </div>
              <p className="text-xs text-white/80 font-medium">Destination-Aware Budgeting · Expense Splitting · Room Sharing</p>
            </div>
          </div>
          <button 
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition cursor-pointer"
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        {/* Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5">
          
          {/* 1. Destination Benchmark & Days Header Card */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-50 to-brand-50/40 border border-brand-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-2xs">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-brand-600 text-white">
                  Destination Cost Benchmark
                </span>
                <span className="text-xs font-black text-slate-800">
                  {cleanCity} ({groupDays} Days)
                </span>
              </div>
              <p className="text-xs text-slate-600 font-semibold mt-1">
                Estimated rate: <strong className="text-brand-700">₹{baseRatePerDay.toLocaleString()}</strong>/day per traveler · Group savings: <strong className="text-emerald-700">18% off</strong>
              </p>
              <p className="text-[11px] text-slate-500 font-medium">
                Benchmark: <strong>₹{benchmarkPerPerson.toLocaleString()}</strong> per person (Total: ₹{benchmarkTotalGroup.toLocaleString()})
              </p>
            </div>

            {/* Days Stepper & Sync Button */}
            <div className="flex items-center gap-2 self-end sm:self-center">
              <div className="flex items-center gap-1.5 bg-white px-2.5 py-1.5 rounded-xl border border-slate-200 shadow-2xs">
                <span className="text-[10px] font-bold text-slate-400 uppercase mr-1">Days:</span>
                <button
                  type="button"
                  onClick={() => setGroupDays(Math.max(1, groupDays - 1))}
                  className="w-6 h-6 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center"
                >
                  -
                </button>
                <span className="text-xs font-black text-slate-900 px-1">{groupDays}d</span>
                <button
                  type="button"
                  onClick={() => setGroupDays(Math.min(15, groupDays + 1))}
                  className="w-6 h-6 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center"
                >
                  +
                </button>
              </div>

              <button
                type="button"
                onClick={handleSyncBudgetsToDestination}
                className="px-2.5 py-1.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 font-black text-[11px] flex items-center gap-1 shadow-2xs cursor-pointer"
                title="Auto-fill member budgets around this destination's rate"
              >
                <i className="fa-solid fa-wand-magic-sparkles text-amber-500"></i>
                <span>Auto-Fill</span>
              </button>
            </div>
          </div>

          {/* 2. Group Members Preference List */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                <i className="fa-solid fa-user-group text-brand-600"></i>
                <span>Group Members ({members.length} Travelers):</span>
              </span>
              <button 
                type="button"
                onClick={handleAddMember}
                className="px-3 py-1.5 bg-brand-50 text-brand-600 hover:bg-brand-100 rounded-xl text-xs font-black transition flex items-center gap-1.5 cursor-pointer border border-brand-200/60"
              >
                <i className="fa-solid fa-plus text-[10px]"></i>
                <span>Add Member</span>
              </button>
            </div>

            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {members.map((m, idx) => (
                <div 
                  key={idx}
                  className="p-3 bg-slate-50/90 border border-slate-200/90 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs hover:border-slate-300 transition"
                >
                  <div className="flex items-center gap-2.5 font-bold text-slate-800">
                    <span className="w-6 h-6 rounded-full bg-brand-600 text-white flex items-center justify-center text-[11px] font-black shrink-0">
                      {idx + 1}
                    </span>
                    <input 
                      type="text" 
                      value={m.name}
                      onChange={(e) => handleUpdateMember(idx, 'name', e.target.value)}
                      className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg font-bold text-slate-800 w-28 focus:outline-brand-500 shadow-2xs"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <label className="text-[10px] uppercase font-bold text-slate-400">Budget (₹):</label>
                    <input 
                      type="number" 
                      value={m.budget}
                      onChange={(e) => handleUpdateMember(idx, 'budget', Number(e.target.value))}
                      className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg font-bold text-slate-800 w-28 focus:outline-brand-500 shadow-2xs text-right"
                      step="1000"
                    />
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-2">
                    <div className="flex items-center gap-1 text-[10px]">
                      {m.interests.map((it, itIdx) => (
                        <span key={itIdx} className="px-2 py-0.5 bg-brand-50 text-brand-700 rounded-md font-semibold border border-brand-200/60">
                          {it}
                        </span>
                      ))}
                    </div>

                    {members.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveMember(idx)}
                        className="text-slate-400 hover:text-rose-500 text-xs px-1.5 py-1 transition"
                        title="Remove member"
                      >
                        <i className="fa-solid fa-trash-can"></i>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Harmonize Action Button */}
            <button 
              type="button"
              onClick={handleComputeConsensus}
              disabled={isLoading}
              className="w-full py-3.5 bg-gradient-to-r from-brand-600 via-indigo-600 to-purple-600 hover:from-brand-700 hover:to-purple-700 active:scale-98 text-white font-black text-xs sm:text-sm rounded-2xl shadow-lg shadow-brand-500/25 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <i className="fa-solid fa-spinner fa-spin text-sm"></i>
                  <span>Calculating Destination Split across {members.length} Members...</span>
                </>
              ) : (
                <>
                  <i className="fa-solid fa-scale-balanced text-amber-300"></i>
                  <span>Harmonize Consensus ({members.length} Members · {groupDays} Days)</span>
                </>
              )}
            </button>
          </div>

          {/* 3. Consensus Results & Interactive Split Breakdown */}
          {consensusResult && (
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-slate-50 to-brand-50/40 border border-brand-200 space-y-4 animate-fadeIn">
              
              {/* Split Summary Banner */}
              <div className="p-4 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 text-white rounded-2xl shadow-md space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-[10px] uppercase font-black tracking-wider px-2 py-0.5 rounded-full bg-white/20">
                    Split Expense Verdict
                  </span>
                  <span className="text-xs font-bold text-emerald-100">
                    {members.length} Members Split Equally
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div>
                    <span className="text-[10px] text-emerald-100 uppercase font-bold block">Total Group Trip Budget</span>
                    <span className="text-xl sm:text-2xl font-black text-white">
                      ₹{Math.round(effectiveTotal).toLocaleString()}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-emerald-100 uppercase font-bold block">Split per Person</span>
                    <span className="text-xl sm:text-2xl font-black text-amber-300">
                      ₹{Math.round(effectivePerPerson).toLocaleString()} <span className="text-xs font-normal text-white">/ member</span>
                    </span>
                  </div>
                </div>

                <p className="text-[11px] text-emerald-50 font-medium pt-1 border-t border-white/20">
                  {consensusResult.consensus_summary}
                </p>
              </div>

              {/* Expense Category Breakdown Split */}
              {consensusResult.expense_breakdown && consensusResult.expense_breakdown.length > 0 && (
                <div className="space-y-2">
                  <h5 className="font-extrabold text-xs text-slate-800 uppercase tracking-wider">
                    📊 Expense Category Breakdown (Split for {members.length} Travelers):
                  </h5>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {consensusResult.expense_breakdown.map((cat, cIdx) => (
                      <div key={cIdx} className="p-3 bg-white border border-slate-200/90 rounded-xl shadow-2xs space-y-1">
                        <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                          <span>{cat.category}</span>
                          <span className="text-brand-600">{cat.percentage}%</span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-slate-500 font-semibold">Total: ₹{Math.round(cat.amount_total).toLocaleString()}</span>
                          <strong className="text-emerald-700">₹{Math.round(cat.amount_per_person).toLocaleString()} / person</strong>
                        </div>
                        <p className="text-[10px] text-slate-400 truncate">{cat.note}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Individual Member Split Matrix */}
              {consensusResult.member_splits && consensusResult.member_splits.length > 0 && (
                <div className="space-y-2">
                  <h5 className="font-extrabold text-xs text-slate-800 uppercase tracking-wider">
                    👥 Individual Member Split Matrix:
                  </h5>
                  <div className="space-y-1.5">
                    {consensusResult.member_splits.map((m, mIdx) => (
                      <div key={mIdx} className="p-2.5 bg-white border border-slate-200 rounded-xl flex items-center justify-between text-xs shadow-2xs">
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center text-[10px] font-bold">
                            {mIdx + 1}
                          </span>
                          <strong className="text-slate-800">{m.name}</strong>
                          <span className="text-[11px] text-slate-400">Budget: ₹{Math.round(m.stated_budget).toLocaleString()}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-slate-600 font-bold">Share: ₹{Math.round(m.fair_share).toLocaleString()}</span>
                          <span className={`px-2 py-0.5 rounded-md text-[10px] font-black ${
                            m.balance >= 0 ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'
                          }`}>
                            {m.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Accommodations */}
              {consensusResult.recommended_accommodations && consensusResult.recommended_accommodations.length > 0 && (
                <div>
                  <h5 className="font-extrabold text-xs text-slate-800 uppercase tracking-wider mb-2">
                    🏨 Group Room Sharing Lodges:
                  </h5>
                  <div className="space-y-2">
                    {consensusResult.recommended_accommodations.map((acc, aIdx) => (
                      <div key={aIdx} className="p-3 bg-white border border-slate-200 rounded-xl flex items-center justify-between text-xs shadow-2xs">
                        <div>
                          <strong>{acc.name}</strong> ({acc.type})
                          <p className="text-[11px] text-slate-500">{acc.suitability_rating}</p>
                        </div>
                        <span className="font-bold text-emerald-700">₹{Math.round(acc.price_per_night).toLocaleString()} / night</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Transportation */}
              {consensusResult.transportation_options && consensusResult.transportation_options.length > 0 && (
                <div>
                  <h5 className="font-extrabold text-xs text-slate-800 uppercase tracking-wider mb-2">
                    🚐 Shared Group Vehicle & Transit Options:
                  </h5>
                  <div className="space-y-2">
                    {consensusResult.transportation_options.map((tr, tIdx) => (
                      <div key={tIdx} className="p-3 bg-white border border-slate-200 rounded-xl flex items-center justify-between text-xs shadow-2xs">
                        <div>
                          <strong>{tr.mode}</strong>
                          <p className="text-[11px] text-slate-500">{tr.recommendation_verdict}</p>
                        </div>
                        <span className="font-bold text-brand-600">₹{Math.round(tr.estimated_cost_per_person).toLocaleString()} / person</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

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
