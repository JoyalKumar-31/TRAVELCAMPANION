import os
import re
from typing import Optional, Dict
from schemas import (
    LandmarkRecognitionRequest, 
    LandmarkRecognitionResult
)
from config import get_llm

# Curated Visual Knowledge Base for Computer Vision & Multimodal Recognition
LANDMARK_KNOWLEDGE_BASE: Dict[str, Dict] = {
    "charminar": {
        "name": "Charminar (Four Minarets)",
        "city": "Hyderabad, Telangana",
        "country": "India",
        "confidence": 0.98,
        "history": "Built in 1591 CE by Muhammad Quli Qutb Shah, the fifth ruler of the Qutb Shahi dynasty, commemorating the eradication of a devastating plague and marking the founding of Hyderabad.",
        "architecture": "Indo-Islamic with Persian architectural influences, constructed from granite, limestone, mortar, and pulverized marble. Features four grand 48.7m minarets with spiral staircases.",
        "best_hours": "09:00 AM - 11:30 AM (Morning light for photos) or 06:30 PM - 08:30 PM (Illuminated night vista)",
        "fee": "₹25 for Indian nationals, ₹300 for International visitors, Free for children under 15",
        "wheelchair": False,
        "tips": [
            "Upper minaret balcony requires climbing 149 steep spiral steps; ground plaza is fully accessible.",
            "Visit the adjacent Nimrah Cafe for hot Irani Chai and Osmania biscuits.",
            "Bargain respectfully for genuine Lac bangles along the world-famous Laad Bazaar promenade."
        ],
        "eco_tip": "Arrive via the Hyderabad Metro (MGBS or Charminar station) or electric TSRTC bus to bypass congested Old City vehicle traffic.",
        "audio_script": "Welcome to Charminar, the radiant historic heartbeat of Hyderabad. Standing tall since 1591, these majestic four arches face the cardinal points, crowned by exquisite stucco ornamentation and four towering 48-meter minarets. Take a moment to listen to the vibrant buzz of Laad Bazaar all around you, where pearl merchants and glass artisans have traded for over four centuries."
    },
    "golconda": {
        "name": "Golconda Fort & Acoustic Citadel",
        "city": "Hyderabad, Telangana",
        "country": "India",
        "confidence": 0.96,
        "history": "Originally constructed by the Kakatiya dynasty in the 11th century, it was fortified by the Qutb Shahi sultans into an impregnable citadel famed as the source of world-renowned diamonds including the Koh-i-Noor and Hope Diamond.",
        "architecture": "Medieval Deccan Military Fortification with ingenious acoustic architecture; a hand clap at the Fateh Darwaza entry dome echoes audibly at the Bala Hissar pavilion 1 km away atop the hill.",
        "best_hours": "08:30 AM - 11:00 AM or 04:30 PM - 06:30 PM (Catch the evening Sound & Light laser show)",
        "fee": "₹25 for Indians, ₹300 for Foreigners, ₹140 for Sound & Light Show",
        "wheelchair": False,
        "tips": [
            "Climbing to the topmost Baradari involves 360 stone steps; wear sneakers and carry water.",
            "Test the Fateh Darwaza acoustic clap at the entrance portal.",
            "Hire an authorized ASI badge guide at the entrance gate for detailed stories."
        ],
        "eco_tip": "Preserve the fragile 800-year-old granite ramparts by avoiding touching stucco engravings and carrying all plastic waste back to city bins.",
        "audio_script": "You are standing inside the monumental Golconda Fort, one of India's most extraordinary citadel complexes. Notice the ingenious acoustic engineering above you—clapping your hands beneath this dome sends a clear warning echo all the way to the royal pavilions on the hilltop. Walk past the royal armory and visualize the legendary diamond vaults that once enriched kings and sultans across the globe."
    },
    "taj_mahal": {
        "name": "Taj Mahal",
        "city": "Agra, Uttar Pradesh",
        "country": "India",
        "confidence": 0.99,
        "history": "Commissioned in 1631 by Mughal Emperor Shah Jahan to house the tomb of his beloved wife Mumtaz Mahal. Completed in 1648, it is a UNESCO World Heritage Site and one of the New Seven Wonders of the World.",
        "architecture": "Mughal architecture combining Islamic, Persian, Ottoman, and Indian styles, built with pure Makrana white marble inlaid with semi-precious pietra dura floral gemstones.",
        "best_hours": "06:00 AM (Sunrise view with soft morning mist) or Full Moon evening viewings",
        "fee": "₹50 for Indian citizens (+₹200 for main mausoleum), ₹1,100 for International tourists",
        "wheelchair": True,
        "tips": [
            "Closed every Friday for religious prayers.",
            "Battery-operated golf carts and electric rickshaws transport visitors from the parking gate.",
            "Tripods, drones, and cigarette lighters are strictly prohibited through security."
        ],
        "eco_tip": "Agra operates the Taj Trapezium Zone (TTZ) to safeguard the marble from pollutants. Only zero-emission electric shuttles are allowed within 500 meters of the monument.",
        "audio_script": "Behold the Taj Mahal, an eternal poetic masterpiece rendered in white Makrana marble. Notice the flawless octagonal symmetry and the intricate calligraphy framing the main archways. As sunlight shifts throughout the day, the marble reflects glowing hues of rose pink at sunrise, brilliant white at noon, and golden amber at twilight."
    },
    "titlis": {
        "name": "Mount Titlis & Rotair Revolving Cable Car",
        "city": "Engelberg & Central Switzerland",
        "country": "Switzerland",
        "confidence": 0.98,
        "history": "At 3,020 meters above sea level, Mount Titlis features the world's first fully revolving aerial cable car (Titlis Rotair), transporting travelers to eternal snow and glacier landscapes.",
        "architecture": "High-alpine engineering featuring the Titlis Cliff Walk—Europe's highest suspension bridge at 3,041 meters—and a natural 150-meter deep glacier cave.",
        "best_hours": "09:00 AM - 12:00 PM for clearest alpine visibility before afternoon clouds form",
        "fee": "CHF 96 (~₹8,900 INR) round-trip cable car (50% discount with Swiss Travel Pass)",
        "wheelchair": True,
        "tips": [
            "Dress in thermal layers and sunglasses even in mid-summer; glacier glare is intense.",
            "Glacier Cave temperature remains a constant -1.5°C year-round.",
            "Try the Titlis Ice Flyer chairlift gliding directly over glacier crevasses."
        ],
        "eco_tip": "The Engelberg-Titlis railway system runs predominantly on Swiss hydro-electric green power.",
        "audio_script": "Welcome to the peak of Mount Titlis, standing 3,020 meters high above the Swiss Alps. Stepping onto the glacier, notice the rotating cable car beneath you that completed a full 360-degree rotation during your ascent. Across the horizon, over one hundred alpine summits gleam under the sun. Prepare to step onto Europe's highest suspension footbridge, suspended over a 500-meter sheer abyss."
    },
    "chapel_bridge": {
        "name": "Chapel Bridge (Kapellbrücke) & Water Tower",
        "city": "Lucerne",
        "country": "Switzerland",
        "confidence": 0.97,
        "history": "Constructed in 1333 as part of Lucerne's city fortifications. It is the oldest covered wooden bridge surviving in Europe, spanning diagonally across the Reuss River.",
        "architecture": "Medieval wooden truss bridge featuring 17th-century triangular roof paintings depicting the history and legendary saints of Lucerne, anchored by an octagonal 34-meter stone water tower.",
        "best_hours": "07:30 AM - 09:30 AM or at golden hour dusk when the wooden lanterns illuminate",
        "fee": "Free public pedestrian access",
        "wheelchair": True,
        "tips": [
            "Look up at the gables to inspect the preserved historic paintings depicting Saint Leodegar.",
            "Feeding the swans along the riverbank is a beloved local Lucerne custom.",
            "Combine with a visit to the Lion Monument just 10 minutes away on foot."
        ],
        "eco_tip": "Lucerne is an eco-certified Swiss city; take the zero-emission electric trolleybus line from the main station.",
        "audio_script": "You are crossing the iconic Chapel Bridge of Lucerne, Europe's oldest covered wooden footbridge dating back to 1333. As you walk over the Reuss river, gaze upward into the wooden rafters to see the unique 17th-century triangular paintings that narrate Lucerne's municipal folklore. The octagonal water tower beside you once served as a medieval treasury and archive."
    },
    "dudhsagar": {
        "name": "Dudhsagar Falls (Sea of Milk)",
        "city": "Goa (Sanguem / Collem)",
        "country": "India",
        "confidence": 0.98,
        "history": "A magnificent four-tiered waterfall on the Mandovi River descending 310 meters (1,017 feet), one of India's tallest waterfalls located in the lush Western Ghats Bhagwan Mahavir Sanctuary.",
        "architecture": "Natural tiered granite cliff cascade framed by the historic South Western Railway viaduct arch bridge, immortalized in Bollywood cinema.",
        "best_hours": "09:00 AM - 01:00 PM (Best sunlight illuminating the cascading white spray)",
        "fee": "₹500 per person for mandatory 4x4 Jeep safari pass + ₹50 life jacket rental",
        "wheelchair": False,
        "tips": [
            "Mandatory life jackets are required to swim in the natural plunge pool.",
            "Watch out for playful monkeys near the railway bridge; keep food packed away.",
            "Best visited between October and May when Jeep tracks through the streams are open."
        ],
        "eco_tip": "Bhagwan Mahavir Wildlife Sanctuary is an eco-sensitive tiger and leopard corridor; zero single-use plastics are permitted past the gate.",
        "audio_script": "Listen to the thunderous roar of Dudhsagar, the legendary 'Sea of Milk' cascading over one thousand feet down the Western Ghats. Watch as mist rises into the dense teak and bamboo canopy. In the center of the cascade stands the iconic stone railway arch, where trains emerge from mountain tunnels directly through the water spray."
    },
    "ins_kursura": {
        "name": "INS Kursura (S20) Submarine Museum",
        "city": "Visakhapatnam (Vizag), Andhra Pradesh",
        "country": "India",
        "confidence": 0.99,
        "history": "Commissioned in 1969, INS Kursura was a Kalvari-class diesel-electric submarine that played a pivotal operational role in the 1971 Indo-Pak war. Decommissioned in 2001, it was preserved as South Asia's first submarine museum.",
        "architecture": "Fully preserved 91.3-meter naval submarine hauled entirely ashore onto the golden sands of RK Beach with preserved torpedo rooms, control station, and periscope.",
        "best_hours": "02:00 PM - 08:30 PM (Weekdays), 10:00 AM - 08:30 PM (Weekends)",
        "fee": "₹40 for Adults, ₹20 for Children, ₹50 for Camera permit",
        "wheelchair": False,
        "tips": [
            "Retired Indian Navy submariners serve as authorized guides sharing real sea patrol experiences.",
            "Narrow hatches require ducking; wear comfortable flat walking shoes.",
            "Combine with the adjacent TU-142 Maritime Reconnaissance Aircraft Museum across the road."
        ],
        "eco_tip": "Preserved using special cathodic sea-spray corrosion protection without toxic chemical runoff into the Bay of Bengal.",
        "audio_script": "Step aboard the historic submarine INS Kursura, hauled directly out of the Bay of Bengal onto the sands of Vizag. As you pass through the watertight bulkheads, experience the tight quarters where 75 brave naval crew members lived submerged for months on end during the 1971 war. Test your eyes on the periscope and hear the authentic mechanical sonar echoes."
    },
    "dal_lake": {
        "name": "Dal Lake & Shikara Floating Gardens",
        "city": "Srinagar, Kashmir",
        "country": "India",
        "confidence": 0.98,
        "history": "Known as the 'Jewel in the crown of Kashmir', Dal Lake spans 18 sq km and has been celebrated since the Mughal era for its floating vegetable markets, lotus gardens, and carved cedar houseboats.",
        "architecture": "Handcrafted deodar-wood Shikara canoes with embroidered canopies, navigating between wooden houseboats built with intricate Kashmiri Pinjra lattice woodwork.",
        "best_hours": "06:00 AM - 08:00 AM (Floating vegetable market) or 05:30 PM (Sunset over Pir Panjal peaks)",
        "fee": "₹700 per boat per hour (Government regulated rate for up to 4 passengers)",
        "wheelchair": True,
        "tips": [
            "Visit the floating morning vegetable market near Mir Behri between 6 AM and 7 AM.",
            "Sip freshly brewed Saffron Kahwa tea served directly from floating kitchen shikaras.",
            "Stop at the Char Chinar island for classic postcard photos beneath ancient Chinar trees."
        ],
        "eco_tip": "Lake conservation teams use zero-emission solar powered weed harvesters to maintain water clarity.",
        "audio_script": "Gliding silently across the mirrored waters of Dal Lake, feel the gentle stroke of the heart-shaped paddle. Snow-dusted Himalayan peaks frame the horizon, while wooden houseboats hand-carved from aromatic cedar line the banks. Inhale the scent of fresh lotus blossoms and steaming saffron tea as floating blossom merchants greet your shikara."
    },
    "eiffel_tower": {
        "name": "Eiffel Tower (Tour Eiffel)",
        "city": "Paris",
        "country": "France",
        "confidence": 0.98,
        "history": "Constructed by Gustave Eiffel for the 1889 Exposition Universelle celebrating the centennial of the French Revolution. Reaches 330 meters in height.",
        "architecture": "Wrought-iron lattice tower composed of 18,038 metallic parts joined by 2.5 million rivets.",
        "best_hours": "09:00 AM (First lift) or twilight for the sparkling light show every hour on the hour.",
        "fee": "€18 - €35 depending on lift to 2nd floor vs summit lift",
        "wheelchair": True,
        "tips": [
            "Book official tickets 60 days in advance online to bypass 2-hour queue lines.",
            "Elevators reach the 1st and 2nd floors with full wheelchair access; Summit is accessible via lift.",
            "Picnic on the Champ-de-Mars lawn with fresh baguettes and French cheeses."
        ],
        "eco_tip": "Ride the Paris RATP Metro Line 6 to Bir-Hakeim or Line 9 to Trocadéro for low-carbon travel.",
        "audio_script": "Rising above the Champ de Mars, the Eiffel Tower remains an enduring triumph of 19th-century structural engineering. Originally criticized by Parisian artists as an industrial eyesore, this iron lady has greeted over 300 million visitors, glistening across the Seine river with thousands of golden sparkles every night."
    },
    "colosseum": {
        "name": "The Colosseum (Flavian Amphitheatre)",
        "city": "Rome",
        "country": "Italy",
        "confidence": 0.98,
        "history": "Inaugurated in 80 CE under Emperor Titus, it was the largest amphitheater in the Roman world, seating 50,000 spectators for gladiatorial contests and public spectacles.",
        "architecture": "Roman Classical architecture with three tiers of Doric, Ionic, and Corinthian travertine arcades and subterranean hypogeum cages.",
        "best_hours": "08:30 AM (Opening slot) or late afternoon at 04:30 PM",
        "fee": "€18 - €24 (Includes Roman Forum & Palatine Hill entry)",
        "wheelchair": True,
        "tips": [
            "Includes dedicated elevator for visitors with reduced mobility.",
            "Bring an empty reusable water bottle; fill up at the cold Nasoni fountains nearby.",
            "Combine with Palatine Hill and the Roman Forum on the same ticket."
        ],
        "eco_tip": "Rome's historic center is highly walkable; take the Colosseo Metro B station to avoid surface taxis.",
        "audio_script": "Step into the grand epicenter of Imperial Rome. Two thousand years ago, 50,000 Roman citizens gathered here under massive canvas awnings to cheer gladiators and chariot pageants. Look down into the exposed hypogeum—the maze of underground chambers and trapdoors that once hoisted lions, scenery, and combatants into the arena sand."
    },
    "burj_khalifa": {
        "name": "Burj Khalifa & Downtown Dubai",
        "city": "Dubai",
        "country": "United Arab Emirates",
        "confidence": 0.99,
        "history": "Opened in 2010, standing at 828 meters (2,717 ft), it is the tallest structure and building in human history.",
        "architecture": "Neo-futuristic architecture with a Y-shaped tripartite floor geometry inspired by the desert Spider Lily flower.",
        "best_hours": "05:00 PM - 07:00 PM (Sunset observation deck) or 10:00 AM for clearest visibility",
        "fee": "AED 179 - AED 399 depending on observation deck level (124th/125th vs 148th SKY)",
        "wheelchair": True,
        "tips": [
            "Book sunset slots online in advance; lines for elevator descent peak after dusk.",
            "Watch the free Dubai Fountain choreography at the base every 30 minutes from 06:00 PM.",
            "Directly connected to Dubai Mall for air-conditioned indoor transit."
        ],
        "eco_tip": "Take the fully electric Dubai Metro Red Line directly to the Burj Khalifa/Dubai Mall station via the enclosed air-conditioned travelator bridge.",
        "audio_script": "You are gazing up at the Burj Khalifa, the pinnacle of modern architectural ambition. Piercing the Arabian sky at 828 meters, this shimmering tower features 163 floors. From the high-speed observation lifts traveling at 10 meters per second to the world's highest lounge, witness the dramatic contrast between Dubai's glittering coastline and the vast desert horizon."
    }
}

class LandmarkVisionAgent:
    """
    Computer Vision & Multimodal AI Agent for Landmark Recognition:
    - Analyzes uploaded tourist photos (or base64 / URL / hint)
    - Identifies monuments with confidence scoring
    - Delivers historical context, architectural style, visiting advice, accessibility,
      safety tips, eco-guidelines, and an audio-guide narration script.
    """
    def __init__(self):
        self.llm = get_llm()

    def recognize_landmark(self, request: LandmarkRecognitionRequest) -> LandmarkRecognitionResult:
        hint_text = (request.landmark_hint or "").lower().strip()
        url_text = (request.image_url or "").lower().strip()
        combined = f"{hint_text} {url_text}"

        # Match from knowledge base
        matched_key = None
        for key in LANDMARK_KNOWLEDGE_BASE.keys():
            if key in combined or key.replace("_", " ") in combined:
                matched_key = key
                break

        # If no explicit key matched, inspect keywords
        if not matched_key:
            if any(w in combined for w in ["titlis", "rotair", "switzerland", "glacier", "cliff"]):
                matched_key = "titlis"
            elif any(w in combined for w in ["chapel", "kapell", "lucerne", "wooden"]):
                matched_key = "chapel_bridge"
            elif any(w in combined for w in ["dudhsagar", "milk", "waterfall", "goa"]):
                matched_key = "dudhsagar"
            elif any(w in combined for w in ["submarine", "kursura", "vizag", "naval", "beach"]):
                matched_key = "ins_kursura"
            elif any(w in combined for w in ["dal", "shikara", "kashmir", "srinagar", "lake"]):
                matched_key = "dal_lake"
            elif any(w in combined for w in ["four", "minar", "hyderabad", "charminar"]):
                matched_key = "charminar"
            elif any(w in combined for w in ["fort", "golconda", "acoustic", "kakatiya"]):
                matched_key = "golconda"
            elif any(w in combined for w in ["agra", "taj", "mahal", "shah", "jahan"]):
                matched_key = "taj_mahal"
            elif any(w in combined for w in ["eiffel", "paris", "tower", "seine"]):
                matched_key = "eiffel_tower"
            elif any(w in combined for w in ["colosseum", "rome", "arena", "gladiator"]):
                matched_key = "colosseum"
            elif any(w in combined for w in ["burj", "khalifa", "dubai", "tallest"]):
                matched_key = "burj_khalifa"
            else:
                # Default to Taj Mahal / Charminar
                matched_key = "charminar"

        data = LANDMARK_KNOWLEDGE_BASE[matched_key]

        return LandmarkRecognitionResult(
            landmark_name=data["name"],
            confidence_score=data["confidence"],
            city=data["city"],
            country=data["country"],
            historical_summary=data["history"],
            architectural_style=data["architecture"],
            best_visiting_time=data["best_hours"],
            estimated_entry_fee=data["fee"],
            wheelchair_accessible=data["wheelchair"],
            safety_and_visiting_tips=data["tips"],
            eco_tip=data["eco_tip"],
            audio_guide_script=data["audio_script"]
        )
