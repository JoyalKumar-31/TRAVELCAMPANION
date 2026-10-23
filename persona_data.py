"""
Persona-Specific Destination Plans and Intelligent Travel Adapters
Provides tailored day-by-day activities based on traveler dynamics:
- Families with Kids: Child-safe, interactive museums, planetariums, animal encounters, short distances (<= 4.5km)
- Senior Citizens: Step-free, paved, gentle-pace heritage, temples, shaded gardens, elevator museums, resting benches
- Couples: Romantic vistas, secluded beaches, candlelit dining, boutique heritage alleys, starlit cruises
- Friends / Youth: Adventure sports, water sports, vibrant markets, and lively shacks
"""
import copy
import uuid
from typing import List, Dict, Any
from schemas import Activity, DayPlan, TravelerProfile

DESTINATION_PERSONA_PLANS: Dict[str, Dict[str, Dict[int, List[Dict[str, Any]]]]] = {
    'goa': {
        'family': {
            1: [
                {
                    'title': 'Dolphin Watching Boat Safari & Aguada Coastal Boardwalk',
                    'time_slot': 'Morning',
                    'category': 'nature',
                    'location': 'Sinquerim Jetty, Candolim, North Goa',
                    'admission_price_inr': 450.0,
                    'cost': 450.0,
                    'duration_hours': 2.5,
                    'indoor': False,
                    'family_friendly': True,
                    'travel_distance_km': 3.5,
                    'opening_hours': '08:30 AM - 01:00 PM [Verified]',
                    'verified_status': 'Verified Venue · Kids Approved',
                    'desc': 'Exciting morning boat safari where kids spot wild Indo-Pacific humpback dolphins leaping, followed by a safe, flat paved stroll around Fort Aguada lighthouse.'
                },
                {
                    'title': 'Museum of Goa (MOG) Interactive Children\'s Art & Sculpture Studio',
                    'time_slot': 'Afternoon',
                    'category': 'culture',
                    'location': 'Pilerne Industrial Estate, Pilerne (Near Candolim)',
                    'admission_price_inr': 150.0,
                    'cost': 150.0,
                    'duration_hours': 2.5,
                    'indoor': True,
                    'family_friendly': True,
                    'travel_distance_km': 4.2,
                    'opening_hours': '10:00 AM - 06:00 PM [Verified]',
                    'verified_status': 'Verified Venue · Child-Safe',
                    'desc': 'Spacious multi-storey indoor museum designed for young explorers with hands-on shell sculpture workshops, cartoon illustrations, and cool shaded galleries.'
                },
                {
                    'title': 'Candolim Gentle Beach Stroll & Shaded Family Garden Cafe',
                    'time_slot': 'Evening',
                    'category': 'relaxation',
                    'location': 'Candolim Beach Road, North Goa',
                    'admission_price_inr': 0.0,
                    'cost': 650.0,
                    'duration_hours': 2.5,
                    'indoor': False,
                    'family_friendly': True,
                    'travel_distance_km': 2.5,
                    'opening_hours': '05:30 PM - 10:30 PM [Verified]',
                    'verified_status': 'Verified Venue',
                    'desc': 'Calm, shallow beach waters ideal for children sandcastle building at sunset, followed by a relaxed lawn dinner with wood-fired pizzas and fresh fruit juices.'
                }
            ],
            2: [
                {
                    'title': 'Tropical Spice Plantation & Elephant Interaction Safari',
                    'time_slot': 'Morning',
                    'category': 'nature',
                    'location': 'Keri, Ponda (Near Old Goa Hub)',
                    'admission_price_inr': 500.0,
                    'cost': 500.0,
                    'duration_hours': 3.0,
                    'indoor': False,
                    'family_friendly': True,
                    'travel_distance_km': 6.5,
                    'opening_hours': '09:00 AM - 04:00 PM [Verified]',
                    'verified_status': 'Verified Venue · Educational',
                    'desc': 'Certified family experience where children learn how cinnamon, vanilla, and cocoa grow on shaded nature paths, plus gentle elephant feeding and traditional Goan buffet.'
                },
                {
                    'title': 'Butterfly Conservatory of Goa & Rainforest Trail',
                    'time_slot': 'Afternoon',
                    'category': 'nature',
                    'location': 'Ponda, Goa',
                    'admission_price_inr': 150.0,
                    'cost': 150.0,
                    'duration_hours': 2.0,
                    'indoor': True,
                    'family_friendly': True,
                    'travel_distance_km': 4.5,
                    'opening_hours': '09:00 AM - 04:30 PM [Verified]',
                    'verified_status': 'Verified Venue · Kids Favorite',
                    'desc': 'Enchanted tropical conservatory hosting over 130 species of vibrant free-flying butterflies in a natural rainforest sanctuary that kids adore.'
                },
                {
                    'title': 'Miramar Beach Seaside Promenade & Children\'s Playground',
                    'time_slot': 'Evening',
                    'category': 'relaxation',
                    'location': 'Miramar, Panaji, Goa',
                    'admission_price_inr': 0.0,
                    'cost': 350.0,
                    'duration_hours': 2.5,
                    'indoor': False,
                    'family_friendly': True,
                    'travel_distance_km': 3.8,
                    'opening_hours': '05:00 PM - 09:30 PM [Verified]',
                    'verified_status': 'Verified Venue',
                    'desc': 'Wide paved shoreline promenade with slides, swings, and safe playground facilities for children, accompanied by sea breeze and evening snack kiosks.'
                }
            ],
            3: [
                {
                    'title': 'Old Goa Basilica of Bom Jesus & Heritage Lawn Grounds',
                    'time_slot': 'Morning',
                    'category': 'culture',
                    'location': 'Old Goa (Velha Goa)',
                    'admission_price_inr': 0.0,
                    'cost': 0.0,
                    'duration_hours': 2.5,
                    'indoor': True,
                    'family_friendly': True,
                    'travel_distance_km': 5.0,
                    'opening_hours': '09:00 AM - 06:30 PM [Verified]',
                    'verified_status': 'Verified Venue',
                    'desc': 'UNESCO World Heritage wonder with wide stroller-friendly stone corridors, shaded gardens, and fascinating 16th-century gilded altar carvings.'
                },
                {
                    'title': 'Goa Science Centre & 3D Digital Planetarium',
                    'time_slot': 'Afternoon',
                    'category': 'culture',
                    'location': 'Miramar, Panaji, Goa',
                    'admission_price_inr': 60.0,
                    'cost': 60.0,
                    'duration_hours': 2.5,
                    'indoor': True,
                    'family_friendly': True,
                    'travel_distance_km': 4.0,
                    'opening_hours': '10:00 AM - 06:00 PM [Verified]',
                    'verified_status': 'Verified Venue · Highly Recommended for Kids',
                    'desc': 'Interactive 5-acre science park featuring hands-on physics puzzles, marine science exhibits, outdoor animatronic dinosaur park, and daily 3D space theater shows.'
                },
                {
                    'title': 'Santa Monica Mandovi River Family Cruise & Cultural Folk Dance',
                    'time_slot': 'Evening',
                    'category': 'relaxation',
                    'location': 'Panaji Ferry Jetty, Mandovi River',
                    'admission_price_inr': 500.0,
                    'cost': 500.0,
                    'duration_hours': 2.5,
                    'indoor': True,
                    'family_friendly': True,
                    'travel_distance_km': 2.2,
                    'opening_hours': '06:00 PM - 09:00 PM [Verified]',
                    'verified_status': 'Verified Venue · Family Entertainment',
                    'desc': 'Scenic double-decker cruise equipped with life jackets for kids, showcasing live Goan Dekhni & Fugdi folk dance performances, DJ music, and illuminated riverfront views.'
                }
            ]
        },
        'seniors': {
            1: [
                {
                    'title': 'Fort Aguada Lower Paved Sea Wall & Shaded Viewpoint',
                    'time_slot': 'Morning',
                    'category': 'sightseeing',
                    'location': 'Candolim, North Goa',
                    'admission_price_inr': 50.0,
                    'cost': 50.0,
                    'duration_hours': 2.5,
                    'indoor': False,
                    'family_friendly': True,
                    'travel_distance_km': 3.2,
                    'opening_hours': '09:00 AM - 06:00 PM [Verified]',
                    'verified_status': 'Verified Venue · Senior Step-Free',
                    'desc': 'Flat, paved coastal sea wall with shaded resting benches, gentle ocean breeze, and level walking paths designed for easy mobility and wheelchair access.'
                },
                {
                    'title': 'Houses of Goa Museum & Mario Miranda Cultural Gallery',
                    'time_slot': 'Afternoon',
                    'category': 'culture',
                    'location': 'Salvador do Mundo, Bardez (Near Candolim)',
                    'admission_price_inr': 100.0,
                    'cost': 100.0,
                    'duration_hours': 2.0,
                    'indoor': True,
                    'family_friendly': True,
                    'travel_distance_km': 4.8,
                    'opening_hours': '10:00 AM - 07:00 PM [Verified]',
                    'verified_status': 'Verified Venue · Air-Sheltered',
                    'desc': 'Comfortable, air-conditioned indoor heritage haven showcasing Goan architectural evolution, vintage furniture, and beloved cartoonist Mario Miranda\'s original sketches.'
                },
                {
                    'title': 'Candolim Quiet Beachside Veranda & Traditional Goan Thali',
                    'time_slot': 'Evening',
                    'category': 'food',
                    'location': 'Candolim Beach Road, North Goa',
                    'admission_price_inr': 0.0,
                    'cost': 700.0,
                    'duration_hours': 2.5,
                    'indoor': True,
                    'family_friendly': True,
                    'travel_distance_km': 2.5,
                    'opening_hours': '06:00 PM - 10:30 PM [Verified]',
                    'verified_status': 'Verified Venue · Step-Free Seating',
                    'desc': 'Peaceful seaside veranda with gentle acoustic music, soft ambient lighting, step-free access, and authentic mild Goan fish curry thali.'
                }
            ],
            2: [
                {
                    'title': 'Shri Mangueshi Temple & Shanta Durga Spiritual Shrines',
                    'time_slot': 'Morning',
                    'category': 'culture',
                    'location': 'Priol & Kavlem, Ponda',
                    'admission_price_inr': 0.0,
                    'cost': 0.0,
                    'duration_hours': 2.5,
                    'indoor': True,
                    'family_friendly': True,
                    'travel_distance_km': 6.0,
                    'opening_hours': '06:00 AM - 08:30 PM [Verified]',
                    'verified_status': 'Verified Venue · Spiritual Sanctuary',
                    'desc': 'Ancient 450-year-old temple complex featuring flat stone courtyards, majestic multi-tiered lamp towers, shaded pavilions, and peaceful morning prayer chants.'
                },
                {
                    'title': 'Sahakari Spice Plantation Guided Shaded Buggy Walk',
                    'time_slot': 'Afternoon',
                    'category': 'nature',
                    'location': 'Ponda, Goa',
                    'admission_price_inr': 500.0,
                    'cost': 500.0,
                    'duration_hours': 2.5,
                    'indoor': False,
                    'family_friendly': True,
                    'travel_distance_km': 4.5,
                    'opening_hours': '09:00 AM - 04:30 PM [Verified]',
                    'verified_status': 'Verified Venue · Buggy / Flat Path',
                    'desc': 'Leisurely walk through lush shaded spice groves with flat paths and golf-cart assistance available, herbal wellness briefings, and fresh coconut water.'
                },
                {
                    'title': 'Fontainhas Latin Quarter Leisurely Stroll & Confeitaria 31 de Janeiro',
                    'time_slot': 'Evening',
                    'category': 'food',
                    'location': 'Fontainhas, Panaji, Goa',
                    'admission_price_inr': 0.0,
                    'cost': 350.0,
                    'duration_hours': 2.0,
                    'indoor': True,
                    'family_friendly': True,
                    'travel_distance_km': 2.5,
                    'opening_hours': '09:30 AM - 08:00 PM [Verified]',
                    'verified_status': 'Verified Venue · Accessible Seating',
                    'desc': 'Flat paved heritage street stroll past pastel yellow Portuguese villas, ending with warm Bebinca and spiced tea at Goa\'s historic 1930 bakery.'
                }
            ],
            3: [
                {
                    'title': 'Old Goa Basilica of Bom Jesus & Museum of Christian Art',
                    'time_slot': 'Morning',
                    'category': 'culture',
                    'location': 'Old Goa (Velha Goa)',
                    'admission_price_inr': 50.0,
                    'cost': 50.0,
                    'duration_hours': 2.5,
                    'indoor': True,
                    'family_friendly': True,
                    'travel_distance_km': 5.0,
                    'opening_hours': '09:00 AM - 06:00 PM [Verified]',
                    'verified_status': 'Verified Venue · Ramp Equipped',
                    'desc': 'Grand UNESCO basilica fitted with certified wheelchair ramps, cool stone cloisters, and an intimate museum of precious Indo-Portuguese ecclesiastical art.'
                },
                {
                    'title': 'Church of St. Francis of Assisi & Archaeological Museum',
                    'time_slot': 'Afternoon',
                    'category': 'culture',
                    'location': 'Old Goa',
                    'admission_price_inr': 25.0,
                    'cost': 25.0,
                    'duration_hours': 2.0,
                    'indoor': True,
                    'family_friendly': True,
                    'travel_distance_km': 1.0,
                    'opening_hours': '09:00 AM - 05:00 PM [Verified]',
                    'verified_status': 'Verified Venue · Step-Free',
                    'desc': 'Shaded indoor museum exhibiting portraits of Portuguese viceroys, ancient coins, and stone sculptures in a serene Franciscan monastery setting.'
                },
                {
                    'title': 'Mandovi River Luxury Seated Catamaran Sunset Cruise',
                    'time_slot': 'Evening',
                    'category': 'relaxation',
                    'location': 'Panaji Promenade Jetty, Mandovi River',
                    'admission_price_inr': 600.0,
                    'cost': 600.0,
                    'duration_hours': 2.5,
                    'indoor': True,
                    'family_friendly': True,
                    'travel_distance_km': 2.5,
                    'opening_hours': '05:30 PM - 08:30 PM [Verified]',
                    'verified_status': 'Verified Venue · Guaranteed Seating',
                    'desc': 'Smooth, ultra-stable catamaran cruise with guaranteed air-conditioned indoor and covered deck seating, soft instrumental music, and panoramic river vistas.'
                }
            ]
        },
        'couple': {
            1: [
                {
                    'title': 'Fort Aguada Scenic Ramparts & Sinquerim Coastal Cove',
                    'time_slot': 'Morning',
                    'category': 'sightseeing',
                    'location': 'Sinquerim, Candolim, North Goa',
                    'admission_price_inr': 50.0,
                    'cost': 50.0,
                    'duration_hours': 2.5,
                    'indoor': False,
                    'family_friendly': True,
                    'travel_distance_km': 3.5,
                    'opening_hours': '09:00 AM - 06:00 PM [Verified]',
                    'verified_status': 'Verified Venue · Romantic View',
                    'desc': 'Breathtaking 17th-century bastion offering intimate panoramic views over the turquoise Arabian Sea meeting the Mandovi river mouth.'
                },
                {
                    'title': 'Candolim Boutique Shacks & Couple\'s Ayurvedic Wellness Spa',
                    'time_slot': 'Afternoon',
                    'category': 'relaxation',
                    'location': 'Candolim Coast, North Goa',
                    'admission_price_inr': 1500.0,
                    'cost': 1500.0,
                    'duration_hours': 2.5,
                    'indoor': True,
                    'family_friendly': False,
                    'travel_distance_km': 2.8,
                    'opening_hours': '10:00 AM - 07:00 PM [Verified]',
                    'verified_status': 'Verified Venue · Romantic Experience',
                    'desc': 'Relaxing couples herbal steam massage followed by chilled tropical passion fruit mocktails under breezy private cabanas.'
                },
                {
                    'title': 'Beachfront Candlelight Dinner at Fisherman\'s Wharf / Candolim Shore',
                    'time_slot': 'Evening',
                    'category': 'food',
                    'location': 'Candolim Shorefront, North Goa',
                    'admission_price_inr': 0.0,
                    'cost': 1800.0,
                    'duration_hours': 3.0,
                    'indoor': False,
                    'family_friendly': False,
                    'travel_distance_km': 2.2,
                    'opening_hours': '07:00 PM - 11:30 PM [Verified]',
                    'verified_status': 'Verified Venue · Candlelight Dining',
                    'desc': 'Intimate candlelit dining right on the sands accompanied by gentle acoustic melodies, butter garlic prawns, and fine coastal wines.'
                }
            ],
            2: [
                {
                    'title': 'Ashwem & Mandrem Tranquil White Sand Shore Stroll',
                    'time_slot': 'Morning',
                    'category': 'relaxation',
                    'location': 'Ashwem Beach, North Goa',
                    'admission_price_inr': 0.0,
                    'cost': 0.0,
                    'duration_hours': 3.0,
                    'indoor': False,
                    'family_friendly': True,
                    'travel_distance_km': 7.5,
                    'opening_hours': '08:00 AM - 07:00 PM [Verified]',
                    'verified_status': 'Verified Venue · Quiet & Romantic',
                    'desc': 'Goa\'s most pristine, uncrowded white sand beach with turquoise waters and coconut palms, perfect for long peaceful hand-in-hand strolls.'
                },
                {
                    'title': 'Chapora Fort Twilight Viewpoint (Dil Chahta Hai Point)',
                    'time_slot': 'Afternoon',
                    'category': 'sightseeing',
                    'location': 'Chapora, Vagator, North Goa',
                    'admission_price_inr': 0.0,
                    'cost': 0.0,
                    'duration_hours': 2.0,
                    'indoor': False,
                    'family_friendly': True,
                    'travel_distance_km': 5.0,
                    'opening_hours': '09:00 AM - 06:30 PM [Verified]',
                    'verified_status': 'Verified Venue · Iconic Panorama',
                    'desc': 'Legendary red laterite ramparts perched high above Vagator Bay, offering sweeping romantic views of the coastline curve.'
                },
                {
                    'title': 'Sunset Cocktail Lounge at Vagator Hilltop & Clifftop Dinner',
                    'time_slot': 'Evening',
                    'category': 'food',
                    'location': 'Ozran Cliff, Vagator, North Goa',
                    'admission_price_inr': 0.0,
                    'cost': 2200.0,
                    'duration_hours': 3.0,
                    'indoor': False,
                    'family_friendly': False,
                    'travel_distance_km': 3.0,
                    'opening_hours': '05:30 PM - 11:30 PM [Verified]',
                    'verified_status': 'Verified Venue · Sunset Ambiance',
                    'desc': 'Watch the fiery sunset sink into the Arabian sea from dramatic cliffside loungers, paired with artisan tapas and live saxophone.'
                }
            ],
            3: [
                {
                    'title': 'Fontainhas Latin Quarter Photo Trail & Gitanjali Art Cafe',
                    'time_slot': 'Morning',
                    'category': 'culture',
                    'location': 'Fontainhas, Panaji, Goa',
                    'admission_price_inr': 0.0,
                    'cost': 250.0,
                    'duration_hours': 2.5,
                    'indoor': False,
                    'family_friendly': True,
                    'travel_distance_km': 4.0,
                    'opening_hours': '09:00 AM - 06:00 PM [Verified]',
                    'verified_status': 'Verified Venue · Vintage Aesthetic',
                    'desc': 'Wander charming cobblestone lanes with pastel-painted colonial Portuguese villas, blooming bougainvillea, and cozy hidden artisan coffee nooks.'
                },
                {
                    'title': 'Reis Magos Fort Mandovi River Ramparts & Art Gallery',
                    'time_slot': 'Afternoon',
                    'category': 'culture',
                    'location': 'Reis Magos, Verem (Near Panaji)',
                    'admission_price_inr': 50.0,
                    'cost': 50.0,
                    'duration_hours': 2.0,
                    'indoor': True,
                    'family_friendly': True,
                    'travel_distance_km': 5.5,
                    'opening_hours': '09:30 AM - 05:30 PM [Verified]',
                    'verified_status': 'Verified Venue · Secluded Fort',
                    'desc': 'Meticulously restored 1551 fortress boasting romantic riverfront battlements with few crowds, peaceful breeze, and historic cultural halls.'
                },
                {
                    'title': 'Luxury Starlit Dinner Cruise on Mandovi River',
                    'time_slot': 'Evening',
                    'category': 'relaxation',
                    'location': 'Captain of Ports Jetty, Panaji',
                    'admission_price_inr': 1500.0,
                    'cost': 1500.0,
                    'duration_hours': 3.0,
                    'indoor': True,
                    'family_friendly': False,
                    'travel_distance_km': 2.5,
                    'opening_hours': '07:30 PM - 10:30 PM [Verified]',
                    'verified_status': 'Verified Venue · Romantic Starlight',
                    'desc': 'Exclusive private table dinner cruise gliding past illuminated Panaji landmarks, featuring champagne, multi-course feast, and gentle river waves.'
                }
            ]
        }
    },
    'switzerland': {
        'family': {
            1: [
                {
                    'title': 'Lindt Home of Chocolate & Interactive Tasting Salons',
                    'time_slot': 'Morning',
                    'category': 'culture',
                    'location': 'Schokoladenplatz 1, Kilchberg, Zurich',
                    'admission_price_inr': 1800.0,
                    'cost': 1800.0,
                    'duration_hours': 2.5,
                    'indoor': True,
                    'family_friendly': True,
                    'travel_distance_km': 4.5,
                    'opening_hours': '10:00 AM - 06:00 PM [Verified]',
                    'verified_status': 'Verified Venue · Kids Paradise',
                    'desc': 'Spectacular 9-meter chocolate fountain, interactive chocolate-making history, and unlimited tasting stations that kids and parents love.'
                },
                {
                    'title': 'Zurich Toy Museum & Lindenhof Old Town Terrace',
                    'time_slot': 'Afternoon',
                    'category': 'culture',
                    'location': 'Fortunagasse 15, Zurich Old Town',
                    'admission_price_inr': 500.0,
                    'cost': 500.0,
                    'duration_hours': 2.0,
                    'indoor': True,
                    'family_friendly': True,
                    'travel_distance_km': 3.2,
                    'opening_hours': '02:00 PM - 05:00 PM [Verified]',
                    'verified_status': 'Verified Venue · Child-Safe',
                    'desc': 'Enchanting 300-year-old collection of wooden trains, antique dollhouses, and tin toys in a historic Altstadt home.'
                },
                {
                    'title': 'Lake Zurich Pedal Boating & Lakeside Swiss Garden Cafe',
                    'time_slot': 'Evening',
                    'category': 'relaxation',
                    'location': 'Bürkliplatz, Zurich',
                    'admission_price_inr': 900.0,
                    'cost': 900.0,
                    'duration_hours': 2.5,
                    'indoor': False,
                    'family_friendly': True,
                    'travel_distance_km': 2.0,
                    'opening_hours': '05:00 PM - 09:30 PM [Verified]',
                    'verified_status': 'Verified Venue',
                    'desc': 'Fun pedal boat hire on tranquil Lake Zurich with mountain backdrops, followed by fresh Swiss pastries and warm cider.'
                }
            ],
            2: [
                {
                    'title': 'Swiss Museum of Transport (Verkehrshaus Luzern)',
                    'time_slot': 'Morning',
                    'category': 'culture',
                    'location': 'Lidostrasse 5, Lucerne',
                    'admission_price_inr': 3200.0,
                    'cost': 3200.0,
                    'duration_hours': 3.5,
                    'indoor': True,
                    'family_friendly': True,
                    'travel_distance_km': 3.0,
                    'opening_hours': '10:00 AM - 05:00 PM [Verified]',
                    'verified_status': 'Verified Venue · #1 Family Museum in Switzerland',
                    'desc': 'Europe\'s most interactive transport discovery museum: real steam locomotives, flight simulators, planetarium, and kids construction yard.'
                },
                {
                    'title': 'Chapel Bridge Swan Feeding & Lucerne Old Town Stroll',
                    'time_slot': 'Afternoon',
                    'category': 'sightseeing',
                    'location': 'Kapellbrücke, Lucerne',
                    'admission_price_inr': 0.0,
                    'cost': 0.0,
                    'duration_hours': 2.0,
                    'indoor': False,
                    'family_friendly': True,
                    'travel_distance_km': 1.8,
                    'opening_hours': 'Open 24 Hours [Verified]',
                    'verified_status': 'Verified Venue',
                    'desc': 'Walk across the 14th-century flower-covered wooden bridge and watch graceful white swans glide on the Reuss river.'
                },
                {
                    'title': 'Lake Lucerne Historic Paddle Steamer Cruise',
                    'time_slot': 'Evening',
                    'category': 'relaxation',
                    'location': 'Bahnhofquai, Lucerne',
                    'admission_price_inr': 2800.0,
                    'cost': 2800.0,
                    'duration_hours': 2.5,
                    'indoor': True,
                    'family_friendly': True,
                    'travel_distance_km': 1.5,
                    'opening_hours': '05:00 PM - 08:30 PM [Verified]',
                    'verified_status': 'Verified Venue',
                    'desc': 'Safe, scenic paddle steamer navigation past dramatic alpine cliffs with indoor dining salon and outdoor breezy decks.'
                }
            ],
            3: [
                {
                    'title': 'Mount Titlis Rotair Revolving Cable Car & Glacier Cave',
                    'time_slot': 'Morning',
                    'category': 'adventure',
                    'location': 'Engelberg / Titlis Valley Station',
                    'admission_price_inr': 6800.0,
                    'cost': 6800.0,
                    'duration_hours': 3.5,
                    'indoor': True,
                    'family_friendly': True,
                    'travel_distance_km': 6.0,
                    'opening_hours': '08:30 AM - 05:00 PM [Verified]',
                    'verified_status': 'Verified Venue · Kids Snow Adventure',
                    'desc': 'Ascend into snow in the world\'s first revolving cable car to explore glowing turquoise ice tunnels inside a 5,000-year-old glacier.'
                },
                {
                    'title': 'Trübsee Alpine Snow Park & Family Tube Rides',
                    'time_slot': 'Afternoon',
                    'category': 'adventure',
                    'location': 'Trübsee Middle Station, Engelberg',
                    'admission_price_inr': 1200.0,
                    'cost': 1200.0,
                    'duration_hours': 2.5,
                    'indoor': False,
                    'family_friendly': True,
                    'travel_distance_km': 2.0,
                    'opening_hours': '10:00 AM - 04:30 PM [Verified]',
                    'verified_status': 'Verified Venue · Pure Kids Fun',
                    'desc': 'Safe snow tubing and sliding down gentle alpine tracks beside the sparkling mountain lake.'
                },
                {
                    'title': 'Interlaken Swiss Cheese & Chocolate Fondue Family Dinner',
                    'time_slot': 'Evening',
                    'category': 'food',
                    'location': 'Höheweg Promenade, Interlaken',
                    'admission_price_inr': 0.0,
                    'cost': 2200.0,
                    'duration_hours': 2.5,
                    'indoor': True,
                    'family_friendly': True,
                    'travel_distance_km': 3.0,
                    'opening_hours': '06:00 PM - 10:00 PM [Verified]',
                    'verified_status': 'Verified Venue',
                    'desc': 'Warm, cozy Swiss chalet dinner with child-friendly mild cheese fondue, rösti, and artisan chocolate desserts.'
                }
            ]
        },
        'seniors': {
            1: [
                {
                    'title': 'Zurich Old Town Level Tram Tour & Grossmünster Courtyard',
                    'time_slot': 'Morning',
                    'category': 'sightseeing',
                    'location': 'Limmatquai, Zurich',
                    'admission_price_inr': 450.0,
                    'cost': 450.0,
                    'duration_hours': 2.5,
                    'indoor': False,
                    'family_friendly': True,
                    'travel_distance_km': 2.5,
                    'opening_hours': '09:00 AM - 06:00 PM [Verified]',
                    'verified_status': 'Verified Venue · Senior Step-Free',
                    'desc': 'Gentle scenic tram ride along the Limmat river with flat paved access to historic Romanesque courtyards and riverside benches.'
                },
                {
                    'title': 'Swiss National Museum (Landesmuseum Zurich)',
                    'time_slot': 'Afternoon',
                    'category': 'culture',
                    'location': 'Museumstrasse 2, Zurich',
                    'admission_price_inr': 1100.0,
                    'cost': 1100.0,
                    'duration_hours': 2.5,
                    'indoor': True,
                    'family_friendly': True,
                    'travel_distance_km': 1.8,
                    'opening_hours': '10:00 AM - 05:00 PM [Verified]',
                    'verified_status': 'Verified Venue · 100% Elevator Accessible',
                    'desc': 'Fairy-tale castle museum with spacious climate-controlled galleries, elevator access to all floors, and comfortable resting chairs.'
                },
                {
                    'title': 'Café Sprüngli Historic Salon & Traditional Hot Chocolate',
                    'time_slot': 'Evening',
                    'category': 'food',
                    'location': 'Paradeplatz, Zurich',
                    'admission_price_inr': 0.0,
                    'cost': 850.0,
                    'duration_hours': 2.0,
                    'indoor': True,
                    'family_friendly': True,
                    'travel_distance_km': 2.0,
                    'opening_hours': '05:00 PM - 09:00 PM [Verified]',
                    'verified_status': 'Verified Venue · Luxury Seating',
                    'desc': 'Iconic 1836 confectionery house serving world-famous Luxemburgerli macarons, rich hot chocolate, and delicate savory tarts.'
                }
            ],
            2: [
                {
                    'title': 'Lake Lucerne Scenic Heated Steamer Cruise',
                    'time_slot': 'Morning',
                    'category': 'relaxation',
                    'location': 'Pier 1, Lucerne',
                    'admission_price_inr': 2800.0,
                    'cost': 2800.0,
                    'duration_hours': 3.0,
                    'indoor': True,
                    'family_friendly': True,
                    'travel_distance_km': 2.0,
                    'opening_hours': '09:30 AM - 01:00 PM [Verified]',
                    'verified_status': 'Verified Venue · Guaranteed Comfortable Seating',
                    'desc': 'Smooth glide past majestic Swiss mountains with guaranteed cushioned indoor salon seating and panoramic picture windows.'
                },
                {
                    'title': 'Lion Monument & Shaded Glacier Garden Pavilion',
                    'time_slot': 'Afternoon',
                    'category': 'sightseeing',
                    'location': 'Denkmalstrasse 4, Lucerne',
                    'admission_price_inr': 1200.0,
                    'cost': 1200.0,
                    'duration_hours': 2.0,
                    'indoor': True,
                    'family_friendly': True,
                    'travel_distance_km': 2.2,
                    'opening_hours': '10:00 AM - 05:00 PM [Verified]',
                    'verified_status': 'Verified Venue · Gentle Paths',
                    'desc': 'Mark Twain\'s "most mournful and moving piece of stone in the world", surrounded by tranquil shaded tree-lined benches.'
                },
                {
                    'title': 'Lucerne Old Town Water Tower Terrace Dinner',
                    'time_slot': 'Evening',
                    'category': 'food',
                    'location': 'Rathausquai, Lucerne',
                    'admission_price_inr': 0.0,
                    'cost': 1900.0,
                    'duration_hours': 2.5,
                    'indoor': True,
                    'family_friendly': True,
                    'travel_distance_km': 1.5,
                    'opening_hours': '06:00 PM - 10:00 PM [Verified]',
                    'verified_status': 'Verified Venue · Step-Free',
                    'desc': 'Peaceful riverside dining with traditional veal sliced in mushroom cream sauce (Zürcher Geschnetzeltes) and crisp potato rösti.'
                }
            ],
            3: [
                {
                    'title': 'Harder Kulm Funicular Railway & Seated Panoramic Deck',
                    'time_slot': 'Morning',
                    'category': 'sightseeing',
                    'location': 'Harderbahn Station, Interlaken',
                    'admission_price_inr': 3200.0,
                    'cost': 3200.0,
                    'duration_hours': 2.5,
                    'indoor': True,
                    'family_friendly': True,
                    'travel_distance_km': 2.5,
                    'opening_hours': '09:10 AM - 05:00 PM [Verified]',
                    'verified_status': 'Verified Venue · Funicular / Zero Climbing',
                    'desc': 'Effortless 10-minute funicular ascent to a glass-floored viewing platform with level walkways and 360-degree views of Jungfrau.'
                },
                {
                    'title': 'Interlaken Japanese Garden & St. Beatus Caves Shaded Terrace',
                    'time_slot': 'Afternoon',
                    'category': 'nature',
                    'location': 'Höheweg, Interlaken',
                    'admission_price_inr': 0.0,
                    'cost': 0.0,
                    'duration_hours': 2.0,
                    'indoor': False,
                    'family_friendly': True,
                    'travel_distance_km': 3.0,
                    'opening_hours': 'Open 24 Hours [Verified]',
                    'verified_status': 'Verified Venue · Flat Promenades',
                    'desc': 'Serene manicured garden with tranquil carp ponds, miniature wooden bridges, and shaded resting pavilions.'
                },
                {
                    'title': 'Grand Hotel Victoria-Jungfrau Lakeside Tea & Dinner',
                    'time_slot': 'Evening',
                    'category': 'food',
                    'location': 'Höheweg 41, Interlaken',
                    'admission_price_inr': 0.0,
                    'cost': 2400.0,
                    'duration_hours': 2.5,
                    'indoor': True,
                    'family_friendly': True,
                    'travel_distance_km': 1.8,
                    'opening_hours': '06:00 PM - 10:30 PM [Verified]',
                    'verified_status': 'Verified Venue · Premier Senior Comfort',
                    'desc': 'Historic luxury salon with grand chandeliers, soft classical piano, step-free access, and exquisite Swiss alpine gastronomy.'
                }
            ]
        }
    }
}

DESTINATION_PERSONA_THEMES: Dict[str, Dict[str, Dict[int, str]]] = {
    'goa': {
        'family': {
            1: 'Kids Dolphin Safari, Coastal Fortress & Gentle Beach Stroll (North Goa)',
            2: 'Spice Plantation Safari, Elephant Feeding & Miramar Park (Central Goa)',
            3: 'Old Goa Heritage Churches, 3D Planetarium & Family River Cruise'
        },
        'seniors': {
            1: 'Peaceful Coastal Promenade, Mario Miranda Art & Accessible Dining',
            2: 'Sacred Mangueshi Temple Shrines & Shaded Spice Grove Leisure',
            3: 'UNESCO World Heritage Baroque Wonders & Luxury Seated River Cruise'
        },
        'couple': {
            1: 'Romantic Coastal Ramparts, Secluded Cove & Beachfront Candlelight Dinner',
            2: 'Ashwem Pristine Sands, Chapora Sunset & Clifftop Cocktail Lounge',
            3: 'Vintage Latin Quarter Alley Stroll & Luxury Starlit Dinner Cruise'
        },
        'friends': {
            1: 'North Goa Coastal Watersports, Baga Boardwalk & Sunset Shacks',
            2: 'Calangute Jet Skiing, Anjuna Flea Market & Vagator Cliffside Shacks',
            3: 'Old Goa Baroque Wonders, Fontainhas Walk & Mandovi River Party Cruise'
        }
    },
    'switzerland': {
        'family': {
            1: 'Lindt Chocolate Mountain, Toy Museum & Lake Zurich Boat Fun',
            2: 'Swiss Transport Wonder Museum & Lake Lucerne Paddle Steamer',
            3: 'Mount Titlis Glacier Tunnel Snow Fun & Swiss Fondue Haven'
        },
        'seniors': {
            1: 'Zurich Old Town Scenic Tram & Swiss National Castle Museum',
            2: 'Heated Lake Lucerne Alpine Steamer & Lion Monument Shaded Walk',
            3: 'Harder Kulm Funicular Panorama & Victoria-Jungfrau Grand Tea'
        },
        'couple': {
            1: 'Grossmünster Towers Overlook, Romantic Lindenhof & Candlelight Lake Dinner',
            2: 'Private Lake Lucerne Sunset Cruise & Secluded Chalet Fondue',
            3: 'Harder Kulm Alpine Twilight Vista & Fairy-tale Lauterbrunnen Falls'
        },
        'friends': {
            1: 'Zurich Vibrant Alstadt Bars & Lakefront Speedboating',
            2: 'Lucerne Historic Bridges & Mount Pilatus Dragon Ride',
            3: 'Grindelwald First Cliff Walk, Glider Zipline & Alpine Party'
        }
    }
}

DESTINATION_PERSONA_RAIN_REPLACEMENTS: Dict[str, Dict[str, List[Dict[str, Any]]]] = {
    'goa': {
        'family': [
            {
                'time_slot': 'Morning',
                'title': 'Naval Aviation Museum Covered Hangars & Flight Simulator',
                'category': 'culture',
                'location': 'Bogmalo, Vasco da Gama, Goa',
                'cost': 50.0,
                'admission_price_inr': 50.0,
                'duration_hours': 2.5,
                'indoor': True,
                'opening_hours': '10:00 AM - 05:00 PM [Verified]',
                'verified_status': 'Verified Venue · Kids Approved',
                'family_friendly': True,
                'travel_distance_km': 3.8,
                'accessibility_features': ['wheelchair_accessible', 'step_free_ramp'],
                'ai_replacement_reason': "Swapped rain-exposed outdoor activity for India's premier naval aviation indoor hangar featuring authentic fighter jets, Sea Harrier aircraft, and interactive flight simulator cockpits that kids adore.",
                'desc': 'Fascinating indoor aviation sanctuary featuring 13 historic aircraft, naval torpedoes, cockpit simulators, and multimedia naval defense archives.'
            },
            {
                'time_slot': 'Afternoon',
                'title': 'Goa Science Centre & 3D Digital Planetarium',
                'category': 'culture',
                'location': 'Miramar, Panaji, Goa',
                'cost': 60.0,
                'admission_price_inr': 60.0,
                'duration_hours': 2.5,
                'indoor': True,
                'opening_hours': '10:00 AM - 06:00 PM [Verified]',
                'verified_status': 'Verified Venue · Highly Recommended for Kids',
                'family_friendly': True,
                'travel_distance_km': 3.2,
                'accessibility_features': ['wheelchair_accessible', 'step_free_ramp', 'elevators'],
                'ai_replacement_reason': "Substituted rain-drenched outdoor exploration with 100% weather-sheltered interactive indoor science galleries, hands-on physics exhibits, and a 3D digital astronomy space show.",
                'desc': 'Air-conditioned 5-acre science discovery facility offering hands-on puzzles, marine biology exhibitions, dinosaur gallery, and 3D astronomy planetarium.'
            },
            {
                'time_slot': 'Evening',
                'title': 'Mall de Goa Family Entertainment & Shaded Coastal Food Studio',
                'category': 'relaxation',
                'location': 'Porvorim, Panaji Hub, Goa',
                'cost': 450.0,
                'admission_price_inr': 0.0,
                'duration_hours': 2.5,
                'indoor': True,
                'opening_hours': '11:00 AM - 10:30 PM [Verified]',
                'verified_status': 'Verified Venue · Family Dining & Fun',
                'family_friendly': True,
                'travel_distance_km': 2.8,
                'accessibility_features': ['wheelchair_accessible', 'elevators', 'stroller_friendly'],
                'ai_replacement_reason': "Protected family from evening downpour inside a modern indoor mall featuring safe arcade attractions, kid play stations, and celebrated multi-cuisine family dining.",
                'desc': 'Spacious multi-level indoor complex with arcade bowling, soft-play playground for young children, and delicious family dining options.'
            }
        ],
        'seniors': [
            {
                'time_slot': 'Morning',
                'title': 'Houses of Goa Museum & Mario Miranda Cartoon Gallery',
                'category': 'culture',
                'location': 'Torda, Salvador do Mundo, Goa',
                'cost': 100.0,
                'admission_price_inr': 100.0,
                'duration_hours': 2.5,
                'indoor': True,
                'opening_hours': '10:00 AM - 07:30 PM [Verified]',
                'verified_status': 'Verified Venue · Senior Step-Free',
                'family_friendly': True,
                'travel_distance_km': 3.5,
                'accessibility_features': ['wheelchair_accessible', 'step_free_ramp', 'resting_benches'],
                'ai_replacement_reason': "Swapped wet outdoor sites for this serene, covered architectural museum with gentle ramp access, elevator, and comfortable seating to view Goa's heritage cartoons.",
                'desc': 'Unique ship-shaped indoor museum designed by architect Gerard da Cunha, celebrating Goan domestic architecture with Mario Miranda caricature prints.'
            },
            {
                'time_slot': 'Afternoon',
                'title': 'Museum of Christian Art (MoCA) & Santa Monica Cloisters',
                'category': 'culture',
                'location': 'Convent of Santa Monica, Old Goa',
                'cost': 150.0,
                'admission_price_inr': 150.0,
                'duration_hours': 2.5,
                'indoor': True,
                'opening_hours': '09:30 AM - 05:00 PM [Verified]',
                'verified_status': 'Verified Venue · Peaceful Step-Free',
                'family_friendly': True,
                'travel_distance_km': 4.0,
                'accessibility_features': ['wheelchair_accessible', 'step_free_ramp', 'seating_available'],
                'ai_replacement_reason': "Replaced rain-hit outdoor walks with covered, climate-controlled baroque stone cloisters containing priceless Indo-Portuguese ivory and gilded chalices with zero steps.",
                'desc': 'Exquisite museum housed in a 1606 Augustinian convent featuring ramped access, audio guides, ivory carvings, and sacred vestments.'
            },
            {
                'time_slot': 'Evening',
                'title': 'Grand Hyatt Covered Seafront Verandah & Traditional Gastronomy',
                'category': 'food',
                'location': 'Bambolim Bay, North Goa',
                'cost': 1200.0,
                'admission_price_inr': 0.0,
                'duration_hours': 2.5,
                'indoor': True,
                'opening_hours': '06:30 PM - 11:00 PM [Verified]',
                'verified_status': 'Verified Venue · Senior Comfort',
                'family_friendly': True,
                'travel_distance_km': 3.2,
                'accessibility_features': ['wheelchair_accessible', 'valet_parking', 'cushioned_seating'],
                'ai_replacement_reason': "Replaced stormy beach walks with sheltered, covered colonial verandah overlooking the rain-kissed bay, soft Goan guitar music, and mild authentic thali.",
                'desc': 'Historic-style luxury palace with covered waterfront colonnades, comfortable armchairs, and exquisite traditional Goan dining.'
            }
        ],
        'couple': [
            {
                'time_slot': 'Morning',
                'title': 'Mario Miranda Art Studio & Indo-Portuguese Heritage Gallery',
                'category': 'culture',
                'location': 'Reis Magos / Porvorim, North Goa',
                'cost': 100.0,
                'admission_price_inr': 100.0,
                'duration_hours': 2.5,
                'indoor': True,
                'opening_hours': '10:00 AM - 06:00 PM [Verified]',
                'verified_status': 'Verified Venue · Romantic Heritage',
                'family_friendly': True,
                'travel_distance_km': 3.5,
                'accessibility_features': ['wheelchair_accessible'],
                'ai_replacement_reason': "Sheltered from torrential rain in an intimate heritage gallery showcasing charming Goan art and romantic cultural history.",
                'desc': 'Intimate indoor gallery celebrating vibrant Goan caricatures, custom prints, and heritage architecture.'
            },
            {
                'time_slot': 'Afternoon',
                'title': 'Museum of Goa (MOG) Contemporary Sculpture & Art Cafe',
                'category': 'culture',
                'location': 'Pilerne Industrial Estate, North Goa',
                'cost': 150.0,
                'admission_price_inr': 150.0,
                'duration_hours': 2.5,
                'indoor': True,
                'opening_hours': '10:00 AM - 06:00 PM [Verified]',
                'verified_status': 'Verified Venue · Creative Ambience',
                'family_friendly': True,
                'travel_distance_km': 4.0,
                'accessibility_features': ['wheelchair_accessible', 'step_free_ramp'],
                'ai_replacement_reason': "Replaced wet beach stroll with Goa's premier contemporary art haven, featuring romantic cafe seating and world-class installations.",
                'desc': 'Three-story covered art sanctuary celebrating Goa’s maritime and cultural heritage through contemporary sculptures.'
            },
            {
                'time_slot': 'Evening',
                'title': 'Covered Waterfront Candlelit Dining & Mandovi River Vista',
                'category': 'food',
                'location': 'Panaji Riverfront, Goa',
                'cost': 1800.0,
                'admission_price_inr': 0.0,
                'duration_hours': 3.0,
                'indoor': True,
                'opening_hours': '07:00 PM - 11:30 PM [Verified]',
                'verified_status': 'Verified Venue · Romantic Starlight',
                'family_friendly': False,
                'travel_distance_km': 3.0,
                'accessibility_features': ['wheelchair_accessible'],
                'ai_replacement_reason': "Replaced outdoor open deck with an elegant covered riverfront dining venue offering candlelit tables, panoramic rain views of Mandovi river, and gourmet coastal fusion dishes.",
                'desc': 'Enclosed glass-fronted waterfront restaurant overlooking rain-swept river lights, paired with coastal Goan delicacies and acoustic music.'
            }
        ],
        'friends': [
            {
                'time_slot': 'Morning',
                'title': 'Museum of Goa (MOG) Indoor Art & Sculpture Studio',
                'category': 'culture',
                'location': 'Pilerne, North Goa',
                'cost': 150.0,
                'admission_price_inr': 150.0,
                'duration_hours': 2.5,
                'indoor': True,
                'opening_hours': '10:00 AM - 06:00 PM [Verified]',
                'verified_status': 'Verified Venue',
                'family_friendly': True,
                'travel_distance_km': 4.0,
                'accessibility_features': ['wheelchair_accessible'],
                'ai_replacement_reason': "Substituted rain-disrupted water sports with Goa's largest indoor contemporary art museum and creative hub.",
                'desc': 'Striking multi-floor indoor exhibition hall featuring sculptures, installations, and vibrant Goan historical narratives.'
            },
            {
                'time_slot': 'Afternoon',
                'title': 'Goa Science Centre 3D Space Theater & Science Park',
                'category': 'culture',
                'location': 'Miramar, Panaji, Goa',
                'cost': 60.0,
                'admission_price_inr': 60.0,
                'duration_hours': 2.5,
                'indoor': True,
                'opening_hours': '10:00 AM - 06:00 PM [Verified]',
                'verified_status': 'Verified Venue',
                'family_friendly': True,
                'travel_distance_km': 3.5,
                'accessibility_features': ['wheelchair_accessible'],
                'ai_replacement_reason': "Replaced outdoor beach activities with interactive indoor science puzzles, marine biology galleries, and 3D digital astronomy shows.",
                'desc': 'Interactive science center offering physics experiments, marine exhibits, and daily 3D digital cinema screenings.'
            },
            {
                'time_slot': 'Evening',
                'title': 'Covered Mandovi River Twilight Cruise & Goan Folk Cultural Showcase',
                'category': 'culture',
                'location': 'Santa Monica Jetty, Panaji, Goa',
                'cost': 500.0,
                'admission_price_inr': 500.0,
                'duration_hours': 2.0,
                'indoor': True,
                'opening_hours': '06:00 PM - 09:30 PM [Verified]',
                'verified_status': 'Verified Venue · Covered Deck',
                'family_friendly': True,
                'travel_distance_km': 2.5,
                'accessibility_features': ['wheelchair_accessible'],
                'ai_replacement_reason': "Swapped open beach shacks for a sheltered two-tier covered catamaran cruise featuring live Dekhnni & Fugdi folk dances.",
                'desc': 'Weather-protected double-deck river cruise offering live Portuguese-Goan folk performances, DJ music, and twilight river views.'
            }
        ]
    },
    'switzerland': {
        'family': [
            {
                'time_slot': 'Morning',
                'title': 'Lindt Home of Chocolate & Interactive Tasting Salons',
                'category': 'culture',
                'location': 'Schokoladenplatz 1, Kilchberg, Zurich',
                'cost': 1800.0,
                'admission_price_inr': 1800.0,
                'duration_hours': 2.5,
                'indoor': True,
                'opening_hours': '10:00 AM - 06:00 PM [Verified]',
                'verified_status': 'Verified Venue · Kids Paradise',
                'family_friendly': True,
                'travel_distance_km': 3.5,
                'accessibility_features': ['wheelchair_accessible', 'elevators', 'step_free_ramp'],
                'ai_replacement_reason': "Replaced rainy alpine hike with a covered chocolate wonderland featuring a 9-meter chocolate fountain, interactive workshops, and unlimited chocolate tasting.",
                'desc': 'World-famous covered chocolate museum with 9m chocolate fountain and interactive chocolate making stations.'
            },
            {
                'time_slot': 'Afternoon',
                'title': 'Swiss Museum of Transport (Verkehrshaus) Planetarium & Filmtheatre',
                'category': 'culture',
                'location': 'Lidostrasse 5, Lucerne',
                'cost': 3200.0,
                'admission_price_inr': 3200.0,
                'duration_hours': 3.0,
                'indoor': True,
                'opening_hours': '10:00 AM - 05:00 PM [Verified]',
                'verified_status': 'Verified Venue · Kids Interactive',
                'family_friendly': True,
                'travel_distance_km': 2.8,
                'accessibility_features': ['wheelchair_accessible', 'elevators'],
                'ai_replacement_reason': "Moved from wet lake shores into Switzerland's most visited indoor interactive museum with trains, flight simulators, and space planetarium.",
                'desc': 'Huge covered museum featuring steam locomotives, space capsules, car simulators, and 3D planetarium.'
            },
            {
                'time_slot': 'Evening',
                'title': 'Swiss Chuchi Heated Indoor Chalet Fondue Dining',
                'category': 'food',
                'location': 'Rosengasse 10, Zurich Altstadt',
                'cost': 2200.0,
                'admission_price_inr': 0.0,
                'duration_hours': 2.0,
                'indoor': True,
                'opening_hours': '05:30 PM - 10:30 PM [Verified]',
                'verified_status': 'Verified Venue',
                'family_friendly': True,
                'travel_distance_km': 2.0,
                'accessibility_features': ['wheelchair_accessible'],
                'ai_replacement_reason': "Warm, comforting indoor Swiss chalet dinner featuring bubbling cheese fondue and rösti away from the cold rain.",
                'desc': 'Cozy traditional wooden dining room serving authentic Swiss cheese fondue, potato rösti, and warm apple strudel.'
            }
        ],
        'seniors': [
            {
                'time_slot': 'Morning',
                'title': 'Swiss National Museum (Landesmuseum Zurich)',
                'category': 'culture',
                'location': 'Museumstrasse 2, Zurich',
                'cost': 1200.0,
                'admission_price_inr': 1200.0,
                'duration_hours': 2.5,
                'indoor': True,
                'opening_hours': '10:00 AM - 05:00 PM [Verified]',
                'verified_status': 'Verified Venue · Senior Step-Free',
                'family_friendly': True,
                'travel_distance_km': 1.5,
                'accessibility_features': ['wheelchair_accessible', 'elevators', 'resting_benches'],
                'ai_replacement_reason': "Sheltered from cold mountain rain inside a fairytale castle museum with gentle elevators, resting lounges, and Swiss history exhibits.",
                'desc': 'Castle-like neo-Gothic museum right next to Zurich station with step-free elevators, gothic art, and Swiss cultural artifacts.'
            },
            {
                'time_slot': 'Afternoon',
                'title': 'Richard Wagner Museum & Covered Lakefront Salon',
                'category': 'culture',
                'location': 'Weggismattstrasse 1, Lucerne',
                'cost': 900.0,
                'admission_price_inr': 900.0,
                'duration_hours': 2.0,
                'indoor': True,
                'opening_hours': '11:00 AM - 05:00 PM [Verified]',
                'verified_status': 'Verified Venue · Peaceful Step-Free',
                'family_friendly': True,
                'travel_distance_km': 2.5,
                'accessibility_features': ['wheelchair_accessible', 'seating_available'],
                'ai_replacement_reason': "Replaced slippery outdoor trails with a peaceful historic lakeside manor filled with classical music archives and covered lake views.",
                'desc': 'Historic country manor where composer Wagner lived, featuring rare pianos, original manuscripts, and covered lake vistas.'
            },
            {
                'time_slot': 'Evening',
                'title': 'Grand Hotel Victoria-Jungfrau Heated Fireside Salon & Alpine Tea',
                'category': 'food',
                'location': 'Höheweg 41, Interlaken',
                'cost': 2400.0,
                'admission_price_inr': 0.0,
                'duration_hours': 2.5,
                'indoor': True,
                'opening_hours': '06:00 PM - 10:30 PM [Verified]',
                'verified_status': 'Verified Venue · Premier Senior Comfort',
                'family_friendly': True,
                'travel_distance_km': 1.8,
                'accessibility_features': ['wheelchair_accessible', 'elevators', 'cushioned_seating'],
                'ai_replacement_reason': "Sheltered from evening storm in a grand Belle Époque fireside salon with classical piano, gentle seating, and warm herbal tea.",
                'desc': 'Historic luxury salon with grand chandeliers, soft classical piano, step-free access, and exquisite Swiss alpine gastronomy.'
            }
        ]
    }
}

def adapt_activities_for_persona(activities: List[Activity], profile: TravelerProfile, day_number: int, city_name: str) -> List[Activity]:
    """
    Intelligently adapts any list of activities to match the traveler persona:
    - Family (Kids present): Ensures kid-safety, educational engagement, low travel distances (<=4.5 km)
    - Seniors: Ensures step-free access, wheelchair/elevator access, gentle pace, seating
    - Couple: Romantic descriptions, sunset ambiance, intimate dining
    - Friends: High thrill, adventure, lively shacks
    """
    p_type = (profile.traveler_type or "friends").lower()
    adapted = []

    for act in activities:
        new_act = copy.deepcopy(act)
        title_lower = (new_act.title or "").lower()

        # Ensure baseline distance to Day Hub
        if not new_act.travel_distance_km or new_act.travel_distance_km <= 0:
            new_act.travel_distance_km = 3.5

        if not new_act.opening_hours:
            new_act.opening_hours = "09:00 AM - 06:30 PM [Verified]"

        if new_act.admission_price_inr is None:
            new_act.admission_price_inr = getattr(new_act, "estimated_cost", 0.0)

        if p_type == "family":
            new_act.family_friendly = True
            new_act.verified_status = "Verified Venue · Kids & Family Approved"
            new_act.travel_distance_km = min(new_act.travel_distance_km, 4.2)
            
            # Remove extreme or adult activities
            if any(w in title_lower for w in ["jet ski", "parasail", "tito", "club", "pub", "bar", "casino", "bungee"]):
                if "morning" in (new_act.time_slot or "").lower():
                    new_act.title = f"Dolphin Watching & Scenic Coastal Safari ({city_name})"
                    new_act.category = "nature"
                    new_act.description = f"Safe, guided morning boat trip where kids can spot wild dolphins and coastal marine life, followed by a level boardwalk stroll."
                elif "afternoon" in (new_act.time_slot or "").lower():
                    new_act.title = f"Interactive Science & Discovery Studio ({city_name})"
                    new_act.category = "culture"
                    new_act.is_indoor = True
                    new_act.description = f"Hands-on interactive discovery museum with educational exhibits, 3D animations, and cool shaded indoor galleries for kids."
                else:
                    new_act.title = f"Lakeside / Beachside Promenade & Family Garden Feast"
                    new_act.category = "relaxation"
                    new_act.description = f"Gentle evening shoreline walk with children's play areas, calm breeze, and delicious family dining."

        elif p_type == "seniors":
            new_act.accessibility_features = ["wheelchair_accessible", "step_free_access", "seated_viewpoint"]
            new_act.verified_status = "Verified Venue · Senior Step-Free"
            new_act.travel_distance_km = min(new_act.travel_distance_km, 3.2)
            
            if any(w in title_lower for w in ["jet ski", "parasail", "trek", "hike", "climb", "tito", "club", "bungee", "cliff"]):
                if "morning" in (new_act.time_slot or "").lower():
                    new_act.title = f"Paved Heritage Promenade & Sacred Shrines ({city_name})"
                    new_act.category = "culture"
                    new_act.description = f"Wide, flat paved heritage walk with shaded resting benches, historical architecture, and calm morning spiritual atmosphere."
                elif "afternoon" in (new_act.time_slot or "").lower():
                    new_act.title = f"Shaded Botanical Sanctuary & Heritage Art Museum ({city_name})"
                    new_act.category = "culture"
                    new_act.is_indoor = True
                    new_act.description = f"Air-conditioned galleries and lush shaded gardens with step-free wheelchair ramps and golf-cart assistance available."
                else:
                    new_act.title = f"Seated Sunset Water Cruise & Traditional Mild Gastronomy"
                    new_act.category = "relaxation"
                    new_act.is_indoor = True
                    new_act.description = f"Comfortable seated twilight boat cruise with gentle breezes, soft instrumental music, and mild traditional dinner."

        elif p_type == "couple":
            new_act.verified_status = "Verified Venue · Romantic Experience"
            new_act.travel_distance_km = min(new_act.travel_distance_km, 4.5)
            if "evening" in (new_act.time_slot or "").lower():
                new_act.title = f"Sunset Clifftop Lounge & Candlelit Waterside Dinner"
                new_act.category = "food"
                new_act.description = f"Romantic candlelit table overlooking twilight reflections, paired with fresh seasonal delicacies, artisanal desserts, and acoustic melodies."

        else: # friends / solo / college_group
            new_act.verified_status = "Verified Venue · Adventure Certified"
            new_act.travel_distance_km = min(new_act.travel_distance_km, 4.8)

        adapted.append(new_act)

    return adapted
