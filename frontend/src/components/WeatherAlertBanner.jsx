import React from 'react';

export default function WeatherAlertBanner({ 
  destination, 
  weather, 
  alertText, 
  isReplanning, 
  onTriggerReplanning 
}) {
  const cleanCity = (destination || "").split("(")[0].split(",")[0].trim();

  return (
    <div className="space-y-4">
      
      {/* 1. Destination Weather Widget */}
      <div className="bg-white rounded-[2rem] p-5 sm:p-6 border border-slate-200/80 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-400 to-orange-400 text-white flex items-center justify-center text-2xl shadow-md shadow-amber-500/20 shrink-0">
            <i className={`fa-solid ${weather?.icon || 'fa-cloud-sun'}`}></i>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-heading text-2xl sm:text-3xl font-black text-slate-900">{weather?.temp || "22°C"}</span>
              <span className="px-2.5 py-0.5 rounded-lg bg-emerald-50 text-emerald-800 text-xs font-black border border-emerald-200">
                {weather?.condition || "Optimal Weather"}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1 max-w-xl font-medium leading-relaxed">
              {weather?.verdict || "Great conditions for outdoor walking trails and scenic viewpoints."}
            </p>
          </div>
        </div>

        <div className="text-left sm:text-right shrink-0">
          <span className="text-[10px] uppercase font-black text-slate-400 block tracking-wider">Live Met Shield</span>
          <span className="text-xs font-extrabold text-slate-800">{cleanCity} Regional Met Sensor</span>
        </div>
      </div>

      {/* 2. Real-Time Disruption Signal & Adaptive Replanning Banner */}
      <div className="rounded-[2rem] p-4 sm:p-5 bg-gradient-to-r from-rose-50/90 via-amber-50/80 to-orange-50/90 border border-rose-200/80 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-2xl bg-rose-500 text-white flex items-center justify-center text-base shadow-md shadow-rose-500/25 shrink-0 mt-0.5">
            <i className="fa-solid fa-cloud-bolt"></i>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-wider text-rose-700">Real-Time Disruption Signal</span>
              <span className="px-2 py-0.5 rounded-md bg-rose-100 text-rose-800 text-[10px] font-black">Active Alert</span>
            </div>
            <p className="text-xs text-slate-700 font-bold mt-1 max-w-xl leading-relaxed">
              {alertText || "Unpredictable crowd surge alert. Tap below to automatically adjust your itinerary."}
            </p>
          </div>
        </div>

        <button 
          onClick={onTriggerReplanning}
          disabled={isReplanning}
          className="px-5 py-2.5 bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700 active:scale-95 text-white font-black text-xs rounded-xl shadow-md shadow-rose-600/20 transition flex items-center gap-2 shrink-0 disabled:opacity-50"
        >
          {isReplanning ? (
            <i className="fa-solid fa-spinner fa-spin"></i>
          ) : (
            <i className="fa-solid fa-bolt"></i>
          )}
          <span>{isReplanning ? "Replanning Itinerary..." : "⚡ Adapt Schedule Now"}</span>
        </button>
      </div>

    </div>
  );
}
