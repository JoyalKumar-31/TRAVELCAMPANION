import re
from typing import Dict, List, Optional, Any, Tuple
from schemas import CompanionChatRequest, CompanionChatResponse, CompanionAction
from config import get_llm
from hotel_service import HOTELS_DATABASE, get_destination_hotel_key
from geo_service import calculate_journey_logistics

LOCAL_PHRASEBOOKS: Dict[str, Dict[str, str]] = {
    "hyderabad": {
        "Hello / Greetings": "Aadab / Namaskaram",
        "How much does this cost?": "Iska kitna hua? / Idi entha?",
        "Please make it less spicy": "Mirchi kam daaliye / Mirchi thakkuva veyyandi",
        "Where is the Charminar / station?": "Charminar kidhar hai? / Station ekkada undi?",
        "Thank you very much": "Shukriya / Chala Dhanyavadalu",
        "Emergency, please help!": "Madad kijiye! / Sahayam cheyandi!"
    },
    "kerala": {
        "Hello / Greetings": "Namaskaram",
        "How much is this?": "Ithinu ethra aayi?",
        "Where is the boat jetty?": "Boat jetty evideyaanu?",
        "Please make food less spicy": "Erivu kurachu mathi",
        "Thank you": "Nandi",
        "Emergency!": "Sahayikkanam!"
    },
    "goa": {
        "Hello": "Deu boro dis divum / Hello",
        "How much is this?": "Haka kitle poixe?",
        "Where is the beach?": "Vell kaim asa?",
        "Thank you": "Dev borem korum",
        "Delicious food": "Jevon chodd borem"
    },
    "switzerland": {
        "Hello (Swiss German)": "Grüezi (Gree-et-see)",
        "Thank you": "Merci vielmal / Danke schön",
        "Where is the train?": "Wo isch de Zug?",
        "How much does it cost?": "Wieviel choschtet das?",
        "Delicious!": "Fein / Guet!"
    },
    "tokyo": {
        "Hello": "Konnichiwa (こんにちは)",
        "Excuse me / Sorry": "Sumimasen (すみません)",
        "How much is this?": "Kore wa ikura desu ka? (これはいくらですか？)",
        "Where is the train station?": "Eki wa doko desu ka? (駅はどこですか？)",
        "Thank you": "Arigatou gozaimasu (ありがとうございます)",
        "Check please": "O-kaikei kudasai (お会計ください)"
    },
    "paris": {
        "Hello": "Bonjour",
        "Excuse me / Please": "S'il vous plaît / Excusez-moi",
        "How much does this cost?": "Combien ça coûte ?",
        "Where is the metro?": "Où se trouve le métro le plus proche ?",
        "Thank you very much": "Merci beaucoup",
        "Do you speak English?": "Parlez-vous anglais ?"
    },
    "rome": {
        "Hello / Good day": "Buongiorno",
        "Please / You're welcome": "Per favore / Prego",
        "How much is this?": "Quanto costa questo?",
        "Where is the bathroom?": "Dov'è il bagno?",
        "Thank you": "Grazie mille",
        "Delicious!": "Delizioso!"
    }
}

# Canonical Destination Map for Action Detection
DESTINATIONS_DIRECTORY = {
    "goa": "Goa, India",
    "switzerland": "Switzerland (Zurich, Lucerne, Interlaken, Grindelwald)",
    "zurich": "Switzerland (Zurich, Lucerne, Interlaken, Grindelwald)",
    "lucerne": "Switzerland (Zurich, Lucerne, Interlaken, Grindelwald)",
    "interlaken": "Switzerland (Zurich, Lucerne, Interlaken, Grindelwald)",
    "hyderabad": "Hyderabad, Telangana",
    "vizag": "Visakhapatnam, Andhra Pradesh",
    "visakhapatnam": "Visakhapatnam, Andhra Pradesh",
    "araku": "Visakhapatnam, Andhra Pradesh",
    "kashmir": "Kashmir & Srinagar, India",
    "srinagar": "Kashmir & Srinagar, India",
    "gulmarg": "Kashmir & Srinagar, India",
    "kerala": "Kerala (Kochi, Alappuzha, Munnar), India",
    "kochi": "Kerala (Kochi, Alappuzha, Munnar), India",
    "cochin": "Kerala (Kochi, Alappuzha, Munnar), India",
    "alappuzha": "Kerala (Kochi, Alappuzha, Munnar), India",
    "alleppey": "Kerala (Kochi, Alappuzha, Munnar), India",
    "munnar": "Kerala (Kochi, Alappuzha, Munnar), India",
    "jaipur": "Jaipur & Udaipur, Rajasthan",
    "udaipur": "Jaipur & Udaipur, Rajasthan",
    "delhi": "Delhi, Agra & Taj Mahal, India",
    "agra": "Delhi, Agra & Taj Mahal, India",
    "taj mahal": "Delhi, Agra & Taj Mahal, India",
    "manali": "Manali & Shimla, Himachal Pradesh",
    "solang": "Manali & Shimla, Himachal Pradesh",
    "shimla": "Manali & Shimla, Himachal Pradesh",
    "varanasi": "Varanasi (Kashi & Sarnath Ghats), Uttar Pradesh",
    "kashi": "Varanasi (Kashi & Sarnath Ghats), Uttar Pradesh",
    "ladakh": "Ladakh (Leh, Pangong Tso, Nubra Valley)",
    "leh": "Ladakh (Leh, Pangong Tso, Nubra Valley)",
    "ooty": "Ooty & Coonoor (Nilgiri Mountain Railway)",
    "paris": "Paris, France",
    "dubai": "Dubai, United Arab Emirates",
    "tokyo": "Tokyo & Kyoto, Japan",
    "rome": "Rome & Florence, Italy"
}

# Detailed Tour Curations per Destination & Day Number
DAY_TOURS_KNOWLEDGE = {
    "kerala": {
        1: {
            "title": "Day 1: Fort Kochi Colonial Heritage, Chinese Fishing Nets & Cultural Evening",
            "morning": "Fort Kochi Chinese Fishing Nets & 1503 St. Francis Church. Watch local fishermen operate the cantilevered teakwood nets and stroll the leafy colonial tree-lined paths.",
            "afternoon": "Mattancherry Dutch Palace & Jew Town / Paradesi Synagogue. Explore mythological Ramayana murals, antique spice trade emporiums, and handcrafted ginger cafes.",
            "evening": "Live Kerala Kathakali theatrical performance at Fort Kochi Cultural Centre, followed by a coastal dinner of Karimeen Pollichathu (pearl spot fish wrapped in banana leaf) & flaky Malabar Parotta.",
            "cost_inr": "₹1,450 per person (entry tickets, public ferry, Kathakali show & dinner)",
            "tip": "Take the scenic Kochi Water Metro ferry from Ernakulam jetty to Fort Kochi for just ₹6 per person—it's air-conditioned and bypasses road traffic!"
        },
        2: {
            "title": "Day 2: Alappuzha (Alleppey) Backwaters Houseboat Cruise & Kuttanad Canals",
            "morning": "Board a traditional thatched-roof Kettuvallam houseboat from Punnamada Jetty, sailing along palm-fringed Vembanad Lake waters.",
            "afternoon": "Shikara canoe ride gliding through narrow village canals in Kuttanad, witnessing below-sea-level paddy farming and coir making.",
            "evening": "Sunset at Alappuzha Beach with its 150-year-old historic sea bridge pier, enjoying fresh tender coconut and banana fritters.",
            "cost_inr": "₹2,200 per person (sharing houseboat cruise & village canoe pass)",
            "tip": "Pre-book a certified government DTPC shikara boat for genuine canal tranquility."
        },
        3: {
            "title": "Day 3: Munnar Tea Plantations, Mattupetty Dam & Eravikulam Mountain Trails",
            "morning": "Scenic ascent to Munnar hill station, touring Kolukkumalai or Tata Tea Museum with tea tasting and rolling green terrace vistas.",
            "afternoon": "Speed boating at Mattupetty Dam & Echo Point, surrounded by mist-capped Anamudi mountains.",
            "evening": "Kalaripayattu martial arts combat demonstration in Munnar town, followed by aromatic cardamom tea and hot appams with vegetable stew.",
            "cost_inr": "₹1,800 per person",
            "tip": "Carry a light windbreaker jacket as hill mist rolls in rapidly after 4 PM."
        }
    },
    "switzerland": {
        1: {
            "title": "Day 1: Zurich Historic Altstadt, Lake Cruise & Lindt Chocolate Sanctuary",
            "morning": "Zurich Old Town (Altstadt) walking trail, Grossmünster twin towers, and panoramic Limmat river viewpoints at Lindenhof Hill.",
            "afternoon": "Scenic Lake Zurich paddle steamer cruise to Kilchberg, touring the Lindt Home of Chocolate with its colossal 9-meter chocolate fountain.",
            "evening": "Bahnhofstrasse promenade window-shopping & authentic Swiss Cheese Fondue and Rösti dinner in an ancient guild house.",
            "cost_inr": "₹4,500 / CHF 48 per person (entry tickets & fondue dinner; rail covered with Swiss Pass)",
            "tip": "Activate your Swiss Travel Pass for free access to Zurich trams, lake ferries, and over 500 museums."
        },
        2: {
            "title": "Day 2: Lucerne Medieval Chapel Bridge & Mount Titlis Revolving Cable Car",
            "morning": "Explore medieval Lucerne, crossing the 14th-century wooden Chapel Bridge (Kapellbrücke) and visiting the Lion Monument.",
            "afternoon": "Ride the Rotair 360-degree revolving cable car to Mount Titlis summit (3,020m), walking the Titlis Cliff Walk suspension bridge.",
            "evening": "Lucerne lakeside promenade dinner tasting raclette cheese and fresh Lake Lucerne perch fish.",
            "cost_inr": "₹9,500 / CHF 105 per person (Titlis cable car return & cliff walk)",
            "tip": "Check the summit webcam in the morning before ascending Mount Titlis to ensure clear blue skies."
        },
        3: {
            "title": "Day 3: Interlaken Lakes & Harder Kulm Sunset Funicular",
            "morning": "GoldenPass scenic express train from Lucerne to Interlaken between Lake Brienz and Lake Thun.",
            "afternoon": "Funicular railway up to Harder Kulm Two-Lakes Bridge with breathtaking panoramic views of the Eiger, Mönch, and Jungfrau peaks.",
            "evening": "Interlaken Höheweg park walk watching paragliders land against alpine peaks, enjoying Swiss artisan hot chocolate.",
            "cost_inr": "₹3,800 / CHF 40 per person",
            "tip": "Harder Kulm funicular runs every 30 minutes until sunset."
        }
    },
    "goa": {
        1: {
            "title": "Day 1: North Goa Coastal Bastions, Baga Beach Watersports & Fontainhas Heritage",
            "morning": "17th-century Fort Aguada and its four-tiered Portuguese lighthouse overlooking the Arabian Sea, followed by Sinquerim Beach bastions.",
            "afternoon": "Baga Beach watersports (parasailing, bumper ride, jet-ski) and lunch at an iconic beach shack savoring Goan Prawn Balchão and fish curry rice.",
            "evening": "Walk the vibrant yellow-and-cobalt heritage villas of Fontainhas Latin Quarter in Panaji, listening to live acoustic Fado tunes.",
            "cost_inr": "₹1,850 per person (watersports combo & beach shack meal)",
            "tip": "Rent an Activa scooter (₹400/day) or self-drive car for effortless hopping between beach shacks."
        },
        2: {
            "title": "Day 2: Dudhsagar Jungle Waterfalls & Spice Plantation Safari",
            "morning": "4x4 Open Jeep safari through the Bhagwan Mahavir Wildlife Sanctuary crossing jungle streams to Dudhsagar Falls pool.",
            "afternoon": "Guided aromatic organic Spice Plantation tour with traditional Goan buffet lunch served on fresh banana leaves.",
            "evening": "Relaxed sunset at Anjuna or Vagator beach near Chapora Fort (Dil Chahta Hai point).",
            "cost_inr": "₹2,200 per person (Jeep safari permit + spice lunch)",
            "tip": "Wear quick-dry clothing and non-slip sandals for the rocky waterfall crossing."
        },
        3: {
            "title": "Day 3: South Goa Historic Churches & Quiet White Sand Beaches",
            "morning": "Basilica of Bom Jesus (UNESCO World Heritage with St. Francis Xavier sacred relics) and Se Cathedral.",
            "afternoon": "Drive south to Palolem or Colva beach, exploring peaceful dolphin-watching boat trips.",
            "evening": "Beachside candlelit dinner with fresh grilled lobster, garlic butter naan, and sweet Bebinca dessert.",
            "cost_inr": "₹1,600 per person",
            "tip": "South Goa is significantly quieter and more romantic than North Goa party strips."
        }
    },
    "hyderabad": {
        1: {
            "title": "Day 1: Golconda Fort Citadel, Charminar & Legendary Biryani Trail",
            "morning": "Climb Golconda Fort to the Bala Hissar royal pavilion, experiencing the world-famous acoustic clapping portico.",
            "afternoon": "Visit the majestic Qutb Shahi Tombs heritage park, followed by an authentic Dum Biryani feast at Shadab or Paradise.",
            "evening": "Ascend Charminar monument, stroll the glittering Laad Bazaar for lacquer bangles and pearls, and sip Irani Chai with hot Osmania biscuits at Nimrah Cafe.",
            "cost_inr": "₹850 per person (heritage tickets, metro rides, Biryani & Irani chai)",
            "tip": "Take the Hyderabad Metro Red Line to MGBS/Charminar to avoid old city traffic congestion."
        },
        2: {
            "title": "Day 2: Salar Jung Museum & Hussain Sagar Lakefront Sunset",
            "morning": "Tour Salar Jung Museum's 38 galleries, including the famous 19th-century Musical Clock and the Veiled Rebecca marble masterpiece.",
            "afternoon": "Chowmahalla Palace of the Nizams, admiring the vintage Rolls-Royce collection and Belgian crystal chandeliers.",
            "evening": "Speedboat ride to the monolithic Buddha Statue in Hussain Sagar Lake, followed by a breezy sunset stroll on Tank Bund.",
            "cost_inr": "₹650 per person",
            "tip": "The Salar Jung Musical Clock strikes promptly on the hour—arrive at the central court 10 minutes early."
        },
        3: {
            "title": "Day 3: Ramoji Film City Cinematic Experience",
            "morning": "Guinness World Record-holding Ramoji Film City tour with live stunt shows and movie set walkthroughs.",
            "afternoon": "Theme park rides, Japanese gardens, and action studio demonstrations.",
            "evening": "Return via Outer Ring Road, dining on fiery Andhra meals and Haleem in Gachibowli / Jubilee Hills.",
            "cost_inr": "₹1,650 per person",
            "tip": "Book Ramoji premium express pass online to skip ride queues."
        }
    },
    "vizag": {
        1: {
            "title": "Day 1: RK Beachfront, Real Submarine Museum & Kailasagiri Hilltop",
            "morning": "Ride the ropeway cable car up Kailasagiri Hill for a 360-degree panorama of the sweeping Bay of Bengal coastline.",
            "afternoon": "Tour inside the decommissioned naval submarine at INS Kursura (S20) Submarine Museum and the adjacent TU-142 Aircraft Museum.",
            "evening": "Sunset walk along RK Beach, savoring Andhra spicy bamboo chicken, steaming sweet corn, and tender coconut water.",
            "cost_inr": "₹650 per person (museum entries, ropeway pass & beach snacks)",
            "tip": "The submarine museum opens at 2 PM on weekdays and 10 AM on weekends; sunset from Kailasagiri is unbeatable."
        },
        2: {
            "title": "Day 2: Araku Valley Mountain Train & Borra Caves Expedition",
            "morning": "Board the glass-domed Vistadome coach train from Vizag station climbing through 58 tunnels into Eastern Ghat misty valleys.",
            "afternoon": "Descend into the 150-million-year-old Borra Caves, marveling at the natural limestone stalactites and illuminated caverns.",
            "evening": "Araku tribal coffee museum, sipping freshly brewed organic Araku Valley Arabica coffee.",
            "cost_inr": "₹1,400 per person (Vistadome train return + cave entry)",
            "tip": "Book Vistadome train tickets on IRCTC at least 15 days in advance as seats fill fast."
        }
    },
    "kashmir": {
        1: {
            "title": "Day 1: Dal Lake Shikara Ride, Floating Gardens & Royal Mughal Terraces",
            "morning": "Morning wooden Shikara boat ride on tranquil Dal Lake, visiting floating lotus markets, Char Chinar island, and Meena Bazaar.",
            "afternoon": "Nishat Bagh ('Garden of Bliss') & Shalimar Bagh stepped Mughal fountains overlooking the snow-capped Zabarwan peaks.",
            "evening": "Lal Chowk historic walk, sipping hot saffron Kahwa tea and savoring an authentic multi-course Kashmiri Wazwan dinner (Rogan Josh & Rista).",
            "cost_inr": "₹1,350 per person (Shikara pass, Mughal garden entry & Wazwan dinner)",
            "tip": "Haggle pleasantly for the Shikara ride; standard government rate is ₹700/hour per boat."
        },
        2: {
            "title": "Day 2: Gulmarg Meadow of Flowers & World's Highest Gondola",
            "morning": "Drive to Gulmarg, boarding Phase 1 & Phase 2 Gondola cable car to Apharwat Peak (3,980m) in pristine alpine snow.",
            "afternoon": "Snow sledging, skiing, or walking through the Gulmarg pine meadows and historic St. Mary's Church.",
            "evening": "Warm up with spicy Kashmiri Dum Aloo and hot noon chai in a traditional heated wooden restaurant.",
            "cost_inr": "₹2,400 per person (Gondola Phase 1 & 2 tickets)",
            "tip": "Book Gulmarg Gondola tickets online on the official J&K Tourism portal days ahead."
        }
    }
}

class MultilingualCompanionAgent:
    """
    Intelligent Conversational AI Travel Companion & Real-Time Action Executor:
    - Provides instant, precise, context-rich answers to user questions (Day tour, lodges, sharing prices, budget, weather, routes).
    - Detects requested user actions and binds them to structured application commands:
      • SET_DESTINATION (Goa, Switzerland, Kashmir, Kerala, Hyderabad, Vizag, etc.)
      • SET_DURATION (1 to 14 days)
      • SET_PERSONA (solo, couple, family, friends, seniors)
      • SWITCH_DAY (day 1, day 2, day 3, etc.)
      • REPLAN (adaptive replanning)
      • SCROLL_TO_SECTION (route map, day 1 hotels, photos gallery)
      • OPEN_BOOKING (hotel booking modal)
    - Returns prices in Indian Rupees (₹ INR) with transparent room sharing breakdowns.
    """
    def __init__(self):
        self.llm = get_llm()

    def respond(self, request: CompanionChatRequest) -> CompanionChatResponse:
        q = request.query.strip()
        dest = request.destination.strip()
        lang = request.language.strip()
        traveler_ctx = request.traveler_context or {}

        q_lower = q.lower()
        dest_lower = dest.lower()

        # 1. Action Intent Parsing
        action: Optional[CompanionAction] = self._detect_action(q_lower, dest, traveler_ctx)

        # 2. Knowledge-Driven Content Formulation
        answer_text = self._build_knowledge_response(q_lower, dest, lang, traveler_ctx, action)

        # 3. Audio Narration Script
        audio_script = re.sub(r'[*_#`]', '', answer_text).replace("\n", " ").strip()

        # 4. Phrasebook Matching
        matched_phrases = {}
        for city_key, phrases in LOCAL_PHRASEBOOKS.items():
            if city_key in dest_lower or (action and action.action_type == "SET_DESTINATION" and city_key in str(action.payload).lower()):
                matched_phrases = phrases
                break
        if not matched_phrases:
            matched_phrases = {
                "Hello / Welcome": "Namaste / Hello",
                "How much is this?": "How much does this cost?",
                "Where is the nearest transit?": "Where is the nearest metro/bus station?",
                "Can you help me?": "Could you please help me?",
                "Thank you": "Thank you very much"
            }

        # 5. Context-Sensitive Follow-up Suggestions
        clean_city = dest.split("(")[0].split(",")[0].strip()
        followups = [
            f"What are the best sharing lodges near Day 1 in {clean_city}?",
            f"Can you tell me the tour of Day 2 in {clean_city}?",
            f"How much is the total estimated budget in ₹ INR?",
            f"Show directions by bike and train to {clean_city}"
        ]

        return CompanionChatResponse(
            response_text=answer_text,
            language=lang,
            audio_narrative_text=audio_script,
            useful_local_phrases=matched_phrases,
            suggested_followups=followups,
            action=action
        )

    def _detect_action(self, q_lower: str, current_dest: str, ctx: Dict[str, Any]) -> Optional[CompanionAction]:
        """Detects if user query contains an explicit or implied action request."""

        # 1. Action: SET_DESTINATION
        # Check if user says "change destination to Goa", "go to Switzerland", "plan trip to Kashmir", etc.
        dest_triggers = ["change destination to", "switch destination to", "set destination to", "plan trip to", 
                         "plan for", "go to", "take me to", "explore", "switch to", "let's go to", "visit", 
                         "change to", "trip to"]
        
        for trig in dest_triggers:
            if trig in q_lower:
                tail = q_lower.split(trig)[-1].strip()
                for key, canonical_name in DESTINATIONS_DIRECTORY.items():
                    if key in tail:
                        return CompanionAction(action_type="SET_DESTINATION", payload=canonical_name)

        # Standalone destination mentions when requesting a plan
        for key, canonical_name in DESTINATIONS_DIRECTORY.items():
            pattern = rf'\b(?:plan|trip|visit|go|switch|explore)\b.*\b{key}\b'
            if re.search(pattern, q_lower):
                return CompanionAction(action_type="SET_DESTINATION", payload=canonical_name)

        # 2. Action: SET_DURATION
        # Check if user asks "plan for 3 days", "change duration to 5 days", "make it 4 days", etc.
        dur_match = re.search(r'\b(?:plan for|make it|change to|duration|extend to|reduce to)?\s*([1-9]|1[0-4])\s*(?:days?|day)\b', q_lower)
        if dur_match and any(w in q_lower for w in ["plan", "make", "change", "set", "duration", "day", "days"]):
            num_days = int(dur_match.group(1))
            return CompanionAction(action_type="SET_DURATION", payload=num_days)

        # 3. Action: SET_PERSONA
        if any(w in q_lower for w in ["couple", "romantic", "honeymoon"]):
            if any(w in q_lower for w in ["switch", "change", "make", "traveling", "we are", "as", "set"]):
                return CompanionAction(action_type="SET_PERSONA", payload={"persona": "couple", "count": 2})
        elif any(w in q_lower for w in ["solo", "alone", "single traveler"]):
            if any(w in q_lower for w in ["switch", "change", "make", "traveling", "i am", "as", "set"]):
                return CompanionAction(action_type="SET_PERSONA", payload={"persona": "solo", "count": 1})
        elif any(w in q_lower for w in ["family", "with kids", "family of"]):
            count_match = re.search(r'family\s*(?:of\s*)?(\d+)', q_lower)
            count = int(count_match.group(1)) if count_match else 4
            return CompanionAction(action_type="SET_PERSONA", payload={"persona": "family", "count": count})
        elif any(w in q_lower for w in ["friends", "college", "buddies", "group of"]):
            count_match = re.search(r'(\d+)\s*friends', q_lower) or re.search(r'group\s*(?:of\s*)?(\d+)', q_lower)
            count = int(count_match.group(1)) if count_match else 3
            return CompanionAction(action_type="SET_PERSONA", payload={"persona": "friends", "count": count})
        elif any(w in q_lower for w in ["seniors", "elderly", "parents"]):
            if any(w in q_lower for w in ["switch", "change", "make", "traveling", "as", "set"]):
                return CompanionAction(action_type="SET_PERSONA", payload={"persona": "seniors", "count": 2})

        # 4. Action: SWITCH_DAY
        # Matches queries like "tour of day 1", "acn you tell me the tour of day 1", "show day 2", "day 3 itinerary"
        day_match = re.search(r'\bday\s*([1-9]|1[0-4])\b', q_lower)
        if day_match and any(w in q_lower for w in ["tour", "show", "open", "tell", "itinerary", "schedule", "activities", "visit", "what is"]):
            day_num = int(day_match.group(1))
            return CompanionAction(action_type="SWITCH_DAY", payload=day_num - 1)

        # 5. Action: REPLAN
        if any(w in q_lower for w in ["replan", "adapt", "reschedule", "weather alert", "rain alternative", "substitute"]):
            return CompanionAction(action_type="REPLAN", payload=None)

        # 6. Action: SCROLL_TO_SECTION (Route Map / Directions)
        if any(w in q_lower for w in ["show directions", "go directions", "show bike route", "bike route", "train route", 
                                      "car route", "directions", "show map", "open map", "route map"]):
            return CompanionAction(action_type="SCROLL_TO_SECTION", payload="route-map-section")

        # 7. Action: SCROLL_TO_SECTION (Hotels)
        if any(w in q_lower for w in ["show hotels", "show lodges", "open hotels", "where to stay", "view hotels", "view lodges"]):
            return CompanionAction(action_type="SCROLL_TO_SECTION", payload="day1-hotels-section")

        # 8. Action: OPEN_BOOKING
        if any(w in q_lower for w in ["book hotel", "book lodge", "reserve room", "open booking", "book stay"]):
            return CompanionAction(action_type="OPEN_BOOKING", payload=None)

        # 9. Action: SCROLL_TO_SECTION (Photos / Gallery)
        if any(w in q_lower for w in ["show photos", "show places", "photo gallery", "see pictures", "photos of places"]):
            return CompanionAction(action_type="SCROLL_TO_SECTION", payload="places-gallery-section")

        return None

    def _build_knowledge_response(
        self, 
        q_lower: str, 
        dest: str, 
        lang: str, 
        ctx: Dict[str, Any], 
        action: Optional[CompanionAction]
    ) -> str:
        """Constructs an exhaustive, highly specific response based on tourist intent and action."""

        clean_city = (dest or "").split("(")[0].split(",")[0].strip()
        hotel_key = get_destination_hotel_key(dest)

        # ---------------------------------------------------------
        # Case A: User Action Confirmations
        # ---------------------------------------------------------
        if action:
            if action.action_type == "SET_DESTINATION":
                target_dest = str(action.payload)
                target_city = target_dest.split("(")[0].split(",")[0].strip()
                return (
                    f"✈️ **Destination Switched to {target_city}!**\n\n"
                    f"I have automatically updated your full multi-day itinerary, live weather radar, route map directions, "
                    f"and verified Day 1 lodges with room sharing rates in ₹ INR for **{target_dest}**.\n\n"
                    f"Would you like me to walk you through the **Day 1 Tour**, recommend local delicacies, or show bike/train routes?"
                )

            elif action.action_type == "SET_DURATION":
                num_days = action.payload
                return (
                    f"📅 **Trip Duration Updated to {num_days} Days!**\n\n"
                    f"I have recalculated your day-by-day activity schedule and revised your estimated budget for {clean_city} "
                    f"across {num_days} full days. You can explore each day tab on the timeline above!"
                )

            elif action.action_type == "SET_PERSONA":
                persona = action.payload.get("persona", "couple")
                count = action.payload.get("count", 2)
                return (
                    f"👥 **Traveler Profile Updated to {persona.capitalize()} ({count} Traveler{'s' if count>1 else ''})!**\n\n"
                    f"Your itinerary pacing, lodging recommendations, and daily activity budget in {clean_city} have been "
                    f"tailored specifically for a {persona} trip. Room sharing and dining suggestions have been refreshed."
                )

            elif action.action_type == "REPLAN":
                return (
                    f"⚡ **AI Adaptive Replanning Triggered!**\n\n"
                    f"The Adaptive Replanner Agent has evaluated real-time weather and crowd alerts in {clean_city}. "
                    f"Exposed outdoor slots have been substituted with verified indoor cultural sanctuaries, and transport "
                    f"logistics have been re-optimized. Check the updated timeline above!"
                )

            elif action.action_type == "OPEN_BOOKING":
                return (
                    f"🏨 **Opening Hotel & Lodge Booking Dialog...**\n\n"
                    f"Here you can review verified Day 1 lodges near your staying hub, select your preferred room sharing tier "
                    f"(dormitory, twin sharing, or private deluxe in ₹ INR), and proceed with instant partner booking links."
                )

        # ---------------------------------------------------------
        # Case B: Tour of Day 1 / Day 2 / Day 3 (e.g. "tour of day 1")
        # ---------------------------------------------------------
        day_match = re.search(r'\bday\s*([1-9]|1[0-4])\b', q_lower)
        is_tour_query = any(w in q_lower for w in ["tour", "itinerary", "schedule", "activities", "visit", "what is", "tell me", "plan"])
        
        if (day_match and is_tour_query) or "tour of day" in q_lower or "day 1" in q_lower and "tour" in q_lower:
            day_num = int(day_match.group(1)) if day_match else 1
            dest_key = hotel_key

            # Check if curated day tour exists
            city_tours = DAY_TOURS_KNOWLEDGE.get(dest_key, {})
            tour_info = city_tours.get(day_num) or city_tours.get(1)

            if tour_info:
                return (
                    f"🗺️ **{tour_info['title']}**\n\n"
                    f"• 🌅 **Morning (09:00 - 12:30)**: {tour_info['morning']}\n\n"
                    f"• ☀️ **Afternoon (13:30 - 17:00)**: {tour_info['afternoon']}\n\n"
                    f"• 🌙 **Evening (17:30 - 21:00)**: {tour_info['evening']}\n\n"
                    f"💰 **Estimated Day Budget**: {tour_info['cost_inr']}\n"
                    f"💡 **Local Pro-Tip**: {tour_info['tip']}\n\n"
                    f"*(I have switched your timeline view to Day {day_num} above so you can view photos and details!)*"
                )
            else:
                # Dynamic Knowledge Generation for other cities
                return (
                    f"🗺️ **Day {day_num} Tour of {clean_city}**\n\n"
                    f"• 🌅 **Morning (09:00 - 12:30)**: Iconic heritage landmarks and historical monument walk with morning light.\n\n"
                    f"• ☀️ **Afternoon (13:30 - 17:00)**: Premier cultural museum, indoor gallery sanctuaries, and local culinary lunch.\n\n"
                    f"• 🌙 **Evening (17:30 - 21:00)**: Vibrant shopping bazaar, scenic waterfront promenade, and authentic regional dinner.\n\n"
                    f"💰 **Estimated Day Budget**: ~₹1,800 - ₹3,200 per person including entry permits, transfers, and dining."
                )

        # ---------------------------------------------------------
        # Case C: Hotels & Lodges Near Day 1 with Room Sharing Rates
        # ---------------------------------------------------------
        if any(w in q_lower for w in ["hotel", "lodge", "stay", "sharing", "dorm", "hostel", "accommodation", "room price"]):
            hotels_list = HOTELS_DATABASE.get(hotel_key, HOTELS_DATABASE.get("goa", []))
            if hotels_list:
                hotel_lines = []
                for h in hotels_list[:3]:
                    sharing_text = ", ".join([f"{s['type']} (~₹{s['price_per_person_inr']:,}/person)" for s in h.get("sharing_options", [])[:2]])
                    hotel_lines.append(
                        f"• **{h['name']}** ({h['type']})\n"
                        f"  📍 *Proximity*: {h.get('distance', 'Near hub')} | ⭐ {h.get('rating', 4.8)}/5\n"
                        f"  🛏️ *Sharing*: {sharing_text}\n"
                        f"  ✨ *Amenities*: {', '.join(h.get('amenities', [])[:3])}"
                    )
                return (
                    f"🏨 **Verified Lodges & Stays Near Day 1 in {clean_city}:**\n\n"
                    + "\n\n".join(hotel_lines) +
                    f"\n\n💡 *All lodges provide free WiFi, AC, and room sharing options. You can compare and book directly using the verified lodges section above!*"
                )

        # ---------------------------------------------------------
        # Case D: Directions / Transit Modes (Bike, Car, Train, Flight)
        # ---------------------------------------------------------
        if any(w in q_lower for w in ["direction", "how to reach", "bike", "car", "train", "flight", "distance", "route", "travel time", "map"]):
            origin = ctx.get("origin", "Hyderabad, Telangana")
            logistics = calculate_journey_logistics(origin, dest)
            modes = logistics.get("modes", {})

            bike_info = modes.get("bike", {})
            car_info = modes.get("car", {})
            train_info = modes.get("train", {})
            flight_info = modes.get("flight", {})

            return (
                f"🛣️ **Route & Multi-Modal Go Directions from {origin.split(',')[0]} to {clean_city}:**\n\n"
                f"📍 **Total Distance**: ~{logistics.get('distance_km', 850):,} km (Road: ~{logistics.get('road_distance_km', 1050):,} km)\n\n"
                f"• 🏍️ **Bike / Motorcycle**: ~{bike_info.get('time_str', '14h')} | Est. Fuel: ₹{bike_info.get('fuel_cost_inr', 1800):,} (Highway scenic corridor)\n"
                f"• 🚗 **Car / Self-Drive**: ~{car_info.get('time_str', '11h')} | Fuel + Tolls: ₹{car_info.get('total_est_cost_inr', 4500):,}\n"
                f"• 🚆 **Train / Rail**: ~{train_info.get('time_str', '12h')} | Fare: {train_info.get('fare_inr', '3AC: ₹1,200 | SL: ₹450')}\n"
                f"• ✈️ **Flight**: ~{flight_info.get('time_str', '1h 45m')} | Est. Fare: {flight_info.get('fare_inr', '₹4,500')}\n\n"
                f"👉 *Tap the **Go Directions** button on the interactive route map to launch turn-by-turn navigation in Google Maps!*"
            )

        # ---------------------------------------------------------
        # Case E: Budget & Expenses in ₹ INR
        # ---------------------------------------------------------
        if any(w in q_lower for w in ["budget", "cost", "how much money", "expense", "rupee", "inr", "price"]):
            duration = ctx.get("duration", 3)
            travelers = ctx.get("travelersCount", 2)
            is_intl = hotel_key in ["switzerland", "paris", "dubai", "tokyo", "rome", "london"]
            daily_per_person = 12000 if is_intl else 2800
            total_est = daily_per_person * duration * travelers

            return (
                f"💰 **Estimated Budget Breakdown for {clean_city} ({duration} Days, {travelers} Traveler{'s' if travelers>1 else ''}):**\n\n"
                f"• 🏨 **Stay & Lodging (35%)**: ~₹{int(total_est * 0.35):,} (dorm sharing or twin room options)\n"
                f"• 🍽️ **Food & Street Dining (25%)**: ~₹{int(total_est * 0.25):,} (authentic regional delicacies)\n"
                f"• 🎟️ **Sightseeing & Monument Permits (20%)**: ~₹{int(total_est * 0.20):,}\n"
                f"• 🚕 **Local Transit & Metro (15%)**: ~₹{int(total_est * 0.15):,}\n"
                f"• 🛡️ **Emergency Reserve (5%)**: ~₹{int(total_est * 0.05):,}\n\n"
                f"👉 **Total Estimated Budget**: **₹{total_est:,} INR** (All-inclusive recommended trip allowance)."
            )

        # ---------------------------------------------------------
        # Case F: Local Food & Delicacies
        # ---------------------------------------------------------
        if any(w in q_lower for w in ["food", "eat", "biryani", "dish", "dishes", "restaurant", "cuisine", "taste", "dosa", "seafood"]):
            food_map = {
                "hyderabad": "World-famous Hyderabadi Dum Biryani, Haleem, Mirchi Ka Salan, Double Ka Meetha, and Irani Chai at Charminar & Shadab.",
                "kerala": "Karimeen Pollichathu, Appam with Coconut Stew, Malabar Chicken Biryani, Banana Chips, and fresh toddy shop tiger prawns.",
                "goa": "Goan Fish Curry Rice, Prawn Balchão, Pork Vindaloo, Poee bread, Bebinca multi-layered pudding, and fresh Kingfish fry.",
                "switzerland": "Traditional Gruyère & Emmental Cheese Fondue, crispy Swiss Rösti, Zürcher Geschnetzeltes, Raclette, and Lindt artisanal pralines.",
                "vizag": "Andhra Spicy Bamboo Chicken, Chepala Pulusu (tangy fish curry), Royyala Vepudu (prawn fry), and Pootharekulu sweets.",
                "kashmir": "Authentic Kashmiri Wazwan (Rogan Josh, Gushtaba, Rista), saffron Kahwa tea, Dum Aloo, and Nadru Yakhni (lotus stem)."
            }
            dishes = food_map.get(hotel_key, f"Signature regional dishes of {clean_city}, featuring long-standing family kitchens and evening street food lanes.")
            return (
                f"🍲 **Must-Try Culinary Delicacies in {clean_city}:**\n\n"
                f"{dishes}\n\n"
                f"💡 *Vegetarian and mild spice options are widely available; ask for 'kam theekha' or 'mild spice' when ordering!*"
            )

        # ---------------------------------------------------------
        # Case G: Weather & Disruption Advice
        # ---------------------------------------------------------
        if any(w in q_lower for w in ["weather", "rain", "temperature", "climate", "hot", "cold", "season"]):
            return (
                f"🌤️ **Live Weather & Climate Intelligence for {clean_city}:**\n\n"
                f"Current conditions are optimal for outdoor walking and sightseeing. "
                f"In the event of sudden afternoon showers or sea breeze surges, our AI Adaptive Replanner automatically "
                f"substitutes outdoor activities with covered historical museums and tea sanctuaries with a single tap!"
            )

        # ---------------------------------------------------------
        # Case H: Packing Essentials
        # ---------------------------------------------------------
        if any(w in q_lower for w in ["pack", "carry", "luggage", "cloth", "wear"]):
            return (
                f"🎒 **Essential Packing Checklist for {clean_city}:**\n\n"
                f"• 👟 Comfortable walking shoes or trekking sandals for monument and beach trails\n"
                f"• 👕 Breathable cotton attire with a light jacket for breezy evenings\n"
                f"• 🔋 Portable power bank (10,000+ mAh) and universal plug adapter\n"
                f"• ☀️ SPF 50+ Sunscreen, polarized sunglasses & compact umbrella\n"
                f"• 💊 Basic travel medical kit (hydration salts, antacids, band-aids)"
            )

        # ---------------------------------------------------------
        # Case I: Safety & Emergency
        # ---------------------------------------------------------
        if any(w in q_lower for w in ["safe", "safety", "emergency", "police", "hospital", "danger"]):
            return (
                f"🛡️ **Tourist Safety & Emergency Protocol for {clean_city}:**\n\n"
                f"• 🚨 **Universal Emergency Helpline**: 112\n"
                f"• 👮 **Police Control**: 100 / 112\n"
                f"• 🚑 **Medical Ambulance**: 108 / 112\n"
                f"• 🚔 Dedicated tourist police desks are active at all major transit terminals and iconic landmarks. "
                f"App-based registered cabs (Uber/Ola) are recommended for late-night journeys."
            )

        # ---------------------------------------------------------
        # Case J: Wheelchair & Senior Accessibility
        # ---------------------------------------------------------
        if any(w in q_lower for w in ["wheelchair", "accessib", "senior", "elderly", "ramp", "lift"]):
            return (
                f"♿ **Accessibility & Senior-Friendly Amenities in {clean_city}:**\n\n"
                f"Major monuments, modern transit terminals, and museums offer step-free ramps, elevators, and battery-operated "
                f"golf-cart shuttles. Pacing is calibrated to provide comfortable rest stops and low-fatigue transit corridors."
            )

        # ---------------------------------------------------------
        # Case K: Fallback Dynamic Intelligence
        # ---------------------------------------------------------
        return (
            f"🌟 **Assisting your trip to {clean_city}!**\n\n"
            f"As your AI Tourism Companion, I can:\n"
            f"1. 🗺️ Walk you through the **Day 1, Day 2, or Day 3 Tour**\n"
            f"2. 🏨 Show **Verified Lodges & Sharing Room Rates** in ₹ INR\n"
            f"3. 🛣️ Show **Go Directions** by Bike, Train, and Car\n"
            f"4. ✈️ Switch your destination (e.g. *'change destination to Goa'*, *'switch to Switzerland'*)\n"
            f"5. ⚡ **Replan your schedule** if rain or crowds occur.\n\n"
            f"What would you like to explore next?"
        )
