import React, { useState, useEffect } from 'react';

const PERSONAS = [
  { key: "solo", label: "Solo Backpacker", icon: "fa-person-walking", defaultCount: 1, desc: "Fast-paced & budget stays" },
  { key: "couple", label: "Couple / Romantic", icon: "fa-heart", defaultCount: 2, desc: "Scenic & boutique dining" },
  { key: "family", label: "Family Vacation", icon: "fa-people-roof", defaultCount: 4, desc: "Comfort, kids & safety" },
  { key: "friends", label: "Friends Adventure", icon: "fa-user-group", defaultCount: 4, desc: "Sharing lodges & thrills" },
  { key: "college_group", label: "College Group", icon: "fa-graduation-cap", defaultCount: 6, desc: "Lowest budget dorm sharing" },
  { key: "seniors", label: "Senior Citizens", icon: "fa-wheelchair", defaultCount: 2, desc: "Gentle pace & comfort" }
];

export default function SearchBar({
  origin = "Hyderabad, Telangana, India",
  destination = "Goa, India",
  duration = 3,
  travelersCount = 4,
  travelerType = "friends",
  startDate = "",
  onStartDateChange,
  isPlanning,
  onOriginChange,
  onDestinationChange,
  onDurationChange,
  onTravelersCountChange,
  onPersonaSelect,
  onExecutePlanning
}) {
  const [hasChanged, setHasChanged] = useState(false);

  // Trigger subtle pulse feedback when trip settings change
  useEffect(() => {
    setHasChanged(true);
    const timer = setTimeout(() => setHasChanged(false), 2500);
    return () => clearTimeout(timer);
  }, [duration, travelersCount, travelerType, startDate, destination]);

  function handleKeyDown(e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      onExecutePlanning();
    }
  }

  const activePersonaObj = PERSONAS.find(p => p.key === travelerType) || PERSONAS[3];
  const cleanDestination = (destination || "").split("(")[0].split(",")[0].trim();

  // Helper date calculations
  function formatDisplayDate(dateStr) {
    if (!dateStr) return "";
    try {
      const d = new Date(dateStr + "T00:00:00");
      return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    } catch {
      return dateStr;
    }
  }

  function calculateEndDate(startStr, days) {
    if (!startStr) return "";
    try {
      const d = new Date(startStr + "T00:00:00");
      d.setDate(d.getDate() + (Number(days) || 3) - 1);
      return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    } catch {
      return "";
    }
  }

  const formattedStart = formatDisplayDate(startDate);
  const formattedEnd = calculateEndDate(startDate, duration);

  return (
    <div 
      onKeyDown={handleKeyDown}
      className="relative z-20 mt-6 bg-white/95 backdrop-blur-xl rounded-[2.2rem] p-4 sm:p-6 shadow-[0_20px_50px_rgba(15,23,42,0.09)] border border-slate-200/90 text-slate-800 space-y-4"
    >
      
      {/* 1. Core Inputs Grid: Destination, Dates, Days, Travelers, Action CTA */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-3 items-stretch">
        
        {/* Destination (Where to?) - 3 Cols */}
        <div className="lg:col-span-3 flex items-center gap-3 px-3.5 py-3 bg-slate-50/95 rounded-2xl border border-slate-200/80 hover:border-brand-500 focus-within:border-brand-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-brand-500/10 transition shadow-2xs">
          <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold text-xs shrink-0">
            <i className="fa-solid fa-location-dot"></i>
          </div>
          <div className="flex-1 min-w-0">
            <label className="block text-[10px] uppercase font-black text-slate-400 tracking-wider">Destination</label>
            <select 
              value={destination} 
              onChange={(e) => onDestinationChange(e.target.value)}
              className="w-full bg-transparent text-xs font-black text-slate-900 focus:outline-none cursor-pointer truncate"
            >
              <optgroup label="🇮🇳 India Tourist Circuits">
                <option value="Goa, India">Goa (Baga Beach, Dudhsagar & Forts)</option>
                <option value="Hyderabad, Telangana">Hyderabad (Charminar, Golconda & Biryani)</option>
                <option value="Visakhapatnam, Andhra Pradesh">Visakhapatnam / Vizag (Submarine & Araku)</option>
                <option value="Kerala (Kochi, Alappuzha, Munnar), India">Kerala (Backwaters, Houseboat & Munnar)</option>
                <option value="Delhi, Agra & Taj Mahal, India">Delhi & Agra (Taj Mahal, Red Fort & Qutub)</option>
                <option value="Kashmir & Srinagar, India">Kashmir (Dal Lake, Gulmarg & Pahalgam)</option>
                <option value="Manali & Shimla, Himachal Pradesh">Manali & Solang Valley (Atal Tunnel)</option>
                <option value="Jaipur & Udaipur, Rajasthan">Jaipur & Udaipur (Amber Fort & Hawa Mahal)</option>
                <option value="Varanasi, Uttar Pradesh">Varanasi (Kashi Vishwanath & Ganga Aarti)</option>
                <option value="Ladakh, India">Ladakh (Pangong Tso & Khardung La)</option>
                <option value="Ooty, Tamil Nadu, India">Ooty (Toy Train & Nilgiri Hills)</option>
              </optgroup>
              <optgroup label="🌟 International Tours">
                <option value="Switzerland (Zurich, Lucerne, Interlaken, Grindelwald)">Switzerland (Zurich, Lucerne, Interlaken)</option>
                <option value="Paris, France">Paris, France (Eiffel Tower & Louvre)</option>
                <option value="Dubai, United Arab Emirates">Dubai, UAE (Burj Khalifa & Safari)</option>
                <option value="Rome, Italy">Rome, Italy (Colosseum & Vatican)</option>
                <option value="Tokyo, Japan">Tokyo, Japan (Shibuya & Senso-ji)</option>
                <option value="Singapore">Singapore (Marina Bay & Sentosa)</option>
              </optgroup>
            </select>
          </div>
        </div>

        {/* Travel Dates Picker - 3 Cols */}
        <div className="lg:col-span-3 flex items-center gap-3 px-3.5 py-2.5 bg-slate-50/95 rounded-2xl border border-slate-200/80 hover:border-brand-500 focus-within:border-brand-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-brand-500/10 transition shadow-2xs">
          <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xs shrink-0">
            <i className="fa-regular fa-calendar-days"></i>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <label className="block text-[10px] uppercase font-black text-slate-400 tracking-wider">Travel Dates</label>
              {formattedEnd && (
                <span className="text-[9px] font-black text-indigo-700 bg-indigo-50 px-1.5 py-0.2 rounded">
                  {duration} Days
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              <input 
                type="date" 
                value={startDate}
                onChange={(e) => onStartDateChange && onStartDateChange(e.target.value)}
                className="bg-transparent text-xs font-black text-slate-900 focus:outline-none cursor-pointer w-full"
                title="Select travel start date"
              />
            </div>
            {formattedStart && formattedEnd && (
              <span className="text-[10px] font-bold text-slate-500 truncate block mt-0.5">
                {formattedStart} → {formattedEnd}
              </span>
            )}
          </div>
        </div>

        {/* Days Stepper - 2 Cols */}
        <div className="lg:col-span-2 flex flex-col justify-between px-3.5 py-2 bg-slate-50/95 rounded-2xl border border-slate-200/80 hover:border-slate-300 transition shadow-2xs">
          <div className="flex items-center justify-between">
            <label className="text-[10px] uppercase font-black text-slate-400 tracking-wider">
              <i className="fa-regular fa-calendar mr-1 text-slate-400"></i>Days
            </label>
            <div className="flex items-center gap-1">
              <button 
                type="button"
                onClick={() => onDurationChange(Math.max(1, duration - 1))}
                className="w-5 h-5 rounded-md bg-white hover:bg-slate-200 border border-slate-200 text-slate-700 font-black text-[11px] flex items-center justify-center transition active:scale-95"
                title="Decrease Days"
              >
                -
              </button>
              <button 
                type="button"
                onClick={() => onDurationChange(Math.min(15, duration + 1))}
                className="w-5 h-5 rounded-md bg-white hover:bg-slate-200 border border-slate-200 text-slate-700 font-black text-[11px] flex items-center justify-center transition active:scale-95"
                title="Increase Days"
              >
                +
              </button>
            </div>
          </div>
          <div className="flex items-baseline justify-between mt-0.5">
            <span className="text-xs font-black text-slate-900">{duration} Days</span>
            <div className="flex gap-1">
              {[3, 5, 7].map(d => (
                <button
                  key={d}
                  type="button"
                  onClick={() => onDurationChange(d)}
                  className={`text-[9px] font-black px-1.5 py-0.5 rounded transition ${
                    duration === d ? 'bg-brand-600 text-white' : 'bg-slate-200/70 text-slate-600 hover:bg-slate-300'
                  }`}
                >
                  {d}d
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Travelers / Group Stepper - 2 Cols */}
        <div className="lg:col-span-2 flex flex-col justify-between px-3.5 py-2 bg-slate-50/95 rounded-2xl border border-slate-200/80 hover:border-slate-300 transition shadow-2xs">
          <div className="flex items-center justify-between">
            <label className="text-[10px] uppercase font-black text-slate-400 tracking-wider">
              <i className="fa-solid fa-users mr-1 text-slate-400"></i>Travelers
            </label>
            <div className="flex items-center gap-1">
              <button 
                type="button"
                onClick={() => onTravelersCountChange(Math.max(1, travelersCount - 1))}
                className="w-5 h-5 rounded-md bg-white hover:bg-slate-200 border border-slate-200 text-slate-700 font-black text-[11px] flex items-center justify-center transition active:scale-95"
                title="Decrease Travelers"
              >
                -
              </button>
              <button 
                type="button"
                onClick={() => onTravelersCountChange(Math.min(20, travelersCount + 1))}
                className="w-5 h-5 rounded-md bg-white hover:bg-slate-200 border border-slate-200 text-slate-700 font-black text-[11px] flex items-center justify-center transition active:scale-95"
                title="Increase Travelers"
              >
                +
              </button>
            </div>
          </div>
          <div className="flex items-baseline justify-between mt-0.5">
            <span className="text-xs font-black text-slate-900">
              {travelersCount} {travelersCount > 1 ? 'People' : 'Person'}
            </span>
            <div className="flex gap-1">
              {[1, 2, 4, 6].map(c => (
                <button
                  key={c}
                  type="button"
                  onClick={() => onTravelersCountChange(c)}
                  className={`text-[9px] font-black px-1.5 py-0.5 rounded transition ${
                    travelersCount === c ? 'bg-brand-600 text-white' : 'bg-slate-200/70 text-slate-600 hover:bg-slate-300'
                  }`}
                >
                  {c}p
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* PRIMARY ENTER ACTION BUTTON - 2 Cols */}
        <div className="lg:col-span-2 flex items-center">
          <button
            type="button"
            onClick={onExecutePlanning}
            disabled={isPlanning}
            className={`w-full h-full min-h-[50px] rounded-2xl bg-gradient-to-r from-brand-600 via-indigo-600 to-purple-600 hover:from-brand-700 hover:to-purple-700 active:scale-96 text-white font-black text-xs shadow-xl shadow-brand-500/30 flex items-center justify-center gap-2 transition duration-200 tracking-wide uppercase group cursor-pointer border border-white/20 ${
              hasChanged ? 'ring-4 ring-amber-400/60 ring-offset-2 animate-pulse' : ''
            }`}
            title="Press Enter to generate itinerary"
          >
            {isPlanning ? (
              <>
                <i className="fa-solid fa-spinner fa-spin text-sm"></i>
                <span className="font-extrabold">Planning...</span>
              </>
            ) : (
              <>
                <span className="w-6 h-6 rounded-lg bg-white/20 text-white flex items-center justify-center text-xs font-mono font-bold group-hover:scale-110 group-hover:bg-amber-400 group-hover:text-slate-950 transition">
                  ⏎
                </span>
                <span className="font-extrabold tracking-wider">ENTER PLAN</span>
              </>
            )}
          </button>
        </div>

      </div>

      {/* 2. Secondary Row: Origin & Travel Style (Personas) */}
      <div className="pt-2 border-t border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Origin Selector */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">From:</span>
          <select 
            value={origin} 
            onChange={(e) => onOriginChange(e.target.value)}
            className="bg-slate-100/80 hover:bg-slate-200 text-slate-800 text-xs font-extrabold px-3 py-1.5 rounded-xl border border-slate-200/80 focus:outline-none cursor-pointer"
          >
            <option value="Hyderabad, Telangana, India">Hyderabad, Telangana</option>
            <option value="Visakhapatnam, Andhra Pradesh, India">Visakhapatnam (Vizag)</option>
            <option value="Mumbai, Maharashtra, India">Mumbai</option>
            <option value="New Delhi, India">New Delhi</option>
            <option value="Bengaluru, Karnataka, India">Bengaluru</option>
            <option value="Goa, India">Goa</option>
            <option value="London, United Kingdom">London, UK</option>
            <option value="Dubai, United Arab Emirates">Dubai, UAE</option>
            <option value="Zurich, Switzerland">Zurich, Switzerland</option>
          </select>
        </div>

        {/* Persona Quick Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none flex-1">
          <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider mr-1 shrink-0">
            Style:
          </span>
          {PERSONAS.map((p) => {
            const isSelected = travelerType === p.key;
            return (
              <button
                key={p.key}
                type="button"
                onClick={() => onPersonaSelect(p.key, p.defaultCount)}
                className={`px-3 py-1.5 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all duration-200 flex items-center gap-1.5 cursor-pointer ${
                  isSelected
                    ? 'bg-slate-900 text-white shadow-md shadow-slate-900/20 scale-102 ring-2 ring-brand-500'
                    : 'bg-slate-100/90 hover:bg-slate-200 text-slate-700'
                }`}
              >
                <i className={`fa-solid ${p.icon} text-[11px] ${isSelected ? 'text-amber-400' : 'text-slate-400'}`}></i>
                <span>{p.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. TRIP CONFIGURATION SUMMARY PILL (Shows Destination, Dates, Duration & Group) */}
      <div className="p-3 sm:p-4 rounded-2xl bg-gradient-to-r from-brand-50/90 via-indigo-50/70 to-purple-50/80 border border-brand-200/90 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-2xs">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-md shadow-brand-500/25 shrink-0">
            <i className="fa-solid fa-umbrella-beach text-amber-300"></i>
          </div>
          <div className="text-left min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-brand-600 text-white shadow-2xs">
                Trip Configured
              </span>
              <span className="text-xs font-black text-slate-900 truncate">
                📍 {cleanDestination}  ·  🗓️ {duration} Days ({formattedStart || "Custom Dates"}{formattedEnd ? ` → ${formattedEnd}` : ''})
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium truncate mt-0.5">
              👥 <strong>{travelersCount} Travelers</strong> ({activePersonaObj.label}) · Weather Forecast & Proximity Shields Active
            </p>
          </div>
        </div>

        {/* Enter CTA Button */}
        <button
          type="button"
          onClick={onExecutePlanning}
          disabled={isPlanning}
          className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 via-indigo-600 to-purple-600 hover:from-brand-700 hover:to-purple-700 active:scale-95 text-white font-black text-xs shadow-md shadow-brand-500/20 flex items-center justify-center gap-2 transition duration-200 uppercase tracking-wide shrink-0 group cursor-pointer"
        >
          {isPlanning ? (
            <>
              <i className="fa-solid fa-spinner fa-spin text-xs"></i>
              <span>Generating {duration}-Day Plan...</span>
            </>
          ) : (
            <>
              <span className="px-1.5 py-0.5 rounded bg-white/20 text-[10px] font-mono font-bold group-hover:scale-110 transition">⏎</span>
              <span>Enter / Apply ({duration}d · {travelersCount}p)</span>
              <i className="fa-solid fa-arrow-right text-[11px] group-hover:translate-x-1 transition"></i>
            </>
          )}
        </button>
      </div>

    </div>
  );
}
