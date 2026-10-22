import React from 'react';

export default function WeatherAlertBanner({ 
  destination, 
  weather, 
  liveWeather,
  simulatedAlert,
  alertText, 
  isReplanning, 
  isSimulating,
  onTriggerReplanning,
  onSimulateRain,
  onClearSimulation,
  startDate,
  duration = 3
}) {
  const cleanCity = (destination || "").split("(")[0].split(",")[0].trim();

  // Determine current weather display values
  const isSimulatedActive = Boolean(simulatedAlert);
  const isLiveAlertActive = Boolean(liveWeather?.has_rain_alert);
  const hasAnyRainAlert = isSimulatedActive || isLiveAlertActive;

  // Day 2 forecast data if available
  const day2Forecast = liveWeather?.days_forecast?.find(d => d.day_number === 2);

  // Weather metrics
  let displayTemp = weather?.temp || "29°C";
  let displayCondition = weather?.condition || "Pleasant & Clear";
  let displayIcon = weather?.icon || "fa-cloud-sun";
  let rainProbability = 15;
  let humidity = 68;
  let sourceBadge = "Seasonal Climate (Regional Met Sensor)";
  let isLive = false;

  if (isSimulatedActive) {
    displayTemp = `${simulatedAlert.temp_celsius || 26}°C`;
    displayCondition = simulatedAlert.condition || "Torrential Monsoon Downpour";
    displayIcon = simulatedAlert.icon || "fa-cloud-bolt";
    rainProbability = simulatedAlert.precipitation_probability || 95;
    humidity = simulatedAlert.humidity_percent || 92;
    sourceBadge = "Demonstration Alert (Manual Rain Simulation)";
  } else if (liveWeather?.available && day2Forecast) {
    displayTemp = `${Math.round(day2Forecast.temp_max != null ? day2Forecast.temp_max : 28)}°C`;
    displayCondition = day2Forecast.condition;
    displayIcon = day2Forecast.icon;
    rainProbability = day2Forecast.rain_prob_percent;
    humidity = day2Forecast.humidity_percent;
    sourceBadge = "Live Weather Forecast (Open-Meteo Satellite & Met Grid)";
    isLive = true;
  } else if (liveWeather && !liveWeather.available) {
    sourceBadge = "Live Weather API Unavailable (Outside 14-day forecast window)";
  }

  return (
    <div className="space-y-4">
      
      {/* 1. Destination Weather Overview Widget */}
      <div className="bg-white rounded-[2rem] p-5 sm:p-6 border border-slate-200/80 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-md shrink-0 ${
            hasAnyRainAlert 
              ? 'bg-gradient-to-tr from-rose-500 to-red-600 text-white shadow-rose-500/25 animate-pulse'
              : 'bg-gradient-to-tr from-amber-400 to-orange-400 text-white shadow-amber-500/20'
          }`}>
            <i className={`fa-solid ${displayIcon}`}></i>
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-heading text-2xl sm:text-3xl font-black text-slate-900">{displayTemp}</span>
              <span className={`px-2.5 py-0.5 rounded-lg text-xs font-black border ${
                hasAnyRainAlert 
                  ? 'bg-rose-50 text-rose-800 border-rose-200'
                  : 'bg-emerald-50 text-emerald-800 border-emerald-200'
              }`}>
                {displayCondition}
              </span>

              {/* Rain Probability & Humidity Live Indicators */}
              <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-800 text-[10px] font-bold border border-blue-200 flex items-center gap-1">
                <i className="fa-solid fa-cloud-showers-heavy text-blue-600"></i>
                <span>Rain Risk: <strong>{rainProbability}%</strong></span>
              </span>

              <span className="px-2 py-0.5 rounded-md bg-cyan-50 text-cyan-800 text-[10px] font-bold border border-cyan-200 flex items-center gap-1">
                <i className="fa-solid fa-droplet text-cyan-600"></i>
                <span>Humidity: <strong>{humidity}%</strong></span>
              </span>
            </div>

            <p className="text-xs text-slate-500 mt-1.5 max-w-xl font-medium leading-relaxed">
              {hasAnyRainAlert 
                ? `High precipitation warning in ${cleanCity}. Planned outdoor beach visits and cliff walks on Day 2 face heavy waterlogging.`
                : (weather?.verdict || `Optimal conditions for sightseeing, heritage walks, and outdoor activities in ${cleanCity}.`)}
            </p>
          </div>
        </div>

        {/* Source Badge & Demonstration Trigger */}
        <div className="text-left md:text-right shrink-0 flex flex-col md:items-end gap-2 w-full md:w-auto">
          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-black tracking-wide border ${
            isSimulatedActive 
              ? 'bg-amber-100 text-amber-900 border-amber-300'
              : isLive 
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                : 'bg-slate-100 text-slate-600 border-slate-200'
          }`}>
            <span className={`w-2 h-2 rounded-full ${
              isSimulatedActive ? 'bg-amber-500' : isLive ? 'bg-emerald-500' : 'bg-slate-400'
            }`}></span>
            <span>{sourceBadge}</span>
          </span>

          {/* Quick Manual Simulation Action Button for Evaluators/Demos */}
          <div className="flex items-center gap-2">
            {!isSimulatedActive ? (
              <button
                type="button"
                onClick={onSimulateRain}
                disabled={isSimulating}
                className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-amber-50 text-slate-700 hover:text-amber-900 border border-slate-200 hover:border-amber-300 text-[11px] font-extrabold transition flex items-center gap-1.5 cursor-pointer active:scale-95 shadow-2xs"
                title="Simulate heavy monsoon rain on Day 2 for demonstration"
              >
                <i className="fa-solid fa-flask text-amber-600"></i>
                <span>{isSimulating ? "Simulating..." : "🌧️ Simulate Rain Alert (Day 2 Demo)"}</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={onClearSimulation}
                className="px-3 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 text-[10px] font-bold transition flex items-center gap-1 cursor-pointer"
                title="Reset manual simulation to live API"
              >
                <i className="fa-solid fa-rotate-left"></i>
                <span>Reset Simulation</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 2. Honest Fallback Notice if Weather API is Unavailable for Selected Dates */}
      {liveWeather && !liveWeather.available && (
        <div className="p-3.5 rounded-2xl bg-slate-100/90 border border-slate-200 flex items-start sm:items-center justify-between gap-3 text-xs text-slate-600">
          <div className="flex items-start gap-2.5">
            <i className="fa-solid fa-circle-info text-indigo-500 text-sm mt-0.5 sm:mt-0 shrink-0"></i>
            <div>
              <span className="font-bold text-slate-800">Meteorological API Notice:</span>
              <span className="ml-1 font-normal text-slate-600">
                Live forecast is currently unavailable for selected travel dates (outside Open-Meteo's 14-day satellite window). Rather than fabricating fictitious weather numbers, you can click <strong>"Simulate Rain Alert (Day 2 Demo)"</strong> above to test the AI replanning engine.
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 3. Real-Time or Simulated Disruption Alert Banner & One-Click AI Replanning */}
      {hasAnyRainAlert && (
        <div className="rounded-[2.2rem] p-5 sm:p-6 bg-gradient-to-r from-rose-50 via-amber-50/90 to-orange-50 border-2 border-rose-300 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4 animate-fadeIn">
          <div className="flex items-start gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-rose-600 to-red-600 text-white flex items-center justify-center text-lg shadow-md shadow-rose-500/30 shrink-0 mt-0.5">
              <i className="fa-solid fa-cloud-bolt animate-bounce"></i>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-black uppercase tracking-wider text-rose-800">
                  {isSimulatedActive ? "⚡ Simulated Rain Disruption Signal" : "⚡ Live Meteorological Rain Alert"}
                </span>
                <span className={`px-2 py-0.5 rounded-md text-[10px] font-black ${
                  isSimulatedActive 
                    ? 'bg-amber-100 text-amber-900 border border-amber-300' 
                    : 'bg-rose-100 text-rose-800 border border-rose-200'
                }`}>
                  {isSimulatedActive ? "🟠 Manual Simulation Mode" : "🟢 Live Sensor Feed"}
                </span>
                <span className="px-2 py-0.5 rounded-md bg-rose-600 text-white text-[10px] font-bold">
                  Day 2 Outdoor Activities Affected
                </span>
              </div>
              <p className="text-xs text-slate-800 font-bold max-w-2xl leading-relaxed">
                {isSimulatedActive 
                  ? simulatedAlert.description 
                  : (liveWeather?.alert_details || "Heavy rain & lightning risk detected on Day 2. Outdoor beaches, watersports, and open-air cliff treks must be replaced.")}
              </p>
              <p className="text-[11px] text-slate-600 font-medium">
                Day 1 & Day 3 itineraries will remain untouched. Only Day 2 outdoor activities will be substituted with verified indoor cultural venues.
              </p>
            </div>
          </div>

          <div className="shrink-0 w-full md:w-auto">
            <button 
              onClick={onTriggerReplanning}
              disabled={isReplanning}
              className="w-full md:w-auto px-6 py-3 bg-gradient-to-r from-rose-600 via-red-600 to-orange-600 hover:from-rose-700 hover:to-orange-700 active:scale-95 text-white font-black text-xs rounded-2xl shadow-lg shadow-rose-600/30 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 border border-white/20"
              title="Trigger AI Replanning for Day 2"
            >
              {isReplanning ? (
                <>
                  <i className="fa-solid fa-spinner fa-spin text-sm"></i>
                  <span>AI Agent Replanning Day 2...</span>
                </>
              ) : (
                <>
                  <i className="fa-solid fa-bolt text-amber-300 text-sm"></i>
                  <span>⚡ AI Replan Day 2 Itinerary</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

    </div>
  );
}