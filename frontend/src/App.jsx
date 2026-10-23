import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import SearchBar from './components/SearchBar';
import HeroBanner from './components/HeroBanner';
import RouteMap from './components/RouteMap';
import WeatherAlertBanner from './components/WeatherAlertBanner';
import Day2ReplannedComparison from './components/Day2ReplannedComparison';
import BudgetCard from './components/BudgetCard';
import ItineraryTimeline from './components/ItineraryTimeline';
import PlacesGallery from './components/PlacesGallery';
import Day1HotelsSection from './components/Day1HotelsSection';
import HotelBookingModal from './components/HotelBookingModal';
import GroupTravelModal from './components/GroupTravelModal';
import AIChatCompanion from './components/AIChatCompanion';
import SOSShieldModal from './components/SOSShieldModal';
import ErrorBoundary from './components/ErrorBoundary';
import { 
  DESTINATION_CONFIG, 
  HOTELS_DATABASE, 
  getHotelsForDestination,
  getDestinationKey, 
  generateBookingLinks 
} from './data/destinationData';

function getTomorrowDateStr() {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return tomorrow.toISOString().split('T')[0];
}

export default function App() {
  // Initial trip configuration requested: Goa, India · 3 days · 4 travelers
  const [origin, setOrigin] = useState("Hyderabad, Telangana, India");
  const [destination, setDestination] = useState("Goa, India");
  const [duration, setDuration] = useState(3);
  const [travelersCount, setTravelersCount] = useState(4);
  const [travelerType, setTravelerType] = useState("friends");
  const [startDate, setStartDate] = useState(getTomorrowDateStr());

  const [totalBudget, setTotalBudget] = useState(65000);
  const [usedBudget, setUsedBudget] = useState(45000);

  const [itinerary, setItinerary] = useState(null);
  const [activeDayIndex, setActiveDayIndex] = useState(0);
  const [hotels, setHotels] = useState([]);

  // Weather & Replanning States
  const [liveWeather, setLiveWeather] = useState(null);
  const [simulatedAlert, setSimulatedAlert] = useState(null);
  const [comparisonData, setComparisonData] = useState(null);
  const [isComparisonOpen, setIsComparisonOpen] = useState(false);

  const [isPlanning, setIsPlanning] = useState(false);
  const [isReplanning, setIsReplanning] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);

  // Modals state
  const [selectedHotelForBooking, setSelectedHotelForBooking] = useState(null);
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isSafetyModalOpen, setIsSafetyModalOpen] = useState(false);

  const destKey = getDestinationKey(destination);
  const cleanCity = (destination || "").split("(")[0].split(",")[0].trim();
  const matchedConfig = DESTINATION_CONFIG[destKey];
  const currentConfig = matchedConfig || {
    heroImg: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1600&q=85",
    baseRatePerDay: 3500,
    weather: { temp: "26°C", condition: "Pleasant & Clear", verdict: `Optimal conditions for sightseeing and exploring culinary quarters in ${cleanCity}.`, icon: "fa-sun" },
    alert: { text: `Weather alert monitored for ${cleanCity}. Tap to adapt your schedule.`, day: 2, slot: "Afternoon" },
    recs: [
      { title: `${cleanCity} Central Heritage Square`, note: "Historical Old Quarter", rating: "4.8", img: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80" },
      { title: `${cleanCity} Scenic Botanical Gardens`, note: "Nature & Greenery Trail", rating: "4.7", img: "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=600&q=80" },
      { title: `${cleanCity} Cultural Arts Sanctuary`, note: "Local Heritage & Handicrafts", rating: "4.8", img: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=600&q=80" }
    ]
  };
  const [alertText, setAlertText] = useState(currentConfig?.alert?.text || `Rain alert detected for Day 2 outdoor activities in ${cleanCity}.`);

  // Fix: Ensure page is firmly at the top on initial load (never auto-scroll down)
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, []);

  // Initial Load & Destination / Parameter Swaps
  useEffect(() => {
    // 1. Recalculate dynamic budget in ₹ INR
    const groupMultiplier = travelersCount > 1 ? (1 + (travelersCount - 1) * 0.75) : 1;
    const calcTotal = Math.round((currentConfig?.baseRatePerDay || 4500) * duration * groupMultiplier);
    const calcUsed = Math.round(calcTotal * 0.73);
    setTotalBudget(calcTotal);
    setUsedBudget(calcUsed);

    // 2. Update Alert Text
    setAlertText(currentConfig?.alert?.text || `Rain alert detected for Day 2 outdoor activities in ${cleanCity}.`);

    // 3. Instant 0ms Lodges Display from Client Knowledge Base
    const isIntl = ["switzerland", "paris", "dubai", "tokyo", "rome", "london", "singapore", "bali", "maldives"].includes(destKey);
    const clientStays = getHotelsForDestination(destKey, destination);
    const enrichedStays = (clientStays || []).map(h => ({
      ...h,
      booking_links: h.booking_links || generateBookingLinks(h.name, cleanCity, isIntl)
    }));
    setHotels(enrichedStays);

    // 4. Background Sync with FastAPI Backend for fresh hotels, weather & itinerary
    syncDay1HotelsFromAPI(destination);
    fetchLiveWeather(destination, startDate, duration);
    generateItineraryViaAgents(destination, duration, travelersCount, travelerType, calcTotal, startDate);

  }, [destination, duration, travelersCount, travelerType, startDate]);

  // Sync Day 1 Lodges via Backend
  async function syncDay1HotelsFromAPI(destName) {
    try {
      const res = await fetch('/api/hotels/near', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ destination: destName, day_number: 1 })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.hotels && data.hotels.length > 0) {
          setHotels(data.hotels);
        }
      }
    } catch (err) {
      console.warn("Hotels API background sync:", err);
    }
  }

  // Fetch Live Meteorological Weather Forecast from Open-Meteo
  async function fetchLiveWeather(destName, sDate, durDays) {
    try {
      const url = `/api/weather/forecast?destination=${encodeURIComponent(destName)}&start_date=${encodeURIComponent(sDate || '')}&duration_days=${durDays || 3}`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setLiveWeather(data);
      }
    } catch (err) {
      console.warn("Weather forecast fetch error:", err);
    }
  }

  // Synthesize Itinerary via Multi-Agent Graph
  async function generateItineraryViaAgents(destName, durDays, tCount, tType, budgetVal, sDate) {
    setIsPlanning(true);
    try {
      const profile = {
        destination: destName,
        duration_days: durDays,
        budget: budgetVal,
        group_size: tCount,
        traveler_type: tType,
        travel_start_date: sDate || startDate,
        interests: ["culture", "sightseeing", "local food", "nature"],
        accessibility_requirements: tType === "seniors" ? ["senior_friendly", "wheelchair_accessible"] : [],
        pace_preference: tType === "seniors" ? "relaxed" : "moderate"
      };

      const res = await fetch('/api/itinerary/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile)
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.itinerary) {
          setItinerary(data.itinerary);
          setActiveDayIndex(0);
          // Reset comparison on fresh generation
          setComparisonData(null);
          setIsComparisonOpen(false);
        }
      }
    } catch (err) {
      console.warn("Itinerary API generation fallback:", err);
    } finally {
      setIsPlanning(false);
    }
  }

  // Manually Simulate Rain Alert for Day 2 (Demonstration Purpose)
  async function handleSimulateRain() {
    setIsSimulating(true);
    try {
      const res = await fetch('/api/weather/simulate-rain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ destination: destination, day_number: 2 })
      });
      if (res.ok) {
        const data = await res.json();
        setSimulatedAlert(data);
        setAlertText(data.description);
      }
    } catch (err) {
      console.warn("Simulate rain API error:", err);
    } finally {
      setIsSimulating(false);
    }
  }

  function handleClearSimulation() {
    setSimulatedAlert(null);
    setAlertText(currentConfig?.alert?.text || "Favorable weather conditions.");
  }

  // Trigger Adaptive Replanning via AdaptiveReplannerAgent (Keeps Day 1 & Day 3 intact, replaces Day 2 outdoor activities)
  async function handleTriggerReplanning() {
    setIsReplanning(true);
    try {
      const payload = {
        itinerary: itinerary,
        affected_day: 2,
        disruption_description: simulatedAlert 
          ? simulatedAlert.description 
          : (liveWeather?.alert_details || "Severe monsoon torrential rain downpour affecting Day 2 outdoor activities"),
        is_simulated: Boolean(simulatedAlert)
      };

      const res = await fetch('/api/itinerary/replan-day', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setItinerary(data.updated_itinerary);
          setComparisonData(data);
          setIsComparisonOpen(true);
          setActiveDayIndex(1); // Set Day 2 active
          
          // Scroll to comparison section smoothly
          setTimeout(() => {
            const el = document.getElementById("day2-comparison-section");
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }, 150);
        }
      }
    } catch (err) {
      console.warn("Replanning API error:", err);
    } finally {
      setIsReplanning(false);
    }
  }

  function handlePersonaSelect(personaKey, defaultCount) {
    setTravelerType(personaKey);
    setTravelersCount(defaultCount);
  }

  function scrollToSection(id) {
    const elem = document.getElementById(id);
    if (elem) elem.scrollIntoView({ behavior: 'smooth' });
  }

  // Handle Action Requested by AI Companion Agent
  function handleExecuteCompanionAction(action) {
    if (!action || !action.action_type) return;

    console.log("[AI Companion Action Executed]:", action.action_type, action.payload);

    switch (action.action_type) {
      case "SET_DESTINATION":
        if (action.payload) {
          setDestination(String(action.payload));
        }
        break;

      case "SET_DURATION":
        if (action.payload) {
          const days = Math.min(14, Math.max(1, Number(action.payload)));
          setDuration(days);
        }
        break;

      case "SET_PERSONA":
        if (action.payload) {
          const persona = action.payload.persona || "couple";
          const count = Number(action.payload.count) || 2;
          handlePersonaSelect(persona, count);
        }
        break;

      case "SWITCH_DAY":
        if (action.payload !== undefined && action.payload !== null) {
          const dayIdx = Number(action.payload);
          setActiveDayIndex(dayIdx);
          scrollToSection("itinerary-timeline-section");
        }
        break;

      case "REPLAN":
        handleTriggerReplanning();
        scrollToSection("weather-alert-section");
        break;

      case "SCROLL_TO_SECTION":
        if (action.payload) {
          scrollToSection(action.payload);
        }
        break;

      case "OPEN_BOOKING":
        if (hotels && hotels.length > 0) {
          setSelectedHotelForBooking(hotels[0]);
        }
        break;

      case "OPEN_SAFETY":
      case "OPEN_SOS":
      case "SOS":
      case "EMERGENCY":
        setIsSafetyModalOpen(true);
        break;

      default:
        console.warn("Unrecognized companion action:", action);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      
      {/* 1. Global Navigation Bar */}
      <Navbar 
        onOpenGroupModal={() => setIsGroupModalOpen(true)}
        onScrollToSection={scrollToSection}
        onOpenSafetyModal={() => setIsSafetyModalOpen(true)}
        onToggleChat={() => setIsChatOpen(prev => !prev)}
      />

      {/* Floating Upper-Side Quick Launcher for AI Assistant */}
      {!isChatOpen && (
        <button
          onClick={() => setIsChatOpen(true)}
          className="fixed top-20 right-4 sm:right-8 z-30 px-3.5 py-2 rounded-2xl bg-white/95 backdrop-blur-md hover:bg-white text-slate-800 text-xs font-black shadow-xl shadow-brand-500/15 border border-slate-200/90 flex items-center gap-2 transition hover:scale-105 active:scale-95 animate-fadeIn cursor-pointer"
          title="Open AI Travel Assistant"
        >
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="w-6 h-6 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-600 text-white flex items-center justify-center text-xs shadow-xs">
            <i className="fa-solid fa-headset"></i>
          </span>
          <span className="font-heading text-slate-900 font-extrabold">Ask AI Assistant</span>
        </button>
      )}

      {/* 2. Main Content Container */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 space-y-8">
        
        {/* Hero Section & Floating Search Bar */}
        <section className="relative">
          <ErrorBoundary title="Hero & Search Banner Notice">
            <HeroBanner 
              destination={destination}
              duration={duration}
              travelersCount={travelersCount}
              travelerType={travelerType}
              heroImg={currentConfig?.heroImg}
              onSelectDestination={setDestination}
            />

            <SearchBar 
              origin={origin}
              destination={destination}
              duration={duration}
              travelersCount={travelersCount}
              travelerType={travelerType}
              startDate={startDate}
              onStartDateChange={setStartDate}
              isPlanning={isPlanning}
              onOriginChange={setOrigin}
              onDestinationChange={setDestination}
              onDurationChange={setDuration}
              onTravelersCountChange={setTravelersCount}
              onPersonaSelect={handlePersonaSelect}
              onExecutePlanning={() => generateItineraryViaAgents(destination, duration, travelersCount, travelerType, totalBudget, startDate)}
            />
          </ErrorBoundary>
        </section>

        {/* 3. Core 2-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Main Column (8 Cols): Weather Alert, Day 2 Comparison, Timeline, Verified Lodges */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Live Weather Forecast & Disruption Alert Banner */}
            <div id="weather-alert-section">
              <ErrorBoundary title="Weather Forecast & Alert Notice">
                <WeatherAlertBanner 
                  destination={destination}
                  weather={currentConfig?.weather}
                  liveWeather={liveWeather}
                  simulatedAlert={simulatedAlert}
                  alertText={alertText}
                  isReplanning={isReplanning}
                  isSimulating={isSimulating}
                  onTriggerReplanning={handleTriggerReplanning}
                  onSimulateRain={handleSimulateRain}
                  onClearSimulation={handleClearSimulation}
                  startDate={startDate}
                  duration={duration}
                />
              </ErrorBoundary>
            </div>

            {/* AI-POWERED SIDE-BY-SIDE DAY 2 REPLANNING COMPARISON (Rendered when replanned) */}
            {isComparisonOpen && comparisonData && (
              <div id="day2-comparison-section">
                <ErrorBoundary title="Day 2 Replanning Comparison Notice">
                  <Day2ReplannedComparison 
                    comparisonData={comparisonData}
                    destination={destination}
                    onDismiss={() => setIsComparisonOpen(false)}
                  />
                </ErrorBoundary>
              </div>
            )}

            {/* Iconic Places Photo Showcase & Attractions */}
            <div id="places-gallery-section">
              <ErrorBoundary title="Iconic Attractions Gallery Notice">
                <PlacesGallery 
                  destination={destination}
                />
              </ErrorBoundary>
            </div>

            {/* Day-by-Day Activity Schedule Timeline with Place Photos */}
            <div id="itinerary-timeline-section">
              <ErrorBoundary title="Day-by-Day Timeline Notice">
                <ItineraryTimeline 
                  destination={destination}
                  itinerary={itinerary}
                  activeDayIndex={activeDayIndex}
                  onSelectDayIndex={setActiveDayIndex}
                  isLoading={isPlanning}
                  hasComparisonData={Boolean(comparisonData)}
                  onOpenComparison={() => setIsComparisonOpen(true)}
                  travelerType={travelerType}
                />
              </ErrorBoundary>
            </div>

            {/* Verified Lodges & Hotels Section (Multi-Day with Direct MakeMyTrip Booking) */}
            <div id="day1-hotels-section">
              <ErrorBoundary title="Verified Lodges & Stays Notice">
                <Day1HotelsSection 
                  destination={destination}
                  duration={duration}
                  activeDayIndex={activeDayIndex}
                  onSelectDayIndex={setActiveDayIndex}
                  itinerary={itinerary}
                  hotels={hotels}
                  onOpenBookingModal={(hotel) => setSelectedHotelForBooking(hotel)}
                />
              </ErrorBoundary>
            </div>

          </div>

          {/* Sidebar Column (4 Cols): Budget Card, Interactive Route Map */}
          <div className="lg:col-span-4 space-y-6 sticky top-20">
            
            {/* Real-Time Budget Overview */}
            <ErrorBoundary title="Budget Overview Notice">
              <BudgetCard 
                totalBudget={totalBudget}
                usedBudget={usedBudget}
                travelersCount={travelersCount}
              />
            </ErrorBoundary>

            {/* Geospatial Route Map & Distance Calculation */}
            <div id="route-map-section">
              <ErrorBoundary title="Route Directions Map Notice">
                <RouteMap 
                  origin={origin}
                  destination={destination}
                />
              </ErrorBoundary>
            </div>

          </div>

        </div>

      </main>

      {/* 4. Modals & Slide-out Drawers */}
      <HotelBookingModal 
        hotel={selectedHotelForBooking}
        destination={destination}
        travelersCount={travelersCount}
        travelerType={travelerType}
        isOpen={Boolean(selectedHotelForBooking)}
        onClose={() => setSelectedHotelForBooking(null)}
      />

      <GroupTravelModal 
        destination={destination}
        duration={duration}
        isOpen={isGroupModalOpen}
        onClose={() => setIsGroupModalOpen(false)}
        onApplyGroupPlan={(newGroupCount, newDays) => {
          setTravelersCount(newGroupCount);
          if (newDays) setDuration(newDays);
          setTravelerType('friends');
          setIsGroupModalOpen(false);
          generateItineraryViaAgents(destination, newDays || duration, newGroupCount, 'friends', totalBudget, startDate);
        }}
      />

      {/* Upper-Side AI Chat Companion Drawer (Opens on demand) */}
      <AIChatCompanion 
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        destination={destination}
        origin={origin}
        duration={duration}
        travelersCount={travelersCount}
        travelerType={travelerType}
        itinerary={itinerary}
        activeDayIndex={activeDayIndex}
        onExecuteAction={handleExecuteCompanionAction}
      />

      {/* 5. SOS Emergency Hub & Tourist Safety Shield Modal */}
      <SOSShieldModal
        isOpen={isSafetyModalOpen}
        onClose={() => setIsSafetyModalOpen(false)}
        destination={destination}
      />

      {/* Footer */}
      <footer className="mt-16 bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-500 font-medium">
        TravelMate AI · AI Adaptive Tourism Companion · Built with React 19, FastAPI & LangGraph Multi-Agent System
      </footer>

    </div>
  );
}