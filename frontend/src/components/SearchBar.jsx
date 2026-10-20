import React from 'react';

const PERSONAS = [
  { key: "solo", label: "Solo Backpacker", icon: "fa-person-walking", defaultCount: 1, desc: "Fast-paced & budget stays" },
  { key: "couple", label: "Couple / Romantic", icon: "fa-heart", defaultCount: 2, desc: "Scenic & boutique dining" },
  { key: "family", label: "Family Vacation", icon: "fa-people-roof", defaultCount: 4, desc: "Comfort, kids & safety" },
  { key: "friends", label: "Friends Adventure", icon: "fa-user-group", defaultCount: 4, desc: "Sharing lodges & thrills" },
  { key: "college_group", label: "College Group", icon: "fa-graduation-cap", defaultCount: 6, desc: "Lowest budget dorm sharing" },
  { key: "seniors", label: "Senior Citizens", icon: "fa-wheelchair", defaultCount: 2, desc: "Gentle pace & comfort" }
];

export default function SearchBar({
  origin,
  destination,
  duration,
  travelersCount,
  travelerType,
  isPlanning,
  onOriginChange,
  onDestinationChange,
  onDurationChange,
  onTravelersCountChange,
  onPersonaSelect,
  onExecutePlanning
}) {
  function handleSwapLocations() {
    // Only swap if both are valid
    if (origin && destination) {
      const temp = origin;
      onOriginChange(destination.split('(')[0].trim());
      onDestinationChange(temp);
    }
  }

  return (
    <div className="relative z-20 mt-6 bg-white/95 backdrop-blur-xl rounded-[2rem] p-4 sm:p-6 shadow-[0_20px_50px_rgba(15,23,42,0.08)] border border-slate-200/80 text-slate-800 space-y-4">
      
      {/* 1. Core Inputs Grid: From, Swap, To, Duration, Travelers, CTA */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-3 items-center">
        
        {/* Origin (From) */}
        <div className="lg:col-span-3 flex items-center gap-3 px-4 py-3 bg-slate-50/90 rounded-2xl border border-slate-200/80 hover:border-brand-500 focus-within:border-brand-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-brand-500/10 transition shadow-xs">
          <div className="w-8 h-8 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center font-bold text-sm shrink-0">
            <i className="fa-solid fa-location-crosshairs"></i>
          </div>
          <div className="flex-1 min-w-0">
            <label className="block text-[10px] uppercase font-black text-slate-400 tracking-wider">From (Origin)</label>
            <select 
              value={origin} 
              onChange={(e) => onOriginChange(e.target.value)}
              className="w-full bg-transparent text-xs font-extrabold text-slate-900 focus:outline-none cursor-pointer truncate"
            >
              <optgroup label="Popular Indian Origins">
                <option value="Hyderabad, Telangana, India">Hyderabad, Telangana</option>
                <option value="Visakhapatnam, Andhra Pradesh, India">Visakhapatnam (Vizag)</option>
                <option value="Mumbai, Maharashtra, India">Mumbai</option>
                <option value="New Delhi, India">New Delhi</option>
                <option value="Bengaluru, Karnataka, India">Bengaluru</option>
                <option value="Chennai, Tamil Nadu, India">Chennai</option>
                <option value="Kolkata, West Bengal, India">Kolkata</option>
                <option value="Pune, Maharashtra, India">Pune</option>
                <option value="Kochi, Kerala, India">Kochi</option>
                <option value="Goa, India">Goa</option>
              </optgroup>
              <optgroup label="International Departure Hubs">
                <option value="London, United Kingdom">London, UK</option>
                <option value="Dubai, United Arab Emirates">Dubai, UAE</option>
                <option value="Singapore">Singapore</option>
                <option value="Zurich, Switzerland">Zurich, Switzerland</option>
                <option value="Paris, France">Paris, France</option>
              </optgroup>
            </select>
          </div>
        </div>

        {/* Swap Button (Hidden on small mobile) */}
        <div className="hidden lg:flex lg:col-span-1 justify-center">
          <button
            onClick={handleSwapLocations}
            className="w-9 h-9 rounded-full bg-slate-100 hover:bg-brand-50 hover:text-brand-600 text-slate-500 flex items-center justify-center transition border border-slate-200/80 shadow-xs"
            title="Swap Locations"
          >
            <i className="fa-solid fa-arrow-right-arrow-left text-xs"></i>
          </button>
        </div>

        {/* Destination (Where to?) */}
        <div className="lg:col-span-3 flex items-center gap-3 px-4 py-3 bg-slate-50/90 rounded-2xl border border-slate-200/80 hover:border-brand-500 focus-within:border-brand-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-brand-500/10 transition shadow-xs">
          <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold text-sm shrink-0">
            <i className="fa-solid fa-location-dot"></i>
          </div>
          <div className="flex-1 min-w-0">
            <label className="block text-[10px] uppercase font-black text-slate-400 tracking-wider">Where to? (Destination)</label>
            <select 
              value={destination} 
              onChange={(e) => onDestinationChange(e.target.value)}
              className="w-full bg-transparent text-xs font-extrabold text-slate-900 focus:outline-none cursor-pointer truncate"
            >
              <optgroup label="🌟 International Tours">
                <option value="Switzerland (Zurich, Lucerne, Interlaken, Grindelwald)">Switzerland (Zurich, Lucerne, Interlaken)</option>
                <option value="Paris, France">Paris, France (Eiffel Tower & Louvre)</option>
                <option value="Dubai, United Arab Emirates">Dubai, UAE (Burj Khalifa & Safari)</option>
                <option value="Rome, Italy">Rome, Italy (Colosseum & Vatican)</option>
                <option value="Tokyo, Japan">Tokyo, Japan (Shibuya & Senso-ji)</option>
                <option value="Singapore">Singapore (Marina Bay & Sentosa)</option>
              </optgroup>
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
            </select>
          </div>
        </div>

        {/* Duration Stepper */}
        <div className="lg:col-span-2 flex items-center justify-between px-3.5 py-2.5 bg-slate-50/90 rounded-2xl border border-slate-200/80 shadow-xs">
          <div>
            <label className="block text-[10px] uppercase font-black text-slate-400 tracking-wider">Days</label>
            <span className="text-xs font-black text-slate-900">{duration} Days</span>
          </div>
          <div className="flex items-center gap-1">
            <button 
              onClick={() => onDurationChange(Math.max(1, duration - 1))}
              className="w-7 h-7 rounded-lg bg-white hover:bg-slate-200 border border-slate-200 text-slate-700 font-bold flex items-center justify-center transition"
            >
              -
            </button>
            <button 
              onClick={() => onDurationChange(Math.min(15, duration + 1))}
              className="w-7 h-7 rounded-lg bg-white hover:bg-slate-200 border border-slate-200 text-slate-700 font-bold flex items-center justify-center transition"
            >
              +
            </button>
          </div>
        </div>

        {/* Travelers Stepper */}
        <div className="lg:col-span-2 flex items-center justify-between px-3.5 py-2.5 bg-slate-50/90 rounded-2xl border border-slate-200/80 shadow-xs">
          <div>
            <label className="block text-[10px] uppercase font-black text-slate-400 tracking-wider">Travelers</label>
            <span className="text-xs font-black text-slate-900">{travelersCount} Person{travelersCount > 1 ? 's' : ''}</span>
          </div>
          <div className="flex items-center gap-1">
            <button 
              onClick={() => onTravelersCountChange(Math.max(1, travelersCount - 1))}
              className="w-7 h-7 rounded-lg bg-white hover:bg-slate-200 border border-slate-200 text-slate-700 font-bold flex items-center justify-center transition"
            >
              -
            </button>
            <button 
              onClick={() => onTravelersCountChange(Math.min(20, travelersCount + 1))}
              className="w-7 h-7 rounded-lg bg-white hover:bg-slate-200 border border-slate-200 text-slate-700 font-bold flex items-center justify-center transition"
            >
              +
            </button>
          </div>
        </div>

        {/* Generate Button (Plan CTA) */}
        <div className="lg:col-span-1 flex items-center justify-end">
          <button
            onClick={onExecutePlanning}
            disabled={isPlanning}
            className="w-full lg:w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-600 hover:from-brand-700 hover:to-indigo-700 active:scale-95 text-white flex items-center justify-center text-base shadow-lg shadow-brand-600/30 transition duration-300 disabled:opacity-50"
            title="Generate AI Itinerary"
          >
            {isPlanning ? (
              <i className="fa-solid fa-spinner fa-spin"></i>
            ) : (
              <i className="fa-solid fa-sparkles text-lg"></i>
            )}
          </button>
        </div>

      </div>

      {/* 2. Persona Chips Row */}
      <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider mr-1 shrink-0">
            Travel Style:
          </span>
          {PERSONAS.map((p) => {
            const isSelected = travelerType === p.key;
            return (
              <button
                key={p.key}
                onClick={() => onPersonaSelect(p.key, p.defaultCount)}
                className={`px-3 py-1.5 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all duration-200 flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-slate-900 text-white shadow-md shadow-slate-900/20 scale-102 ring-2 ring-brand-500'
                    : 'bg-slate-100/80 hover:bg-slate-200/80 text-slate-600'
                }`}
              >
                <i className={`fa-solid ${p.icon} text-[11px] ${isSelected ? 'text-amber-400' : 'text-slate-400'}`}></i>
                <span>{p.label}</span>
              </button>
            );
          })}
        </div>

        <button
          onClick={onExecutePlanning}
          disabled={isPlanning}
          className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-50 hover:bg-brand-100 text-brand-700 font-extrabold text-xs border border-brand-200/80 transition"
        >
          <i className="fa-solid fa-bolt text-brand-600"></i>
          <span>{isPlanning ? "Synthesizing Plan..." : "Re-Plan with Selected Persona"}</span>
        </button>
      </div>

    </div>
  );
}
