import os
from typing import List, Dict
from schemas import (
    SmartPackingRequest, 
    SmartPackingChecklist, 
    PackingCategory, 
    PackingItem
)
from config import get_llm

class SmartPackingAgent:
    """
    AI Agent that generates intelligent, personalized packing checklists based on:
    - Destination weather & climate forecasts
    - Trip duration (clothing count formulas)
    - Traveler demographics (infants, kids, adults, seniors)
    - Specific activities (trekking, temple visits, beach, dining)
    - Eco-friendly sustainable travel essentials
    """
    def __init__(self):
        self.llm = get_llm()

    def generate_checklist(self, request: SmartPackingRequest) -> SmartPackingChecklist:
        dest_lower = request.destination.lower()
        duration = max(1, request.duration_days)
        traveler = request.traveler_type.lower()
        acts = [a.lower() for a in request.planned_activities]

        # 1. Determine Climate Archetype
        if any(w in dest_lower for w in ["manali", "ladakh", "kashmir", "shimla", "switzerland", "alps", "himalaya"]):
            climate = "Alpine / Cold Mountain"
            temp_est = "4°C - 15°C"
            weather_desc = "Chilly mountain weather with crisp mornings and freezing nights."
        elif any(w in dest_lower for w in ["dubai", "rajasthan", "jaipur", "jaisalmer", "egypt"]):
            climate = "Desert / Arid Heat"
            temp_est = "24°C - 38°C"
            weather_desc = "Hot sun during daytime with high UV index; mild and breezy evenings."
        elif any(w in dest_lower for w in ["kerala", "goa", "vizag", "visakhapatnam", "chennai", "mumbai", "bali", "phuket"]):
            climate = "Tropical Coastal / High Humidity"
            temp_est = "26°C - 33°C"
            weather_desc = "Warm coastal humidity with bright sunshine and occasional tropical gusts."
        else:
            climate = "Temperate Urban / Mild Continental"
            temp_est = "18°C - 28°C"
            weather_desc = "Pleasant daytime temperatures suitable for walking tours."

        # 2. Build Categories
        # A. Clothing & Footwear
        clothing_items: List[PackingItem] = []
        tops_count = min(duration + 1, 7)
        bottoms_count = max(2, duration // 2 + 1)

        clothing_items.append(PackingItem(
            item=f"Breathable Tops / Shirts ({tops_count} sets)",
            essential=True,
            category="Clothing",
            note="Quick-dry linen or moisture-wicking cotton for day tours."
        ))
        clothing_items.append(PackingItem(
            item=f"Comfortable Trousers / Jeans ({bottoms_count} pairs)",
            essential=True,
            category="Clothing",
            note="Include loose pants or long skirts for religious/temple sites."
        ))
        clothing_items.append(PackingItem(
            item="Cushioned Walking Shoes / Sneakers (Broken-in)",
            essential=True,
            category="Clothing",
            note="Crucial for 8,000-15,000 daily steps across heritage sites."
        ))

        if climate == "Alpine / Cold Mountain":
            clothing_items.extend([
                PackingItem(item="Thermal Base Layers (2 sets)", essential=True, category="Clothing", note="Merino wool or fleece thermals."),
                PackingItem(item="Insulated Windproof Jacket", essential=True, category="Clothing", note="Essential for evening valley chills."),
                PackingItem(item="Woolen Beanie & Touchscreen Gloves", essential=False, category="Clothing", note="Warmth during sunrise viewpoints.")
            ])
        elif climate == "Tropical Coastal / High Humidity" or any("beach" in a or "water" in a for a in acts):
            clothing_items.extend([
                PackingItem(item="Swimwear / UV Rashguard (2 sets)", essential=True, category="Clothing", note="Quick-drying beachwear."),
                PackingItem(item="Waterproof Flip-Flops / Aqua Shoes", essential=True, category="Clothing", note="Protect feet on rocky or hot sand shores."),
                PackingItem(item="Light Linen Overshirt / Kaftan", essential=False, category="Clothing", note="Sun protection when strolling beaches.")
            ])

        # B. Weather & Climate Essentials
        weather_items: List[PackingItem] = [
            PackingItem(item="Broad-Spectrum Sunscreen (SPF 50+ PA+++)", essential=True, category="Weather & Protection", note="Reapply every 3 hours outdoors."),
            PackingItem(item="Polarized UV400 Sunglasses", essential=True, category="Weather & Protection", note="Eye protection against glare."),
            PackingItem(item="Compact Windproof Travel Umbrella", essential=True, category="Weather & Protection", note="Dual-use for sudden rain bursts or intense harsh sun.")
        ]
        if climate == "Tropical Coastal / High Humidity" or "kerala" in dest_lower or "goa" in dest_lower:
            weather_items.append(PackingItem(
                item="DEET / Herbal Mosquito Repellent Spray",
                essential=True,
                category="Weather & Protection",
                note="Crucial for backwaters, lake shores, and sunset outdoor dining."
            ))

        # C. Medical & Personal Care
        med_items: List[PackingItem] = [
            PackingItem(item="Personal Travel First-Aid & Prescription Meds", essential=True, category="Health & Medical", note="Keep in original packaging with prescription copy."),
            PackingItem(item="Oral Rehydration Salts (ORS) / Electrolyte Sachets", essential=True, category="Health & Medical", note="Stay hydrated and avoid heat exhaustion."),
            PackingItem(item="Motion Sickness Pills (Dimenhydrinate)", essential="mountain" in climate.lower() or "ghat" in dest_lower, category="Health & Medical", note="Helpful for winding mountain hairpin roads and boat ferries."),
            PackingItem(item="Antacids & Pain Relief (Paracetamol / Ibuprofen)", essential=True, category="Health & Medical", note="Quick relief after rich street food feasts.")
        ]
        if traveler == "seniors" or "seniors" in request.age_groups:
            med_items.append(PackingItem(
                item="Blood Pressure / Glucose Monitor & Pill Organizer",
                essential=True,
                category="Health & Medical",
                note="Keep 3 extra days' worth of chronic medication in hand luggage."
            ))
        if traveler == "family" or "kids" in request.age_groups:
            med_items.append(PackingItem(
                item="Child-Safe Antiseptic Wipes & Pediatric Thermometer",
                essential=True,
                category="Health & Medical",
                note="Essential for sudden scrapes and playground sanitization."
            ))

        # D. Electronics & Travel Gadgets
        elec_items: List[PackingItem] = [
            PackingItem(item="High-Capacity Fast Power Bank (10,000 - 20,000 mAh)", essential=True, category="Electronics", note="Keeps phone charged for maps, camera, and translation."),
            PackingItem(item="Universal Travel Adapter / Multi-Pin Plug", essential=True, category="Electronics", note="Guarantees compatibility in all hotels."),
            PackingItem(item="Waterproof Phone Pouch with Neck Lanyard", essential=any("water" in a or "boat" in a for a in acts), category="Electronics", note="Safe photos on ferries and water parks."),
            PackingItem(item="Noise-Canceling Earbuds / Earplugs", essential=False, category="Electronics", note="Comfortable sleep on flights, trains, and overnight buses.")
        ]

        # E. Documents & Sustainable Essentials
        doc_items: List[PackingItem] = [
            PackingItem(item="Government Photo ID / Passport + 2 Photocopies", essential=True, category="Documents", note="Required for hotel check-ins and monument ticket counters."),
            PackingItem(item="Offline Downloaded Maps (Google Maps / Citymapper)", essential=True, category="Documents", note="Save destination maps offline for zero-network zones."),
            PackingItem(item="Emergency Medical Insurance Card & Emergency Contacts", essential=True, category="Documents", note="Keep physical emergency card in wallet."),
            PackingItem(item="Reusable Insulated Water Bottle (Eco-Tourism)", essential=True, category="Eco-Friendly", note="Zero single-use plastic waste; fill up at hotel/fountains."),
            PackingItem(item="Foldable Compact Cotton Tote Bag", essential=True, category="Eco-Friendly", note="Bypass single-use plastic bags when buying souvenirs.")
        ]

        categories = [
            PackingCategory(category_name="Clothing & Footwear", items=clothing_items),
            PackingCategory(category_name="Weather & Climate Protection", items=weather_items),
            PackingCategory(category_name="Health, First-Aid & Medications", items=med_items),
            PackingCategory(category_name="Electronics & Power", items=elec_items),
            PackingCategory(category_name="Documents & Eco-Friendly Travel", items=doc_items),
        ]

        total_items = sum(len(c.items) for c in categories)

        climate_tips = [
            f"Climate classification for {request.destination}: {climate} ({temp_est}).",
            weather_desc,
            "Rolling clothes instead of folding saves 30% luggage volume and minimizes wrinkles.",
            "Always pack essential medications and 1 set of clothes in your carry-on luggage."
        ]

        return SmartPackingChecklist(
            destination=request.destination,
            duration_days=duration,
            weather_summary=weather_desc,
            expected_temp_celsius=temp_est,
            categories=categories,
            total_items=total_items,
            climate_tips=climate_tips
        )
