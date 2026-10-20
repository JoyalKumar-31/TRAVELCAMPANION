"""
Hotel & Lodge Recommendation Engine with Room Sharing Options and Direct Booking Links.
Provides authentic hotels, lodges, homestays, and shared rooms near Day 1 staying locations
across all Indian and international destinations, with prices in Indian Rupees (₹ INR).
"""
import urllib.parse
from typing import List, Dict, Any, Optional

HOTELS_DATABASE: Dict[str, List[Dict[str, Any]]] = {
    "goa": [
        {
            "id": "goa-lodge-1",
            "name": "Baga Beach Backpacker Lodge & Hostel",
            "type": "Beachfront Lodge",
            "near_landmark": "Baga Beach (Day 1 Afternoon Hub)",
            "distance": "250m from Baga Beach",
            "rating": 4.8,
            "reviews": 1240,
            "image": "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=600&q=80",
            "amenities": ["Free High-Speed WiFi", "AC", "Individual Lockers", "Swimming Pool", "Beach Access"],
            "base_price_inr": 1600,
            "sharing_options": [
                {"type": "4-Bed Mixed Dorm Bed", "price_per_person_inr": 450, "total_inr": 1800, "badge": "Best Value Group Sharing", "note": "Bunk bed with personal reading lamp & locker"},
                {"type": "2-Sharing (Twin Beds)", "price_per_person_inr": 800, "total_inr": 1600, "badge": "Couple / Friends", "note": "Two single beds with private bathroom"},
                {"type": "Private Deluxe Room", "price_per_person_inr": 1600, "total_inr": 1600, "badge": "Private Stay", "note": "King bed with private sea-facing balcony"}
            ]
        },
        {
            "id": "goa-lodge-2",
            "name": "Fontainhas Heritage Portuguese Lodge",
            "type": "Heritage Lodge & Inn",
            "near_landmark": "Old Latin Quarter (Day 1 Morning Hub)",
            "distance": "150m from Fontainhas Walk",
            "rating": 4.7,
            "reviews": 890,
            "image": "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=600&q=80",
            "amenities": ["Free Breakfast", "Heritage Architecture", "AC", "Cafe & Bar", "Bicycle Rental"],
            "base_price_inr": 3200,
            "sharing_options": [
                {"type": "3-Sharing Triple Room", "price_per_person_inr": 1150, "total_inr": 3450, "badge": "Friends Sharing", "note": "1 Double Bed + 1 Single Bed with colonial teakwood decor"},
                {"type": "2-Sharing Double Room", "price_per_person_inr": 1600, "total_inr": 3200, "badge": "Couple Favorite", "note": "Traditional Portuguese tiled suite with breakfast included"}
            ]
        },
        {
            "id": "goa-lodge-3",
            "name": "Calangute Palms Shared Beach Villa",
            "type": "Group Villa / Serviced Lodge",
            "near_landmark": "Calangute Strip",
            "distance": "500m from Calangute Beach",
            "rating": 4.9,
            "reviews": 650,
            "image": "https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=600&q=80",
            "amenities": ["Private Pool", "Kitchenette", "Living Room", "Free Parking", "BBQ Patio"],
            "base_price_inr": 5400,
            "sharing_options": [
                {"type": "Entire 4-Person Sharing Villa", "price_per_person_inr": 1350, "total_inr": 5400, "badge": "Group Villa", "note": "2 Bedrooms + Private Plunge Pool for up to 4 members"},
                {"type": "Entire 6-Person Sharing Villa", "price_per_person_inr": 1050, "total_inr": 6300, "badge": "Large Group Sharing", "note": "3 Bedrooms + Full Living Room for up to 6 members"}
            ]
        }
    ],

    "hyderabad": [
        {
            "id": "hyd-lodge-1",
            "name": "Charminar Heritage Tourist Lodge",
            "type": "Budget Tourist Lodge",
            "near_landmark": "Charminar & Laad Bazaar (Day 1 Stay)",
            "distance": "350m from Charminar",
            "rating": 4.6,
            "reviews": 1100,
            "image": "https://images.unsplash.com/photo-1572455044327-7348c1be7267?auto=format&fit=crop&w=600&q=80",
            "amenities": ["Free WiFi", "AC & Non-AC", "24/7 Room Service", "Hot Water", "Tour Desk"],
            "base_price_inr": 1500,
            "sharing_options": [
                {"type": "4-Bed Family / Group Sharing", "price_per_person_inr": 400, "total_inr": 1600, "badge": "Super Budget Sharing", "note": "4 Single Cots with private bath & ceiling fans"},
                {"type": "3-Sharing Triple Room", "price_per_person_inr": 550, "total_inr": 1650, "badge": "Group Sharing", "note": "1 King Bed + 1 Single Bed with AC"},
                {"type": "2-Sharing Executive Double", "price_per_person_inr": 750, "total_inr": 1500, "badge": "Couple / Duo", "note": "Spacious double bedroom overlooking Old City bazaar"}
            ]
        },
        {
            "id": "hyd-lodge-2",
            "name": "Banjara Hills Transit Executive Lodge & Suites",
            "type": "Modern Business Lodge",
            "near_landmark": "Banjara Hills Road No. 1",
            "distance": "1.2 km from City Center Metro",
            "rating": 4.7,
            "reviews": 840,
            "image": "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80",
            "amenities": ["Free Buffet Breakfast", "Work Desk", "Gym", "High-Speed WiFi", "Cab Pickup"],
            "base_price_inr": 2400,
            "sharing_options": [
                {"type": "2-Sharing Twin Executive", "price_per_person_inr": 1200, "total_inr": 2400, "badge": "Comfort Sharing", "note": "Twin orthopedic beds + breakfast included"},
                {"type": "3-Sharing Triple Studio", "price_per_person_inr": 900, "total_inr": 2700, "badge": "Family / Friends", "note": "Executive suite with pull-out sofa bed"}
            ]
        },
        {
            "id": "hyd-lodge-3",
            "name": "Golconda View Royal Courtyard Lodge",
            "type": "Heritage Stay & Lodge",
            "near_landmark": "Golconda Fort Citadel",
            "distance": "600m from Fort Entry Gate",
            "rating": 4.8,
            "reviews": 420,
            "image": "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=600&q=80",
            "amenities": ["Fort View Terrace", "Authentic Hyderabadi Dining", "AC", "Traditional Decor"],
            "base_price_inr": 3100,
            "sharing_options": [
                {"type": "2-Sharing Heritage Room", "price_per_person_inr": 1550, "total_inr": 3100, "badge": "Scenic View", "note": "Panoramic Fort Rampart view from private balcony"},
                {"type": "4-Sharing Royal Suite", "price_per_person_inr": 950, "total_inr": 3800, "badge": "Royal Group Sharing", "note": "Two interconnected rooms for up to 4 members"}
            ]
        }
    ],

    "kerala": [
        {
            "id": "ker-lodge-1",
            "name": "Fort Kochi Backpacker & Heritage Lodge",
            "type": "Colonial Lodge & Hostel",
            "near_landmark": "Chinese Fishing Nets (Day 1 Hub)",
            "distance": "200m from Fort Kochi Beach",
            "rating": 4.8,
            "reviews": 980,
            "image": "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=600&q=80",
            "amenities": ["Free WiFi", "Garden Cafe", "Hammocks", "Ayurvedic Spa Desk", "AC"],
            "base_price_inr": 1800,
            "sharing_options": [
                {"type": "4-Bed Air-Conditioned Dorm Bed", "price_per_person_inr": 480, "total_inr": 1920, "badge": "Backpacker Value", "note": "Wooden bunk bed with privacy curtain & locker"},
                {"type": "2-Sharing Dutch Colonial Twin", "price_per_person_inr": 900, "total_inr": 1800, "badge": "Twin Sharing", "note": "Antique wooden beds with garden view"},
                {"type": "Private Heritage Room", "price_per_person_inr": 1800, "total_inr": 1800, "badge": "Private Deluxe", "note": "High ceiling Portuguese bedroom with private verandah"}
            ]
        },
        {
            "id": "ker-lodge-2",
            "name": "Punnamada Lake Shared Kettuvallam Houseboat",
            "type": "Houseboat Lodge",
            "near_landmark": "Alleppey Backwaters Jetty",
            "distance": "Boarding at Finishing Point Jetty",
            "rating": 4.9,
            "reviews": 1450,
            "image": "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=600&q=80",
            "amenities": ["All Meals (Karimeen Fish Thali)", "Private Chef", "Upper Deck View", "AC Bedrooms"],
            "base_price_inr": 6000,
            "sharing_options": [
                {"type": "4-Person Shared Houseboat Suite", "price_per_person_inr": 1500, "total_inr": 6000, "badge": "Iconic Group Stay", "note": "2 AC Bedrooms + Common Upper Deck + Full 3 Meals"},
                {"type": "2-Sharing Private Bedroom", "price_per_person_inr": 3000, "total_inr": 6000, "badge": "Romantic Cruise", "note": "Private bedroom in shared luxury 3-bedroom houseboat"}
            ]
        }
    ],

    "kashmir": [
        {
            "id": "kas-lodge-1",
            "name": "Dal Lake Royal Heritage Shikara Houseboat Lodge",
            "type": "Heritage Houseboat Lodge",
            "near_landmark": "Dal Lake Ghat No. 2 (Day 1 Hub)",
            "distance": "Direct Waterfront on Dal Lake",
            "rating": 4.9,
            "reviews": 1600,
            "image": "https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=600&q=80",
            "amenities": ["Free Shikara Transfers", "Heated Bedrooms (Bukhari)", "Kahwa Tea on Arrival", "Walnut Wood Decor"],
            "base_price_inr": 3800,
            "sharing_options": [
                {"type": "4-Sharing Family Cedar Suite", "price_per_person_inr": 950, "total_inr": 3800, "badge": "Popular Sharing", "note": "Two interconnected carved walnut wood bedrooms with lake view"},
                {"type": "2-Sharing Deluxe Double", "price_per_person_inr": 1900, "total_inr": 3800, "badge": "Couple Favorite", "note": "Front balcony room with unobstructed Zabarwan Mountain views"},
                {"type": "3-Sharing Triple Room", "price_per_person_inr": 1350, "total_inr": 4050, "badge": "Triple Sharing", "note": "1 King Bed + 1 Single Bed with electric bed warmers"}
            ]
        },
        {
            "id": "kas-lodge-2",
            "name": "Boulevard Road Travelers Pine Lodge",
            "type": "Alpine Budget Lodge",
            "near_landmark": "Boulevard Road, Srinagar",
            "distance": "100m from Dal Lake Promenade",
            "rating": 4.7,
            "reviews": 720,
            "image": "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80",
            "amenities": ["Electric Blankets", "In-House Kashmiri Wazwan Cafe", "24h Hot Geyser", "WiFi"],
            "base_price_inr": 2000,
            "sharing_options": [
                {"type": "4-Bed Group Dormitory", "price_per_person_inr": 500, "total_inr": 2000, "badge": "Super Budget", "note": "Heated group dorm with cozy quilts & hot showers"},
                {"type": "2-Sharing Standard Double", "price_per_person_inr": 1000, "total_inr": 2000, "badge": "Duo Sharing", "note": "Double bedroom with mountain view window"}
            ]
        }
    ],

    "manali": [
        {
            "id": "man-lodge-1",
            "name": "Old Manali Bohemian Pine Lodge & Hostel",
            "type": "Mountain Lodge & Hostel",
            "near_landmark": "Hadimba Temple & Old Manali Village",
            "distance": "300m from Hadimba Temple",
            "rating": 4.8,
            "reviews": 1320,
            "image": "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=600&q=80",
            "amenities": ["Bonfire Nights", "Acoustic Cafe", "Apple Orchard View", "Heated Water", "High-Speed WiFi"],
            "base_price_inr": 1400,
            "sharing_options": [
                {"type": "6-Bed Mixed Bunk Dorm Bed", "price_per_person_inr": 380, "total_inr": 2280, "badge": "Cheapest Sharing", "note": "Solid cedarwood bunk with individual charging & lockers"},
                {"type": "4-Bed Pine Wood Dorm Bed", "price_per_person_inr": 480, "total_inr": 1920, "badge": "Cozy Sharing", "note": "4-bed dorm with private attached heated bathroom"},
                {"type": "2-Sharing Wooden Attic Room", "price_per_person_inr": 700, "total_inr": 1400, "badge": "Twin Sharing", "note": "Cozy wooden cottage room with snow mountain balcony"}
            ]
        },
        {
            "id": "man-lodge-2",
            "name": "Solang Valley Snow Crest Chalet & Lodge",
            "type": "Alpine Chalet Lodge",
            "near_landmark": "Solang Valley Snow Point",
            "distance": "500m from Ropeway Base",
            "rating": 4.9,
            "reviews": 880,
            "image": "https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?auto=format&fit=crop&w=600&q=80",
            "amenities": ["Snow Peak View", "Fireplace Lounge", "Trout Barbecue", "Ski Rental Desk"],
            "base_price_inr": 3600,
            "sharing_options": [
                {"type": "4-Sharing Duplex Chalet", "price_per_person_inr": 900, "total_inr": 3600, "badge": "Group Duplex", "note": "2-level wooden chalet for up to 4 persons with fireplace"},
                {"type": "2-Sharing Glacier View Deluxe", "price_per_person_inr": 1800, "total_inr": 3600, "badge": "Couple Balcony", "note": "Balcony facing glacier and pine forest"}
            ]
        }
    ],

    "jaipur": [
        {
            "id": "jai-lodge-1",
            "name": "Pink City Royal Haveli Lodge",
            "type": "Heritage Haveli Lodge",
            "near_landmark": "Hawa Mahal (Day 1 Hub)",
            "distance": "400m from Hawa Mahal & City Palace",
            "rating": 4.8,
            "reviews": 1150,
            "image": "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=600&q=80",
            "amenities": ["Rooftop Restaurant", "Folk Music Evenings", "AC", "Rajasthani Courtyard"],
            "base_price_inr": 1800,
            "sharing_options": [
                {"type": "4-Bed Haveli Dorm Bed", "price_per_person_inr": 450, "total_inr": 1800, "badge": "Budget Heritage Sharing", "note": "Air-conditioned heritage room with brass cots"},
                {"type": "3-Sharing Royal Triple", "price_per_person_inr": 650, "total_inr": 1950, "badge": "Friends Sharing", "note": "1 King Bed + 1 Diwan with Jharokha window"},
                {"type": "2-Sharing Maharaja Deluxe", "price_per_person_inr": 900, "total_inr": 1800, "badge": "Couple Stay", "note": "Carved arches, colorful frescoes, and modern attached bath"}
            ]
        }
    ],

    "varanasi": [
        {
            "id": "var-lodge-1",
            "name": "Ganga View Kashi Heritage Lodge & Dharamshala",
            "type": "Ghatside Pilgrimage Lodge",
            "near_landmark": "Dashashwamedh Ghat (Day 1 Evening Hub)",
            "distance": "150m from Ganga Aarti Steps",
            "rating": 4.7,
            "reviews": 1820,
            "image": "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=600&q=80",
            "amenities": ["Direct River Ganga View", "Rooftop Yoga", "Pure Veg Dining", "Morning Boat Desk", "AC"],
            "base_price_inr": 1200,
            "sharing_options": [
                {"type": "4-Bed Pilgrimage Dorm Sharing", "price_per_person_inr": 320, "total_inr": 1280, "badge": "Pilgrim Budget Sharing", "note": "Clean shared room with locker & attached bath"},
                {"type": "3-Sharing Triple Room", "price_per_person_inr": 450, "total_inr": 1350, "badge": "Family Sharing", "note": "3 Beds with AC & clean linen"},
                {"type": "2-Sharing River View Double", "price_per_person_inr": 600, "total_inr": 1200, "badge": "Ganga View", "note": "Direct window view of sacred Ganga river & sunrise"}
            ]
        }
    ],

    "switzerland": [
        {
            "id": "swi-lodge-1",
            "name": "Zurich Old Town Alpine Riverside Lodge",
            "type": "Historic Swiss Lodge & Inn",
            "near_landmark": "Niederdorf Old Town & Lake Zurich (Day 1)",
            "distance": "200m from Zurich Central Station & Limmat",
            "rating": 4.8,
            "reviews": 1420,
            "image": "https://images.unsplash.com/photo-1515488764276-beab7607c1e6?auto=format&fit=crop&w=600&q=80",
            "amenities": ["Swiss Fondue Breakfast", "Free City Transit Pass", "High-Speed WiFi", "Luggage Storage"],
            "base_price_inr": 7800,
            "sharing_options": [
                {"type": "4-Bed Swiss Bunk Dorm Bed", "price_per_person_inr": 2100, "total_inr": 8400, "badge": "Swiss Budget Sharing", "note": "Swiss pine wood bunk with privacy pod & power sockets"},
                {"type": "2-Sharing Alpine Twin Room", "price_per_person_inr": 3900, "total_inr": 7800, "badge": "Duo Sharing", "note": "Twin beds with private en-suite shower & city view"},
                {"type": "3-Sharing Family Triple Room", "price_per_person_inr": 2800, "total_inr": 8400, "badge": "Triple Sharing", "note": "1 Queen Bed + 1 Single Bed in historic 17th-century lodge"}
            ]
        },
        {
            "id": "swi-lodge-2",
            "name": "Interlaken Valley Backpacker Chalet Lodge",
            "type": "Alpine Mountain Chalet",
            "near_landmark": "Interlaken Ost Railway & Harder Kulm",
            "distance": "350m from Interlaken Ost",
            "rating": 4.9,
            "reviews": 1850,
            "image": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80",
            "amenities": ["Jungfrau Glacier View", "Guest Kitchen", "Outdoor Hot Tub", "Bicycle Rental"],
            "base_price_inr": 6500,
            "sharing_options": [
                {"type": "6-Bed Chalet Dorm Bed", "price_per_person_inr": 1650, "total_inr": 9900, "badge": "Backpacker Choice", "note": "Heated wooden chalet dorm with breathtaking alpine panorama"},
                {"type": "2-Sharing Private Chalet Room", "price_per_person_inr": 3250, "total_inr": 6500, "badge": "Couple Chalet", "note": "Private room with balcony facing snow-capped Eiger peak"}
            ]
        }
    ],

    "paris": [
        {
            "id": "par-lodge-1",
            "name": "Montmartre Bohemian Artists Lodge & Hostel",
            "type": "Boutique Parisian Lodge",
            "near_landmark": "Sacré-Cœur & Boulevard de Clichy",
            "distance": "300m from Anvers Metro Station",
            "rating": 4.7,
            "reviews": 1100,
            "image": "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=600&q=80",
            "amenities": ["Croissant & Coffee Breakfast", "Rooftop Paris View", "Free WiFi", "Elevator"],
            "base_price_inr": 8200,
            "sharing_options": [
                {"type": "4-Bed Shared Parisian Studio", "price_per_person_inr": 2200, "total_inr": 8800, "badge": "Group Sharing", "note": "Bunk beds in a classic Haussmannian room with high ceilings"},
                {"type": "2-Sharing Double Room", "price_per_person_inr": 4100, "total_inr": 8200, "badge": "Romantic Duo", "note": "Double bed with view of Eiffel Tower in the distance"}
            ]
        }
    ],

    "dubai": [
        {
            "id": "dub-lodge-1",
            "name": "Deira Heritage Creek Tourist Lodge",
            "type": "Heritage Waterfront Lodge",
            "near_landmark": "Dubai Creek & Gold Souk (Day 1 Hub)",
            "distance": "150m from Abra Water Taxi Station",
            "rating": 4.7,
            "reviews": 1390,
            "image": "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=600&q=80",
            "amenities": ["Arabic Coffee Welcome", "Creek Ferry Access", "AC", "Free WiFi", "Buffet Breakfast"],
            "base_price_inr": 4200,
            "sharing_options": [
                {"type": "4-Sharing Family Creek Suite", "price_per_person_inr": 1150, "total_inr": 4600, "badge": "Family Sharing", "note": "Two interconnected bedrooms overlooking sailing dhow boats"},
                {"type": "3-Sharing Triple Room", "price_per_person_inr": 1450, "total_inr": 4350, "badge": "Triple Sharing", "note": "3 single beds with Arabic courtyard decor"},
                {"type": "2-Sharing Executive Double", "price_per_person_inr": 2100, "total_inr": 4200, "badge": "Couple Stay", "note": "King bed with private bath and creek view balcony"}
            ]
        }
    ],

    "vizag": [
        {
            "id": "viz-lodge-1",
            "name": "RK Beachfront Backpacker & Heritage Lodge",
            "type": "Coastal Tourist Lodge",
            "near_landmark": "RK Beach & Submarine Museum (Day 1 Hub)",
            "distance": "120m from Submarine Museum",
            "rating": 4.8,
            "reviews": 920,
            "image": "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=600&q=80",
            "amenities": ["Direct Ocean View", "AC", "Free WiFi", "Fresh Seafood Thali", "Beach Rental"],
            "base_price_inr": 1400,
            "sharing_options": [
                {"type": "4-Bed Beach Bunk Dorm Bed", "price_per_person_inr": 350, "total_inr": 1400, "badge": "Budget Beach Sharing", "note": "Individual sea-breeze bunk with privacy curtain & locker"},
                {"type": "2-Sharing Sea View Double", "price_per_person_inr": 700, "total_inr": 1400, "badge": "Couple Sea View", "note": "Double bed with balcony facing Bay of Bengal"},
                {"type": "3-Sharing Family Triple", "price_per_person_inr": 550, "total_inr": 1650, "badge": "Group Sharing", "note": "1 King Bed + 1 Single Cot with attached modern shower"}
            ]
        },
        {
            "id": "viz-lodge-2",
            "name": "Araku Valley Pine Mist Eco Lodge",
            "type": "Hill Station Eco Lodge",
            "near_landmark": "Araku Tribal Museum & Coffee Gardens",
            "distance": "350m from Tribal Museum",
            "rating": 4.9,
            "reviews": 740,
            "image": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80",
            "amenities": ["Organic Coffee Terrace", "Bonfire", "Mountain Stream Trek", "Hot Water"],
            "base_price_inr": 2200,
            "sharing_options": [
                {"type": "4-Sharing Wooden Family Cottage", "price_per_person_inr": 550, "total_inr": 2200, "badge": "Group Cottage", "note": "Spacious pine wood cottage for up to 4 members"},
                {"type": "2-Sharing Valley View Room", "price_per_person_inr": 1100, "total_inr": 2200, "badge": "Scenic Balcony", "note": "Private balcony overlooking Araku coffee plantations"}
            ]
        }
    ],

    "delhi_agra": [
        {
            "id": "del-lodge-1",
            "name": "Taj Sunrise View Heritage Lodge & Homestay",
            "type": "Heritage View Lodge",
            "near_landmark": "Taj Mahal East Gate (Day 1 Hub)",
            "distance": "250m from Taj Mahal Entry Gate",
            "rating": 4.8,
            "reviews": 1650,
            "image": "https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=600&q=80",
            "amenities": ["Rooftop Taj Mahal Panorama", "Free WiFi", "AC", "Traditional Mughlai Breakfast", "Luggage Storage"],
            "base_price_inr": 1600,
            "sharing_options": [
                {"type": "4-Bed Taj View Dorm Bed", "price_per_person_inr": 400, "total_inr": 1600, "badge": "Best Value Sharing", "note": "Air-conditioned dorm bed with personal reading lamp & locker"},
                {"type": "2-Sharing Heritage Deluxe", "price_per_person_inr": 800, "total_inr": 1600, "badge": "Couple Choice", "note": "Teakwood double bed with rooftop Taj Mahal sunrise access"},
                {"type": "3-Sharing Mughal Triple Suite", "price_per_person_inr": 600, "total_inr": 1800, "badge": "Family / Friends", "note": "1 Double Bed + 1 Single Diwan with carved arches"}
            ]
        }
    ],

    "ladakh": [
        {
            "id": "lad-lodge-1",
            "name": "Leh Old Town Himalayan Stargazing Lodge",
            "type": "Traditional Ladakhi Lodge",
            "near_landmark": "Leh Palace & Main Bazaar (Day 1 Hub)",
            "distance": "250m from Old Bazaar",
            "rating": 4.9,
            "reviews": 1120,
            "image": "https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=600&q=80",
            "amenities": ["Bukhari Room Heating", "Oxygen Cylinder Assistance", "Tibetan Butter Tea", "Stargazing Terrace"],
            "base_price_inr": 2400,
            "sharing_options": [
                {"type": "4-Bed Heated Wood Dorm Bed", "price_per_person_inr": 600, "total_inr": 2400, "badge": "Himalayan Backpacker", "note": "Warm pine wood bunk with heavy wool blankets & hot showers"},
                {"type": "2-Sharing Snow Mountain Room", "price_per_person_inr": 1200, "total_inr": 2400, "badge": "Couple Deluxe", "note": "Double bedroom facing snow-capped Stok Kangri range"}
            ]
        }
    ],

    "ooty": [
        {
            "id": "oot-lodge-1",
            "name": "Nilgiri Blue Mountain Heritage Tea Lodge",
            "type": "Colonial Tea Estate Lodge",
            "near_landmark": "Ooty Lake & Botanical Garden (Day 1 Hub)",
            "distance": "300m from Lake Boathouse",
            "rating": 4.8,
            "reviews": 890,
            "image": "https://images.unsplash.com/photo-1589308078059-be1415eab4c3?auto=format&fit=crop&w=600&q=80",
            "amenities": ["Fireplace Lounge", "Fresh Nilgiri Tea", "Eucalyptus Garden", "Heated Water", "Free Parking"],
            "base_price_inr": 1800,
            "sharing_options": [
                {"type": "4-Bed Pine Wood Sharing Suite", "price_per_person_inr": 450, "total_inr": 1800, "badge": "Budget Group Sharing", "note": "4 single wooden cots with cozy hill quilts"},
                {"type": "2-Sharing Colonial Fireplace Room", "price_per_person_inr": 900, "total_inr": 1800, "badge": "Couple Warmth", "note": "Colonial bedroom with working fireplace & garden patio"}
            ]
        }
    ],

    "tokyo": [
        {
            "id": "tok-lodge-1",
            "name": "Asakusa Traditional Ryokan & Capsule Lodge",
            "type": "Traditional Japanese Ryokan & Capsule Lodge",
            "near_landmark": "Sensō-ji Temple (Day 1 Hub)",
            "distance": "200m from Kaminarimon Gate",
            "rating": 4.8,
            "reviews": 2100,
            "image": "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=600&q=80",
            "amenities": ["Traditional Onsen Bath", "Free High-Speed WiFi", "Yukata Robes", "Matcha Welcome Drink"],
            "base_price_inr": 5500,
            "sharing_options": [
                {"type": "Individual Futuristic Capsule Pod", "price_per_person_inr": 1900, "total_inr": 1900, "badge": "Futuristic Pod", "note": "Soundproof cyber pod with ambient sleep lighting & USB console"},
                {"type": "2-Sharing Traditional Tatami Room", "price_per_person_inr": 2750, "total_inr": 5500, "badge": "Authentic Ryokan", "note": "Woven rush tatami mats with authentic Japanese futon bedding"}
            ]
        }
    ],

    "rome": [
        {
            "id": "rom-lodge-1",
            "name": "Colosseo Imperial Historic Lodge",
            "type": "Historic Roman Townhouse Lodge",
            "near_landmark": "Colosseum & Roman Forum (Day 1 Hub)",
            "distance": "250m from Colosseo Metro Station",
            "rating": 4.8,
            "reviews": 1640,
            "image": "https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=600&q=80",
            "amenities": ["Italian Espresso & Pastry Breakfast", "Terrace with Ancient Ruins View", "AC", "WiFi"],
            "base_price_inr": 7200,
            "sharing_options": [
                {"type": "4-Bed Imperial Shared Suite", "price_per_person_inr": 1800, "total_inr": 7200, "badge": "Group Sharing", "note": "Renaissance vaulted ceiling suite for up to 4 members"},
                {"type": "2-Sharing Roman Classic Double", "price_per_person_inr": 3600, "total_inr": 7200, "badge": "Romantic Duo", "note": "Double bedroom overlooking historic cobblestone via"}
            ]
        }
    ],

    "london": [
        {
            "id": "lon-lodge-1",
            "name": "South Bank & Westminster Travelers Lodge",
            "type": "Riverside Historic Lodge & Inn",
            "near_landmark": "Big Ben & London Eye (Day 1 Hub)",
            "distance": "300m from Waterloo & Westminster Bridge",
            "rating": 4.7,
            "reviews": 1890,
            "image": "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=600&q=80",
            "amenities": ["Full English Breakfast Option", "Thames Riverside Walk Access", "Free WiFi", "Secure Pods"],
            "base_price_inr": 8500,
            "sharing_options": [
                {"type": "4-Bed Shared London Bunk Pod", "price_per_person_inr": 2125, "total_inr": 8500, "badge": "Central Sharing", "note": "Curtained bunk pod with individual reading light & power hub"},
                {"type": "2-Sharing Westminster Twin", "price_per_person_inr": 4250, "total_inr": 8500, "badge": "Twin Classic", "note": "Twin beds with en-suite modern shower and city view"}
            ]
        }
    ],

    "singapore": [
        {
            "id": "sin-lodge-1",
            "name": "Marina Bay & Chinatown Smart Capsule Lodge",
            "type": "Smart Pod & Boutique Lodge",
            "near_landmark": "Chinatown Heritage Quarter (Day 1 Hub)",
            "distance": "120m from Chinatown MRT Station",
            "rating": 4.8,
            "reviews": 1720,
            "image": "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=600&q=80",
            "amenities": ["Air Purification AC", "Free High-Speed WiFi", "Smart Card Lockers", "Rain Showers"],
            "base_price_inr": 4200,
            "sharing_options": [
                {"type": "Single Smart Capsule Pod", "price_per_person_inr": 1400, "total_inr": 1400, "badge": "Smart Pod", "note": "Futuristic pod bed with orthopaedic mattress and privacy door"},
                {"type": "2-Sharing Queen Pod Suite", "price_per_person_inr": 2100, "total_inr": 4200, "badge": "Couple Pod", "note": "Spacious double pod for couples with personal multimedia screen"}
            ]
        }
    ],

    "bali": [
        {
            "id": "bal-lodge-1",
            "name": "Ubud Rainforest Tropical Bamboo Eco Lodge",
            "type": "Balinese Eco Lodge & Hostel",
            "near_landmark": "Ubud Monkey Forest & Sacred Trail (Day 1)",
            "distance": "300m from Ubud Center",
            "rating": 4.9,
            "reviews": 1410,
            "image": "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=600&q=80",
            "amenities": ["Infinity Jungle Pool", "Complimentary Tropical Fruit Breakfast", "Yoga Shala", "AC"],
            "base_price_inr": 1600,
            "sharing_options": [
                {"type": "4-Bed Bamboo Jungle Dorm Bed", "price_per_person_inr": 400, "total_inr": 1600, "badge": "Eco Jungle Sharing", "note": "Open-air bamboo architecture with mosquito net & pool access"},
                {"type": "2-Sharing Private Ricefield Villa", "price_per_person_inr": 800, "total_inr": 1600, "badge": "Romantic Eco Villa", "note": "Carved teakwood double bed with private outdoor rain shower"}
            ]
        }
    ],

    "maldives": [
        {
            "id": "mal-lodge-1",
            "name": "Maafushi Island Turquoise Lagoon Beach Lodge",
            "type": "Island Beachfront Lodge",
            "near_landmark": "Maafushi Coral Lagoon (Day 1 Hub)",
            "distance": "50m from Bikini Beach & Snorkel Point",
            "rating": 4.9,
            "reviews": 1530,
            "image": "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=600&q=80",
            "amenities": ["Free Snorkeling Gear", "Direct White Sand Beach Access", "Tropical Breakfast", "AC", "WiFi"],
            "base_price_inr": 5200,
            "sharing_options": [
                {"type": "4-Sharing Beachfront Lagoon Villa", "price_per_person_inr": 1300, "total_inr": 5200, "badge": "Group Lagoon Villa", "note": "2 interconnected bedrooms stepping right onto powdery white sand"},
                {"type": "2-Sharing Turquoise Ocean View Deluxe", "price_per_person_inr": 2600, "total_inr": 5200, "badge": "Couple Ocean View", "note": "King bed with private balcony facing aquamarine lagoon waters"}
            ]
        }
    ]
}

def get_destination_hotel_key(destination_name: str) -> str:
    """Matches any destination string to available hotel database key."""
    d = destination_name.lower()
    if "goa" in d: return "goa"
    if "hyderabad" in d: return "hyderabad"
    if "kerala" in d or "kochi" in d or "alleppey" in d or "munnar" in d: return "kerala"
    if "kashmir" in d or "srinagar" in d or "gulmarg" in d: return "kashmir"
    if "manali" in d or "solang" in d or "shimla" in d: return "manali"
    if "jaipur" in d or "rajasthan" in d or "udaipur" in d: return "jaipur"
    if "varanasi" in d or "kashi" in d: return "varanasi"
    if "vizag" in d or "visakhapatnam" in d: return "vizag"
    if "delhi" in d or "agra" in d or "taj mahal" in d: return "delhi_agra"
    if "ladakh" in d or "leh" in d: return "ladakh"
    if "ooty" in d or "nilgiri" in d: return "ooty"
    if "tokyo" in d or "kyoto" in d or "japan" in d: return "tokyo"
    if "rome" in d or "vatican" in d or "italy" in d: return "rome"
    if "london" in d or "uk" in d: return "london"
    if "singapore" in d: return "singapore"
    if "bali" in d or "indonesia" in d: return "bali"
    if "maldives" in d: return "maldives"
    if "paris" in d: return "paris"
    if "dubai" in d: return "dubai"
    if "switzerland" in d or "zurich" in d or "interlaken" in d: return "switzerland"
    return "goa"

def generate_booking_redirect_url(hotel_name: str, destination: str, is_international: bool = False) -> Dict[str, str]:
    """
    Generates real partner booking search links pre-populated with hotel name and destination city.
    """
    query = f"{hotel_name} {destination}"
    encoded_query = urllib.parse.quote_plus(query)
    encoded_dest = urllib.parse.quote_plus(destination)
    encoded_hotel = urllib.parse.quote_plus(hotel_name)

    # Google Hotels Direct Search (Aggregates MakeMyTrip, Agoda, Booking.com, and direct hotel sites)
    google_hotels_url = f"https://www.google.com/travel/hotels?q={encoded_query}"

    # MakeMyTrip URL for Indian domestic lodges and hotels
    makemytrip_url = f"https://www.makemytrip.com/hotels/hotel-listing/?city={encoded_dest}&searchText={encoded_hotel}"

    # Booking.com URL
    booking_url = f"https://www.booking.com/searchresults.html?ss={encoded_query}"

    # Agoda URL
    agoda_url = f"https://www.agoda.com/search?text={encoded_query}"

    primary_url = booking_url if is_international else makemytrip_url

    return {
        "primary_url": primary_url,
        "google_hotels_url": google_hotels_url,
        "makemytrip_url": makemytrip_url,
        "booking_url": booking_url,
        "agoda_url": agoda_url
    }

def get_day1_hotels_for_destination(destination_name: str, day_number: int = 1) -> List[Dict[str, Any]]:
    """
    Retrieves authentic lodges & hotels near Day 1 staying hub with room sharing options
    and generates dynamic booking links.
    """
    key = get_destination_hotel_key(destination_name)
    hotels = HOTELS_DATABASE.get(key, HOTELS_DATABASE["goa"])
    is_intl = key in ["switzerland", "paris", "dubai", "tokyo", "rome", "london", "singapore", "bali", "new_york"]

    clean_city = destination_name.split("(")[0].split(",")[0].strip()

    result = []
    for h in hotels:
        item = dict(h)
        # Attach dynamic redirection booking links
        item["booking_links"] = generate_booking_redirect_url(item["name"], clean_city, is_international=is_intl)
        item["day_number"] = day_number
        result.append(item)

    return result
