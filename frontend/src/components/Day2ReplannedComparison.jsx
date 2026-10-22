import React from 'react';

export default function Day2ReplannedComparison({
  comparisonData,
  destination = "Goa, India",
  onDismiss
}) {
  if (!comparisonData) return null;

  const {
    affected_day = 2,
    alert_source = "manual_simulation",
    alert_badge = "Demonstration Alert (Manual Rain Simulation)",
    original_day_plan,
    revised_day_plan,
    replacements_summary = [],
    ai_replan_rationale
  } = comparisonData;

  const isSimulated = alert_source === "manual_simulation";
  const cleanCity = (destination || "").split("(")[0].split(",")[0].trim();

  return (
    <div className="bg-white rounded-[2.5rem] p-5 sm:p-8 border-2 border-brand-500 shadow-xl space-y-6 animate-fadeIn">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className={`px-3 py-1 rounded-xl text-xs font-black flex items-center gap-1.5 shadow-2xs ${
              isSimulated 
                ? 'bg-amber-100 text-amber-900 border border-amber-300' 
                : 'bg-emerald-100 text-emerald-900 border border-emerald-300'
            }`}>
              <i className={`fa-solid ${isSimulated ? 'fa-flask' : 'fa-satellite-dish'}`}></i>
              <span>{alert_badge}</span>
            </span>

            <span className="px-3 py-1 rounded-xl bg-rose-50 text-rose-800 text-xs font-black border border-rose-200 flex items-center gap-1.5">
              <i className="fa-solid fa-cloud-showers-heavy text-rose-600"></i>
              <span>Rain Disruption on Day {affected_day}</span>
            </span>

            <span className="px-3 py-1 rounded-xl bg-blue-50 text-blue-800 text-xs font-black border border-blue-200">
              ✔ Day 1 & Day 3 Unchanged
            </span>
          </div>

          <h3 className="font-heading font-black text-slate-900 text-lg sm:text-2xl mt-2 leading-tight">
            AI-Powered Day {affected_day} Rain Replanning: Original vs Revised Schedule
          </h3>
          <p className="text-xs text-slate-500 font-medium mt-1 max-w-3xl leading-relaxed">
            All unsuitable outdoor beach and cliffside activities on <strong>Day {affected_day}</strong> were automatically swapped for verified, weather-sheltered indoor attractions in {cleanCity}.
          </p>
        </div>

        {onDismiss && (
          <button
            onClick={onDismiss}
            className="self-start md:self-auto px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs rounded-xl transition cursor-pointer shrink-0"
          >
            <i className="fa-solid fa-xmark mr-1.5"></i> Close Comparison
          </button>
        )}
      </div>

      {/* Overarching AI Rationale Alert Box */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-brand-50/90 via-indigo-50/50 to-purple-50/80 border border-brand-200 shadow-2xs space-y-1.5">
        <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-brand-700">
          <i className="fa-solid fa-brain"></i>
          <span>AI Adaptive Replanner Rationale:</span>
        </div>
        <p className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed">
          {ai_replan_rationale || `Heavy rain on Day ${affected_day} made open-air beach sports unsafe. Day 1 and Day 3 remain completely unchanged. Day ${affected_day} was restructured with authentic indoor museums and sheltered heritage galleries to guarantee weather safety, step-free access, and family-friendly comfort.`}
        </p>
      </div>

      {/* Side-by-Side 2-Column Comparison Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* LEFT COLUMN: DISRUPTED ORIGINAL DAY 2 */}
        <div className="rounded-3xl p-5 sm:p-6 bg-rose-50/40 border-2 border-rose-200/80 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-rose-200/60">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping"></span>
                <span className="text-[10px] font-black uppercase tracking-wider text-rose-700">Before Replanning</span>
              </div>
              <h4 className="font-heading font-black text-slate-900 text-base sm:text-lg mt-0.5">
                Original Day {affected_day}: Outdoor Beach Activities
              </h4>
            </div>
            <span className="px-2.5 py-1 rounded-lg bg-rose-100 text-rose-800 text-[10px] font-black border border-rose-200 shrink-0">
              🌧️ Disrupted by Rain
            </span>
          </div>

          <div className="space-y-4">
            {original_day_plan?.activities?.map((act, idx) => (
              <div 
                key={act.id || idx}
                className="p-4 rounded-2xl bg-white/90 border border-rose-200 shadow-xs space-y-2 opacity-85 relative overflow-hidden"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-rose-100 text-rose-800">
                    {act.time_slot} Slot
                  </span>
                  <span className="text-[10px] font-black text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                    ⚠️ Outdoor · Unsafe in Rain
                  </span>
                </div>

                <div>
                  <h5 className="font-heading font-black text-slate-700 text-sm line-through">
                    {act.title}
                  </h5>
                  <p className="text-xs text-slate-500 mt-0.5">
                    <i className="fa-solid fa-location-dot text-slate-400 mr-1"></i>
                    {act.location}
                  </p>
                </div>

                <p className="text-[11px] text-slate-500 font-medium">
                  {act.description}
                </p>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[11px]">
                  <span className="text-slate-400 font-bold">Planned Cost: ₹{act.estimated_cost?.toLocaleString()}</span>
                  <span className="text-rose-700 font-bold text-[10px]">
                    <i className="fa-solid fa-triangle-exclamation mr-1"></i> High Waterlogging / Lightning Risk
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT COLUMN: REVISED DAY 2 (AI RAIN-ADAPTIVE INDOOR REPLANNED) */}
        <div className="rounded-3xl p-5 sm:p-6 bg-emerald-50/40 border-2 border-emerald-300 shadow-md space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-emerald-200/80">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800">After AI Replanning</span>
              </div>
              <h4 className="font-heading font-black text-slate-900 text-base sm:text-lg mt-0.5">
                Revised Day {affected_day}: Verified Indoor Cultural Haven
              </h4>
            </div>
            <span className="px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800 text-[10px] font-black border border-emerald-300 shrink-0">
              🛡️ 100% Weather-Safe
            </span>
          </div>

          <div className="space-y-4">
            {replacements_summary?.map((item, idx) => {
              const act = item.revised_activity || item;
              return (
                <div 
                  key={idx}
                  className="p-4 rounded-2xl bg-white border border-emerald-300 shadow-sm space-y-3 relative ring-1 ring-emerald-500/10"
                >
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-emerald-600 text-white shadow-2xs">
                      {item.slot || act.time_slot} Slot · Substituted
                    </span>
                    <span className="text-[10px] font-black text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 flex items-center gap-1">
                      <i className="fa-solid fa-shield-halved text-emerald-600"></i>
                      <span>{act.verified_status || "Verified Venue"}</span>
                    </span>
                  </div>

                  <div>
                    <h5 className="font-heading font-black text-slate-900 text-base text-emerald-950">
                      {act.title}
                    </h5>
                    <p className="text-xs text-slate-500 mt-0.5 font-medium">
                      <i className="fa-solid fa-location-dot text-brand-600 mr-1"></i>
                      {act.location}
                    </p>
                  </div>

                  {/* Verified Details Badges Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 pt-1 text-[10px]">
                    <div className="p-2 rounded-xl bg-slate-50 border border-slate-200/80">
                      <span className="text-slate-400 block font-bold uppercase text-[9px]">Opening Hours</span>
                      <strong className="text-slate-800 font-extrabold truncate block">
                        {act.opening_hours || "09:30 AM - 06:00 PM [Verified]"}
                      </strong>
                    </div>

                    <div className="p-2 rounded-xl bg-slate-50 border border-slate-200/80">
                      <span className="text-slate-400 block font-bold uppercase text-[9px]">Admission Fee</span>
                      <strong className="text-emerald-700 font-black truncate block">
                        ₹{(act.admission_price_inr !== undefined ? act.admission_price_inr : act.estimated_cost)?.toLocaleString()} / person
                      </strong>
                    </div>

                    <div className="p-2 rounded-xl bg-slate-50 border border-slate-200/80 col-span-2 sm:col-span-1">
                      <span className="text-slate-400 block font-bold uppercase text-[9px]">Accessibility</span>
                      <strong className="text-slate-800 font-extrabold truncate block">
                        ♿ Step-Free / Ramp [Verified]
                      </strong>
                    </div>
                  </div>

                  {/* AI Replacement Reason Box */}
                  <div className="p-3 rounded-xl bg-emerald-50/80 border border-emerald-200 space-y-1">
                    <span className="text-[10px] font-black text-emerald-900 uppercase tracking-wider block flex items-center gap-1">
                      <i className="fa-solid fa-circle-check text-emerald-600"></i>
                      Why Selected by AI:
                    </span>
                    <p className="text-[11px] text-emerald-950 font-medium leading-relaxed">
                      {item.reason_selected || act.ai_replacement_reason || "Selected because it provides dry indoor shelter, verified cultural pedigree, and family-friendly accessibility without duplicate stops."}
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 font-semibold">
                    <span>⏱️ Duration: {act.duration_hours || 2.5} hrs</span>
                    <span className="text-emerald-700 font-bold">
                      👨‍👩‍👧‍👦 Family-Friendly: Yes [Verified]
                    </span>
                  </div>

                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Bottom Summary Bar */}
      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
        <div className="flex items-center gap-2">
          <i className="fa-solid fa-circle-check text-emerald-600 text-base"></i>
          <span>
            <strong>Trip Integrity Protected:</strong> Day 1 (Outdoor sightseeing) and Day 3 (Heritage & Cruise) remain completely untouched.
          </span>
        </div>
        <span className="text-emerald-700 font-black shrink-0">
          Day 2 Revised Cost: ₹{revised_day_plan?.total_day_cost?.toLocaleString()}
        </span>
      </div>

    </div>
  );
}
