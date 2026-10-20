/**
 * TravelMate AI - Core Interactive Frontend Application
 * Interacts directly with FastAPI backend AI Agents
 */

// =========================================================================
// Global Application State
// =========================================================================
const state = {
  currentOrigin: "Hyderabad, Telangana, India",
  currentDestination: "Switzerland (Zurich, Lucerne, Interlaken, Grindelwald)",
  durationDays: 5,
  travelersCount: 2,
  travelerType: "couple",
  totalBudget: 120000,
  usedBudget: 85000,
  currentItinerary: null,
  activeDayIndex: 0,
  leafletMap: null,
  mapMarkers: [],
  routePolyline: null,
  isVoiceActive: false,
  activeHotels: [],
  selectedHotelForBooking: null,
  selectedSharingIdx: 0,
};

// Curated High-Definition Photos
const PHOTO_BANK = {
  cafe_sprungli: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80",
  zurich_old_town: "https://images.unsplash.com/photo-1515488764276-beab7607c1e6?auto=format&fit=crop&w=600&q=80",
  lake_view: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80",
  swiss_museum: "https://images.unsplash.com/photo-1565008447742-97f6f38c985c?auto=format&fit=crop&w=600&q=80",
  lake_zurich: "https://images.unsplash.com/photo-1527668752968-14dc70a27c95?auto=format&fit=crop&w=600&q=80",
  chapel_bridge: "https://images.unsplash.com/photo-1528728329032-2972f65dfb3f?auto=format&fit=crop&w=600&q=80",
  harder_kulm: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80",
  grindelwald_first: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80",
  lindt: "https://images.unsplash.com/photo-1549007994-cb92caebd54b?auto=format&fit=crop&w=600&q=80",
  mount_titlis: "https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?auto=format&fit=crop&w=400&q=80",
  jungfraujoch: "https://images.unsplash.com/photo-1491555103944-7c647fd857e6?auto=format&fit=crop&w=400&q=80",
  lucerne_cruise: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=400&q=80",
  brienz: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=400&q=80",
  charminar: "https://images.unsplash.com/photo-1572455044327-7348c1be7267?auto=format&fit=crop&w=600&q=80",
  taj_mahal: "https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=600&q=80",
  eiffel_tower: "https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?auto=format&fit=crop&w=600&q=80",
  colosseum: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=600&q=80",
  senso_ji: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=600&q=80",
  dubai: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=600&q=80",
  goa_beach: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=600&q=80",
  kerala_backwaters: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=600&q=80",
  kashmir_valley: "https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=600&q=80",
  manali_snow: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=600&q=80",
  vizag_sea: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=600&q=80",
  jaipur_palace: "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=600&q=80",
  varanasi_ghats: "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=600&q=80",
  amritsar_temple: "https://images.unsplash.com/photo-1588096344356-9b552b998e3b?auto=format&fit=crop&w=600&q=80",
  ladakh_lake: "https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=600&q=80",
  ooty_tea: "https://images.unsplash.com/photo-1589308078059-be1415eab4c3?auto=format&fit=crop&w=600&q=80",
  london_eye: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=600&q=80",
  singapore_skyline: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=600&q=80",
  bali_temple: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=600&q=80",
  bangkok_wat: "https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&w=600&q=80",
  new_york_sky: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=600&q=80",
  barcelona_sagrada: "https://images.unsplash.com/photo-1583422409516-2895a77efded?auto=format&fit=crop&w=600&q=80",
  maldives_resort: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=600&q=80",
  andaman_beach: "https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?auto=format&fit=crop&w=600&q=80",
  mumbai_sea: "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=600&q=80",
  rishikesh_ganga: "https://images.unsplash.com/photo-1600100397608-f010f4439c63?auto=format&fit=crop&w=600&q=80",
  tirupati_temple: "https://images.unsplash.com/photo-1621847468516-1ed5d0df56fe?auto=format&fit=crop&w=600&q=80"
};

// =========================================================================
// Destination Metadata & Realistic Dynamic Pricing in ₹ INR
// =========================================================================
const DESTINATION_CONFIG = {
  "switzerland": {
    heroImg: "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=1600&q=85",
    baseRatePerDay: 12000,
    weather: { temp: "18°C", condition: "Partly Cloudy", verdict: "Good time to explore! Low rain chance. Pleasant temperature for sightseeing.", icon: "fa-cloud-sun" },
    alert: { text: "Light rain expected on Day 3 (Interlaken). Tap to automatically recalculate with indoor cultural venues.", day: 3, slot: "Morning" },
    recs: [
      { title: "Mount Titlis", note: "Rotair Revolving Cable Car", rating: "4.8", img: PHOTO_BANK.mount_titlis },
      { title: "Jungfraujoch", note: "Top of Europe Glacier Views", rating: "4.9", img: PHOTO_BANK.jungfraujoch },
      { title: "Lake Lucerne Cruise", note: "Scenic Historic Paddle Steamer", rating: "4.7", img: PHOTO_BANK.lucerne_cruise },
      { title: "Lindt Chocolate Factory", note: "Giant 9m Chocolate Fountain", rating: "4.6", img: PHOTO_BANK.lindt },
      { title: "Brienz", note: "Turquoise Lakeside Woodcarving", rating: "4.6", img: PHOTO_BANK.brienz },
    ]
  },
  "goa": {
    heroImg: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1600&q=85",
    baseRatePerDay: 3500,
    weather: { temp: "31°C", condition: "Tropical Sunny", verdict: "Bright sunshine & warm breeze. Perfect conditions for beaches & water sports!", icon: "fa-sun" },
    alert: { text: "High sea surge alert at Calangute on Day 2. Tap to swap open beach sports with Aguada Jail Heritage Museum.", day: 2, slot: "Afternoon" },
    recs: [
      { title: "Dudhsagar Falls", note: "Four-Tiered Jungle Waterfall", rating: "4.8", img: PHOTO_BANK.goa_beach },
      { title: "Baga Beach Watersports", note: "Parasailing & Jet Skiing", rating: "4.7", img: PHOTO_BANK.goa_beach },
      { title: "Chapora Fort", note: "Iconic Sunset Ramparts", rating: "4.6", img: PHOTO_BANK.goa_beach },
      { title: "Fontainhas Latin Quarter", note: "Colorful Portuguese Heritage", rating: "4.7", img: PHOTO_BANK.zurich_old_town },
      { title: "Spice Plantation Tour", note: "Authentic Goan Thali & Buffets", rating: "4.5", img: PHOTO_BANK.lake_view },
    ]
  },
  "hyderabad": {
    heroImg: "https://images.unsplash.com/photo-1572455044327-7348c1be7267?auto=format&fit=crop&w=1600&q=85",
    baseRatePerDay: 2800,
    weather: { temp: "28°C", condition: "Warm & Clear", verdict: "Pleasant morning temperatures. Excellent weather for historic fort walks & bazaars.", icon: "fa-sun" },
    alert: { text: "Peak afternoon temperature alert on Day 1. Tap to swap outdoor fort trek with air-conditioned Salar Jung Museum.", day: 1, slot: "Afternoon" },
    recs: [
      { title: "Golconda Fort", note: "Acoustic Citadel & Laser Show", rating: "4.8", img: PHOTO_BANK.charminar },
      { title: "Charminar & Laad Bazaar", note: "Irani Chai & Pearl Shopping", rating: "4.7", img: PHOTO_BANK.charminar },
      { title: "Ramoji Film City", note: "World's Largest Themed Studio", rating: "4.6", img: PHOTO_BANK.swiss_museum },
      { title: "Chowmahalla Palace", note: "Opulent Nizam Royal Courtyards", rating: "4.7", img: PHOTO_BANK.cafe_sprungli },
      { title: "Durgam Cheruvu Cable Bridge", note: "Night Skyline & Lake Boating", rating: "4.5", img: PHOTO_BANK.lake_zurich },
    ]
  },
  "kerala": {
    heroImg: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1600&q=85",
    baseRatePerDay: 3600,
    weather: { temp: "23°C", condition: "Misty Tropical", verdict: "Lush green scenery with refreshing mountain and backwater breezes.", icon: "fa-cloud-rain" },
    alert: { text: "Monsoon shower alert along coastal canals on Day 2. Tap to swap open canoe ride for covered Coir & Spice Museum.", day: 2, slot: "Morning" },
    recs: [
      { title: "Alleppey Houseboat", note: "Overnight Backwaters Cruise", rating: "4.9", img: PHOTO_BANK.kerala_backwaters },
      { title: "Eravikulam National Park", note: "Nilgiri Tahr Mountain Sanctuary", rating: "4.8", img: PHOTO_BANK.kerala_backwaters },
      { title: "Fort Kochi Chinese Nets", note: "Colonial Heritage Promenade", rating: "4.6", img: PHOTO_BANK.chapel_bridge },
      { title: "Tata Tea Museum", note: "Rolling Plantations & Tasting", rating: "4.7", img: PHOTO_BANK.brienz },
      { title: "Athirappilly Waterfalls", note: "Niagara of India Forest Vista", rating: "4.8", img: PHOTO_BANK.harder_kulm },
    ]
  },
  "kashmir": {
    heroImg: "https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=1600&q=85",
    baseRatePerDay: 4500,
    weather: { temp: "14°C", condition: "Crisp Alpine", verdict: "Cool mountain breezes and clear skies overlooking snow-capped peaks.", icon: "fa-snowflake" },
    alert: { text: "Mountain mist and temperature drop in Gulmarg on Day 2. Tap to swap high gondola with traditional woodcarving enclave.", day: 2, slot: "Afternoon" },
    recs: [
      { title: "Dal Lake Shikara", note: "Floating Flower & Spice Market", rating: "4.9", img: PHOTO_BANK.kashmir_valley },
      { title: "Gulmarg Gondola", note: "Asia's Highest Cable Car", rating: "4.9", img: PHOTO_BANK.mount_titlis },
      { title: "Pahalgam Betaab Valley", note: "Pristine Pine Forests & River", rating: "4.8", img: PHOTO_BANK.kashmir_valley },
      { title: "Shalimar Mughal Garden", note: "Terraced Royal Fountains", rating: "4.7", img: PHOTO_BANK.brienz },
      { title: "Sonamarg Meadow of Gold", note: "Thajiwas Glacier Trek", rating: "4.7", img: PHOTO_BANK.grindelwald_first },
    ]
  },
  "paris": {
    heroImg: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1600&q=85",
    baseRatePerDay: 14000,
    weather: { temp: "16°C", condition: "Mild Autumn", verdict: "Delightful walking weather along the Seine river and boulevard cafes.", icon: "fa-cloud-sun" },
    alert: { text: "Heavy rain shower alert on Day 2 Afternoon. Tap to swap Tuileries garden stroll with Musée d'Orsay.", day: 2, slot: "Afternoon" },
    recs: [
      { title: "Eiffel Tower Summit", note: "Panoramic 330m Paris Vista", rating: "4.8", img: PHOTO_BANK.eiffel_tower },
      { title: "Louvre Museum", note: "Mona Lisa & Classical Wing", rating: "4.8", img: PHOTO_BANK.eiffel_tower },
      { title: "Seine River Cruise", note: "Evening Illuminated Monuments", rating: "4.7", img: PHOTO_BANK.lake_zurich },
      { title: "Montmartre & Sacré-Cœur", note: "Bohemian Artisan Plaza", rating: "4.7", img: PHOTO_BANK.zurich_old_town },
      { title: "Palace of Versailles", note: "Hall of Mirrors & Royal Gardens", rating: "4.9", img: PHOTO_BANK.swiss_museum },
    ]
  },
  "tokyo": {
    heroImg: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1600&q=85",
    baseRatePerDay: 15000,
    weather: { temp: "19°C", condition: "Pleasant & Clear", verdict: "Optimal autumn weather for city transit and temple garden walks.", icon: "fa-sun" },
    alert: { text: "Transit congestion alert in Shibuya on Day 1. Tap to reschedule to Meiji Shrine peaceful bamboo grove.", day: 1, slot: "Evening" },
    recs: [
      { title: "Sensō-ji Temple", note: "Tokyo's Oldest Buddhist Shrine", rating: "4.8", img: PHOTO_BANK.senso_ji },
      { title: "Shibuya Sky Observation", note: "360-Degree Glass Deck Vista", rating: "4.9", img: PHOTO_BANK.senso_ji },
      { title: "Tsukiji Outer Market", note: "Fresh Nigiri Sushi & Wagashi", rating: "4.7", img: PHOTO_BANK.cafe_sprungli },
      { title: "teamLab Planets", note: "Immersive Digital Art Dome", rating: "4.8", img: PHOTO_BANK.swiss_museum },
      { title: "Meiji Jingu Shrine", note: "Sacred Evergreen Forest", rating: "4.7", img: PHOTO_BANK.brienz },
    ]
  },
  "dubai": {
    heroImg: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1600&q=85",
    baseRatePerDay: 11000,
    weather: { temp: "30°C", condition: "Sunny & Warm", verdict: "Clear skies and comfortable coastal breeze in the late afternoon.", icon: "fa-sun" },
    alert: { text: "Midday desert haze alert on Day 2. Tap to swap dune safari with indoor Museum of the Future.", day: 2, slot: "Afternoon" },
    recs: [
      { title: "Burj Khalifa At The Top", note: "124th/125th Floor Skyline", rating: "4.8", img: PHOTO_BANK.dubai },
      { title: "Desert Safari & BBQ", note: "Dune Bashing & Starlight Camp", rating: "4.8", img: PHOTO_BANK.dubai },
      { title: "Dubai Mall & Aquarium", note: "World's Largest Giant Tank", rating: "4.7", img: PHOTO_BANK.dubai },
      { title: "Dubai Marina Yacht Cruise", note: "Luxury Skyscraper Harbor", rating: "4.7", img: PHOTO_BANK.lake_zurich },
      { title: "Museum of the Future", note: "Futuristic Torus Architecture", rating: "4.8", img: PHOTO_BANK.swiss_museum },
    ]
  },
  "vizag": {
    heroImg: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1600&q=85",
    baseRatePerDay: 2600,
    weather: { temp: "29°C", condition: "Coastal Breeze", verdict: "Refreshing sea breeze. Ideal for naval museum tours & beach walks.", icon: "fa-sun" },
    alert: { text: "Strong sea winds at RK Beach on Day 1. Tap to swap beach walk with INS Kursura Submarine indoor tour.", day: 1, slot: "Afternoon" },
    recs: [
      { title: "INS Kursura Submarine", note: "Real Decommissioned Naval Sub", rating: "4.8", img: PHOTO_BANK.vizag_sea },
      { title: "Kailasagiri Hilltop", note: "Ropeway & Sea Coast Panorama", rating: "4.7", img: PHOTO_BANK.vizag_sea },
      { title: "Rushikonda Blue Flag Beach", note: "Pristine Certified Eco Beach", rating: "4.7", img: PHOTO_BANK.vizag_sea },
      { title: "Araku Valley Vistadome", note: "Glass-Roof Mountain Railway", rating: "4.9", img: PHOTO_BANK.harder_kulm },
      { title: "Borra Caves", note: "Million-Year-Old Stalactites", rating: "4.8", img: PHOTO_BANK.swiss_museum },
    ]
  },
  "delhi_agra": {
    heroImg: "https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1600&q=85",
    baseRatePerDay: 3200,
    weather: { temp: "26°C", condition: "Sunny Autumn", verdict: "Pleasant daytime weather. Great conditions for walking Mughal monuments.", icon: "fa-sun" },
    alert: { text: "Foggy morning delay on Taj Mahal expressway. Tap to re-route via Gatimaan Superfast Express.", day: 1, slot: "Morning" },
    recs: [
      { title: "Taj Mahal Sunrise", note: "UNESCO Wonder of the World", rating: "4.9", img: PHOTO_BANK.taj_mahal },
      { title: "Agra Fort", note: "Red Sandstone Royal Bastions", rating: "4.8", img: PHOTO_BANK.taj_mahal },
      { title: "Qutub Minar", note: "73m Tower of Victory", rating: "4.7", img: PHOTO_BANK.charminar },
      { title: "Humayun's Tomb", note: "Precursor to Taj Mahal Gardens", rating: "4.8", img: PHOTO_BANK.taj_mahal },
      { title: "Chandni Chowk Food Trail", note: "Authentic Parathas & Jalebis", rating: "4.6", img: PHOTO_BANK.cafe_sprungli },
    ]
  },
  "jaipur": {
    heroImg: "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1600&q=85",
    baseRatePerDay: 3200,
    weather: { temp: "27°C", condition: "Royal Sunny", verdict: "Warm dry breezes and golden desert sun perfect for exploring palaces and courtyards.", icon: "fa-sun" },
    alert: { text: "Midday sun intensity at Amber Fort on Day 1. Tap to swap open courtyard walk with Albert Hall Museum.", day: 1, slot: "Afternoon" },
    recs: [
      { title: "Amber Fort & Palace", note: "Sheesh Mahal & Elephant Ramparts", rating: "4.9", img: PHOTO_BANK.jaipur_palace },
      { title: "Hawa Mahal (Palace of Winds)", note: "953 Pink Sandstone Windows", rating: "4.8", img: PHOTO_BANK.jaipur_palace },
      { title: "City Palace Royal Courtyard", note: "Chandra Mahal & Armoury Museum", rating: "4.7", img: PHOTO_BANK.jaipur_palace },
      { title: "Jal Mahal Water Palace", note: "Man Sagar Lake Viewpoint", rating: "4.6", img: PHOTO_BANK.lake_zurich },
      { title: "Chokhi Dhani Ethnic Resort", note: "Traditional Rajasthani Thali & Folk Dance", rating: "4.8", img: PHOTO_BANK.cafe_sprungli },
    ]
  },
  "manali": {
    heroImg: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1600&q=85",
    baseRatePerDay: 3400,
    weather: { temp: "12°C", condition: "Chilly Mountain Mist", verdict: "Fresh pine forest air, snow-capped peaks, and crystal river streams.", icon: "fa-snowflake" },
    alert: { text: "Snowfall warning along Rohtang Pass on Day 2. Tap to reroute through all-weather Atal Tunnel to Sissu.", day: 2, slot: "Morning" },
    recs: [
      { title: "Solang Valley Snow Point", note: "Skiing, Zorbing & Paragliding", rating: "4.8", img: PHOTO_BANK.manali_snow },
      { title: "Atal Tunnel & Sissu Waterfalls", note: "Engineering Marvel through Pir Panjal", rating: "4.9", img: PHOTO_BANK.manali_snow },
      { title: "Hadimba Devi Temple", note: "Cedar Forest 1553 Wood Pagoda", rating: "4.7", img: PHOTO_BANK.manali_snow },
      { title: "Jogini Waterfalls Trek", note: "Scenic Vashisht River Vista", rating: "4.7", img: PHOTO_BANK.harder_kulm },
      { title: "Old Manali Bohemian Cafes", note: "Wood-Fired Trout & Live Acoustic Music", rating: "4.6", img: PHOTO_BANK.cafe_sprungli },
    ]
  },
  "ladakh": {
    heroImg: "https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=1600&q=85",
    baseRatePerDay: 4800,
    weather: { temp: "8°C", condition: "High Altitude Sunshine", verdict: "High-altitude crisp sunny skies with thin, pure Himalayan mountain air.", icon: "fa-sun" },
    alert: { text: "Altitude acclimatization precaution on Day 1. Tap to swap high Khardung La pass with peaceful Shanti Stupa.", day: 1, slot: "Morning" },
    recs: [
      { title: "Pangong Tso Lake", note: "High-Altitude Color-Changing Lake (4,250m)", rating: "4.9", img: PHOTO_BANK.ladakh_lake },
      { title: "Khardung La Pass", note: "World's Highest Motorable Pass (5,359m)", rating: "4.8", img: PHOTO_BANK.ladakh_lake },
      { title: "Nubra Valley Sand Dunes", note: "Double-Humped Bactrian Camels & Diskit", rating: "4.9", img: PHOTO_BANK.ladakh_lake },
      { title: "Magnetic Hill", note: "Natural Anti-Gravity Optical Wonder", rating: "4.6", img: PHOTO_BANK.ladakh_lake },
      { title: "Thiksey Monastery", note: "Twelve-Story Tibetan Potala Miniature", rating: "4.8", img: PHOTO_BANK.ladakh_lake },
    ]
  },
  "varanasi": {
    heroImg: "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=1600&q=85",
    baseRatePerDay: 2500,
    weather: { temp: "24°C", condition: "Serene & Misty", verdict: "Crisp morning mist over the sacred Ganges and warm spiritual afternoons.", icon: "fa-sun" },
    alert: { text: "Ghat crowd surge during evening Ganga Aarti on Day 1. Tap to book private wooden boat viewing.", day: 1, slot: "Evening" },
    recs: [
      { title: "Dashashwamedh Evening Aarti", note: "Spiritual Brass Lamp Ceremony on Ganges", rating: "4.9", img: PHOTO_BANK.varanasi_ghats },
      { title: "Kashi Vishwanath Corridor", note: "Ancient Golden Temple of Lord Shiva", rating: "4.9", img: PHOTO_BANK.varanasi_ghats },
      { title: "Sunrise Ganges Boat Ride", note: "Subah-e-Banaras Morning Chants", rating: "4.8", img: PHOTO_BANK.varanasi_ghats },
      { title: "Sarnath Deer Park & Stupa", note: "Where Buddha Preached His First Sermon", rating: "4.7", img: PHOTO_BANK.swiss_museum },
      { title: "Banarasi Silk & Chaat Trail", note: "Tamatar Chaat & Famous Malaiyyo Treat", rating: "4.7", img: PHOTO_BANK.cafe_sprungli },
    ]
  },
  "mumbai": {
    heroImg: "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=1600&q=85",
    baseRatePerDay: 3800,
    weather: { temp: "29°C", condition: "Arabian Sea Breeze", verdict: "Pleasant evening winds and iconic bustling energy along Marine Drive.", icon: "fa-sun" },
    alert: { text: "Evening rush hour crowd along Colaba Causeway on Day 1. Tap to reroute by ferry to Elephanta Caves.", day: 1, slot: "Evening" },
    recs: [
      { title: "Gateway of India & Taj Hotel", note: "1924 Basalt Arch Waterfront Monument", rating: "4.8", img: PHOTO_BANK.mumbai_sea },
      { title: "Marine Drive Queen's Necklace", note: "Iconic C-Shaped Sunset Boulevard", rating: "4.8", img: PHOTO_BANK.mumbai_sea },
      { title: "Elephanta Caves UNESCO", note: "Rock-Cut Trimurti Sculptures via Ferry", rating: "4.7", img: PHOTO_BANK.mumbai_sea },
      { title: "Chhatrapati Shivaji Terminus", note: "Victorian Gothic UNESCO Landmark", rating: "4.8", img: PHOTO_BANK.mumbai_sea },
      { title: "Bandra-Worli Sea Link", note: "Cable-Stayed Sea Bridge & Bandstand", rating: "4.7", img: PHOTO_BANK.mumbai_sea },
    ]
  },
  "bengaluru": {
    heroImg: "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=1600&q=85",
    baseRatePerDay: 3400,
    weather: { temp: "24°C", condition: "Pleasant Garden City", verdict: "Mild cool breezes and shaded boulevards across royal parks and botanical centers.", icon: "fa-cloud-sun" },
    alert: { text: "City peak-hour traffic bottleneck on Day 1. Tap to take Namma Metro to Bangalore Palace.", day: 1, slot: "Morning" },
    recs: [
      { title: "Bangalore Palace", note: "Tudor-Style Royal Quarters & Wooden Carvings", rating: "4.7", img: PHOTO_BANK.swiss_museum },
      { title: "Lalbagh Botanical Glass House", note: "240-Acre Garden & 3,000-Million-Year-Old Rock", rating: "4.8", img: PHOTO_BANK.brienz },
      { title: "Mysore Palace Illuminations", note: "100,000 Golden Incandescent Lamps", rating: "4.9", img: PHOTO_BANK.jaipur_palace },
      { title: "Bannerghatta Safari Park", note: "Open Lion, Tiger & Bear Sanctuary", rating: "4.6", img: PHOTO_BANK.kerala_backwaters },
      { title: "Cubbon Park & Vidhana Soudha", note: "Lush Bamboo Groves & Neo-Dravidian Capitol", rating: "4.7", img: PHOTO_BANK.lake_view },
    ]
  },
  "chennai": {
    heroImg: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1600&q=85",
    baseRatePerDay: 3000,
    weather: { temp: "30°C", condition: "Coastal Warmth", verdict: "Breezy coastal climate along the Bay of Bengal, ideal for temple architecture.", icon: "fa-sun" },
    alert: { text: "High humidity at Marina Beach on Day 2. Tap to shift to indoor Government Museum & Bronze Gallery.", day: 2, slot: "Afternoon" },
    recs: [
      { title: "Mahabalipuram Shore Temple", note: "8th Century Pallava Ocean Monoliths", rating: "4.8", img: PHOTO_BANK.tirupati_temple },
      { title: "Kapaleeshwarar Temple", note: "Vibrant Dravidian Gopuram in Mylapore", rating: "4.8", img: PHOTO_BANK.tirupati_temple },
      { title: "Marina Beach Promenade", note: "World's Second Longest Natural Beach", rating: "4.6", img: PHOTO_BANK.vizag_sea },
      { title: "DakshinaChitra Heritage Village", note: "Live Southern Indian Architecture & Crafts", rating: "4.7", img: PHOTO_BANK.brienz },
      { title: "Fort St. George & Museum", note: "First British Outpost in India (1644)", rating: "4.5", img: PHOTO_BANK.swiss_museum },
    ]
  },
  "amritsar": {
    heroImg: "https://images.unsplash.com/photo-1588096344356-9b552b998e3b?auto=format&fit=crop&w=1600&q=85",
    baseRatePerDay: 2600,
    weather: { temp: "22°C", condition: "Crisp Autumn Sunshine", verdict: "Golden sunshine, devotional serenity, and celebrated Punjabi hospitality.", icon: "fa-sun" },
    alert: { text: "Massive rush expected at Wagah Border gate on Day 2. Tap to prioritize VIP pass seating.", day: 2, slot: "Afternoon" },
    recs: [
      { title: "Harmandir Sahib (Golden Temple)", note: "Pure Gold Sanctum & 24/7 Community Langar", rating: "5.0", img: PHOTO_BANK.amritsar_temple },
      { title: "Wagah Border Beating Retreat", note: "Electrifying Indo-Pak Military Ceremony", rating: "4.9", img: PHOTO_BANK.amritsar_temple },
      { title: "Jallianwala Bagh Memorial", note: "Historic Martyr's Well & Eternal Flame", rating: "4.8", img: PHOTO_BANK.swiss_museum },
      { title: "The Partition Museum", note: "World's First Partition Memorial in Town Hall", rating: "4.8", img: PHOTO_BANK.swiss_museum },
      { title: "Gobindgarh Fort 7D Show", note: "Maharaja Ranjit Singh Fortress & Toshakhana", rating: "4.7", img: PHOTO_BANK.jaipur_palace },
    ]
  },
  "rishikesh": {
    heroImg: "https://images.unsplash.com/photo-1600100397608-f010f4439c63?auto=format&fit=crop&w=1600&q=85",
    baseRatePerDay: 2700,
    weather: { temp: "21°C", condition: "Himalayan Breeze", verdict: "Clear turquoise Ganges river water and refreshing Himalayan foothills breeze.", icon: "fa-sun" },
    alert: { text: "Strong river currents on Day 2. Tap to swap upper river rapids with calm Triveni Ghat Aarti & Yoga.", day: 2, slot: "Morning" },
    recs: [
      { title: "Ganga White Water Rafting", note: "Grade III/IV Rapids from Shivpuri to Rishikesh", rating: "4.9", img: PHOTO_BANK.rishikesh_ganga },
      { title: "Laxman Jhula & Ram Jhula", note: "Suspension Bridges with Panoramic River Views", rating: "4.7", img: PHOTO_BANK.rishikesh_ganga },
      { title: "Parmarth Niketan Evening Aarti", note: "Mesmerizing Holy Fire Ritual by the Ganga", rating: "4.9", img: PHOTO_BANK.varanasi_ghats },
      { title: "The Beatles Ashram", note: "Graffiti Domes Where Beatles Composed White Album", rating: "4.7", img: PHOTO_BANK.brienz },
      { title: "Neer Garh Waterfalls Trek", note: "Multi-Tiered Natural Turquoise Plunge Pools", rating: "4.8", img: PHOTO_BANK.harder_kulm },
    ]
  },
  "ooty": {
    heroImg: "https://images.unsplash.com/photo-1589308078059-be1415eab4c3?auto=format&fit=crop&w=1600&q=85",
    baseRatePerDay: 3100,
    weather: { temp: "15°C", condition: "Cool Misty Hills", verdict: "Chilly colonial hill station breeze surrounded by rolling tea plantations.", icon: "fa-cloud-sun" },
    alert: { text: "Dense afternoon fog along Doddabetta Peak on Day 2. Tap to visit Government Botanical Glass House.", day: 2, slot: "Afternoon" },
    recs: [
      { title: "Nilgiri Mountain Toy Train", note: "UNESCO Heritage Rack-and-Pinion Railway", rating: "4.9", img: PHOTO_BANK.ooty_tea },
      { title: "Government Botanical Gardens", note: "55-Acre Terraced Floral Sanctuary (1848)", rating: "4.7", img: PHOTO_BANK.ooty_tea },
      { title: "Doddabetta Peak Panorama", note: "Highest Point in Nilgiris (2,637m) Telescope", rating: "4.7", img: PHOTO_BANK.harder_kulm },
      { title: "Pykara Lake & Waterfalls", note: "Pristine Boating amidst Shola Pine Forests", rating: "4.8", img: PHOTO_BANK.lake_zurich },
      { title: "Tea Factory & Chocolate Museum", note: "Fresh CTC Tea Processing & Handmade Truffles", rating: "4.6", img: PHOTO_BANK.lindt },
    ]
  },
  "tirupati": {
    heroImg: "https://images.unsplash.com/photo-1621847468516-1ed5d0df56fe?auto=format&fit=crop&w=1600&q=85",
    baseRatePerDay: 2400,
    weather: { temp: "29°C", condition: "Sacred Hills Warmth", verdict: "Pleasant mountain air along the Seven Hills of Seshachalam.", icon: "fa-sun" },
    alert: { text: "Long general darshan queue wait on Day 1. Tap to switch to Special Entry Seeghra Darshan slot.", day: 1, slot: "Morning" },
    recs: [
      { title: "Sri Venkateswara Balaji Temple", note: "Tirumala Ananda Nilayam Golden Dome", rating: "5.0", img: PHOTO_BANK.tirupati_temple },
      { title: "Silathoranam Natural Arch", note: "Rare Million-Year-Old Geological Rock Arch", rating: "4.7", img: PHOTO_BANK.tirupati_temple },
      { title: "Kapila Theertham Holy Falls", note: "Ancient Waterfall & Shiva Temple at Mountain Foot", rating: "4.7", img: PHOTO_BANK.harder_kulm },
      { title: "Sri Govindaraja Swami Temple", note: "Grand 7-Tiered Raja Gopuram in Tirupati Town", rating: "4.8", img: PHOTO_BANK.tirupati_temple },
      { title: "Chandragiri Fort & Light Show", note: "Vijayanagara Imperial Raja Mahal Palace", rating: "4.6", img: PHOTO_BANK.jaipur_palace },
    ]
  },
  "pondicherry": {
    heroImg: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1600&q=85",
    baseRatePerDay: 2900,
    weather: { temp: "28°C", condition: "French Coastal Breeze", verdict: "Gentle Coromandel coast sea breeze and charming French colonial lanes.", icon: "fa-sun" },
    alert: { text: "Afternoon high tide at Promenade Beach on Day 1. Tap to tour indoor Auroville Matrimandir Visitors Centre.", day: 1, slot: "Afternoon" },
    recs: [
      { title: "Promenade Beach Rock Walk", note: "Scenic 1.5km French Quarter Seafront Boulevard", rating: "4.8", img: PHOTO_BANK.vizag_sea },
      { title: "French White Town Heritage Walk", note: "Pastel Yellow Colonial Villas & Bougainvillea", rating: "4.8", img: PHOTO_BANK.zurich_old_town },
      { title: "Auroville Matrimandir Dome", note: "Golden Globe Meditation Sanctuary of Universal Unity", rating: "4.9", img: PHOTO_BANK.swiss_museum },
      { title: "Sri Aurobindo Ashram", note: "Peaceful Floral Courtyard in Rue de la Marine", rating: "4.7", img: PHOTO_BANK.brienz },
      { title: "Paradise Beach Ferry Island", note: "Chunnambar Boat House Lagoon Ferry", rating: "4.7", img: PHOTO_BANK.lake_zurich },
    ]
  },
  "wayanad": {
    heroImg: "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=1600&q=85",
    baseRatePerDay: 3100,
    weather: { temp: "20°C", condition: "Emerald Hills Mist", verdict: "Refreshing mountain mist, spice scented air, and lush tea canopy.", icon: "fa-cloud-rain" },
    alert: { text: "Trail slippery warning at Chembra Peak on Day 2. Tap to swap steep trek with Banasura Earth Dam Boating.", day: 2, slot: "Morning" },
    recs: [
      { title: "Banasura Sagar Earth Dam", note: "Largest Earth Dam in India with Speed Boating", rating: "4.8", img: PHOTO_BANK.lake_zurich },
      { title: "Chembra Peak Heart Lake", note: "Highest Peak in Wayanad with Perennial Heart Lake", rating: "4.8", img: PHOTO_BANK.harder_kulm },
      { title: "Edakkal Prehistoric Caves", note: "7,000-Year-Old Stone Age Pictorial Carvings", rating: "4.7", img: PHOTO_BANK.swiss_museum },
      { title: "Soochipara Waterfalls", note: "Three-Tiered Sentinel Rock Forest Cascade", rating: "4.7", img: PHOTO_BANK.harder_kulm },
      { title: "Muthanga Wildlife Sanctuary", note: "Elephant Herd Safari & Wild Bison Tracking", rating: "4.6", img: PHOTO_BANK.kerala_backwaters },
    ]
  },
  "andaman": {
    heroImg: "https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?auto=format&fit=crop&w=1600&q=85",
    baseRatePerDay: 5500,
    weather: { temp: "29°C", condition: "Pristine Coral Islands", verdict: "Crystal turquoise waters, gentle sea waves, and tropical island breezes.", icon: "fa-sun" },
    alert: { text: "Low tide coral protection alert at Elephant Beach on Day 2. Tap to move snorkeling to high tide morning.", day: 2, slot: "Afternoon" },
    recs: [
      { title: "Radhanagar Beach (Havelock)", note: "Ranked Among Asia's Best Sunset Beaches", rating: "5.0", img: PHOTO_BANK.andaman_beach },
      { title: "Cellular Jail National Memorial", note: "Historic Freedom Struggle Jail & Light Sound Show", rating: "4.9", img: PHOTO_BANK.swiss_museum },
      { title: "Elephant Beach Coral Reef", note: "Sea Walking, Jet Skiing & Glass Bottom Boats", rating: "4.8", img: PHOTO_BANK.andaman_beach },
      { title: "Ross Island (Netaji Subhash)", note: "Peacocks amidst Colonial Ruins & Banyan Roots", rating: "4.7", img: PHOTO_BANK.andaman_beach },
      { title: "Neil Island Natural Bridge", note: "Living Rock Formation at Laxmanpur Beach", rating: "4.7", img: PHOTO_BANK.andaman_beach },
    ]
  },
  "rome": {
    heroImg: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=1600&q=85",
    baseRatePerDay: 13500,
    weather: { temp: "21°C", condition: "Sunny Mediterranean", verdict: "Crisp morning air and sunny piazzas perfect for walking ancient ruins.", icon: "fa-sun" },
    alert: { text: "Long security queues at Colosseum on Day 1. Tap to prioritize skip-the-line underground arena access.", day: 1, slot: "Morning" },
    recs: [
      { title: "Colosseum & Arena Floor", note: "Ancient Roman Amphitheatre of Gladiators", rating: "4.9", img: PHOTO_BANK.colosseum },
      { title: "Vatican Museums & Sistine Chapel", note: "Michelangelo's Iconic Ceiling Frescoes", rating: "4.9", img: PHOTO_BANK.colosseum },
      { title: "Trevi Fountain Coin Toss", note: "Baroque Masterpiece Fed by Ancient Aqueduct", rating: "4.8", img: PHOTO_BANK.colosseum },
      { title: "Pantheon Temple", note: "2,000-Year-Old Unreinforced Concrete Dome", rating: "4.8", img: PHOTO_BANK.colosseum },
      { title: "Trastevere Food Walk", note: "Authentic Cacio e Pepe & Artisanal Gelato", rating: "4.7", img: PHOTO_BANK.cafe_sprungli },
    ]
  },
  "london": {
    heroImg: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=1600&q=85",
    baseRatePerDay: 14500,
    weather: { temp: "15°C", condition: "Overcast & Crisp", verdict: "Typical London breeze. Ideal conditions for indoor museums and historic theatres.", icon: "fa-cloud" },
    alert: { text: "Brisk rain drizzle forecasted along South Bank on Day 2. Tap to move outdoor Thames walk to Tate Modern.", day: 2, slot: "Afternoon" },
    recs: [
      { title: "Big Ben & Westminster Abbey", note: "Iconic Elizabeth Tower & Royal Coronation Church", rating: "4.9", img: PHOTO_BANK.london_eye },
      { title: "The British Museum", note: "Rosetta Stone & Classical Antiquities Wing", rating: "4.8", img: PHOTO_BANK.swiss_museum },
      { title: "Tower of London & Crown Jewels", note: "Historic Norman Fortress along the Thames", rating: "4.8", img: PHOTO_BANK.london_eye },
      { title: "London Eye River Capsule", note: "360-Degree Panoramic View of the Capital", rating: "4.7", img: PHOTO_BANK.london_eye },
      { title: "Borough Market Food Trail", note: "Artisan British Cheeses, Pasties & Salt Beef", rating: "4.7", img: PHOTO_BANK.cafe_sprungli },
    ]
  },
  "singapore": {
    heroImg: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=1600&q=85",
    baseRatePerDay: 12500,
    weather: { temp: "29°C", condition: "Tropical Warmth", verdict: "Humid and sunny with lush floral breezes across waterfront gardens.", icon: "fa-sun" },
    alert: { text: "Late afternoon tropical downpour on Day 2. Tap to move Cloud Forest outdoor dome to Jewel Changi Canopy Park.", day: 2, slot: "Evening" },
    recs: [
      { title: "Marina Bay Sands SkyPark", note: "Observation Deck with 57th Floor Infinity View", rating: "4.9", img: PHOTO_BANK.singapore_skyline },
      { title: "Gardens by the Bay Supertrees", note: "Supertree Grove Light Show & Flower Dome", rating: "4.9", img: PHOTO_BANK.singapore_skyline },
      { title: "Sentosa Island Cable Car", note: "Cable Car to Siloso Beach & Universal Studios", rating: "4.8", img: PHOTO_BANK.singapore_skyline },
      { title: "Chinatown Maxwell Hawker Centre", note: "Tian Tian Hainanese Chicken Rice & Satay", rating: "4.7", img: PHOTO_BANK.cafe_sprungli },
      { title: "Singapore Night Safari", note: "World's First Open-Air Nocturnal Zoo Tram", rating: "4.8", img: PHOTO_BANK.singapore_skyline },
    ]
  },
  "bali": {
    heroImg: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1600&q=85",
    baseRatePerDay: 6500,
    weather: { temp: "28°C", condition: "Tropical Sunshine", verdict: "Golden sunshine and gentle sea breezes across emerald terraces and beaches.", icon: "fa-sun" },
    alert: { text: "High coastal waves at Uluwatu on Day 2. Tap to swap sea cliff walk with Sacred Ubud Monkey Forest sanctuary.", day: 2, slot: "Morning" },
    recs: [
      { title: "Tegallalang Rice Terrace", note: "Emerald Terraces & Iconic Giant Jungle Swing", rating: "4.8", img: PHOTO_BANK.bali_temple },
      { title: "Uluwatu Sunset & Kecak Dance", note: "70m Sea Cliff Amphitheatre Fire Dance", rating: "4.9", img: PHOTO_BANK.bali_temple },
      { title: "Sacred Monkey Forest Sanctuary", note: "Centuries-Old Banyan Temples in Ubud", rating: "4.7", img: PHOTO_BANK.bali_temple },
      { title: "Tanah Lot Ocean Temple", note: "Iconic Off-Shore Ancient Hindu Pilgrimage Rock", rating: "4.8", img: PHOTO_BANK.bali_temple },
      { title: "Nusa Penida Kelingking T-Rex", note: "Turquoise Cove & White Sand Beach Lookout", rating: "4.9", img: PHOTO_BANK.bali_temple },
    ]
  },
  "bangkok": {
    heroImg: "https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&w=1600&q=85",
    baseRatePerDay: 7000,
    weather: { temp: "32°C", condition: "Tropical Warm", verdict: "Lively street vibes and warm weather along the Chao Phraya river.", icon: "fa-sun" },
    alert: { text: "Heavy traffic gridlock on Sukhumvit on Day 1. Tap to switch to Chao Phraya express boat river transit.", day: 1, slot: "Evening" },
    recs: [
      { title: "The Grand Palace & Wat Phra Kaew", note: "Royal Complex of Sacred Emerald Buddha", rating: "4.9", img: PHOTO_BANK.bangkok_wat },
      { title: "Wat Arun (Temple of Dawn)", note: "Colorfully Glazed Porcelain River Spire", rating: "4.8", img: PHOTO_BANK.bangkok_wat },
      { title: "Chao Phraya Dinner Cruise", note: "Evening Buffet with Illuminated Temples", rating: "4.7", img: PHOTO_BANK.lake_zurich },
      { title: "Chatuchak Weekend Market", note: "15,000 Stalls of Thai Fashion & Street Food", rating: "4.7", img: PHOTO_BANK.cafe_sprungli },
      { title: "Damnoen Saduak Floating Market", note: "Wooden Longtail Boats Selling Fresh Mangoes", rating: "4.6", img: PHOTO_BANK.lake_view },
    ]
  },
  "new_york": {
    heroImg: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=1600&q=85",
    baseRatePerDay: 16000,
    weather: { temp: "17°C", condition: "Clear Autumn", verdict: "Crisp blue skies and energetic city pulse across Manhattan avenues.", icon: "fa-sun" },
    alert: { text: "Broadway theatre rush congestion on Day 2. Tap to advance pre-theatre dining in Hell's Kitchen.", day: 2, slot: "Evening" },
    recs: [
      { title: "Empire State Building 86th Floor", note: "360-Degree Open-Air Manhattan Observatory", rating: "4.8", img: PHOTO_BANK.new_york_sky },
      { title: "Statue of Liberty & Ellis Island", note: "Ferry to Iconic Symbol of American Freedom", rating: "4.8", img: PHOTO_BANK.new_york_sky },
      { title: "Central Park Stroll & Bow Bridge", note: "843 Acres of Rolling Green in Mid-Manhattan", rating: "4.9", img: PHOTO_BANK.lake_view },
      { title: "Metropolitan Museum of Art (Met)", note: "Temple of Dendur & European Masterpieces", rating: "4.9", img: PHOTO_BANK.swiss_museum },
      { title: "High Line & Hudson Yards", note: "Elevated Freight Rail Park & The Vessel", rating: "4.7", img: PHOTO_BANK.new_york_sky },
    ]
  },
  "barcelona": {
    heroImg: "https://images.unsplash.com/photo-1583422409516-2895a77efded?auto=format&fit=crop&w=1600&q=85",
    baseRatePerDay: 13000,
    weather: { temp: "22°C", condition: "Mediterranean Warmth", verdict: "Perfect sunny weather for Catalan tapas, beach promenades, and Gaudí architecture.", icon: "fa-sun" },
    alert: { text: "Peak afternoon ticket queues at Park Güell on Day 1. Tap to reschedule to evening Picasso Museum.", day: 1, slot: "Afternoon" },
    recs: [
      { title: "Sagrada Família Basilica", note: "Antoni Gaudí's Unfinished Masterpiece", rating: "4.9", img: PHOTO_BANK.barcelona_sagrada },
      { title: "Park Güell Mosaic Serpent Terrace", note: "Vibrant Mosaic Benches & City Lookout", rating: "4.8", img: PHOTO_BANK.barcelona_sagrada },
      { title: "Gothic Quarter (Barri Gòtic)", note: "Medieval Stone Alleys & Roman Walls", rating: "4.8", img: PHOTO_BANK.zurich_old_town },
      { title: "Casa Batlló & Casa Milà", note: "Dragon Roof & Surreal Gaudí Architecture", rating: "4.7", img: PHOTO_BANK.barcelona_sagrada },
      { title: "La Boqueria Market Tapas", note: "Fresh Jamón Ibérico, Seafood & Sangria", rating: "4.7", img: PHOTO_BANK.cafe_sprungli },
    ]
  },
  "maldives": {
    heroImg: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=1600&q=85",
    baseRatePerDay: 18000,
    weather: { temp: "29°C", condition: "Turquoise Paradise", verdict: "Calm lagoon waters, clear turquoise visibility, and gentle warm trade winds.", icon: "fa-sun" },
    alert: { text: "Afternoon wind chop on outer reef on Day 2. Tap to swap deep-sea snorkeling with private overwater spa session.", day: 2, slot: "Afternoon" },
    recs: [
      { title: "Overwater Villa Lagoon Retreat", note: "Direct Wooden Steps into Crystal Aquamarine Lagoon", rating: "5.0", img: PHOTO_BANK.maldives_resort },
      { title: "Coral Reef Snorkeling with Turtles", note: "Manta Rays, Sea Turtles & Vibrant Coral Gardens", rating: "4.9", img: PHOTO_BANK.maldives_resort },
      { title: "Sunset Dolphin Safari Cruise", note: "Playful Spinner Dolphins in the Golden Hour", rating: "4.8", img: PHOTO_BANK.maldives_resort },
      { title: "Private Sandbank Lunch", note: "Secluded White Sand Bank in the Indian Ocean", rating: "4.9", img: PHOTO_BANK.maldives_resort },
      { title: "Underwater Glass Restaurant", note: "Dining 5 Metres Below Sea Level with Sharks", rating: "4.8", img: PHOTO_BANK.maldives_resort },
    ]
  }
};

// =========================================================================
// Verified Day 1 Lodges & Stays Database (Instant 0ms Client Cache)
// =========================================================================
function generateClientBookingLinks(hotelName, destName, isIntl) {
  const cleanDest = (destName || "").split("(")[0].split(",")[0].trim();
  const q = encodeURIComponent(`${hotelName} ${cleanDest}`);
  const d = encodeURIComponent(cleanDest);
  const h = encodeURIComponent(hotelName);
  const mmt = `https://www.makemytrip.com/hotels/hotel-listing/?city=${d}&searchText=${h}`;
  const booking = `https://www.booking.com/searchresults.html?ss=${q}`;
  const google = `https://www.google.com/travel/hotels?q=${q}`;
  return {
    primary_url: isIntl ? booking : mmt,
    google_hotels_url: google,
    makemytrip_url: mmt,
    booking_url: booking
  };
}

const CLIENT_HOTELS_DB = {
  "switzerland": [
    {
      id: "swi-lodge-1",
      name: "Zurich Old Town Alpine Riverside Lodge",
      type: "Historic Swiss Lodge & Inn",
      near_landmark: "Niederdorf Old Town & Lake Zurich (Day 1 Hub)",
      distance: "200m from Zurich Central Station & Limmat",
      rating: 4.8,
      reviews: 1420,
      image: "https://images.unsplash.com/photo-1515488764276-beab7607c1e6?auto=format&fit=crop&w=600&q=80",
      amenities: ["Swiss Fondue Breakfast", "Free City Transit Pass", "High-Speed WiFi", "Luggage Storage"],
      base_price_inr: 7800,
      sharing_options: [
        { type: "4-Bed Swiss Bunk Dorm Bed", price_per_person_inr: 2100, total_inr: 8400, badge: "Swiss Budget Sharing", note: "Swiss pine wood bunk with privacy pod & power sockets" },
        { type: "2-Sharing Alpine Twin Room", price_per_person_inr: 3900, total_inr: 7800, badge: "Duo Sharing", note: "Twin beds with private en-suite shower & city view" },
        { type: "3-Sharing Family Triple Room", price_per_person_inr: 2800, total_inr: 8400, badge: "Triple Sharing", note: "1 Queen Bed + 1 Single Bed in historic 17th-century lodge" }
      ]
    },
    {
      id: "swi-lodge-2",
      name: "Interlaken Valley Backpacker Chalet Lodge",
      type: "Alpine Mountain Chalet",
      near_landmark: "Interlaken Ost Railway & Harder Kulm",
      distance: "350m from Interlaken Ost",
      rating: 4.9,
      reviews: 1850,
      image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80",
      amenities: ["Jungfrau Glacier View", "Guest Kitchen", "Outdoor Hot Tub", "Bicycle Rental"],
      base_price_inr: 6500,
      sharing_options: [
        { type: "6-Bed Chalet Dorm Bed", price_per_person_inr: 1650, total_inr: 9900, badge: "Backpacker Choice", note: "Heated wooden chalet dorm with breathtaking alpine panorama" },
        { type: "2-Sharing Private Chalet Room", price_per_person_inr: 3250, total_inr: 6500, badge: "Couple Chalet", note: "Private room with balcony facing snow-capped Eiger peak" }
      ]
    }
  ],

  "goa": [
    {
      id: "goa-lodge-1",
      name: "Baga Beach Backpacker Lodge & Hostel",
      type: "Beachfront Lodge",
      near_landmark: "Baga Beach (Day 1 Afternoon Hub)",
      distance: "250m from Baga Beach",
      rating: 4.8,
      reviews: 1240,
      image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=600&q=80",
      amenities: ["Free High-Speed WiFi", "AC", "Individual Lockers", "Swimming Pool", "Beach Access"],
      base_price_inr: 1600,
      sharing_options: [
        { type: "4-Bed Mixed Dorm Bed", price_per_person_inr: 450, total_inr: 1800, badge: "Best Value Group Sharing", note: "Bunk bed with personal reading lamp & locker" },
        { type: "2-Sharing (Twin Beds)", price_per_person_inr: 800, total_inr: 1600, badge: "Couple / Friends", note: "Two single beds with private bathroom" },
        { type: "Private Deluxe Room", price_per_person_inr: 1600, total_inr: 1600, badge: "Private Stay", note: "King bed with private sea-facing balcony" }
      ]
    },
    {
      id: "goa-lodge-2",
      name: "Fontainhas Heritage Portuguese Lodge",
      type: "Heritage Lodge & Inn",
      near_landmark: "Old Latin Quarter (Day 1 Morning Hub)",
      distance: "150m from Fontainhas Walk",
      rating: 4.7,
      reviews: 890,
      image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=600&q=80",
      amenities: ["Free Breakfast", "Heritage Architecture", "AC", "Cafe & Bar", "Bicycle Rental"],
      base_price_inr: 3200,
      sharing_options: [
        { type: "3-Sharing Triple Room", price_per_person_inr: 1150, total_inr: 3450, badge: "Friends Sharing", note: "1 Double Bed + 1 Single Bed with colonial teakwood decor" },
        { type: "2-Sharing Double Room", price_per_person_inr: 1600, total_inr: 3200, badge: "Couple Favorite", note: "Traditional Portuguese tiled suite with breakfast included" }
      ]
    }
  ],

  "hyderabad": [
    {
      id: "hyd-lodge-1",
      name: "Charminar Heritage Tourist Lodge",
      type: "Budget Tourist Lodge",
      near_landmark: "Charminar & Laad Bazaar (Day 1 Stay)",
      distance: "350m from Charminar",
      rating: 4.6,
      reviews: 1100,
      image: "https://images.unsplash.com/photo-1572455044327-7348c1be7267?auto=format&fit=crop&w=600&q=80",
      amenities: ["Free WiFi", "AC & Non-AC", "24/7 Room Service", "Hot Water", "Tour Desk"],
      base_price_inr: 1500,
      sharing_options: [
        { type: "4-Bed Family / Group Sharing", price_per_person_inr: 400, total_inr: 1600, badge: "Super Budget Sharing", note: "4 Single Cots with private bath & ceiling fans" },
        { type: "3-Sharing Triple Room", price_per_person_inr: 550, total_inr: 1650, badge: "Group Sharing", note: "1 King Bed + 1 Single Bed with AC" },
        { type: "2-Sharing Executive Double", price_per_person_inr: 750, total_inr: 1500, badge: "Couple / Duo", note: "Spacious double bedroom overlooking Old City bazaar" }
      ]
    },
    {
      id: "hyd-lodge-2",
      name: "Banjara Hills Transit Executive Lodge & Suites",
      type: "Modern Business Lodge",
      near_landmark: "Banjara Hills Road No. 1",
      distance: "1.2 km from City Center Metro",
      rating: 4.7,
      reviews: 840,
      image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80",
      amenities: ["Free Buffet Breakfast", "Work Desk", "Gym", "High-Speed WiFi", "Cab Pickup"],
      base_price_inr: 2400,
      sharing_options: [
        { type: "2-Sharing Twin Executive", price_per_person_inr: 1200, total_inr: 2400, badge: "Comfort Sharing", note: "Twin orthopedic beds + breakfast included" },
        { type: "3-Sharing Triple Studio", price_per_person_inr: 900, total_inr: 2700, badge: "Family / Friends", note: "Executive suite with pull-out sofa bed" }
      ]
    }
  ],

  "vizag": [
    {
      id: "viz-lodge-1",
      name: "RK Beachfront Backpacker & Heritage Lodge",
      type: "Coastal Tourist Lodge",
      near_landmark: "RK Beach & Submarine Museum (Day 1 Hub)",
      distance: "120m from Submarine Museum",
      rating: 4.8,
      reviews: 920,
      image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=600&q=80",
      amenities: ["Direct Ocean View", "AC", "Free WiFi", "Fresh Seafood Thali", "Beach Rental"],
      base_price_inr: 1400,
      sharing_options: [
        { type: "4-Bed Beach Bunk Dorm Bed", price_per_person_inr: 350, total_inr: 1400, badge: "Budget Beach Sharing", note: "Individual sea-breeze bunk with privacy curtain & locker" },
        { type: "2-Sharing Sea View Double", price_per_person_inr: 700, total_inr: 1400, badge: "Couple Sea View", note: "Double bed with balcony facing Bay of Bengal" },
        { type: "3-Sharing Family Triple", price_per_person_inr: 550, total_inr: 1650, badge: "Group Sharing", note: "1 King Bed + 1 Single Cot with attached modern shower" }
      ]
    },
    {
      id: "viz-lodge-2",
      name: "Araku Valley Pine Mist Eco Lodge",
      type: "Hill Station Eco Lodge",
      near_landmark: "Araku Tribal Museum & Coffee Gardens",
      distance: "350m from Tribal Museum",
      rating: 4.9,
      reviews: 740,
      image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80",
      amenities: ["Organic Coffee Terrace", "Bonfire", "Mountain Stream Trek", "Hot Water"],
      base_price_inr: 2200,
      sharing_options: [
        { type: "4-Sharing Wooden Family Cottage", price_per_person_inr: 550, total_inr: 2200, badge: "Group Cottage", note: "Spacious pine wood cottage for up to 4 members" },
        { type: "2-Sharing Valley View Room", price_per_person_inr: 1100, total_inr: 2200, badge: "Scenic Balcony", note: "Private balcony overlooking Araku coffee plantations" }
      ]
    }
  ],

  "delhi_agra": [
    {
      id: "del-lodge-1",
      name: "Taj Sunrise View Heritage Lodge & Homestay",
      type: "Heritage View Lodge",
      near_landmark: "Taj Mahal East Gate (Day 1 Hub)",
      distance: "250m from Taj Mahal Entry Gate",
      rating: 4.8,
      reviews: 1650,
      image: "https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=600&q=80",
      amenities: ["Rooftop Taj Mahal Panorama", "Free WiFi", "AC", "Traditional Mughlai Breakfast", "Luggage Storage"],
      base_price_inr: 1600,
      sharing_options: [
        { type: "4-Bed Taj View Dorm Bed", price_per_person_inr: 400, total_inr: 1600, badge: "Best Value Sharing", note: "Air-conditioned dorm bed with personal reading lamp & locker" },
        { type: "2-Sharing Heritage Deluxe", price_per_person_inr: 800, total_inr: 1600, badge: "Couple Choice", note: "Teakwood double bed with rooftop Taj Mahal sunrise access" },
        { type: "3-Sharing Mughal Triple Suite", price_per_person_inr: 600, total_inr: 1800, badge: "Family / Friends", note: "1 Double Bed + 1 Single Diwan with carved arches" }
      ]
    }
  ],

  "kerala": [
    {
      id: "ker-lodge-1",
      name: "Fort Kochi Backpacker & Heritage Lodge",
      type: "Colonial Lodge & Hostel",
      near_landmark: "Chinese Fishing Nets (Day 1 Hub)",
      distance: "200m from Fort Kochi Beach",
      rating: 4.8,
      reviews: 980,
      image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=600&q=80",
      amenities: ["Free WiFi", "Garden Cafe", "Hammocks", "Ayurvedic Spa Desk", "AC"],
      base_price_inr: 1800,
      sharing_options: [
        { type: "4-Bed Air-Conditioned Dorm Bed", price_per_person_inr: 480, total_inr: 1920, badge: "Backpacker Value", note: "Wooden bunk bed with privacy curtain & locker" },
        { type: "2-Sharing Dutch Colonial Twin", price_per_person_inr: 900, total_inr: 1800, badge: "Twin Sharing", note: "Antique wooden beds with garden view" }
      ]
    },
    {
      id: "ker-lodge-2",
      name: "Punnamada Lake Shared Kettuvallam Houseboat",
      type: "Houseboat Lodge",
      near_landmark: "Alleppey Backwaters Jetty",
      distance: "Boarding at Finishing Point Jetty",
      rating: 4.9,
      reviews: 1450,
      image: "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=600&q=80",
      amenities: ["All Meals (Karimeen Fish Thali)", "Private Chef", "Upper Deck View", "AC Bedrooms"],
      base_price_inr: 6000,
      sharing_options: [
        { type: "4-Person Shared Houseboat Suite", price_per_person_inr: 1500, total_inr: 6000, badge: "Iconic Group Stay", note: "2 AC Bedrooms + Common Upper Deck + Full 3 Meals" },
        { type: "2-Sharing Private Bedroom", price_per_person_inr: 3000, total_inr: 6000, badge: "Romantic Cruise", note: "Private bedroom in shared luxury 3-bedroom houseboat" }
      ]
    }
  ],

  "kashmir": [
    {
      id: "kas-lodge-1",
      name: "Dal Lake Royal Heritage Shikara Houseboat Lodge",
      type: "Heritage Houseboat Lodge",
      near_landmark: "Dal Lake Ghat No. 2 (Day 1 Hub)",
      distance: "Direct Waterfront on Dal Lake",
      rating: 4.9,
      reviews: 1600,
      image: "https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=600&q=80",
      amenities: ["Free Shikara Transfers", "Heated Bedrooms (Bukhari)", "Kahwa Tea on Arrival", "Walnut Wood Decor"],
      base_price_inr: 3800,
      sharing_options: [
        { type: "4-Sharing Family Cedar Suite", price_per_person_inr: 950, total_inr: 3800, badge: "Popular Sharing", note: "Two interconnected carved walnut wood bedrooms with lake view" },
        { type: "2-Sharing Deluxe Double", price_per_person_inr: 1900, total_inr: 3800, badge: "Couple Favorite", note: "Front balcony room with unobstructed Zabarwan Mountain views" }
      ]
    }
  ],

  "manali": [
    {
      id: "man-lodge-1",
      name: "Old Manali Bohemian Pine Lodge & Hostel",
      type: "Mountain Lodge & Hostel",
      near_landmark: "Hadimba Temple & Old Manali Village",
      distance: "300m from Hadimba Temple",
      rating: 4.8,
      reviews: 1320,
      image: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=600&q=80",
      amenities: ["Bonfire Nights", "Acoustic Cafe", "Apple Orchard View", "Heated Water", "High-Speed WiFi"],
      base_price_inr: 1400,
      sharing_options: [
        { type: "6-Bed Mixed Bunk Dorm Bed", price_per_person_inr: 380, total_inr: 2280, badge: "Cheapest Sharing", note: "Solid cedarwood bunk with individual charging & lockers" },
        { type: "4-Bed Pine Wood Dorm Bed", price_per_person_inr: 480, total_inr: 1920, badge: "Cozy Sharing", note: "4-bed dorm with private attached heated bathroom" },
        { type: "2-Sharing Wooden Attic Room", price_per_person_inr: 700, total_inr: 1400, badge: "Twin Sharing", note: "Cozy wooden cottage room with snow mountain balcony" }
      ]
    }
  ],

  "jaipur": [
    {
      id: "jai-lodge-1",
      name: "Pink City Royal Haveli Lodge",
      type: "Heritage Haveli Lodge",
      near_landmark: "Hawa Mahal (Day 1 Hub)",
      distance: "400m from Hawa Mahal & City Palace",
      rating: 4.8,
      reviews: 1150,
      image: "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=600&q=80",
      amenities: ["Rooftop Restaurant", "Folk Music Evenings", "AC", "Rajasthani Courtyard"],
      base_price_inr: 1800,
      sharing_options: [
        { type: "4-Bed Haveli Dorm Bed", price_per_person_inr: 450, total_inr: 1800, badge: "Budget Heritage Sharing", note: "Air-conditioned heritage room with brass cots" },
        { type: "2-Sharing Maharaja Deluxe", price_per_person_inr: 900, total_inr: 1800, badge: "Couple Stay", note: "Carved arches, colorful frescoes, and modern attached bath" }
      ]
    }
  ],

  "varanasi": [
    {
      id: "var-lodge-1",
      name: "Ganga View Kashi Heritage Lodge & Dharamshala",
      type: "Ghatside Pilgrimage Lodge",
      near_landmark: "Dashashwamedh Ghat (Day 1 Evening Hub)",
      distance: "150m from Ganga Aarti Steps",
      rating: 4.7,
      reviews: 1820,
      image: "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=600&q=80",
      amenities: ["Direct River Ganga View", "Rooftop Yoga", "Pure Veg Dining", "Morning Boat Desk", "AC"],
      base_price_inr: 1200,
      sharing_options: [
        { type: "4-Bed Pilgrimage Dorm Sharing", price_per_person_inr: 320, total_inr: 1280, badge: "Pilgrim Budget Sharing", note: "Clean shared room with locker & attached bath" },
        { type: "2-Sharing River View Double", price_per_person_inr: 600, total_inr: 1200, badge: "Ganga View", note: "Direct window view of sacred Ganga river & sunrise" }
      ]
    }
  ],

  "ladakh": [
    {
      id: "lad-lodge-1",
      name: "Leh Old Town Himalayan Stargazing Lodge",
      type: "Traditional Ladakhi Lodge",
      near_landmark: "Leh Palace & Main Bazaar (Day 1 Hub)",
      distance: "250m from Old Bazaar",
      rating: 4.9,
      reviews: 1120,
      image: "https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=600&q=80",
      amenities: ["Bukhari Room Heating", "Oxygen Cylinder Assistance", "Tibetan Butter Tea", "Stargazing Terrace"],
      base_price_inr: 2400,
      sharing_options: [
        { type: "4-Bed Heated Wood Dorm Bed", price_per_person_inr: 600, total_inr: 2400, badge: "Himalayan Backpacker", note: "Warm pine wood bunk with heavy wool blankets & hot showers" },
        { type: "2-Sharing Snow Mountain Room", price_per_person_inr: 1200, total_inr: 2400, badge: "Couple Deluxe", note: "Double bedroom facing snow-capped Stok Kangri range" }
      ]
    }
  ],

  "ooty": [
    {
      id: "oot-lodge-1",
      name: "Nilgiri Blue Mountain Heritage Tea Lodge",
      type: "Colonial Tea Estate Lodge",
      near_landmark: "Ooty Lake & Botanical Garden (Day 1 Hub)",
      distance: "300m from Lake Boathouse",
      rating: 4.8,
      reviews: 890,
      image: "https://images.unsplash.com/photo-1589308078059-be1415eab4c3?auto=format&fit=crop&w=600&q=80",
      amenities: ["Fireplace Lounge", "Fresh Nilgiri Tea", "Eucalyptus Garden", "Heated Water", "Free Parking"],
      base_price_inr: 1800,
      sharing_options: [
        { type: "4-Bed Pine Wood Sharing Suite", price_per_person_inr: 450, total_inr: 1800, badge: "Budget Group Sharing", note: "4 single wooden cots with cozy hill quilts" },
        { type: "2-Sharing Colonial Fireplace Room", price_per_person_inr: 900, total_inr: 1800, badge: "Couple Warmth", note: "Colonial bedroom with working fireplace & garden patio" }
      ]
    }
  ],

  "paris": [
    {
      id: "par-lodge-1",
      name: "Montmartre Bohemian Artists Lodge & Hostel",
      type: "Boutique Parisian Lodge",
      near_landmark: "Sacré-Cœur & Boulevard de Clichy",
      distance: "300m from Anvers Metro Station",
      rating: 4.7,
      reviews: 1100,
      image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=600&q=80",
      amenities: ["Croissant & Coffee Breakfast", "Rooftop Paris View", "Free WiFi", "Elevator"],
      base_price_inr: 8200,
      sharing_options: [
        { type: "4-Bed Shared Parisian Studio", price_per_person_inr: 2200, total_inr: 8800, badge: "Group Sharing", note: "Bunk beds in a classic Haussmannian room with high ceilings" },
        { type: "2-Sharing Double Room", price_per_person_inr: 4100, total_inr: 8200, badge: "Romantic Duo", note: "Double bed with view of Eiffel Tower in the distance" }
      ]
    }
  ],

  "dubai": [
    {
      id: "dub-lodge-1",
      name: "Deira Heritage Creek Tourist Lodge",
      type: "Heritage Waterfront Lodge",
      near_landmark: "Dubai Creek & Gold Souk (Day 1 Hub)",
      distance: "150m from Abra Water Taxi Station",
      rating: 4.7,
      reviews: 1390,
      image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=600&q=80",
      amenities: ["Arabic Coffee Welcome", "Creek Ferry Access", "AC", "Free WiFi", "Buffet Breakfast"],
      base_price_inr: 4200,
      sharing_options: [
        { type: "4-Sharing Family Creek Suite", price_per_person_inr: 1150, total_inr: 4600, badge: "Family Sharing", note: "Two interconnected bedrooms overlooking sailing dhow boats" },
        { type: "2-Sharing Executive Double", price_per_person_inr: 2100, total_inr: 4200, badge: "Couple Stay", note: "King bed with private bath and creek view balcony" }
      ]
    }
  ],

  "tokyo": [
    {
      id: "tok-lodge-1",
      name: "Asakusa Traditional Ryokan & Capsule Lodge",
      type: "Traditional Japanese Ryokan & Capsule Lodge",
      near_landmark: "Sensō-ji Temple (Day 1 Hub)",
      distance: "200m from Kaminarimon Gate",
      rating: 4.8,
      reviews: 2100,
      image: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=600&q=80",
      amenities: ["Traditional Onsen Bath", "Free High-Speed WiFi", "Yukata Robes", "Matcha Welcome Drink"],
      base_price_inr: 5500,
      sharing_options: [
        { type: "Individual Futuristic Capsule Pod", price_per_person_inr: 1900, total_inr: 1900, badge: "Futuristic Pod", note: "Soundproof cyber pod with ambient sleep lighting & USB console" },
        { type: "2-Sharing Traditional Tatami Room", price_per_person_inr: 2750, total_inr: 5500, badge: "Authentic Ryokan", note: "Woven rush tatami mats with authentic Japanese futon bedding" }
      ]
    }
  ],

  "rome": [
    {
      id: "rom-lodge-1",
      name: "Colosseo Imperial Historic Lodge",
      type: "Historic Roman Townhouse Lodge",
      near_landmark: "Colosseum & Roman Forum (Day 1 Hub)",
      distance: "250m from Colosseo Metro Station",
      rating: 4.8,
      reviews: 1640,
      image: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=600&q=80",
      amenities: ["Italian Espresso & Pastry Breakfast", "Terrace with Ancient Ruins View", "AC", "WiFi"],
      base_price_inr: 7200,
      sharing_options: [
        { type: "4-Bed Imperial Shared Suite", price_per_person_inr: 1800, total_inr: 7200, badge: "Group Sharing", note: "Renaissance vaulted ceiling suite for up to 4 members" },
        { type: "2-Sharing Roman Classic Double", price_per_person_inr: 3600, total_inr: 7200, badge: "Romantic Duo", note: "Double bedroom overlooking historic cobblestone via" }
      ]
    }
  ],

  "london": [
    {
      id: "lon-lodge-1",
      name: "South Bank & Westminster Travelers Lodge",
      type: "Riverside Historic Lodge & Inn",
      near_landmark: "Big Ben & London Eye (Day 1 Hub)",
      distance: "300m from Waterloo & Westminster Bridge",
      rating: 4.7,
      reviews: 1890,
      image: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=600&q=80",
      amenities: ["Full English Breakfast Option", "Thames Riverside Walk Access", "Free WiFi", "Secure Pods"],
      base_price_inr: 8500,
      sharing_options: [
        { type: "4-Bed Shared London Bunk Pod", price_per_person_inr: 2125, total_inr: 8500, badge: "Central Sharing", note: "Curtained bunk pod with individual reading light & power hub" },
        { type: "2-Sharing Westminster Twin", price_per_person_inr: 4250, total_inr: 8500, badge: "Twin Classic", note: "Twin beds with en-suite modern shower and city view" }
      ]
    }
  ],

  "singapore": [
    {
      id: "sin-lodge-1",
      name: "Marina Bay & Chinatown Smart Capsule Lodge",
      type: "Smart Pod & Boutique Lodge",
      near_landmark: "Chinatown Heritage Quarter (Day 1 Hub)",
      distance: "120m from Chinatown MRT Station",
      rating: 4.8,
      reviews: 1720,
      image: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=600&q=80",
      amenities: ["Air Purification AC", "Free High-Speed WiFi", "Smart Card Lockers", "Rain Showers"],
      base_price_inr: 4200,
      sharing_options: [
        { type: "Single Smart Capsule Pod", price_per_person_inr: 1400, total_inr: 1400, badge: "Smart Pod", note: "Futuristic pod bed with orthopaedic mattress and privacy door" },
        { type: "2-Sharing Queen Pod Suite", price_per_person_inr: 2100, total_inr: 4200, badge: "Couple Pod", note: "Spacious double pod for couples with personal multimedia screen" }
      ]
    }
  ],

  "bali": [
    {
      id: "bal-lodge-1",
      name: "Ubud Rainforest Tropical Bamboo Eco Lodge",
      type: "Balinese Eco Lodge & Hostel",
      near_landmark: "Ubud Monkey Forest & Sacred Trail (Day 1)",
      distance: "300m from Ubud Center",
      rating: 4.9,
      reviews: 1410,
      image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=600&q=80",
      amenities: ["Infinity Jungle Pool", "Complimentary Tropical Fruit Breakfast", "Yoga Shala", "AC"],
      base_price_inr: 1600,
      sharing_options: [
        { type: "4-Bed Bamboo Jungle Dorm Bed", price_per_person_inr: 400, total_inr: 1600, badge: "Eco Jungle Sharing", note: "Open-air bamboo architecture with mosquito net & pool access" },
        { type: "2-Sharing Private Ricefield Villa", price_per_person_inr: 800, total_inr: 1600, badge: "Romantic Eco Villa", note: "Carved teakwood double bed with private outdoor rain shower" }
      ]
    }
  ],

  "maldives": [
    {
      id: "mal-lodge-1",
      name: "Maafushi Island Turquoise Lagoon Beach Lodge",
      type: "Island Beachfront Lodge",
      near_landmark: "Maafushi Coral Lagoon (Day 1 Hub)",
      distance: "50m from Bikini Beach & Snorkel Point",
      rating: 4.9,
      reviews: 1530,
      image: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=600&q=80",
      amenities: ["Free Snorkeling Gear", "Direct White Sand Beach Access", "Tropical Breakfast", "AC", "WiFi"],
      base_price_inr: 5200,
      sharing_options: [
        { type: "4-Sharing Beachfront Lagoon Villa", price_per_person_inr: 1300, total_inr: 5200, badge: "Group Lagoon Villa", note: "2 interconnected bedrooms stepping right onto powdery white sand" },
        { type: "2-Sharing Turquoise Ocean View Deluxe", price_per_person_inr: 2600, total_inr: 5200, badge: "Couple Ocean View", note: "King bed with private balcony facing aquamarine lagoon waters" }
      ]
    }
  ]
};

// =========================================================================
// Initialization
// =========================================================================
document.addEventListener("DOMContentLoaded", () => {
  initLeafletMap();
  setupEventListeners();
  loadInitialTrip();
});

function initLeafletMap() {
  const mapContainer = document.getElementById("interactive-map");
  if (!mapContainer) return;

  state.leafletMap = L.map("interactive-map", {
    zoomControl: true,
    scrollWheelZoom: false,
  }).setView([47.3769, 8.5417], 7);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 18,
    attribution: '© OpenStreetMap'
  }).addTo(state.leafletMap);
}

function toggleMapLayer() {
  const layerType = document.getElementById("map-tile-select").value;
  if (!state.leafletMap) return;

  state.leafletMap.eachLayer((layer) => {
    if (layer instanceof L.TileLayer) {
      state.leafletMap.removeLayer(layer);
    }
  });

  if (layerType === "satellite") {
    L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}", {
      attribution: 'Esri World Imagery'
    }).addTo(state.leafletMap);
  } else {
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '© OpenStreetMap'
    }).addTo(state.leafletMap);
  }
}

function zoomToFullMap() {
  if (state.leafletMap && state.mapMarkers.length > 0) {
    const group = new L.featureGroup(state.mapMarkers);
    state.leafletMap.fitBounds(group.getBounds().pad(0.2));
  }
}

// =========================================================================
// Event Listeners (Triggers Instant Recalculation on ANY Selection)
// =========================================================================
function setupEventListeners() {
  // 1. Origin Change
  document.getElementById("origin-select").addEventListener("change", (e) => {
    state.currentOrigin = e.target.value;
    updateDistanceAndRoute();
  });

  // 2. Destination Change -> AUTOMATIC PLAN REGENERATION
  document.getElementById("destination-select").addEventListener("change", (e) => {
    state.currentDestination = e.target.value;
    onTripParametersChanged();
  });

  // 3. Duration Change -> AUTOMATIC PLAN REGENERATION
  document.getElementById("duration-select").addEventListener("change", (e) => {
    state.durationDays = parseInt(e.target.value);
    onTripParametersChanged();
  });

  // 4. Travelers Count Change -> AUTOMATIC PLAN REGENERATION
  document.getElementById("travelers-count-select").addEventListener("change", (e) => {
    state.travelersCount = parseInt(e.target.value);
    onTripParametersChanged();
  });
}

function getDestinationKey(destName) {
  const d = destName.toLowerCase();
  if (d.includes("goa")) return "goa";
  if (d.includes("hyderabad")) return "hyderabad";
  if (d.includes("kerala") || d.includes("munnar") || d.includes("alappuzha") || d.includes("kochi")) return "kerala";
  if (d.includes("kashmir") || d.includes("srinagar") || d.includes("gulmarg")) return "kashmir";
  if (d.includes("paris")) return "paris";
  if (d.includes("tokyo") || d.includes("kyoto") || d.includes("japan")) return "tokyo";
  if (d.includes("dubai")) return "dubai";
  if (d.includes("vizag") || d.includes("visakhapatnam")) return "vizag";
  if (d.includes("delhi") || d.includes("agra") || d.includes("taj mahal")) return "delhi_agra";
  if (d.includes("jaipur") || d.includes("udaipur") || d.includes("rajasthan")) return "jaipur";
  if (d.includes("manali") || d.includes("shimla")) return "manali";
  if (d.includes("ladakh") || d.includes("leh")) return "ladakh";
  if (d.includes("varanasi") || d.includes("kashi")) return "varanasi";
  if (d.includes("mumbai")) return "mumbai";
  if (d.includes("bengaluru") || d.includes("bangalore") || d.includes("mysore")) return "bengaluru";
  if (d.includes("chennai") || d.includes("mahabalipuram")) return "chennai";
  if (d.includes("amritsar")) return "amritsar";
  if (d.includes("rishikesh") || d.includes("haridwar")) return "rishikesh";
  if (d.includes("ooty") || d.includes("nilgiri")) return "ooty";
  if (d.includes("tirupati")) return "tirupati";
  if (d.includes("pondicherry") || d.includes("puducherry") || d.includes("auroville")) return "pondicherry";
  if (d.includes("wayanad")) return "wayanad";
  if (d.includes("andaman") || d.includes("havelock")) return "andaman";
  if (d.includes("rome") || d.includes("vatican") || d.includes("italy")) return "rome";
  if (d.includes("london") || d.includes("uk")) return "london";
  if (d.includes("singapore")) return "singapore";
  if (d.includes("bali") || d.includes("indonesia")) return "bali";
  if (d.includes("bangkok") || d.includes("phuket") || d.includes("thailand")) return "bangkok";
  if (d.includes("new york") || d.includes("usa")) return "new_york";
  if (d.includes("barcelona") || d.includes("spain")) return "barcelona";
  if (d.includes("maldives")) return "maldives";
  return "switzerland";
}

// =========================================================================
// Dynamic Recalculation on Any Parameter Change
// =========================================================================
async function onTripParametersChanged() {
  const dest = state.currentDestination;
  const duration = state.durationDays;
  const count = state.travelersCount;
  const key = getDestinationKey(dest);
  const cfg = DESTINATION_CONFIG[key] || DESTINATION_CONFIG["switzerland"];

  // 1. Update Hero Banner Image
  const bannerImg = document.getElementById("hero-banner-img");
  if (bannerImg && cfg.heroImg) {
    bannerImg.src = cfg.heroImg;
  }

  // 2. Calculate realistic budget in ₹ INR
  // Base daily rate * duration * members count (with multi-passenger lodging discount)
  const groupDiscount = count > 1 ? (1 + (count - 1) * 0.75) : 1;
  const total = Math.round(cfg.baseRatePerDay * duration * groupDiscount);
  const used = Math.round(total * 0.73);
  
  state.totalBudget = total;
  state.usedBudget = used;
  updateBudgetCard();

  // 3. Update Header
  const cleanCity = dest.split("(")[0].split(",")[0].trim();
  document.getElementById("trip-title").innerText = `Your Trip to ${cleanCity}`;
  const label = count === 1 ? "1 Adult" : `${count} Adults`;
  document.getElementById("trip-subtitle").innerHTML = `<span>${duration} Days</span> · <span>${label}</span> · <span class="text-brand-600 font-semibold">${state.travelerType.replace('_', ' ').toUpperCase()}</span>`;

  // 4. Update Weather Widget
  document.getElementById("weather-location").innerText = `${cleanCity}`;
  document.getElementById("weather-temp").innerText = cfg.weather.temp;
  document.getElementById("weather-condition").innerText = cfg.weather.condition;
  document.getElementById("weather-verdict").innerText = cfg.weather.verdict;

  // 5. Update Weather Alert Disruption Banner
  document.getElementById("alert-text").innerHTML = cfg.alert.text;
  const alertBanner = document.getElementById("disruption-banner");
  alertBanner.classList.remove("bg-emerald-50", "border-emerald-200");
  alertBanner.classList.add("bg-gradient-to-r", "from-rose-50", "to-amber-50", "border-rose-200/80");

  // 6. Update Recommendations Carousel
  renderRecommendationsForDest(cfg.recs);

  // 7. Fetch & Render Day 1 Lodges & Hotels with Room Sharing (IMMEDIATE)
  fetchAndRenderDay1Hotels();

  // 8. Update Distance & Leaflet Map
  updateDistanceAndRoute();

  // 9. Regenerate Itinerary via AI Agents Backend
  fetchAndRenderItinerary();
}

function selectTravelerType(typeKey) {
  state.travelerType = typeKey;
  document.querySelectorAll(".traveler-card").forEach(c => {
    c.classList.remove("active", "border-2", "border-brand-500", "shadow-md");
    c.classList.add("border-slate-200/80");
  });

  const target = document.getElementById(`card-${typeKey}`);
  if (target) {
    target.classList.add("active", "border-2", "border-brand-500", "shadow-md");
  }

  // Adjust travelers count automatically based on persona
  const selectElem = document.getElementById("travelers-count-select");
  if (typeKey === "solo") selectElem.value = "1";
  else if (typeKey === "couple") selectElem.value = "2";
  else if (typeKey === "family") selectElem.value = "4";
  else if (typeKey === "friends") selectElem.value = "4";
  else if (typeKey === "college_group") selectElem.value = "6";
  else if (typeKey === "seniors") selectElem.value = "2";

  state.travelersCount = parseInt(selectElem.value);
  onTripParametersChanged();
}

function updateBudgetCard() {
  const total = state.totalBudget || 120000;
  const used = state.usedBudget || 85000;
  const remaining = Math.max(0, total - used);
  const percentage = Math.min(100, Math.round((used / total) * 100));

  document.getElementById("total-budget-display").innerText = `₹${total.toLocaleString()}`;
  document.getElementById("budget-used-text").innerText = `₹${used.toLocaleString()} used`;
  document.getElementById("budget-remaining-text").innerText = `₹${remaining.toLocaleString()} remaining`;
  document.getElementById("budget-progress-bar").style.width = `${percentage}%`;
}

// =========================================================================
// Recommendations Renderer
// =========================================================================
function renderRecommendationsForDest(recsList) {
  const container = document.getElementById("recommendations-container");
  if (!container || !recsList) return;

  container.innerHTML = "";
  recsList.forEach(r => {
    container.innerHTML += `
      <div class="rounded-2xl overflow-hidden border border-slate-100 hover:border-slate-200 transition shadow-sm bg-white group cursor-pointer hover:shadow-md">
        <img src="${r.img}" alt="${r.title}" class="w-full h-24 object-cover group-hover:scale-105 transition duration-300">
        <div class="p-2.5">
          <h5 class="font-bold text-xs text-slate-800 truncate">${r.title}</h5>
          <p class="text-[10px] text-slate-400 mt-0.5 line-clamp-1">${r.note}</p>
          <div class="flex items-center gap-1 mt-1 text-[11px] font-bold text-amber-500">
            <i class="fa-solid fa-star text-[9px]"></i> <span>${r.rating}</span>
          </div>
        </div>
      </div>
    `;
  });
}

function viewMoreRecommendations() {
  alert("Smart Recommendations are dynamically ranked by crowd heatmaps and current weather!");
}

// =========================================================================
// Distance & Leaflet Map Calculation
// =========================================================================
async function updateDistanceAndRoute() {
  const origin = state.currentOrigin;
  const destination = state.currentDestination;

  try {
    const res = await fetch("/api/distance/calculate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ origin, destination })
    });
    const data = await res.json();

    document.getElementById("badge-distance").innerText = `${data.distance_km.toLocaleString()} km`;
    document.getElementById("badge-flight").innerText = data.flight_time;
    document.getElementById("route-distance-summary").innerText = `${origin.split(",")[0]} ➔ ${destination.split(",")[0]} (${data.distance_km.toLocaleString()} km)`;

    if (!state.leafletMap) return;

    state.mapMarkers.forEach(m => state.leafletMap.removeLayer(m));
    state.mapMarkers = [];
    if (state.routePolyline) state.leafletMap.removeLayer(state.routePolyline);

    // Origin Pin
    const originMarker = L.circleMarker(data.origin_coords, {
      radius: 8,
      fillColor: "#3B82F6",
      color: "#FFFFFF",
      weight: 2,
      opacity: 1,
      fillOpacity: 0.95
    }).addTo(state.leafletMap).bindPopup(`<b>From:</b> ${data.origin}`);
    state.mapMarkers.push(originMarker);

    // Destination Pin
    const destMarker = L.circleMarker(data.dest_coords, {
      radius: 10,
      fillColor: "#EF4444",
      color: "#FFFFFF",
      weight: 3,
      opacity: 1,
      fillOpacity: 0.95
    }).addTo(state.leafletMap).bindPopup(`<b>Destination:</b> ${data.destination}<br><b>Distance:</b> ${data.distance_km} km`);
    state.mapMarkers.push(destMarker);

    // Connecting Route Line
    state.routePolyline = L.polyline([data.origin_coords, data.dest_coords], {
      color: '#2563EB',
      weight: 3,
      dashArray: '6, 8',
      opacity: 0.85
    }).addTo(state.leafletMap);

    const group = new L.featureGroup(state.mapMarkers);
    state.leafletMap.fitBounds(group.getBounds().pad(0.3));

  } catch (err) {
    console.warn("Failed calculating distance:", err);
  }
}

// =========================================================================
// Live AI Itinerary Generation from Backend
// =========================================================================
async function fetchAndRenderItinerary() {
  const dest = state.currentDestination;
  const duration = state.durationDays;
  const count = state.travelersCount;
  const budget = state.totalBudget;

  const timelineContainer = document.getElementById("timeline-container");
  if (timelineContainer) {
    timelineContainer.innerHTML = `
      <div class="py-12 text-center text-slate-400">
        <i class="fa-solid fa-spinner fa-spin text-2xl text-brand-600 mb-2"></i>
        <p class="text-xs font-semibold">AI Agents synthesizing authentic ${duration}-day schedule for ${dest.split(',')[0]}...</p>
      </div>
    `;
  }

  const profile = {
    destination: dest,
    duration_days: duration,
    budget: budget,
    group_size: count,
    traveler_type: state.travelerType,
    interests: ["culture", "sightseeing", "local food", "nature"],
    accessibility_requirements: state.travelerType === "seniors" ? ["senior_friendly", "wheelchair_accessible"] : [],
    pace_preference: state.travelerType === "seniors" ? "relaxed" : "moderate"
  };

  try {
    const res = await fetch("/api/itinerary/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(profile)
    });
    const data = await res.json();

    if (data.success && data.itinerary) {
      state.currentItinerary = data.itinerary;
      state.activeDayIndex = 0;
      renderDaysTabs();
      renderTimeline(0);
      appendAssistantMessage(`✨ Generated personalized ${duration}-day itinerary for ${dest.split(',')[0]}! Total estimated cost: ₹${data.itinerary.total_estimated_cost.toLocaleString()}.`);
    }
  } catch (err) {
    console.warn("API itinerary fetch failed, using built-in verified itinerary:", err);
  }
}

function renderDaysTabs() {
  const container = document.getElementById("days-tabs-bar");
  if (!container || !state.currentItinerary) return;

  container.innerHTML = "";
  state.currentItinerary.days.forEach((day, idx) => {
    const cityName = day.city || day.focus_theme.split("&")[0].split("of")?.[1]?.trim() || `Day ${day.day_number}`;
    const btn = document.createElement("button");
    btn.className = `day-tab px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition ${idx === state.activeDayIndex ? 'active' : 'text-slate-600 hover:bg-slate-100'}`;
    btn.innerHTML = `<span>Day ${day.day_number}</span><br><span class="text-[10px] font-medium opacity-80 truncate max-w-[100px] block">${cityName}</span>`;
    btn.onclick = () => {
      state.activeDayIndex = idx;
      renderDaysTabs();
      renderTimeline(idx);
    };
    container.appendChild(btn);
  });
}

function renderTimeline(dayIndex) {
  const container = document.getElementById("timeline-container");
  if (!container || !state.currentItinerary) return;

  const targetDay = state.currentItinerary.days[dayIndex];
  if (!targetDay) return;

  container.innerHTML = "";

  targetDay.activities.forEach((act) => {
    const item = document.createElement("div");
    item.className = "relative flex items-start gap-4 pb-4 group";

    const dot = document.createElement("div");
    dot.className = "timeline-dot";
    item.appendChild(dot);

    const photoUrl = act.photo || getPhotoForActivity(act.title);

    item.innerHTML += `
      <div class="w-16 text-right shrink-0">
        <span class="text-xs font-bold text-slate-700 block">${act.time_slot}</span>
      </div>
      <div class="flex-1 bg-white hover:bg-slate-50/80 p-3.5 rounded-2xl border border-slate-100 hover:border-slate-200 transition shadow-sm flex items-center gap-4">
        <img src="${photoUrl}" alt="${act.title}" class="w-16 h-16 rounded-xl object-cover shrink-0 shadow-sm">
        <div class="flex-1 min-w-0">
          <div class="flex items-center justify-between">
            <h4 class="font-bold text-slate-900 text-sm truncate">${act.title}</h4>
            <div class="flex items-center gap-2">
              <span class="text-xs font-bold text-amber-500 flex items-center gap-1">
                <i class="fa-solid fa-star text-[10px]"></i> ${act.rating || '4.7'}
              </span>
              <button class="text-slate-400 hover:text-slate-600 text-xs px-1"><i class="fa-solid fa-ellipsis-vertical"></i></button>
            </div>
          </div>
          <p class="text-xs text-slate-500 mt-0.5 line-clamp-1">${act.desc || act.description || ''}</p>
          <div class="flex items-center gap-3 mt-1.5 text-[11px] text-slate-400 font-medium">
            <span><i class="fa-regular fa-clock mr-1"></i>${act.duration || act.duration_hours + ' hrs'}</span>
            <span>·</span>
            <span class="text-emerald-600 font-semibold">₹${(act.cost || act.estimated_cost || 0).toLocaleString()}</span>
            <span>·</span>
            <span class="px-2 py-0.2 rounded-md ${act.indoor || act.is_indoor ? 'bg-indigo-50 text-indigo-700' : 'bg-amber-50 text-amber-700'} text-[10px] font-bold">
              ${act.indoor || act.is_indoor ? 'Indoor' : 'Outdoor'}
            </span>
          </div>
        </div>
      </div>
    `;

    container.appendChild(item);
  });
}

function getPhotoForActivity(title) {
  const t = title.toLowerCase();
  if (t.includes("golden temple") || t.includes("amritsar") || t.includes("wagah") || t.includes("langar")) return PHOTO_BANK.amritsar_temple;
  if (t.includes("ghat") || t.includes("aarti") || t.includes("kashi") || t.includes("varanasi")) return PHOTO_BANK.varanasi_ghats;
  if (t.includes("amber") || t.includes("hawa mahal") || t.includes("jaipur") || t.includes("chokhi") || t.includes("palace") || t.includes("fort")) return PHOTO_BANK.jaipur_palace;
  if (t.includes("rafting") || t.includes("rishikesh") || t.includes("ganga") || t.includes("jhula")) return PHOTO_BANK.rishikesh_ganga;
  if (t.includes("pangong") || t.includes("ladakh") || t.includes("khardung") || t.includes("nubra")) return PHOTO_BANK.ladakh_lake;
  if (t.includes("toy train") || t.includes("ooty") || t.includes("botanical") || t.includes("pykara") || t.includes("tea")) return PHOTO_BANK.ooty_tea;
  if (t.includes("beach") || t.includes("baga") || t.includes("water sports") || t.includes("calangute") || t.includes("dudhsagar")) return PHOTO_BANK.goa_beach;
  if (t.includes("charminar") || t.includes("golconda") || t.includes("hyderabad") || t.includes("salar jung")) return PHOTO_BANK.charminar;
  if (t.includes("backwater") || t.includes("houseboat") || t.includes("alleppey") || t.includes("kerala") || t.includes("munnar")) return PHOTO_BANK.kerala_backwaters;
  if (t.includes("shikara") || t.includes("dal lake") || t.includes("kashmir") || t.includes("gulmarg") || t.includes("pahalgam")) return PHOTO_BANK.kashmir_valley;
  if (t.includes("snow") || t.includes("solang") || t.includes("manali") || t.includes("atal tunnel") || t.includes("rohtang")) return PHOTO_BANK.manali_snow;
  if (t.includes("kursura") || t.includes("submarine") || t.includes("vizag") || t.includes("araku") || t.includes("borra")) return PHOTO_BANK.vizag_sea;
  if (t.includes("balaji") || t.includes("tirupati") || t.includes("temple") || t.includes("gopuram") || t.includes("mahabalipuram")) return PHOTO_BANK.tirupati_temple;
  if (t.includes("mumbai") || t.includes("marine drive") || t.includes("gateway of india") || t.includes("sea link")) return PHOTO_BANK.mumbai_sea;
  if (t.includes("andaman") || t.includes("radhanagar") || t.includes("havelock") || t.includes("coral")) return PHOTO_BANK.andaman_beach;
  if (t.includes("eiffel") || t.includes("louvre") || t.includes("paris") || t.includes("versailles")) return PHOTO_BANK.eiffel_tower;
  if (t.includes("taj") || t.includes("agra")) return PHOTO_BANK.taj_mahal;
  if (t.includes("colosseum") || t.includes("rome") || t.includes("vatican") || t.includes("trevi")) return PHOTO_BANK.colosseum;
  if (t.includes("senso") || t.includes("tokyo") || t.includes("shibuya") || t.includes("meiji")) return PHOTO_BANK.senso_ji;
  if (t.includes("burj") || t.includes("dubai") || t.includes("desert safari")) return PHOTO_BANK.dubai;
  if (t.includes("london") || t.includes("big ben") || t.includes("tower bridge") || t.includes("westminster")) return PHOTO_BANK.london_eye;
  if (t.includes("singapore") || t.includes("marina bay") || t.includes("sentosa") || t.includes("gardens by the bay")) return PHOTO_BANK.singapore_skyline;
  if (t.includes("bali") || t.includes("ubud") || t.includes("uluwatu") || t.includes("tanah lot")) return PHOTO_BANK.bali_temple;
  if (t.includes("bangkok") || t.includes("wat arun") || t.includes("chao phraya") || t.includes("emerald buddha")) return PHOTO_BANK.bangkok_wat;
  if (t.includes("new york") || t.includes("manhattan") || t.includes("broadway") || t.includes("central park")) return PHOTO_BANK.new_york_sky;
  if (t.includes("sagrada") || t.includes("barcelona") || t.includes("gaudi") || t.includes("park guell")) return PHOTO_BANK.barcelona_sagrada;
  if (t.includes("maldives") || t.includes("overwater") || t.includes("bungalow") || t.includes("resort") || t.includes("lagoon")) return PHOTO_BANK.maldives_resort;
  if (t.includes("first") || t.includes("cliff") || t.includes("titlis") || t.includes("jungfraujoch")) return PHOTO_BANK.grindelwald_first;
  if (t.includes("breakfast") || t.includes("cafe") || t.includes("restaurant") || t.includes("food") || t.includes("dining")) return PHOTO_BANK.cafe_sprungli;
  return PHOTO_BANK.zurich_old_town;
}

// =========================================================================
// Real-Time Disruption Replanner Trigger
// =========================================================================
async function triggerAdaptiveReplanning() {
  const alertBanner = document.getElementById("disruption-banner");
  alertBanner.classList.add("ring-2", "ring-rose-500", "animate-pulse");

  const dest = state.currentDestination;
  const key = getDestinationKey(dest);
  const cfg = DESTINATION_CONFIG[key] || DESTINATION_CONFIG["switzerland"];

  const disruption = {
    day_number: cfg.alert.day || 1,
    time_slot: cfg.alert.slot || "Morning",
    disruption_type: "weather",
    description: cfg.alert.text,
    severity: "medium"
  };

  try {
    const res = await fetch("/api/itinerary/adapt", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        itinerary: state.currentItinerary,
        disruption: disruption
      })
    });
    const data = await res.json();

    if (data.success) {
      state.currentItinerary = data.updated_itinerary;
      state.activeDayIndex = Math.max(0, disruption.day_number - 1);
      renderDaysTabs();
      renderTimeline(state.activeDayIndex);

      document.getElementById("alert-text").innerHTML = `
        <span class="text-emerald-700 font-bold">✔ Replanning Complete:</span> ${data.adaptation_result.reason_for_change}
      `;
      alertBanner.classList.remove("ring-2", "ring-rose-500", "animate-pulse");
      alertBanner.classList.add("bg-emerald-50", "border-emerald-200");

      appendAssistantMessage(`🌧️ Real-Time Disruption Handled: Substituted outdoor activity with indoor cultural sanctuary. Budget variance: ₹${data.adaptation_result.budget_variance}.`);
    }
  } catch (err) {
    console.warn("Adaptive replanning fallback:", err);
  }
}

// =========================================================================
// Initial Load Default Trip (Switzerland)
// =========================================================================
function loadInitialTrip() {
  const dest = state.currentDestination;
  const key = getDestinationKey(dest);
  const cleanCity = dest.split("(")[0].split(",")[0].trim();
  const clientHotels = CLIENT_HOTELS_DB[key] || CLIENT_HOTELS_DB["switzerland"];
  const isIntl = ["switzerland", "paris", "dubai", "tokyo", "rome", "london", "singapore", "bali", "maldives"].includes(key);
  state.activeHotels = clientHotels.map(h => ({
    ...h,
    booking_links: h.booking_links || generateClientBookingLinks(h.name, cleanCity, isIntl)
  }));
  onTripParametersChanged();
}

function executeAIPlanning() {
  onTripParametersChanged();
}

// =========================================================================
// Group Travel Planning Modal
// =========================================================================
function openGroupModal() {
  const modal = document.getElementById("group-modal");
  modal.classList.remove("hidden");
  updateMemberInputsCount(4);
}

function closeGroupModal() {
  document.getElementById("group-modal").classList.add("hidden");
}

function updateMemberInputsCount(count) {
  document.getElementById("modal-member-count-badge").innerText = `${count} Members`;
  const container = document.getElementById("dynamic-members-list");
  container.innerHTML = "";

  const defaultNames = ["Rahul", "Priya", "Ananya", "Arjun", "Karan", "Sneha", "Vikram", "Meera", "Rohan", "Pooja"];
  const defaultBudgets = [25000, 30000, 22000, 26000, 28000, 24000, 35000, 25000, 27000, 24000];
  const defaultInterestPool = ["adventure", "culture", "local food", "nightlife", "photography", "shopping", "relaxation"];

  for (let i = 0; i < count; i++) {
    const name = defaultNames[i] || `Traveler ${i + 1}`;
    const budget = defaultBudgets[i] || 25000;
    container.innerHTML += `
      <div class="p-3.5 bg-slate-50 border border-slate-200/80 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
        <div class="flex items-center gap-2.5 font-bold text-slate-800">
          <div class="w-7 h-7 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center font-extrabold text-[11px]">${i + 1}</div>
          <input type="text" class="member-name-input bg-white px-2.5 py-1.5 border border-slate-200 rounded-lg font-bold text-slate-800 w-28" value="${name}">
        </div>
        <div class="flex items-center gap-2">
          <label class="text-[10px] uppercase font-bold text-slate-400">Max Budget (₹):</label>
          <input type="number" class="member-budget-input bg-white px-2.5 py-1.5 border border-slate-200 rounded-lg font-bold text-slate-800 w-28" value="${budget}" step="1000">
        </div>
        <div class="flex items-center gap-1 overflow-x-auto text-[10px]">
          <span class="px-2 py-0.5 bg-brand-50 text-brand-700 rounded-md font-semibold">${defaultInterestPool[i % defaultInterestPool.length]}</span>
          <span class="px-2 py-0.5 bg-slate-200 text-slate-700 rounded-md font-semibold">${defaultInterestPool[(i + 2) % defaultInterestPool.length]}</span>
        </div>
      </div>
    `;
  }
}

async function submitGroupHarmonization() {
  const dest = state.currentDestination;
  const nameInputs = document.querySelectorAll(".member-name-input");
  const budgetInputs = document.querySelectorAll(".member-budget-input");

  const members = [];
  nameInputs.forEach((inp, idx) => {
    members.push({
      name: inp.value,
      max_budget: parseFloat(budgetInputs[idx].value) || 25000,
      interests: ["culture", "local food", "sightseeing", "adventure"]
    });
  });

  const req = {
    destination: dest,
    duration_days: state.durationDays,
    members: members
  };

  try {
    const res = await fetch("/api/group/consensus", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req)
    });
    const data = await res.json();

    const resultsArea = document.getElementById("group-results-area");
    resultsArea.classList.remove("hidden");

    resultsArea.innerHTML = `
      <div class="bg-brand-50 border border-brand-200 rounded-2xl p-4">
        <h4 class="font-bold text-brand-900 text-sm">🤝 Group Consensus Strategy</h4>
        <p class="text-xs text-brand-700 mt-1">${data.consensus_summary}</p>
        <div class="grid grid-cols-2 gap-3 mt-3 pt-3 border-t border-brand-200 text-xs">
          <div>
            <span class="text-[10px] uppercase font-bold text-brand-500 block">Equal Fair Budget / Person</span>
            <span class="text-base font-extrabold text-slate-900">₹${data.cost_per_person.toLocaleString()}</span>
          </div>
          <div>
            <span class="text-[10px] uppercase font-bold text-brand-500 block">Total Group Pool</span>
            <span class="text-base font-extrabold text-slate-900">₹${data.recommended_shared_budget.toLocaleString()}</span>
          </div>
        </div>
      </div>

      <div>
        <h5 class="font-bold text-xs text-slate-800 uppercase tracking-wider mb-2">🏨 Group Accommodation Recommendations:</h5>
        <div class="space-y-2">
          ${data.recommended_accommodations.map(acc => `
            <div class="p-3 bg-white border border-slate-200 rounded-xl flex items-center justify-between text-xs">
              <div>
                <strong>${acc.name}</strong> (${acc.type})
                <p class="text-[11px] text-slate-500">${acc.suitability_rating}</p>
              </div>
              <span class="font-bold text-emerald-700">₹${acc.price_per_night.toLocaleString()} / night</span>
            </div>
          `).join('')}
        </div>
      </div>

      <div>
        <h5 class="font-bold text-xs text-slate-800 uppercase tracking-wider mb-2">🚐 Group Transportation Optimization:</h5>
        <div class="space-y-2">
          ${data.transportation_options.map(tr => `
            <div class="p-3 bg-white border border-slate-200 rounded-xl flex items-center justify-between text-xs">
              <div>
                <strong>${tr.mode}</strong>
                <p class="text-[11px] text-slate-500">${tr.recommendation_verdict}</p>
              </div>
              <span class="font-bold text-brand-600">₹${tr.estimated_cost_per_person.toLocaleString()} / person</span>
            </div>
          `).join('')}
        </div>
      </div>
    `;

  } catch (err) {
    console.warn("Group consensus API call:", err);
  }
}

// =========================================================================
// AI Travel Assistant (Chat & Voice)
// =========================================================================
function handleChatKeyPress(e) {
  if (e.key === "Enter") {
    submitUserChat();
  }
}

function submitUserChat() {
  const input = document.getElementById("chat-input");
  const query = input.value.trim();
  if (!query) return;

  appendUserMessage(query);
  input.value = "";
  sendQueryToAssistant(query);
}

function sendQuickPrompt(promptText) {
  appendUserMessage(promptText);
  sendQueryToAssistant(promptText);
}

function appendUserMessage(msg) {
  const chatArea = document.getElementById("chat-messages");
  chatArea.innerHTML += `
    <div class="flex justify-end">
      <div class="bg-brand-600 text-white p-3 rounded-2xl rounded-tr-sm max-w-[85%] leading-relaxed">
        ${msg}
      </div>
    </div>
  `;
  chatArea.scrollTop = chatArea.scrollHeight;
}

function appendAssistantMessage(msg) {
  const chatArea = document.getElementById("chat-messages");
  chatArea.innerHTML += `
    <div class="flex justify-start">
      <div class="bg-slate-50 border border-slate-100 text-slate-800 p-3 rounded-2xl rounded-tl-sm max-w-[88%] leading-relaxed">
        ${msg}
      </div>
    </div>
  `;
  chatArea.scrollTop = chatArea.scrollHeight;

  if (state.isVoiceActive && window.speechSynthesis) {
    const utterance = new SpeechSynthesisUtterance(msg.replace(/[*_#]/g, ''));
    utterance.lang = "en-US";
    window.speechSynthesis.speak(utterance);
  }
}

async function sendQueryToAssistant(query) {
  const dest = state.currentDestination;

  try {
    const res = await fetch("/api/chat/companion", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: query,
        destination: dest,
        language: "English"
      })
    });
    const data = await res.json();
    appendAssistantMessage(data.response_text);
  } catch (err) {
    appendAssistantMessage(`🌍 Here to assist you in ${dest.split(',')[0]}! Let me know if you need local food spots, transit passes, or safety numbers.`);
  }
}

function toggleVoiceSpeech() {
  state.isVoiceActive = !state.isVoiceActive;
  const btn = document.getElementById("voice-btn");
  const label = document.getElementById("voice-btn-label");

  if (state.isVoiceActive) {
    btn.classList.add("bg-rose-50", "border-rose-500", "text-rose-600");
    label.innerText = "Listening...";

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.lang = "en-US";
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        document.getElementById("chat-input").value = transcript;
        submitUserChat();
        toggleVoiceSpeech();
      };
      recognition.onerror = () => toggleVoiceSpeech();
      recognition.start();
    } else {
      appendAssistantMessage("🔊 Voice mode activated! I will read my travel answers aloud to you.");
    }
  } else {
    btn.classList.remove("bg-rose-50", "border-rose-500", "text-rose-600");
    label.innerText = "Voice";
    if (window.speechSynthesis) window.speechSynthesis.cancel();
  }
}

// =========================================================================
// Navigation Tabs Switching
// =========================================================================
function switchNav(navKey) {
  document.querySelectorAll(".nav-item").forEach(item => {
    item.classList.remove("active");
    item.classList.add("text-slate-600");
    const icon = item.querySelector("i");
    if (icon) {
      icon.classList.remove("text-brand-600");
      icon.classList.add("text-slate-400");
    }
  });

  const activeItem = document.getElementById(`nav-${navKey}`);
  if (activeItem) {
    activeItem.classList.add("active");
    activeItem.classList.remove("text-slate-600");
    const icon = activeItem.querySelector("i");
    if (icon) {
      icon.classList.add("text-brand-600");
      icon.classList.remove("text-slate-400");
    }
  }

  if (navKey === "groups") {
    openGroupModal();
  } else if (navKey === "assistant") {
    document.getElementById("chat-input").focus();
  } else if (navKey === "safety") {
    showSafetyModal();
  } else if (navKey === "expenses") {
    alert(`💰 Estimated Expense Breakdown for ${state.currentDestination.split(',')[0]}:\n• Total Budget: ₹${state.totalBudget.toLocaleString()}\n• Used on Activities & Dining: ₹${state.usedBudget.toLocaleString()}\n• Remaining Buffer: ₹${(state.totalBudget - state.usedBudget).toLocaleString()}`);
  } else if (navKey === "explore") {
    showLandmarkScanner();
  }
}

function showSafetyModal() {
  const dest = state.currentDestination;
  alert(`🛡️ Tourist Safety & SOS Emergency Hub for ${dest.split(',')[0]}:\n• Universal Emergency Helpline: 112\n• Local Police Control: 100 / 112\n• Medical Ambulance: 108 / 112\n• 24/7 Diplomatic & Tourist Police Active.`);
}

function showLandmarkScanner() {
  const dest = state.currentDestination;
  alert(`📸 Landmark Vision AI Scanner Active: Point camera at any monument in ${dest.split(',')[0]} to extract historical context and listen to a 30-second audio guide!`);
}

function openPreferencesModal() {
  alert("Traveler Preferences: You can change the Destination, Duration, Travelers, and Traveler Type in the top bar to instantly re-tune your itinerary!");
}

// =========================================================================
// Day 1 Nearby Lodges & Hotels with Room Sharing and Partner Redirection
// =========================================================================
async function fetchAndRenderDay1Hotels() {
  const dest = state.currentDestination;
  const container = document.getElementById("day1-hotels-container");
  if (!container) return;

  const key = getDestinationKey(dest);
  const cleanCity = dest.split("(")[0].split(",")[0].trim();
  const heading = document.getElementById("hotels-section-heading");
  if (heading) heading.innerText = `Verified Lodges & Hotels Near Day 1 Stay (${cleanCity})`;

  // 1. Instant 0ms Render from CLIENT_HOTELS_DB (Never blank or stuck on spinner)
  const clientHotels = CLIENT_HOTELS_DB[key] || CLIENT_HOTELS_DB["goa"];
  if (clientHotels && clientHotels.length > 0) {
    const isIntl = ["switzerland", "paris", "dubai", "tokyo", "rome", "london", "singapore", "bali", "maldives"].includes(key);
    const enrichedHotels = clientHotels.map(h => ({
      ...h,
      booking_links: h.booking_links || generateClientBookingLinks(h.name, cleanCity, isIntl)
    }));
    state.activeHotels = enrichedHotels;
    renderHotelsList(enrichedHotels);
  } else {
    container.innerHTML = `
      <div class="py-8 text-center text-slate-400">
        <i class="fa-solid fa-hotel fa-bounce text-2xl text-brand-600 mb-2"></i>
        <p class="text-xs font-semibold">AI Assistant discovering verified lodges near Day 1 staying hub...</p>
      </div>
    `;
  }

  // 2. Concurrently sync with backend FastAPI microservice
  try {
    const res = await fetch("/api/hotels/near", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ destination: dest, day_number: 1 })
    });
    if (res.ok) {
      const data = await res.json();
      if (data.success && data.hotels && data.hotels.length > 0) {
        state.activeHotels = data.hotels;
        renderHotelsList(data.hotels);
      }
    }
  } catch (err) {
    console.warn("Hotels API background sync:", err);
  }
}

function renderHotelsList(hotels) {
  const container = document.getElementById("day1-hotels-container");
  if (!container) return;
  container.innerHTML = "";

  hotels.forEach((h) => {
    const card = document.createElement("div");
    card.className = "bg-white hover:bg-slate-50/70 p-4 md:p-5 rounded-2xl border border-slate-200/80 hover:border-brand-300 transition shadow-sm hover:shadow-md flex flex-col md:flex-row gap-5 items-start group";

    // Build sharing options preview badges
    const sharingHtml = h.sharing_options.map((opt) => `
      <div class="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs hover:border-brand-300 hover:bg-brand-50/30 transition">
        <div class="flex items-center gap-2">
          <span class="w-2 h-2 rounded-full bg-brand-500"></span>
          <div>
            <strong class="text-slate-800 text-[11px] block">${opt.type}</strong>
            <span class="text-[10px] text-slate-400 font-medium">${opt.note || ''}</span>
          </div>
        </div>
        <div class="text-right shrink-0">
          <span class="text-emerald-700 font-extrabold text-xs">₹${opt.price_per_person_inr.toLocaleString()}</span>
          <span class="text-[9px] text-slate-400 block font-semibold">/ person</span>
        </div>
      </div>
    `).join('');

    // Amenities tags
    const amenitiesHtml = h.amenities.slice(0, 4).map(am => `
      <span class="px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md text-[10px] font-semibold">${am}</span>
    `).join('');

    card.innerHTML = `
      <div class="w-full md:w-56 h-44 shrink-0 relative rounded-2xl overflow-hidden shadow-sm">
        <img src="${h.image}" alt="${h.name}" class="w-full h-full object-cover group-hover:scale-105 transition duration-300">
        <span class="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-extrabold uppercase tracking-wider">
          ${h.type}
        </span>
      </div>

      <div class="flex-1 min-w-0 w-full space-y-3">
        <div class="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
          <div>
            <div class="flex items-center gap-2 flex-wrap">
              <h4 class="font-extrabold text-slate-900 text-base leading-snug">${h.name}</h4>
              <span class="px-2 py-0.5 bg-amber-50 text-amber-700 text-[10px] font-bold rounded-md flex items-center gap-1 border border-amber-200">
                <i class="fa-solid fa-star text-[9px]"></i> ${h.rating} (${h.reviews})
              </span>
            </div>
            <p class="text-xs text-slate-500 mt-1 flex items-center gap-1.5 font-medium">
              <i class="fa-solid fa-location-dot text-rose-500 text-[11px]"></i>
              <span class="text-slate-700 font-semibold">${h.distance}</span> · <span class="text-brand-600 font-semibold">${h.near_landmark}</span>
            </p>
          </div>
          <div class="text-left sm:text-right shrink-0">
            <span class="text-[10px] uppercase font-bold text-slate-400 block">Starting Rate</span>
            <span class="text-lg font-black text-slate-900">₹${h.base_price_inr.toLocaleString()}</span>
            <span class="text-[10px] text-slate-400 block font-medium">/ room / night</span>
          </div>
        </div>

        <div class="flex flex-wrap gap-1.5">
          ${amenitiesHtml}
        </div>

        <!-- Room Sharing Box -->
        <div class="pt-1">
          <div class="flex items-center justify-between mb-1.5">
            <span class="text-[10px] font-bold uppercase text-slate-400 tracking-wider flex items-center gap-1">
              <i class="fa-solid fa-bed text-brand-600"></i>Room Sharing & Lodging Options:
            </span>
            <span class="text-[10px] font-extrabold text-brand-600 bg-brand-50 px-2 py-0.5 rounded-md">Cost Per Person</span>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
            ${sharingHtml}
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex flex-wrap items-center gap-2.5 pt-2">
          <button onclick="openHotelBookingModal('${h.id}')" class="px-4 py-2.5 bg-brand-600 hover:bg-brand-700 active:scale-95 text-white font-bold text-xs rounded-xl shadow-md shadow-brand-600/20 transition flex items-center gap-2">
            <i class="fa-solid fa-calendar-check"></i>
            <span>Book Stay & Select Sharing</span>
          </button>
          <a href="${h.booking_links.primary_url}" target="_blank" rel="noopener noreferrer" class="px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition flex items-center gap-2">
            <span>Partner Booking Portal</span>
            <i class="fa-solid fa-arrow-up-right-from-square text-[11px] text-slate-500"></i>
          </a>
          <a href="${h.booking_links.google_hotels_url}" target="_blank" rel="noopener noreferrer" class="px-3 py-2.5 text-slate-500 hover:text-slate-800 text-xs font-semibold transition flex items-center gap-1.5">
            <i class="fa-brands fa-google text-[11px] text-blue-500"></i>
            <span>Check All Rates</span>
          </a>
        </div>

      </div>
    `;

    container.appendChild(card);
  });
}

// =========================================================================
// Hotel Booking Modal Logic (Sharing Selection & Partner Redirection)
// =========================================================================
function openHotelBookingModal(hotelId) {
  const hotel = state.activeHotels.find(h => h.id === hotelId);
  if (!hotel) return;

  state.selectedHotelForBooking = hotel;
  state.selectedSharingIdx = 0;

  document.getElementById("modal-hotel-name").innerText = hotel.name;
  document.getElementById("modal-hotel-type").innerText = hotel.type;
  document.getElementById("modal-hotel-rating").innerText = hotel.rating;
  document.getElementById("modal-hotel-location").innerHTML = `<i class="fa-solid fa-location-dot text-rose-500 text-[11px] mr-1"></i>${hotel.distance} · ${hotel.near_landmark}`;
  document.getElementById("modal-hotel-distance").innerHTML = `<i class="fa-solid fa-shoe-prints mr-1.5 text-sky-400"></i>${hotel.distance}`;
  document.getElementById("modal-hotel-img").src = hotel.image;

  const cleanCity = state.currentDestination.split('(')[0].split(',')[0].trim();
  document.getElementById("modal-redirect-btn-text").innerText = `Proceed to Booking Portal (${cleanCity})`;

  const guests = state.travelersCount || 2;
  document.getElementById("modal-guests-label").innerText = guests === 1 ? "1 Adult" : `${guests} Adults (${state.travelerType.toUpperCase()})`;

  renderModalSharingOptions(hotel);
  updateModalPriceCalculation();

  document.getElementById("modal-booking-form").classList.remove("hidden");
  document.getElementById("modal-booking-confirmation").classList.add("hidden");
  document.getElementById("hotel-booking-modal").classList.remove("hidden");
}

function closeHotelBookingModal() {
  document.getElementById("hotel-booking-modal").classList.add("hidden");
}

function renderModalSharingOptions(hotel) {
  const container = document.getElementById("modal-sharing-options-container");
  if (!container) return;
  container.innerHTML = "";

  hotel.sharing_options.forEach((opt, idx) => {
    const isSelected = idx === state.selectedSharingIdx;
    const div = document.createElement("div");
    div.className = `p-3.5 rounded-2xl border cursor-pointer transition flex items-center justify-between ${isSelected ? 'border-brand-500 bg-brand-50/60 ring-2 ring-brand-500/20' : 'border-slate-200 bg-white hover:border-slate-300'}`;
    div.onclick = () => {
      state.selectedSharingIdx = idx;
      renderModalSharingOptions(hotel);
      updateModalPriceCalculation();
    };

    div.innerHTML = `
      <div class="flex items-center gap-3">
        <div class="w-4 h-4 rounded-full border flex items-center justify-center ${isSelected ? 'border-brand-600 bg-brand-600 text-white' : 'border-slate-300'}">
          ${isSelected ? '<i class="fa-solid fa-check text-[9px]"></i>' : ''}
        </div>
        <div>
          <div class="flex items-center gap-2">
            <strong class="text-xs text-slate-900">${opt.type}</strong>
            ${opt.badge ? `<span class="px-2 py-0.5 rounded-md text-[9px] font-extrabold bg-brand-100 text-brand-700">${opt.badge}</span>` : ''}
          </div>
          <p class="text-[11px] text-slate-500 mt-0.5">${opt.note || ''}</p>
        </div>
      </div>
      <div class="text-right">
        <span class="text-sm font-black text-slate-900">₹${opt.price_per_person_inr.toLocaleString()}</span>
        <span class="text-[10px] text-slate-400 block font-medium">/ person / night</span>
      </div>
    `;
    container.appendChild(div);
  });
}

function updateModalPriceCalculation() {
  if (!state.selectedHotelForBooking) return;
  const opt = state.selectedHotelForBooking.sharing_options[state.selectedSharingIdx];
  if (!opt) return;

  const guests = state.travelersCount || 2;
  const isDorm = opt.type.toLowerCase().includes("dorm") || opt.type.toLowerCase().includes("bed");
  const total = isDorm ? (opt.price_per_person_inr * guests) : opt.total_inr;

  document.getElementById("modal-calc-label").innerText = `${opt.type} (₹${opt.price_per_person_inr.toLocaleString()} × ${guests} guests)`;
  document.getElementById("modal-calc-total").innerText = `₹${total.toLocaleString()} / night`;
  document.getElementById("modal-calc-grand-total").innerText = `₹${total.toLocaleString()}`;
}

function redirectToPartnerBookingPortal() {
  if (!state.selectedHotelForBooking) return;
  const url = state.selectedHotelForBooking.booking_links.primary_url || state.selectedHotelForBooking.booking_links.google_hotels_url;
  window.open(url, "_blank");
}

function confirmDirectLodgeBooking() {
  if (!state.selectedHotelForBooking) return;
  const opt = state.selectedHotelForBooking.sharing_options[state.selectedSharingIdx];
  const randId = "BK-LDG-" + Math.floor(10000 + Math.random() * 90000);

  const guests = state.travelersCount || 2;
  const isDorm = opt.type.toLowerCase().includes("dorm") || opt.type.toLowerCase().includes("bed");
  const total = isDorm ? (opt.price_per_person_inr * guests) : opt.total_inr;

  document.getElementById("conf-booking-id").innerText = randId;
  document.getElementById("conf-hotel-name").innerText = state.selectedHotelForBooking.name;
  document.getElementById("conf-room-type").innerText = `${opt.type} (${guests} Members)`;
  document.getElementById("conf-total-price").innerText = `₹${total.toLocaleString()}`;

  document.getElementById("modal-booking-form").classList.add("hidden");
  document.getElementById("modal-booking-confirmation").classList.remove("hidden");

  appendAssistantMessage(`🏨 Reserved Day 1 stay at ${state.selectedHotelForBooking.name} (${opt.type})! Reference ID: ${randId}. Total: ₹${total.toLocaleString()}. Free cancellation enabled.`);
}
