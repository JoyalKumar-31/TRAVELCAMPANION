from typing import Dict, List, Tuple
from schemas import EcoScore, SafetyInfo, EmergencyResponse
from config import get_llm

class SafetyEcoAgent:
    """
    Evaluates sustainability, green transit impact, tourist safety indices, 
    and authentic culinary highlights with real regional gastronomy.
    """
    def __init__(self):
        pass

    def generate_safety_and_eco(self, destination: str) -> Tuple[SafetyInfo, EcoScore, List[str]]:
        dest_lower = destination.lower()
        
        if "hyderabad" in dest_lower or "charminar" in dest_lower or "telangana" in dest_lower:
            safety = SafetyInfo(
                safety_rating="High (Metro City with 24x7 SHE Teams Surveillance)",
                emergency_contacts={
                    "Universal Emergency": "112",
                    "Hyderabad City Police": "100",
                    "Telangana Tourist Police": "+91-40-23450444",
                    "SHE Teams (Women Safety)": "+91-9490616555",
                    "Medical Ambulance": "108"
                },
                advisories=[
                    "Pre-paid auto counters and app-based cabs (Uber/Ola/Rapido) are recommended from major railway terminals.",
                    "Historical monuments like Charminar and Golconda Fort have designated footwear and locker desks.",
                    "Peak afternoon heat in summer (March-May) can be intense; carry hydration."
                ]
            )
            eco = EcoScore(
                score=88,
                green_transport_percent=82,
                eco_friendly_attractions=8,
                recommendations=[
                    "Use the Hyderabad Metro Rail network spanning Red, Blue, and Green corridors for zero-emission travel.",
                    "Take TSRTC electric AC buses across the IT and heritage corridors.",
                    "Visit biodiversity parks and green reserves around Durgam Cheruvu."
                ]
            )
            food = [
                "Authentic Hyderabadi Mutton Dum Biryani with Mirchi ka Salan & Dahi Chutney (Hotel Shadab / Bawarchi)",
                "Rich slow-cooked Hyderabadi Haleem garnished with fried onions, cashews, and lemon",
                "Nimrah Irani Chai with hot Osmania Biscuits and Chandrakala pastries",
                "Pathar Ka Gosht (Spiced mutton seared on wide granite stone slabs)",
                "Decadent Double ka Meetha (Saffron cardamom bread pudding) & Qubani ka Meetha (Stewed apricot sweet)"
            ]
            return safety, eco, food

        elif "vizag" in dest_lower or "visakhapatnam" in dest_lower or "araku" in dest_lower or "andhra" in dest_lower:
            safety = SafetyInfo(
                safety_rating="High (One of the cleanest and safest coastal naval cities in India)",
                emergency_contacts={
                    "Universal Emergency": "112",
                    "Vizag City Police Control": "100 / 0891-2565454",
                    "Andhra Tourist Helpline": "1800-425-4545",
                    "Disha Women Emergency Helpline": "112 / 181",
                    "Medical Ambulance": "108"
                },
                advisories=[
                    "Only swim in designated swimming zones with lifeguard flags on Rushikonda Beach; avoid deep sea rip currents at RK Beach.",
                    "In Araku Valley ghat roads, travel before sunset to avoid mountain mist and hair-pin turns.",
                    "Light cottons and beach sun protection are ideal throughout the year."
                ]
            )
            eco = EcoScore(
                score=91,
                green_transport_percent=80,
                eco_friendly_attractions=9,
                recommendations=[
                    "Rushikonda is an internationally certified eco-friendly Blue Flag beach with zero-litter policies.",
                    "Support native tribal farmers in Araku by buying shade-grown organic Arabica coffee.",
                    "Take the scenic Vistadome glass-roof electric train journey from Vizag to Araku Valley through 58 mountain tunnels."
                ]
            )
            food = [
                "Authentic Coastal Andhra Royyala Vepudu (Spicy dry-roasted prawn pepper fry)",
                "Chepala Pulusu (Traditional coastal fish curry simmered in tangy tamarind gravy)",
                "Araku Valley Bongu Chicken (Tender country chicken cooked inside wild green bamboo stalks with forest spices)",
                "Andhra Meals Thali with Gongura Pachadi, Pulihora, spicy Podi, and hot Ghee",
                "Vizag Beachfront Hot Mirchi Bajji with crushed roasted onions and Andhra lemon seasoning"
            ]
            return safety, eco, food

        elif "bengaluru" in dest_lower or "bangalore" in dest_lower or "karnataka" in dest_lower:
            safety = SafetyInfo(
                safety_rating="High (Cosmopolitan Tech Hub with Dedicated Tourist Police)",
                emergency_contacts={
                    "Universal Emergency": "112",
                    "Bengaluru City Police": "100",
                    "Karnataka Tourist Assistance": "+91-80-22352828",
                    "Ambulance": "108"
                },
                advisories=[
                    "Use Namma Metro to avoid peak-hour surface traffic between Silk Board, Indiranagar, and Whitefield.",
                    "Evenings can get chilly or catch sudden showers; keep a light jacket or umbrella.",
                    "Autos should run by meter or booked through trusted ride apps."
                ]
            )
            eco = EcoScore(
                score=87,
                green_transport_percent=84,
                eco_friendly_attractions=8,
                recommendations=[
                    "Use Namma Metro and electric BMTC green buses spanning all major hubs.",
                    "Explore extensive pedestrian-friendly green zones in Cubbon Park and Lalbagh.",
                    "Patronize zero-waste local cafes and farm-to-table eateries in Indiranagar and Koramangala."
                ]
            )
            food = [
                "Crispy Benne Masala Dosa with spicy coconut chutney (CTR / Vidyarthi Bhavan)",
                "Steaming hot Bisi Bele Bath with boondi and homemade ghee",
                "Fresh aromatic Tumbler Filter Coffee (Kaapi)",
                "Melt-in-mouth Mysore Pak from iconic sweet houses"
            ]
            return safety, eco, food

        elif "chennai" in dest_lower or "tamil nadu" in dest_lower or "mahabalipuram" in dest_lower:
            safety = SafetyInfo(
                safety_rating="High (Ranked among the safest metropolitan cities for solo travelers)",
                emergency_contacts={
                    "Universal Emergency": "112",
                    "Chennai Police": "100",
                    "Tamil Nadu Tourist Helpline": "+91-44-25383333",
                    "Ambulance": "108"
                },
                advisories=[
                    "Hydrate well during humid coastal months (April-June).",
                    "Dress respectfully when visiting working Hindu temples like Kapaleeshwarar.",
                    "Swimming in Marina Beach waters is prohibited due to dangerous rip currents."
                ]
            )
            eco = EcoScore(
                score=85,
                green_transport_percent=80,
                eco_friendly_attractions=8,
                recommendations=[
                    "Take Chennai Metro and suburban electric trains connecting Central, Egmore, and the airport.",
                    "Buy genuine handloom silks certified with Silk Mark in Kanchipuram and Mylapore.",
                    "Enjoy coastal heritage walking trails in Mahabalipuram."
                ]
            )
            food = [
                "Fluffy steamed Idlis and crunchy Medu Vadas with 4 chutneys (Murugan Idli Shop)",
                "Authentic Chettinad Pepper Chicken / Paneer Gravy with hot Parottas",
                "Traditional Mylapore Degree Filter Kaapi",
                "Marina Beach Sundal (Warm spiced tempered chickpeas with fresh raw mango)"
            ]
            return safety, eco, food

        elif "mumbai" in dest_lower or "bombay" in dest_lower or "maharashtra" in dest_lower:
            safety = SafetyInfo(
                safety_rating="High (The City That Never Sleeps - Highly Safe for Solo & Late Travelers)",
                emergency_contacts={
                    "Universal Emergency": "112",
                    "Mumbai Police": "100",
                    "Tourist Helpline": "+91-22-22074333",
                    "Ambulance": "108"
                },
                advisories=[
                    "Avoid traveling on Mumbai Local suburban trains during peak office hours (8:30-10:30 AM, 6:00-8:30 PM).",
                    "Metered Black-and-Yellow (Kaali-Peeli) taxis and auto-rickshaws strictly operate by digital meters.",
                    "Monsoon months (July-August) can cause localized waterlogging; track weather advisories."
                ]
            )
            eco = EcoScore(
                score=86,
                green_transport_percent=88,
                eco_friendly_attractions=7,
                recommendations=[
                    "Use the expanding Mumbai Metro lines and Mumbai local electric trains for eco-friendly transit.",
                    "Take electric BEST buses across South Mumbai heritage circuits.",
                    "Participate in community beach cleanups at Girgaon Chowpatty and Versova."
                ]
            )
            food = [
                "Hot Mumbai Vada Pav with dry garlic red chutney and fried green chili",
                "Buttery Pav Bhaji with chopped onions and lemon on Girgaon Chowpatty",
                "Crispy Bombil (Bombay Duck) Fry & Malvani Crab Masala",
                "Creamy Bun Maska and Parsi Akuri with Irani Chai at iconic heritage cafes"
            ]
            return safety, eco, food

        elif "kerala" in dest_lower or "alappuzha" in dest_lower or "kochi" in dest_lower or "alleppey" in dest_lower or "allapuza" in dest_lower or "munnar" in dest_lower:
            safety = SafetyInfo(
                safety_rating="High (Ranked top state for tourist safety and public health in India)",
                emergency_contacts={
                    "Emergency Response Support (National)": "112",
                    "Kerala Police Helpline": "100 / 112",
                    "Medical Ambulance (Free)": "108",
                    "Kerala Tourist Police Assistance": "+91-484-2215640",
                    "Women Helpline": "1091"
                },
                advisories=[
                    "Backwater boat cruises operate under official safety certification and lifejacket mandates.",
                    "Light breathable cotton clothing is recommended for coastal humidity.",
                    "Monsoon seasons (June-Aug) bring heavy tropical rains; carry sturdy umbrellas."
                ]
            )
            eco = EcoScore(
                score=95,
                green_transport_percent=86,
                eco_friendly_attractions=9,
                recommendations=[
                    "Ride the state water transport solar-powered ferries across Vembanad Lake.",
                    "Support certified eco-responsible backwater homestays and coir artisan villages.",
                    "Carry reusable water containers; Kerala resorts provide filtered rain-harvested water."
                ]
            )
            food = [
                "Karimeen Pollichathu (Spiced pearl spot fish wrapped & pan-roasted in banana leaves)",
                "Fluffy Appams with creamy coconut vegetable or chicken stew",
                "Grand Kerala Vegetarian Sadya with 24 traditional dishes and Payasam",
                "Fresh Malabar Parotta with roasted pepper beef or paneer masala",
                "Alleppey Backwater Tiger Prawn & Crab Roast in coconut oil"
            ]
            return safety, eco, food
        elif "goa" in dest_lower:
            safety = SafetyInfo(
                safety_rating="High (Popular Coastal Tourism Destination)",
                emergency_contacts={
                    "Universal Emergency": "112",
                    "Tourist Police Goa": "+91-832-2419080",
                    "Ambulance": "108"
                },
                advisories=[
                    "Only swim in designated beach zones monitored by Drishti Marine lifeguards.",
                    "Rent certified two-wheelers with official yellow license plates and always wear helmets.",
                    "Avoid isolated beach stretches late at night."
                ]
            )
            eco = EcoScore(
                score=82,
                green_transport_percent=72,
                eco_friendly_attractions=7,
                recommendations=[
                    "Rent electric scooters available across Panaji and North Goa.",
                    "Dine at certified shacks that adhere to zero-plastic beach litter codes.",
                    "Visit organic spice plantations supporting native Western Ghats biodiversity."
                ]
            )
            food = [
                "Authentic Goan Fish Curry Thali with Kingfish Fry and Kokum Sol Kadi",
                "Spicy Prawn Balchao with local Poi bread",
                "Traditional Goan Pork / Chicken Vindaloo",
                "Bebinca (Multi-layered Goan coconut milk dessert)"
            ]
            return safety, eco, food
        elif "tokyo" in dest_lower or "japan" in dest_lower:
            safety = SafetyInfo(
                safety_rating="Exceptional (Rank 1/100)",
                emergency_contacts={
                    "Police": "110",
                    "Ambulance / Fire": "119",
                    "Japan Helpline (English)": "0570-000-911",
                    "Tourist Information Center": "+81-3-3201-3331"
                },
                advisories=[
                    "Earthquake preparedness: familiarise with hotel exit maps.",
                    "Always carry some cash for small neighborhood ramen bars and temples.",
                    "Trains cease operation between 00:30 and 05:00."
                ]
            )
            eco = EcoScore(
                score=92,
                green_transport_percent=88,
                eco_friendly_attractions=8,
                recommendations=[
                    "Utilize Pasmo/Suica IC card for 100% electrified rail & subway transit.",
                    "Bring personal refillable water bottles; clean tap water is free everywhere.",
                    "Support sustainable heritage craftsmen in Asakusa."
                ]
            )
            food = [
                "Tonkotsu & Shoyu Ramen (Ichiran / Afuri)",
                "Tsukiji Fresh Nigiri Sushi & Tamagoyaki",
                "Charcoal-grilled Yakitori in Omoide Yokocho",
                "Matcha Parfait & Traditional Wagashi Sweets"
            ]
        elif "paris" in dest_lower or "france" in dest_lower:
            safety = SafetyInfo(
                safety_rating="Moderate to High (General Urban Safety)",
                emergency_contacts={
                    "European Emergency Number": "112",
                    "Police": "17",
                    "Medical Emergency (SAMU)": "15",
                    "Paris Tourist Help Desk": "+33-1-49-52-42-63"
                },
                advisories=[
                    "Be mindful of pickpockets on Metro Line 1, 4 and near the Eiffel Tower.",
                    "Avoid signing unverified petition clipboards around major monuments.",
                    "Keep copies of identification in a separate compartment."
                ]
            )
            eco = EcoScore(
                score=85,
                green_transport_percent=78,
                eco_friendly_attractions=6,
                recommendations=[
                    "Use Vélib' public bike-sharing or the extensive Metro RATP network.",
                    "Opt for certified organic bistros ('Bistrot Bio') in the 11th Arrondissement.",
                    "Paris public Wallace fountains provide clean chilled drinking water."
                ]
            )
            food = [
                "Fresh Butter Croissants & Pain au Chocolat from artisan boulangeries",
                "Duck Confit & Beef Bourguignon in historic Latin Quarter bistros",
                "Artisanal French Cheese Board (Brie, Comté, Roquefort) with baguette",
                "Salted Caramel Crepes and Buckwheat Galettes in Le Marais"
            ]
        elif "rome" in dest_lower or "italy" in dest_lower:
            safety = SafetyInfo(
                safety_rating="High (Tourist Vigilance Recommended)",
                emergency_contacts={
                    "Universal Emergency": "112",
                    "Carabinieri (Police)": "112",
                    "Medical Emergency": "118",
                    "Rome Tourist Helpline": "+39-060-608"
                },
                advisories=[
                    "Watch out for pickpockets at Termini Station, Colosseum, and Bus 64.",
                    "Dress respectfully when entering churches (shoulders and knees covered).",
                    "Only take registered white taxis with official municipal crests."
                ]
            )
            eco = EcoScore(
                score=82,
                green_transport_percent=74,
                eco_friendly_attractions=7,
                recommendations=[
                    "Drink from the historic 'Nasoni' street fountains providing cold Alpine spring water.",
                    "Walk between central sites (Colosseum, Pantheon, Trevi are walkable within 25 mins).",
                    "Take the Trenitalia high-speed rail rather than domestic flights."
                ]
            )
            food = [
                "Authentic Roman Pasta: Cacio e Pepe & Carbonara in Trastevere",
                "Crispy Fried Roman Supplì (mozzarella-filled risotto croquettes)",
                "Artisanal Pistachio & Dark Chocolate Gelato at Giolitti",
                "Roman Thin-Crust Pizza al Taglio (Pizza by the slice)"
            ]
        elif "new york" in dest_lower or "nyc" in dest_lower:
            safety = SafetyInfo(
                safety_rating="High (Vibrant Urban Hub)",
                emergency_contacts={
                    "Emergency Services": "911",
                    "Non-Emergency City Services": "311",
                    "NYPD Tourist Unit": "212-239-2500"
                },
                advisories=[
                    "Subway operates 24/7; wait near the conductor's car late at night.",
                    "Tipping of 18-20% is customary at sit-down restaurants.",
                    "Beware of costumed characters requesting money for photos in Times Square."
                ]
            )
            eco = EcoScore(
                score=80,
                green_transport_percent=85,
                eco_friendly_attractions=7,
                recommendations=[
                    "Use OMNY contactless tap-and-go across the entire MTA subway and bus network.",
                    "Walk the High Line and Central Park pedestrian loops.",
                    "Use Citi Bike for scenic Hudson River Greenway cycling."
                ]
            )
            food = [
                "Classic New York Style Crispy Foldable Pizza Slice",
                "Toasted Everything Bagel with Nova Scotia Lox & Cream Cheese",
                "Warm Pastrami on Rye at Katz's Delicatessen",
                "Chinatown Pork Soup Dumplings (Xiao Long Bao) on Mott Street"
            ]
        elif "london" in dest_lower or "uk" in dest_lower:
            safety = SafetyInfo(
                safety_rating="Very High (Policed & Monitored)",
                emergency_contacts={
                    "Police / Ambulance / Fire": "999 or 112",
                    "Non-Emergency Police": "101",
                    "National Health Service Helpline": "111"
                },
                advisories=[
                    "Look both ways before crossing; remember traffic drives on the left.",
                    "Mind the gap between the train and the platform on the London Underground.",
                    "Keep your phone securely pocketed near busy roadway intersections."
                ]
            )
            eco = EcoScore(
                score=88,
                green_transport_percent=86,
                eco_friendly_attractions=8,
                recommendations=[
                    "Tap with contactless cards on the Underground, Overground, and iconic red double-decker buses.",
                    "Hire Santander Cycles for riding across Hyde Park and Regent's Park.",
                    "Support sustainable British food producers at Borough Market."
                ]
            )
            food = [
                "Traditional Sunday Roast with Yorkshire Pudding and rich gravy",
                "Fresh Cod & Chips with mushy peas and malt vinegar",
                "Hot Salt Beef Bagel from Brick Lane",
                "Afternoon High Tea with clotted cream, strawberry jam, and warm scones"
            ]
        elif "barcelona" in dest_lower or "spain" in dest_lower:
            safety = SafetyInfo(
                safety_rating="High (Vigilance on Pickpockets)",
                emergency_contacts={
                    "Universal Emergency": "112",
                    "Mossos d'Esquadra (Police)": "088",
                    "Medical Emergency": "061"
                },
                advisories=[
                    "Keep bags in front of you on La Rambla, Metro Line 3, and Sagrada Família square.",
                    "Dinner typically begins late in Spain (after 20:30).",
                    "Carry a refillable water bottle; tap water is treated and safe."
                ]
            )
            eco = EcoScore(
                score=86,
                green_transport_percent=80,
                eco_friendly_attractions=7,
                recommendations=[
                    "Use T-Casual 10-trip travel card on the TMB metro and tram system.",
                    "Walk through pedestrianized Gothic Quarter and El Born corridors.",
                    "Enjoy local Mediterranean farm-to-table seafood at Mercat de Santa Caterina."
                ]
            )
            food = [
                "Catalan Pan con Tomate (crispy toasted rustic bread with crushed tomato & olive oil)",
                "Authentic Seafood Paella & Fideuà on the Barceloneta coastline",
                "Patatas Bravas with spicy aioli and Iberian Ham croquettes",
                "Crispy Churros con Chocolate at Granja M. Viader"
            ]
        elif "dubai" in dest_lower or "uae" in dest_lower:
            safety = SafetyInfo(
                safety_rating="Exceptional (Ranked among safest worldwide)",
                emergency_contacts={
                    "Police": "999",
                    "Ambulance": "998",
                    "Fire / Civil Defense": "997",
                    "Dubai Tourist Police": "901"
                },
                advisories=[
                    "Respect local customs regarding modest clothing in government buildings and mosques.",
                    "Drink plenty of water to stay hydrated during daytime hours.",
                    "Only consume alcohol in licensed venues, hotels, and restaurants."
                ]
            )
            eco = EcoScore(
                score=78,
                green_transport_percent=72,
                eco_friendly_attractions=6,
                recommendations=[
                    "Ride the driverless, fully electrified Dubai Metro Red and Green lines.",
                    "Take a 1-Dirham traditional wooden Abra instead of road taxis across Dubai Creek.",
                    "Visit The Green Planet bio-dome focused on endangered species conservation."
                ]
            )
            food = [
                "Hot Chicken & Lamb Shawarma with garlic toum sauce",
                "Traditional Emirati Machboos (fragrant spiced rice with slow-cooked meat)",
                "Mezze Platter: Silky Hummus, Mutabal, and Warm Pitas in Downtown",
                "Fresh Saffron Tea (Karak Chai) and Luqaimat sweet dumplings with date syrup"
            ]
        else:
            city_name = destination.split(",")[0].strip()
            safety = SafetyInfo(
                safety_rating="Good (Standard Traveler Vigilance)",
                emergency_contacts={
                    "Universal Emergency": "112 / 911",
                    "Local Police": "Local Municipal Emergency",
                    "Tourist Assistance": "City Tourism Bureau"
                },
                advisories=[
                    f"Stay attentive to personal belongings in crowded transit hubs across {city_name}.",
                    "Keep emergency contact numbers saved on your phone offline.",
                    "Use registered metered taxis or licensed ride-sharing apps."
                ]
            )
            eco = EcoScore(
                score=80,
                green_transport_percent=70,
                eco_friendly_attractions=5,
                recommendations=[
                    "Prioritize walking and public urban bus/rail networks over private cars.",
                    "Dine at locally-owned farm-to-table restaurants supporting regional agriculture.",
                    "Support certified cultural heritage preservation centers."
                ]
            )
            food = [
                f"Signature local breakfast and bakery delicacies of {city_name}",
                f"Traditional slow-cooked regional specialty dish in historic old town",
                f"Artisan street food and seasonal produce at {city_name} Central Market"
            ]

        return safety, eco, food

    def generate_emergency_support(self, destination: str, emergency_type: str = "general") -> EmergencyResponse:
        from schemas import EmergencyResponse
        safety, eco, _ = self.generate_safety_and_eco(destination)
        city_name = destination.split(",")[0].strip()

        contacts = dict(safety.emergency_contacts)
        if "Universal National Emergency" not in contacts:
            contacts["Universal National Emergency"] = "112"

        facilities = [
            {"facility": f"{city_name} Government District Hospital & Trauma Center", "type": "24/7 Medical Emergency", "contact": "Dial 108 or +91-40-23451234"},
            {"facility": f"{city_name} Central Tourist Police Help Desk", "type": "Law Enforcement & Lost Property", "contact": "Dial 100 or Visit Central Station Booth"},
            {"facility": f"{city_name} Municipal Fire & Rescue Station", "type": "Fire & Civil Defense", "contact": "Dial 101"}
        ]

        steps = [
            "1. Stay calm and move to a well-lit, populated public area or authorized hotel lobby.",
            "2. Immediately dial 112 (Universal Emergency) or the dedicated helpline listed above.",
            "3. Share your live GPS location via WhatsApp/SMS with a trusted contact or hotel concierge.",
            "4. Keep your official identification card and insurance documents ready on your phone offline."
        ]

        embassy_advice = (
            f"If you are an international traveler in {city_name}, your consular diplomatic assistance "
            f"can be reached 24/7 through your country's national embassy in New Delhi or regional consulate. "
            f"Local tourist police booths are trained to coordinate with foreign missions."
        )

        return EmergencyResponse(
            destination=destination,
            safety_status=f"Active Protocol ({safety.safety_rating})",
            primary_emergency_numbers=contacts,
            nearest_support_facilities=facilities,
            immediate_action_steps=steps,
            embassy_or_consular_advice=embassy_advice
        )
