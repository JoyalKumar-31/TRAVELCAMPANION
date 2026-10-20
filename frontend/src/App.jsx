import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import SearchBar from './components/SearchBar';
import HeroBanner from './components/HeroBanner';
import RouteMap from './components/RouteMap';
import WeatherAlertBanner from './components/WeatherAlertBanner';
import BudgetCard from './components/BudgetCard';
import ItineraryTimeline from './components/ItineraryTimeline';
import PlacesGallery from './components/PlacesGallery';
import Day1HotelsSection from './components/Day1HotelsSection';
import HotelBookingModal from './components/HotelBookingModal';
import GroupTravelModal from './components/GroupTravelModal';
import AIChatCompanion from './components/AIChatCompanion';
import VisionAIScannerModal from './components/VisionAIScannerModal';
import { 
  DESTINATION_CONFIG, 
  HOTELS_DATABASE, 
  getDestinationKey, 
  generateBookingLinks 
} from './data/destinationData';

export default function App() {
  const [origin, setOrigin] = useState("Hyderabad, Telangana, India");
  const [destination, setDestination] = useState("Switzerland (Zurich, Lucerne, Interlaken, Grindelwald)");
  const [duration, setDuration] = useState(5);
  const [travelersCount, setTravelersCount] = useState(2);
  const [travelerType, setTravelerType] = useState("couple");

  const [totalBudget, setTotalBudget] = useState(120000);
  const [usedBudget, setUsedBudget] = useState(85000);

  const [itinerary, setItinerary] = useState(null);
  const [activeDayIndex, setActiveDayIndex] = useState(0);
  const [hotels, setHotels] = useState([]);

  const [isPlanning, setIsPlanning] = useState(false);
  const [isReplanning, setIsReplanning] = useState(false);

  // Modals state
  const [selectedHotelForBooking, setSelectedHotelForBooking] = useState(null);
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
  const [isVisionModalOpen, setIsVisionModalOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  const destKey = getDestinationKey(destination);
  const currentConfig = DESTINATION_CONFIG[destKey] || DESTINATION_CONFIG["switzerland"];
  const [alertText, setAlertText] = useState(currentConfig.alert?.text);

  // Fix: Ensure page is firmly at the top on initial load (never auto-scroll down)
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, []);

  // Initial Load & Destination Swaps
  useEffect(() => {
    // 1. Recalculate dynamic budget in ₹ INR
    const groupMultiplier = travelersCount > 1 ? (1 + (travelersCount - 1) * 0.75) : 1;
    const calcTotal = Math.round((currentConfig.baseRatePerDay || 4000) * duration * groupMultiplier);
    const calcUsed = Math.round(calcTotal * 0.73);
    setTotalBudget(calcTotal);
    setUsedBudget(calcUsed);

    // 2. Update Alert Text
    setAlertText(currentConfig.alert?.text);

    // 3. Instant 0ms Lodges Display from Client Knowledge Base
    const cleanCity = destination.split("(")[0].split(",")[0].trim();
    const isIntl = ["switzerland", "paris", "dubai", "tokyo", "rome", "london", "singapore", "bali", "maldives"].includes(destKey);
    const clientStays = HOTELS_DATABASE[destKey] || HOTELS_DATABASE["switzerland"];
    const enrichedStays = clientStays.map(h => ({
      ...h,
      booking_links: h.booking_links || generateBookingLinks(h.name, cleanCity, isIntl)
    }));
    setHotels(enrichedStays);

    // 4. Background Sync with FastAPI Backend for fresh hotels & itinerary
    syncDay1HotelsFromAPI(destination);
    generateItineraryViaAgents(destination, duration, travelersCount, travelerType, calcTotal);

  }, [destination, duration, travelersCount, travelerType]);

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

  // Synthesize Itinerary via Multi-Agent Graph
  async function generateItineraryViaAgents(destName, durDays, tCount, tType, budgetVal) {
    setIsPlanning(true);
    try {
      const profile = {
        destination: destName,
        duration_days: durDays,
        budget: budgetVal,
        group_size: tCount,
        traveler_type: tType,
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
        }
      }
    } catch (err) {
      console.warn("Itinerary API generation fallback:", err);
    } finally {
      setIsPlanning(false);
    }
  }

  // Trigger Adaptive Replanning via AdaptiveReplannerAgent
  async function handleTriggerReplanning() {
    setIsReplanning(true);
    try {
      const disruption = {
        day_number: currentConfig.alert?.day || 1,
        time_slot: currentConfig.alert?.slot || "Morning",
        disruption_type: "weather",
        description: alertText,
        severity: "medium"
      };

      const res = await fetch('/api/itinerary/adapt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          itinerary: itinerary,
          disruption: disruption
        })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setItinerary(data.updated_itinerary);
          setAlertText(`✔ Replanning Executed: ${data.adaptation_result?.reason_for_change || 'Alternative indoor venue substituted.'}`);
          setActiveDayIndex(Math.max(0, (disruption.day_number || 1) - 1));
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
        onOpenSafetyModal={() => alert(`🛡️ Tourist Safety & SOS Emergency Hub for ${destination.split(',')[0]}:\n• Universal Emergency Helpline: 112\n• Local Police Control: 100 / 112\n• Medical Ambulance: 108 / 112\n• 24/7 Diplomatic & Tourist Police Active.`)}
        onOpenScannerModal={() => setIsVisionModalOpen(true)}
        onToggleChat={() => setIsChatOpen(prev => !prev)}
      />

      {/* Floating Upper-Side Quick Launcher for AI Assistant */}
      {!isChatOpen && (
        <button
          onClick={() => setIsChatOpen(true)}
          className="fixed top-20 right-4 sm:right-8 z-30 px-3.5 py-2 rounded-2xl bg-white/95 backdrop-blur-md hover:bg-white text-slate-800 text-xs font-black shadow-xl shadow-brand-500/15 border border-slate-200/90 flex items-center gap-2 transition hover:scale-105 active:scale-95 animate-fadeIn"
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
          <HeroBanner 
            destination={destination}
            duration={duration}
            travelersCount={travelersCount}
            travelerType={travelerType}
            heroImg={currentConfig.heroImg}
            onSelectDestination={setDestination}
          />

          <SearchBar 
            origin={origin}
            destination={destination}
            duration={duration}
            travelersCount={travelersCount}
            travelerType={travelerType}
            isPlanning={isPlanning}
            onOriginChange={setOrigin}
            onDestinationChange={setDestination}
            onDurationChange={setDuration}
            onTravelersCountChange={setTravelersCount}
            onPersonaSelect={handlePersonaSelect}
            onExecutePlanning={() => generateItineraryViaAgents(destination, duration, travelersCount, travelerType, totalBudget)}
          />
        </section>

        {/* 3. Core 2-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Main Column (8 Cols): Weather Alert, Day-by-Day Timeline, Verified Lodges */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Live Weather Forecast & Disruption Alert Banner */}
            <div id="weather-alert-section">
              <WeatherAlertBanner 
                destination={destination}
                weather={currentConfig.weather}
                alertText={alertText}
                isReplanning={isReplanning}
                onTriggerReplanning={handleTriggerReplanning}
              />
            </div>

            {/* Iconic Places Photo Showcase & Attractions */}
            <div id="places-gallery-section">
              <PlacesGallery 
                destination={destination}
              />
            </div>

            {/* Day-by-Day Activity Schedule Timeline with Place Photos */}
            <div id="itinerary-timeline-section">
              <ItineraryTimeline 
                destination={destination}
                itinerary={itinerary}
                activeDayIndex={activeDayIndex}
                onSelectDayIndex={setActiveDayIndex}
                isLoading={isPlanning}
              />
            </div>

            {/* Verified Lodges & Hotels Near Day 1 Staying Hub */}
            <div id="day1-hotels-section">
              <Day1HotelsSection 
                destination={destination}
                hotels={hotels}
                onOpenBookingModal={(hotel) => setSelectedHotelForBooking(hotel)}
              />
            </div>

          </div>

          {/* Sidebar Column (4 Cols): Budget Card, Interactive Route Map */}
          <div className="lg:col-span-4 space-y-6 sticky top-20">
            
            {/* Real-Time Budget Overview */}
            <BudgetCard 
              totalBudget={totalBudget}
              usedBudget={usedBudget}
              travelersCount={travelersCount}
            />

            {/* Geospatial Route Map & Distance Calculation */}
            <div id="route-map-section">
              <RouteMap 
                origin={origin}
                destination={destination}
              />
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
        isOpen={isGroupModalOpen}
        onClose={() => setIsGroupModalOpen(false)}
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

      {/* Landmark Vision AI Scanner Modal */}
      <VisionAIScannerModal 
        isOpen={isVisionModalOpen}
        onClose={() => setIsVisionModalOpen(false)}
        destination={destination}
      />

      {/* Footer */}
      <footer className="mt-16 bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-500 font-medium">
        TravelMate AI · AI Adaptive Tourism Companion · Built with React 19, FastAPI & LangGraph Multi-Agent System
      </footer>

    </div>
  );
}
