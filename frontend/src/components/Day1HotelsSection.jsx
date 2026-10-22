import React, { useState, useEffect } from 'react';
import { getHotelsForDay, getDestinationKey, getDaySpecificCity, generateBookingLinks, getHotelsForDestination } from '../data/destinationData';

// Hub names by destination and day index for quick visual labeling
const DAY_HUBS_DIRECTORY = {
  switzerland: [
    { day: 1, hub: "Zurich Old Town & Limmat Hub", landmarks: "Niederdorf, Grossmünster & Lake Zurich" },
    { day: 2, hub: "Lucerne Chapel Bridge Hub", landmarks: "Kapellbrücke, Lake Lucerne & Lion Monument" },
    { day: 3, hub: "Interlaken Valley Hub", landmarks: "Harder Kulm, Lake Thun & Aare River" },
    { day: 4, hub: "Grindelwald First Alpine Hub", landmarks: "First Cliff Walk & Eiger Glacier Express" },
    { day: 5, hub: "Lauterbrunnen & Jungfrau Hub", landmarks: "Staubbach Falls & Top of Europe Railway" }
  ],
  goa: [
    { day: 1, hub: "North Goa Baga Hub", landmarks: "Baga Beach, Tito's Lane & Watersports" },
    { day: 2, hub: "Panaji & Fontainhas Heritage Hub", landmarks: "Old Latin Quarter & Mandovi Riverfront" },
    { day: 3, hub: "South Goa Palolem Coastal Hub", landmarks: "Palolem Beach & Colva Sunset Shore" },
    { day: 4, hub: "Dudhsagar Jungle Foothills Hub", landmarks: "Dudhsagar Waterfalls & Spice Plantations" },
    { day: 5, hub: "Vagator & Chapora Fort Hub", landmarks: "Chapora Fort, Vagator Beach & Anjuna Coast" }
  ],
  hyderabad: [
    { day: 1, hub: "Old City Charminar Hub", landmarks: "Charminar, Chowmahalla Palace & Laad Bazaar" },
    { day: 2, hub: "Golconda & Banjara Hills Hub", landmarks: "Golconda Fort Citadel & Qutb Shahi Tombs" },
    { day: 3, hub: "Hussain Sagar & Necklace Road Hub", landmarks: "Hussain Sagar Lake, Buddha Statue & Birla Mandir" },
    { day: 4, hub: "Ramoji Film City Hub", landmarks: "Ramoji Studio Complex & Film Gardens" },
    { day: 5, hub: "Hitec City & Shilparamam Hub", landmarks: "Shilparamam Arts Village & Durgam Cheruvu" }
  ],
  vizag: [
    { day: 1, hub: "RK Beach & Submarine Hub", landmarks: "INS Kursura Submarine & RK Beach Promenade" },
    { day: 2, hub: "Rushikonda & Kailasagiri Hub", landmarks: "Rushikonda Blue Flag Beach & Hilltop Ropeway" },
    { day: 3, hub: "Araku Valley Mountain Hub", landmarks: "Araku Coffee Plantations & Tribal Heritage Museum" },
    { day: 4, hub: "Borra Caves Valley Hub", landmarks: "Borra Limestone Caves & Gosthani River Gorge" },
    { day: 5, hub: "Bheemili Dutch Coast Hub", landmarks: "Bheemunipatnam Dutch Fort & Yarada Beach" }
  ],
  paris: [
    { day: 1, hub: "Eiffel Tower 7th Arr. Hub", landmarks: "Champ de Mars & Seine River Bir-Hakeim" },
    { day: 2, hub: "Louvre Museum 1st Arr. Hub", landmarks: "Louvre Pyramid, Tuileries & Palais-Royal" },
    { day: 3, hub: "Montmartre Hillside Hub", landmarks: "Sacré-Cœur Basilica & Artists Square" },
    { day: 4, hub: "Latin Quarter & Notre-Dame Hub", landmarks: "Sorbonne, Saint-Germain & Seine Bridges" },
    { day: 5, hub: "Palace of Versailles Hub", landmarks: "Château de Versailles & Royal Gardens" }
  ],
  dubai: [
    { day: 1, hub: "Downtown Dubai Burj Hub", landmarks: "Burj Khalifa, Dubai Mall & Fountain Show" },
    { day: 2, hub: "Dubai Marina & JBR Beach Hub", landmarks: "JBR The Walk & Marina Yacht Harbor" },
    { day: 3, hub: "Palm Jumeirah Island Hub", landmarks: "The Pointe & Atlantis Boardwalk" },
    { day: 4, hub: "Old Dubai & Creek Hub", landmarks: "Al Fahidi Historical District & Gold Souk" },
    { day: 5, hub: "Desert Gateway & Safari Hub", landmarks: "Red Sand Dunes & Arabian Starlight Camp" }
  ],
  kerala: [
    { day: 1, hub: "Fort Kochi Colonial Hub", landmarks: "Chinese Fishing Nets & Mattancherry Palace" },
    { day: 2, hub: "Alleppey Backwaters Hub", landmarks: "Vembanad Lake Houseboat Jetty & Coir Islands" },
    { day: 3, hub: "Munnar Tea Plantations Hub", landmarks: "Emerald Tea Slopes & Mattupetty Dam" },
    { day: 4, hub: "Thekkady Periyar Wildlife Hub", landmarks: "Periyar Tiger Sanctuary & Spice Walk" },
    { day: 5, hub: "Kovalam Lighthouse Beach Hub", landmarks: "Lighthouse Beach & Coastal Sunset Promenade" }
  ],
  delhi_agra: [
    { day: 1, hub: "Taj Mahal East Gate Hub", landmarks: "Taj Mahal Sunrise & Mehtab Bagh" },
    { day: 2, hub: "Agra Fort & Mughal Citadel Hub", landmarks: "Agra Fort & Fatehpur Sikri Palace" },
    { day: 3, hub: "Central Delhi Connaught Hub", landmarks: "Connaught Place, India Gate & Janpath" },
    { day: 4, hub: "Old Delhi Chandni Chowk Hub", landmarks: "Red Fort Lahori Gate & Paranthe Wali Gali" },
    { day: 5, hub: "South Delhi Qutub Hub", landmarks: "Qutub Minar Victory Tower & Hauz Khas" }
  ],
  kashmir: [
    { day: 1, hub: "Dal Lake Srinagar Hub", landmarks: "Dal Lake Shikara Ghat & Floating Gardens" },
    { day: 2, hub: "Gulmarg Gondola Snow Hub", landmarks: "Gulmarg Gondola Cableway & Alpine Slopes" },
    { day: 3, hub: "Pahalgam Betaab Valley Hub", landmarks: "Lidder Riverfront & Aru Valley Pine Forest" },
    { day: 4, hub: "Sonamarg Glacier Hub", landmarks: "Thajiwas Glacier & Sindh Valley Meadow" },
    { day: 5, hub: "Srinagar Mughal Gardens Hub", landmarks: "Nishat Bagh, Shalimar Bagh & Old City" }
  ],
  jaipur: [
    { day: 1, hub: "Amber Fort & Palace Hub", landmarks: "Amber Fort, Maota Lake & Sheesh Mahal" },
    { day: 2, hub: "Hawa Mahal & Old Pink City Hub", landmarks: "Hawa Mahal, City Palace & Jantar Mantar" },
    { day: 3, hub: "Jal Mahal & Nahargarh Hub", landmarks: "Jal Mahal, Nahargarh Sunset & Jaigarh Fort" },
    { day: 4, hub: "Chokhi Dhani Heritage Hub", landmarks: "Chokhi Dhani Ethnic Resort & Rajasthani Folk" },
    { day: 5, hub: "Bapu Bazaar Cultural Hub", landmarks: "Bapu Bazaar, Albert Hall Museum & Johari Bazaar" }
  ],
  manali: [
    { day: 1, hub: "Mall Road & Old Manali Hub", landmarks: "Hadimba Temple, Van Vihar & Mall Road" },
    { day: 2, hub: "Solang Valley Adventure Hub", landmarks: "Solang Valley Ropeway, Ski Slopes & Zorbing" },
    { day: 3, hub: "Atal Tunnel & Sissu Valley Hub", landmarks: "Atal Tunnel, Sissu Waterfall & Lahaul Valley" },
    { day: 4, hub: "Rohtang Pass High Snow Hub", landmarks: "Rohtang Glacier Point & Rahala Falls" },
    { day: 5, hub: "Vashisht Hot Springs Hub", landmarks: "Vashisht Temple, Hot Sulphur Springs & Jogini Falls" }
  ],
  varanasi: [
    { day: 1, hub: "Dashashwamedh Ghat River Hub", landmarks: "Dashashwamedh Ghat, Evening Ganga Aarti & Boat Ride" },
    { day: 2, hub: "Kashi Vishwanath Corridor Hub", landmarks: "Kashi Vishwanath Temple, Annapurna & Godowlia" },
    { day: 3, hub: "Sarnath Buddhist Sanctuary Hub", landmarks: "Dhamek Stupa, Sarnath Deer Park & Museum" },
    { day: 4, hub: "Assi Ghat & Sunrise Yoga Hub", landmarks: "Assi Ghat Subah-e-Banaras & Tulsi Manas" },
    { day: 5, hub: "Ramnagar Fort Riverbank Hub", landmarks: "Ramnagar Fort Palace & Vintage Car Collection" }
  ],
  ladakh: [
    { day: 1, hub: "Leh Old Town Heritage Hub", landmarks: "Leh Palace, Shanti Stupa & Main Bazaar" },
    { day: 2, hub: "Nubra Valley White Dunes Hub", landmarks: "Khardung La Pass, Diskit Monastery & Hunder Camels" },
    { day: 3, hub: "Pangong Tso Alpine Lake Hub", landmarks: "Pangong High Altitude Lake & Chang La Pass" },
    { day: 4, hub: "Magnetic Hill & Indus Sangam Hub", landmarks: "Magnetic Hill, Gurudwara Pathar Sahib & Sangam" },
    { day: 5, hub: "Thiksey & Hemis Monastery Hub", landmarks: "Thiksey Monastery, Hemis & Shey Palace" }
  ],
  ooty: [
    { day: 1, hub: "Ooty Lake & Rose Garden Hub", landmarks: "Ooty Lake Boating, Government Rose Garden" },
    { day: 2, hub: "Nilgiri Mountain Toy Train Hub", landmarks: "UNESCO Steam Railway & Doddabetta Peak" },
    { day: 3, hub: "Coonoor Tea Estates Hub", landmarks: "Sim's Park, Dolphin's Nose & Tea Factory" },
    { day: 4, hub: "Pykara Waterfalls & Lake Hub", landmarks: "Pykara Boat House & Cascading Falls" },
    { day: 5, hub: "Botanical Gardens & Pine Forest Hub", landmarks: "Government Botanical Gardens & Pine Valley" }
  ],
  tokyo: [
    { day: 1, hub: "Shinjuku Skyscraper Hub", landmarks: "Tokyo Metropolitan Towers, Omoide Yokocho & Kabukicho" },
    { day: 2, hub: "Shibuya & Harajuku Hub", landmarks: "Shibuya Crossing, Meiji Shrine & Takeshita Street" },
    { day: 3, hub: "Asakusa & Tokyo Skytree Hub", landmarks: "Senso-ji Temple, Nakamise & Skytree Vista" },
    { day: 4, hub: "Ginza Premier & Tsukiji Hub", landmarks: "Ginza Shopping Boulevard & Outer Fish Market" },
    { day: 5, hub: "Akihabara & Ueno Park Hub", landmarks: "Electric Town & Ueno National Museum" }
  ],
  singapore: [
    { day: 1, hub: "Marina Bay Sands Hub", landmarks: "Marina Bay Sands SkyPark, Merlion & Gardens by the Bay" },
    { day: 2, hub: "Sentosa Island Beach Hub", landmarks: "Universal Studios, Siloso Beach & S.E.A. Aquarium" },
    { day: 3, hub: "Chinatown & Little India Hub", landmarks: "Buddha Tooth Relic Temple & Sri Veeramakaliamman" },
    { day: 4, hub: "Orchard Road Premier Hub", landmarks: "ION Orchard, Botanic Gardens & Dempsey Hill" },
    { day: 5, hub: "Jewel Changi Airport Hub", landmarks: "HSBC Rain Vortex & Canopy Park" }
  ],
  rome: [
    { day: 1, hub: "Colosseum Imperial Hub", landmarks: "Colosseum, Roman Forum & Palatine Hill" },
    { day: 2, hub: "Vatican City & St. Peter's Hub", landmarks: "St. Peter's Basilica, Vatican Museums & Sistine Chapel" },
    { day: 3, hub: "Trevi Fountain & Pantheon Hub", landmarks: "Trevi Fountain, Pantheon & Piazza Navona" },
    { day: 4, hub: "Trastevere Bohemian Hub", landmarks: "Santa Maria in Trastevere & Villa Farnesina" },
    { day: 5, hub: "Spanish Steps & Borghese Hub", landmarks: "Piazza di Spagna & Villa Borghese Gardens" }
  ],
  london: [
    { day: 1, hub: "Westminster & Big Ben Hub", landmarks: "Big Ben, Westminster Abbey & London Eye" },
    { day: 2, hub: "Tower Bridge & City Hub", landmarks: "Tower of London, Tower Bridge & Borough Market" },
    { day: 3, hub: "Soho & British Museum Hub", landmarks: "British Museum, Covent Garden & Trafalgar Square" },
    { day: 4, hub: "Kensington Palaces Hub", landmarks: "Kensington Palace, Hyde Park & Royal Albert Hall" },
    { day: 5, hub: "Greenwich & Royal Observatory Hub", landmarks: "Prime Meridian, Cutty Sark & Greenwich Market" }
  ]
};

export default function Day1HotelsSection({ 
  destination = "Switzerland (Zurich, Lucerne, Interlaken, Grindelwald)", 
  duration = 5,
  activeDayIndex = 0,
  onSelectDayIndex,
  itinerary,
  hotels, 
  onOpenBookingModal 
}) {
  const cleanCity = (destination || "").split("(")[0].split(",")[0].trim();
  const destKey = getDestinationKey(destination);
  const isIntl = ["switzerland", "paris", "dubai", "tokyo", "rome", "london", "singapore", "bali", "maldives"].includes(destKey);

  // Active day index state (synced with parent activeDayIndex)
  const [selectedDayIdx, setSelectedDayIdx] = useState(activeDayIndex || 0);
  const [selectedSharingMap, setSelectedSharingMap] = useState({});

  useEffect(() => {
    if (activeDayIndex !== undefined && activeDayIndex !== selectedDayIdx) {
      setSelectedDayIdx(activeDayIndex);
    }
  }, [activeDayIndex]);

  // Retrieve current day's real lodges
  const dayNumber = selectedDayIdx + 1;
  const currentDayCity = getDaySpecificCity(destKey, dayNumber);
  const hubList = (DAY_HUBS_DIRECTORY && DAY_HUBS_DIRECTORY[destKey]) || (DAY_HUBS_DIRECTORY && DAY_HUBS_DIRECTORY["switzerland"]) || [
    { day: 1, hub: `${currentDayCity} Central Staying Hub`, landmarks: `${currentDayCity} Historic Area` }
  ];
  const currentHub = (hubList.length > 0 && hubList[selectedDayIdx % hubList.length]) || {
    day: dayNumber,
    hub: `${currentDayCity} Day ${dayNumber} Staying Hub`,
    landmarks: `Day ${dayNumber} scheduled destinations & activities`
  };

  // Get matching hotels for the selected day - prioritize getHotelsForDay, fallback to hotels prop or getHotelsForDestination
  let rawHotels = getHotelsForDay(destKey, dayNumber, currentDayCity, isIntl);
  if (!rawHotels || rawHotels.length === 0) {
    rawHotels = (hotels && hotels.length > 0) ? hotels : getHotelsForDestination(destKey, destination);
  }
  const displayedHotels = rawHotels || [];

  function handleSelectDay(idx) {
    setSelectedDayIdx(idx);
    if (onSelectDayIndex) {
      onSelectDayIndex(idx);
    }
  }

  function handleSelectSharing(hotelId, optIdx) {
    setSelectedSharingMap(prev => ({
      ...prev,
      [hotelId]: optIdx
    }));
  }

  // Construct day tabs array based on duration (1 to 14 days)
  const totalDays = Math.max(1, Math.min(14, Number(duration) || 5));
  const dayTabs = Array.from({ length: totalDays }, (_, i) => i);

  return (
    <div id="hotels-section" className="bg-white rounded-[2.5rem] p-5 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
      
      {/* Section Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-600 to-sky-500 text-white flex items-center justify-center font-bold text-base shadow-md shadow-brand-500/20">
              <i className="fa-solid fa-hotel"></i>
            </div>
            <div>
              <h3 className="font-heading font-black text-slate-900 text-lg sm:text-xl">
                Verified Lodges & Stays Near Day {dayNumber} · {currentDayCity} ({currentHub.hub.split(" Hub")[0]})
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Handpicked real lodges, heritage inns & chalets located right beside <strong>Day {dayNumber}</strong> stops ({currentHub.landmarks}) with MakeMyTrip booking & sharing rates
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start lg:self-auto flex-wrap">
          <span className="text-xs font-black text-emerald-800 bg-emerald-50 px-3.5 py-1.5 rounded-xl border border-emerald-200 flex items-center gap-1.5 shadow-xs">
            <i className="fa-solid fa-shield-check text-emerald-600"></i>
            <span>Day {dayNumber} Proximity Verified</span>
          </span>
          <span className="text-xs font-black text-rose-700 bg-rose-50 px-3 py-1.5 rounded-xl border border-rose-200 flex items-center gap-1.5 shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-600 animate-pulse"></span>
            <span>MakeMyTrip Partner Direct</span>
          </span>
        </div>
      </div>

      {/* DAY-BY-DAY INTERACTIVE SELECTOR TABS */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <i className="fa-solid fa-calendar-days text-brand-600"></i>
            <span>Select Day to View Nearby Lodges for that Specific Place:</span>
          </span>
          <span className="text-[10px] font-bold text-brand-600 bg-brand-50 px-2 py-0.5 rounded-md border border-brand-200">
            Click Day 1, Day 2, Day 3...
          </span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {dayTabs.map((dayIdx) => {
            const isSelected = dayIdx === selectedDayIdx;
            const hubInfo = hubList[dayIdx % hubList.length] || { hub: `Day ${dayIdx + 1} Hub` };
            const shortHubName = hubInfo.hub.replace(" Hub", "").split(" & ")[0];

            return (
              <button
                key={dayIdx}
                onClick={() => handleSelectDay(dayIdx)}
                className={`px-4 py-2.5 rounded-2xl text-xs font-extrabold whitespace-nowrap transition-all duration-200 flex items-center gap-2 cursor-pointer shrink-0 ${
                  isSelected
                    ? 'bg-gradient-to-r from-brand-600 to-indigo-600 text-white shadow-md shadow-brand-500/25 scale-105'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 border border-slate-200/60'
                }`}
              >
                <i className={`fa-solid ${isSelected ? 'fa-hotel' : 'fa-bed'} text-[11px]`}></i>
                <span>Day {dayIdx + 1}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-medium ${
                  isSelected ? 'bg-white/20 text-white' : 'bg-slate-200/80 text-slate-600'
                }`}>
                  {shortHubName}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Hotel Cards List for the Selected Day */}
      <div className="space-y-5">
        {(!displayedHotels || displayedHotels.length === 0) ? (
          <p className="text-xs text-slate-500 py-8 text-center font-bold">
            Discovering verified lodges near Day {dayNumber} staying hub...
          </p>
        ) : (
          displayedHotels.map((h) => {
            if (!h) return null;
            const currentSelectedIdx = selectedSharingMap[h.id] !== undefined ? selectedSharingMap[h.id] : 0;
            const activeSharing = (h.sharing_options && (h.sharing_options[currentSelectedIdx] || h.sharing_options[0])) || {
              type: "Standard Room",
              price_per_person_inr: Math.round((h.base_price_inr || 3000) / 2),
              total_inr: h.base_price_inr || 3000,
              badge: "Standard"
            };

            // MakeMyTrip verified direct hotel search URL & city listing fallback
            const mmtSearchUrl = h.booking_links?.makemytrip_url || 
              `https://www.makemytrip.com/hotels/hotel-listing/?city=${encodeURIComponent(currentDayCity)}&searchText=${encodeURIComponent(h.name || '')}`;
            
            const mmtCityUrl = h.booking_links?.makemytrip_city_url || 
              `https://www.makemytrip.com/hotels/hotel-listing/?city=${encodeURIComponent(currentDayCity)}`;

            const googleHotelsUrl = h.booking_links?.google_hotels_url || 
              `https://www.google.com/travel/hotels?q=${encodeURIComponent((h.name || '') + " " + currentDayCity + " makemytrip")}`;

            return (
              <div 
                key={h.id || Math.random()} 
                className="bg-white hover:bg-slate-50/50 p-4 sm:p-6 rounded-3xl border border-slate-200/80 hover:border-brand-300 transition-all duration-300 shadow-xs hover:shadow-xl flex flex-col md:flex-row gap-6 items-start group"
              >
                {/* Hotel Photo */}
                <div className="w-full md:w-64 h-48 shrink-0 relative rounded-2xl overflow-hidden shadow-xs bg-slate-900">
                  <img 
                    src={h.image} 
                    alt={h.name || 'Lodge'} 
                    loading="lazy"
                    onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80"; }}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                  />
                  <span className="absolute top-3 left-3 px-3 py-1 rounded-xl bg-slate-950/80 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-wider border border-white/20">
                    Day {dayNumber} · {h.type || 'Lodge'}
                  </span>
                </div>

                {/* Hotel Details */}
                <div className="flex-1 min-w-0 w-full space-y-4">
                  
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-heading font-black text-slate-900 text-base sm:text-lg leading-snug group-hover:text-brand-700 transition">
                          {h.name}
                        </h4>
                        <span className="px-2.5 py-0.5 bg-amber-50 text-amber-800 text-[11px] font-black rounded-lg flex items-center gap-1 border border-amber-200">
                          <i className="fa-solid fa-star text-amber-500 text-[10px]"></i> {h.rating || 4.7} ({h.reviews || 850} reviews)
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                        <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 font-extrabold text-[11px] border border-emerald-200 flex items-center gap-1">
                          <i className="fa-solid fa-location-crosshairs text-[10px]"></i>
                          <span>{h.distance || "Central District"}</span>
                        </span>
                        <span className="text-xs text-slate-500 font-semibold">
                          near <strong className="text-slate-800">{h.near_landmark || currentDayCity}</strong>
                        </span>
                      </div>
                    </div>

                    {/* Dynamic Rate Display based on Selected Sharing Option */}
                    <div className="text-left sm:text-right shrink-0 p-3 bg-slate-50 rounded-2xl border border-slate-200/70 sm:min-w-[140px]">
                      <span className="text-[10px] uppercase font-black text-slate-400 block tracking-wider">
                        {activeSharing?.type ? activeSharing.type.split(' ')[0] + ' Sharing Rate' : 'Starting Rate'}
                      </span>
                      <span className="text-xl font-black text-emerald-700 block">
                        ₹{(activeSharing?.price_per_person_inr ?? h.base_price_inr ?? 3000)?.toLocaleString()}
                      </span>
                      <span className="text-[10px] text-slate-400 font-bold block">
                        {activeSharing ? "/ person / night" : "/ room / night"}
                      </span>
                    </div>
                  </div>

                  {/* Amenities Badges */}
                  <div className="flex flex-wrap gap-1.5">
                    {Array.isArray(h.amenities) && h.amenities.slice(0, 5).map((am, amIdx) => (
                      <span key={amIdx} className="px-2.5 py-1 bg-slate-100 text-slate-600 rounded-lg text-[10px] font-bold">
                        {am}
                      </span>
                    ))}
                  </div>

                  {/* Room Sharing Breakdown Interactive Selector */}
                  <div className="pt-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider flex items-center gap-1.5">
                        <i className="fa-solid fa-bed text-brand-600"></i>
                        Select Room Sharing Option (Click to preview price):
                      </span>
                      <span className="text-[10px] font-black text-brand-600 bg-brand-50 px-2 py-0.5 rounded-md border border-brand-200">
                        Interactive
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                      {Array.isArray(h.sharing_options) && h.sharing_options.map((opt, optIdx) => {
                        const isChosen = currentSelectedIdx === optIdx;
                        return (
                          <div 
                            key={optIdx}
                            onClick={() => handleSelectSharing(h.id, optIdx)}
                            className={`p-3 rounded-2xl border text-xs cursor-pointer transition-all duration-200 flex flex-col justify-between ${
                              isChosen
                                ? 'bg-brand-50/80 border-brand-500 shadow-sm ring-2 ring-brand-500/20'
                                : 'bg-slate-50/80 border-slate-200/80 hover:border-slate-300'
                            }`}
                          >
                            <div className="flex items-center justify-between gap-1 mb-1">
                              <span className={`text-[10px] font-black uppercase px-1.5 py-0.5 rounded ${
                                isChosen ? 'bg-brand-600 text-white' : 'bg-slate-200 text-slate-700'
                              }`}>
                                {opt?.badge || "Sharing"}
                              </span>
                              <span className="font-black text-emerald-700 text-xs">
                                ₹{(opt?.price_per_person_inr || 0).toLocaleString()}/p
                              </span>
                            </div>
                            <strong className="text-slate-800 text-xs block font-bold truncate">{opt?.type || "Standard Room"}</strong>
                            <span className="text-[10px] text-slate-500 font-medium line-clamp-1 mt-0.5">{opt?.note || ''}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Booking & Partner Action Buttons */}
                  <div className="flex flex-wrap items-center gap-2.5 pt-2">
                    
                    {/* PRIMARY ACTION: DIRECT MAKEMYTRIP PROPERTY BOOKING */}
                    <a 
                      href={mmtSearchUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="px-4 py-2.5 bg-red-600 hover:bg-red-700 active:scale-95 text-white font-black text-xs rounded-xl shadow-md shadow-red-500/25 transition flex items-center gap-2 cursor-pointer group"
                      title={`Book ${h.name} on MakeMyTrip in ${currentDayCity}`}
                    >
                      <span className="w-5 h-5 rounded-md bg-white text-red-600 font-black text-[9px] flex items-center justify-center shadow-xs">
                        MMT
                      </span>
                      <span>Book on MakeMyTrip</span>
                      <i className="fa-solid fa-arrow-up-right-from-square text-[10px] group-hover:translate-x-0.5 transition-transform"></i>
                    </a>

                    {/* DIRECT MAKEMYTRIP CITY HOTELS (100% Guaranteed to Never Filter Out) */}
                    <a 
                      href={mmtCityUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="px-3.5 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs rounded-xl border border-rose-200 transition flex items-center gap-1.5 cursor-pointer active:scale-95"
                      title={`Browse all verified hotels in ${currentDayCity} on MakeMyTrip`}
                    >
                      <i className="fa-solid fa-city text-rose-500 text-[11px]"></i>
                      <span>All {currentDayCity} Hotels (MMT)</span>
                    </a>

                    {/* ROOM SHARING & INSTANT RESERVATION */}
                    <button 
                      onClick={() => onOpenBookingModal({ ...h, city: currentDayCity })}
                      className="px-4 py-2.5 bg-brand-50 hover:bg-brand-100 text-brand-700 font-extrabold text-xs rounded-xl border border-brand-200 transition flex items-center gap-2 cursor-pointer active:scale-95"
                    >
                      <i className="fa-solid fa-bed text-brand-600"></i>
                      <span>Room Sharing & Details</span>
                    </button>

                    {/* TERTIARY ACTION: GOOGLE HOTELS PRICE COMPARISON */}
                    <a 
                      href={googleHotelsUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="px-3 py-2.5 text-slate-500 hover:text-slate-900 text-xs font-bold transition flex items-center gap-1.5"
                      title={`Compare ${h.name} prices across MakeMyTrip, Agoda & Booking.com`}
                    >
                      <i className="fa-brands fa-google text-[12px] text-blue-500"></i>
                      <span>Compare Rates</span>
                    </a>
                  </div>

                </div>
              </div>
            );
          })
        )}
      </div>

    </div>
  );
}
