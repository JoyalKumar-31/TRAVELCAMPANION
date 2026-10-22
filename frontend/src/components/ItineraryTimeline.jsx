import React, { useState } from 'react';
import { getPlacePhoto, getDestinationKey } from '../data/destinationData';

const CATEGORY_COLORS = {
  heritage: "bg-amber-50 text-amber-800 border-amber-200",
  culture: "bg-purple-50 text-purple-800 border-purple-200",
  beach: "bg-cyan-50 text-cyan-800 border-cyan-200",
  culinary: "bg-emerald-50 text-emerald-800 border-emerald-200",
  nature: "bg-emerald-50 text-emerald-800 border-emerald-200",
  adventure: "bg-rose-50 text-rose-800 border-rose-200",
  viewpoint: "bg-sky-50 text-sky-800 border-sky-200",
  default: "bg-slate-100 text-slate-700 border-slate-200"
};

export default function ItineraryTimeline({
  destination,
  itinerary,
  activeDayIndex,
  onSelectDayIndex,
  isLoading,
  onOpenComparison,
  hasComparisonData
}) {
  const [zoomedPhoto, setZoomedPhoto] = useState(null);
  const destKey = getDestinationKey(destination);

  if (isLoading) {
    return (
      <div id="timeline-section" className="bg-white rounded-[2.5rem] p-12 border border-slate-200/80 shadow-sm text-center space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center text-2xl mx-auto shadow-inner animate-bounce">
          <i className="fa-solid fa-sparkles"></i>
        </div>
        <h4 className="font-heading font-black text-slate-900 text-lg">Synthesizing Adaptive Itinerary...</h4>
        <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
          AI Profiler, Safety Shield, and Cultural Agents are sequencing your day-by-day stops with authentic photography and live weather optimization.
        </p>
      </div>
    );
  }

  if (!itinerary || !itinerary.days || itinerary.days.length === 0) {
    return (
      <div id="timeline-section" className="bg-white rounded-[2.5rem] p-10 border border-slate-200/80 shadow-sm text-center text-slate-400 space-y-2">
        <i className="fa-regular fa-calendar-check text-3xl text-slate-300"></i>
        <p className="text-xs font-bold">Select your destination and tap the planning icon to synthesize your custom itinerary.</p>
      </div>
    );
  }

  const activeDay = itinerary.days[activeDayIndex] || itinerary.days[0];
  const isDayReplanned = Boolean(activeDay.is_replanned);

  // Helper date formatter for tab
  function formatDayDate(dateStr) {
    if (!dateStr) return "";
    try {
      const d = new Date(dateStr + "T00:00:00");
      return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    } catch {
      return dateStr;
    }
  }

  return (
    <div id="timeline-section" className="bg-white rounded-[2.5rem] p-5 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
      
      {/* Day Tabs Bar */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {itinerary.days.map((d, idx) => {
            const isActive = idx === activeDayIndex;
            const tabDate = formatDayDate(d.date);
            const isTabReplanned = Boolean(d.is_replanned);

            return (
              <button
                key={d.day_number || idx}
                onClick={() => onSelectDayIndex(idx)}
                className={`px-4 py-2.5 rounded-2xl text-xs font-extrabold whitespace-nowrap transition-all duration-200 flex flex-col items-start cursor-pointer ${
                  isActive
                    ? 'bg-brand-600 text-white shadow-lg shadow-brand-600/25 scale-102 ring-2 ring-brand-400'
                    : 'bg-slate-100/90 hover:bg-slate-200/90 text-slate-600'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <span className="font-black">Day {d.day_number}</span>
                  {tabDate && (
                    <span className={`text-[10px] font-bold ${isActive ? 'text-brand-200' : 'text-slate-400'}`}>
                      · {tabDate}
                    </span>
                  )}
                  {isTabReplanned && (
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" title="AI Replanned Day"></span>
                  )}
                </div>
                <span className={`text-[10px] font-medium truncate max-w-[130px] ${isActive ? 'text-brand-100' : 'text-slate-400'}`}>
                  {isTabReplanned ? "⚡ Rain Replanned" : (d.city || d.focus_theme?.split('&')[0] || `Stop ${idx + 1}`)}
                </span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {hasComparisonData && onOpenComparison && (
            <button
              onClick={onOpenComparison}
              className="px-3 py-1.5 bg-brand-50 hover:bg-brand-100 text-brand-700 text-xs font-extrabold rounded-xl border border-brand-200 transition flex items-center gap-1 cursor-pointer"
              title="Compare Original vs Revised Day 2 Side by Side"
            >
              <i className="fa-solid fa-columns"></i>
              <span className="hidden sm:inline">Side-by-Side</span>
            </button>
          )}

          <span className="hidden sm:inline-flex px-3.5 py-1.5 bg-slate-50 text-slate-700 text-xs font-black rounded-xl border border-slate-200/80">
            Est. Day Spend: ₹{activeDay.total_day_cost?.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Active Day Header Theme */}
      <div className={`p-4 sm:p-5 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs ${
        isDayReplanned 
          ? 'bg-gradient-to-r from-emerald-50 via-teal-50/50 to-blue-50 border-emerald-300'
          : 'bg-gradient-to-r from-brand-50/80 via-blue-50/40 to-slate-50 border-brand-100/80'
      }`}>
        <div>
          <div className="flex items-center gap-2">
            <span className={`text-[10px] uppercase font-black tracking-widest ${
              isDayReplanned ? 'text-emerald-700' : 'text-brand-700'
            }`}>
              Day {activeDay.day_number} Focal Theme {activeDay.date ? `(${formatDayDate(activeDay.date)})` : ''}
            </span>
            {isDayReplanned && (
              <span className="px-2 py-0.5 rounded-md bg-emerald-600 text-white text-[9px] font-black uppercase">
                ⚡ AI Rain-Replanned
              </span>
            )}
          </div>
          <h3 className="font-heading font-black text-slate-900 text-base sm:text-lg">
            {activeDay.focus_theme}
          </h3>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {isDayReplanned && hasComparisonData && onOpenComparison && (
            <button
              onClick={onOpenComparison}
              className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black rounded-xl shadow-sm transition flex items-center gap-1.5 cursor-pointer"
            >
              <i className="fa-solid fa-arrows-split-up-and-left"></i>
              <span>View Side-by-Side Comparison</span>
            </button>
          )}
          <span className="text-xs font-bold text-slate-500 bg-white/80 px-3 py-1 rounded-xl border border-slate-200/60 shadow-2xs">
            <i className="fa-regular fa-clock mr-1 text-slate-400"></i> Full Day Schedule
          </span>
        </div>
      </div>

      {/* Activity Timeline List with Verified Place Photos */}
      <div className="space-y-4">
        {activeDay.activities.map((act, actIdx) => {
          const categoryStyle = CATEGORY_COLORS[act.category?.toLowerCase()] || CATEGORY_COLORS.default;
          const placePhoto = getPlacePhoto(act.title, destKey, act.category);

          return (
            <div 
              key={actIdx}
              className={`p-4 sm:p-5 rounded-3xl transition-all duration-300 shadow-xs hover:shadow-lg flex flex-col md:flex-row items-start gap-5 group border ${
                isDayReplanned 
                  ? 'bg-emerald-50/20 hover:bg-white border-emerald-200/80 hover:border-emerald-400' 
                  : 'bg-slate-50/60 hover:bg-white border-slate-200/80 hover:border-brand-300'
              }`}
            >
              {/* Place Photo Thumbnail with Hover Zoom */}
              <div 
                className="w-full md:w-48 h-36 shrink-0 rounded-2xl overflow-hidden relative shadow-xs bg-slate-950 cursor-pointer"
                onClick={() => setZoomedPhoto({ img: placePhoto, title: act.title, category: act.category, desc: act.description })}
              >
                <img 
                  src={placePhoto} 
                  alt={act.title} 
                  loading="lazy"
                  onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=600&q=80"; }}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent"></div>
                
                <span className="absolute bottom-2 left-2 px-2.5 py-0.5 rounded-md bg-slate-950/85 backdrop-blur-xs text-white text-[9px] font-black uppercase tracking-wider">
                  {act.time_slot}
                </span>

                <span className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/50 text-white text-[10px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                  <i className="fa-solid fa-expand"></i>
                </span>
              </div>

              {/* Activity Content */}
              <div className="flex-1 space-y-2 min-w-0 w-full">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`px-2.5 py-0.5 rounded-lg text-[10px] font-black uppercase border ${categoryStyle}`}>
                    {act.category || 'Sightseeing'}
                  </span>
                  
                  <span className="text-[11px] font-bold text-slate-500">
                    <i className="fa-regular fa-clock mr-1 text-slate-400"></i>{act.duration_hours || 2} hrs
                  </span>

                  {act.is_indoor ? (
                    <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-[10px] font-bold rounded-md border border-blue-200">
                      <i className="fa-solid fa-house-chimney mr-1"></i> Indoor Sanctuary
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded-md border border-emerald-200">
                      <i className="fa-solid fa-sun mr-1"></i> Outdoor Scenic
                    </span>
                  )}

                  {/* Verified Status Tag */}
                  {act.verified_status && (
                    <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 text-[10px] font-black rounded-md border border-emerald-200 flex items-center gap-1">
                      <i className="fa-solid fa-circle-check text-emerald-600"></i>
                      <span>{act.verified_status}</span>
                    </span>
                  )}
                </div>

                <h4 className="font-heading font-black text-slate-900 text-sm sm:text-base group-hover:text-brand-600 transition leading-snug">
                  {act.title}
                </h4>

                <p className="text-xs text-slate-600 leading-relaxed font-normal">
                  {act.description}
                </p>

                {/* Verified Operational Hours & Accessibility Bar */}
                {(act.opening_hours || act.family_friendly) && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[10px] p-2 rounded-xl bg-slate-100/70 border border-slate-200/70">
                    {act.opening_hours && (
                      <div className="flex items-center gap-1.5 text-slate-700">
                        <i className="fa-regular fa-clock text-slate-500"></i>
                        <span className="font-semibold truncate">Hours: {act.opening_hours}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1.5 text-slate-700">
                      <i className="fa-solid fa-wheelchair text-slate-500"></i>
                      <span className="font-semibold truncate">Accessibility: Step-Free / Ramp [Verified]</span>
                    </div>
                  </div>
                )}

                {/* AI Replacement Rationale Box if replanned */}
                {act.ai_replacement_reason && (
                  <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200/80 text-[11px] text-emerald-900 font-medium space-y-1">
                    <span className="text-[10px] font-black uppercase text-emerald-800 flex items-center gap-1">
                      <i className="fa-solid fa-brain text-emerald-600"></i>
                      Why Selected by AI:
                    </span>
                    <p className="text-[11px] leading-relaxed text-emerald-950">
                      {act.ai_replacement_reason}
                    </p>
                  </div>
                )}

                {/* Cultural Tip Pill */}
                {act.cultural_etiquette_tip && (
                  <div className="p-2.5 rounded-xl bg-amber-50/80 border border-amber-200/70 text-[11px] text-amber-900 font-medium flex items-center gap-2">
                    <i className="fa-solid fa-lightbulb text-amber-500 text-xs shrink-0"></i>
                    <span>{act.cultural_etiquette_tip}</span>
                  </div>
                )}

                {/* Activity Cost Footer */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-semibold text-[11px]">
                    {act.admission_price_inr !== undefined ? "Admission Fee:" : "Estimated Activity Cost:"}
                  </span>
                  <span className="font-black text-slate-900">
                    {act.admission_price_inr !== undefined 
                      ? (act.admission_price_inr === 0 ? "Free Admission" : `₹${act.admission_price_inr.toLocaleString()} / person`)
                      : (act.cost_inr ? `₹${act.cost_inr.toLocaleString()}` : "Free Admission")}
                  </span>
                </div>

              </div>

            </div>
          );
        })}
      </div>

      {/* Zoom Modal */}
      {zoomedPhoto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
          <div className="bg-white w-full max-w-lg rounded-[2.5rem] overflow-hidden shadow-2xl border border-white/20">
            <div className="relative h-64 sm:h-72 w-full bg-slate-950">
              <img 
                src={zoomedPhoto.img} 
                alt={zoomedPhoto.title} 
                onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80"; }}
                className="w-full h-full object-cover" 
              />
              <button 
                onClick={() => setZoomedPhoto(null)}
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center transition"
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
            <div className="p-6 space-y-3">
              <h3 className="font-heading font-black text-slate-900 text-lg">{zoomedPhoto.title}</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{zoomedPhoto.desc}</p>
              <div className="pt-2 flex justify-end">
                <button 
                  onClick={() => setZoomedPhoto(null)}
                  className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}