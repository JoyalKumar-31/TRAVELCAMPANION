import React from 'react';

const QUICK_DESTINATIONS = [
  { key: "switzerland", name: "Switzerland (Zurich, Lucerne, Interlaken, Grindelwald)", label: "Switzerland", icon: "🏔️" },
  { key: "goa", name: "Goa, India", label: "Goa", icon: "🏖️" },
  { key: "hyderabad", name: "Hyderabad, Telangana", label: "Hyderabad", icon: "🕌" },
  { key: "vizag", name: "Visakhapatnam, Andhra Pradesh", label: "Vizag", icon: "⚓" },
  { key: "kashmir", name: "Kashmir & Srinagar, India", label: "Kashmir", icon: "❄️" },
  { key: "kerala", name: "Kerala (Kochi, Alappuzha, Munnar), India", label: "Kerala", icon: "🌴" },
  { key: "jaipur", name: "Jaipur & Udaipur, Rajasthan", label: "Jaipur", icon: "🏰" },
  { key: "delhi_agra", name: "Delhi, Agra & Taj Mahal, India", label: "Delhi & Agra", icon: "🛕" },
  { key: "manali", name: "Manali & Shimla, Himachal Pradesh", label: "Manali", icon: "⛷️" },
  { key: "paris", name: "Paris, France", label: "Paris", icon: "🗼" },
  { key: "dubai", name: "Dubai, United Arab Emirates", label: "Dubai", icon: "🏙️" }
];

export default function HeroBanner({ 
  destination, 
  duration, 
  travelersCount, 
  travelerType, 
  heroImg,
  onSelectDestination 
}) {
  const cleanCity = (destination || "").split("(")[0].split(",")[0].trim();
  const travelersLabel = travelersCount === 1 ? "1 Solo Traveler" : `${travelersCount} Travelers`;
  const personaLabel = (travelerType || "couple").replace("_", " ").toUpperCase();

  return (
    <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl min-h-[380px] sm:min-h-[420px] flex flex-col justify-between p-6 sm:p-10 border border-slate-200/80 bg-slate-950 group">
      
      {/* Dynamic Destination Hero Backdrop */}
      <img 
        src={heroImg || "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=1600&q=85"} 
        alt={cleanCity}
        className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-1000 ease-out"
      />

      {/* Cinematic Dark Vignette Gradients */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-slate-950/20"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-slate-950/40 to-transparent"></div>

      {/* Top Bar inside Hero: AI Badges & Quick Stats */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/40 backdrop-blur-xl border border-white/20 text-white text-xs font-bold shadow-md">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
          <span className="text-amber-300 font-extrabold">Autonomous Multi-Agent Travel Engine</span>
          <span className="text-white/40">|</span>
          <span className="text-slate-200">100% Dynamic</span>
        </div>

        <div className="hidden sm:flex items-center gap-2">
          <span className="px-3 py-1 rounded-xl bg-white/15 backdrop-blur-md border border-white/20 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm">
            <i className="fa-solid fa-cloud-sun text-amber-300"></i> Live Weather Shield
          </span>
          <span className="px-3 py-1 rounded-xl bg-white/15 backdrop-blur-md border border-white/20 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm">
            <i className="fa-solid fa-bed text-sky-300"></i> Day 1 Lodges & Stays
          </span>
        </div>
      </div>

      {/* Center & Bottom: Typography & Trip Identity */}
      <div className="relative z-10 max-w-4xl space-y-4 pt-10">
        
        <div className="space-y-2">
          <span className="text-xs uppercase font-black text-brand-300 tracking-widest flex items-center gap-2">
            <i className="fa-solid fa-map-location-dot"></i> Featured Itinerary Experience
          </span>
          <h1 className="font-heading text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-none drop-shadow-lg">
            Discover {cleanCity}
          </h1>
        </div>

        <p className="text-xs sm:text-sm font-medium text-slate-200 max-w-2xl leading-relaxed drop-shadow">
          Personalized day-by-day activities, authentic verified photos, near-stay lodge options with room sharing, and instant weather disruption auto-rerouting.
        </p>

        {/* Trip Tags Badges */}
        <div className="flex flex-wrap items-center gap-2.5 pt-1">
          <div className="px-3 py-1.5 rounded-xl bg-white/20 backdrop-blur-md border border-white/30 text-white text-xs font-black flex items-center gap-2">
            <i className="fa-regular fa-calendar-days text-brand-300"></i>
            <span>{duration} Days Itinerary</span>
          </div>

          <div className="px-3 py-1.5 rounded-xl bg-white/20 backdrop-blur-md border border-white/30 text-white text-xs font-black flex items-center gap-2">
            <i className="fa-solid fa-user-group text-emerald-300"></i>
            <span>{travelersLabel}</span>
          </div>

          <div className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-brand-500 to-indigo-600 text-white text-xs font-black tracking-wide uppercase shadow-md shadow-brand-500/30 flex items-center gap-1.5">
            <i className="fa-solid fa-compass text-amber-300"></i>
            <span>{personaLabel} MODE</span>
          </div>
        </div>

        {/* Instant Destination Quick-Selector Pills */}
        <div className="pt-2">
          <span className="text-[11px] font-extrabold text-slate-300 uppercase tracking-wider block mb-2">
            Quick Switch Destinations:
          </span>
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
            {QUICK_DESTINATIONS.map((d) => {
              const isSelected = destination.toLowerCase().includes(d.key);
              return (
                <button
                  key={d.key}
                  onClick={() => onSelectDestination && onSelectDestination(d.name)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all duration-200 flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-white text-slate-900 shadow-lg shadow-white/20 scale-105 border-2 border-brand-400'
                      : 'bg-black/40 hover:bg-black/60 text-white/90 border border-white/20 hover:border-white/50 backdrop-blur-md'
                  }`}
                >
                  <span>{d.icon}</span>
                  <span>{d.label}</span>
                </button>
              );
            })}
          </div>
        </div>

      </div>

    </div>
  );
}
