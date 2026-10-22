"""
Real-World Destination Knowledge Base
Comprehensive authentic, verified, iconic tourist attractions, exact locations,
real entrance fees in Indian Rupees (₹), and real activities for destinations across India and internationally.
"""

REAL_PLACES_DATABASE = {   'alappuzha': {   'afternoon': [   {   'category': 'sightseeing',
                                          'cost': 0.0,
                                          'desc': 'Historic port beach featuring the weathered iron pilings of the sea bridge once used to '
                                                  'load merchant ships.',
                                          'indoor': False,
                                          'location': 'Beach Road, Alappuzha',
                                          'title': 'Alappuzha Beach & 150-Year-Old Historic Sea Bridge'},
                                      {   'category': 'culture',
                                          'cost': 250.0,
                                          'desc': 'Stunning private museum showcasing Swarovski crystals, porcelain, Tanjore masterpieces, '
                                                  'and antique furniture.',
                                          'indoor': True,
                                          'location': 'CCSB Rd, Alappuzha',
                                          'title': 'Ravi Karunakaran Museum of Crystal & Ivory'},
                                      {   'category': 'adventure',
                                          'cost': 600.0,
                                          'desc': 'Isolated 10-acre island sanctuary in Vembanad Lake home to pintail ducks, cormorants, '
                                                  'and migratory birds.',
                                          'indoor': False,
                                          'location': 'Muhamma, Alappuzha',
                                          'title': 'Pathiramanal Island Bird Sanctuary Canoe Safari'}],
                     'evening': [   {   'category': 'relaxation',
                                        'cost': 250.0,
                                        'desc': 'Watch the sunset glow over the Arabian Sea while sipping fresh ginger tea and snacking on '
                                                'spicy banana fritters.',
                                        'indoor': False,
                                        'location': 'Alappuzha Beach Boardwalk',
                                        'title': 'Alleppey Beach Sunset & Seafront Cafe'},
                                    {   'category': 'food',
                                        'cost': 850.0,
                                        'desc': 'Authentic taste of spicy crab roast, tiger prawns, and tapioca (kappa) with '
                                                'coconut-infused Karimeen pollichathu.',
                                        'indoor': True,
                                        'location': 'Kuttanad Canal Route, Alappuzha',
                                        'title': 'Fresh Toddy Shop & Karimeen Seafood Dinner'},
                                    {   'category': 'adventure',
                                        'cost': 800.0,
                                        'desc': 'Narrow canal shikara boat gliding through village waterways beneath hanging palm trees '
                                                'and lotus flowers.',
                                        'indoor': False,
                                        'location': 'Champakulam, Alappuzha',
                                        'title': 'Kuttanad Canal Village Kayaking / Shikara Ride'}],
                     'indoor_replacements': [   {   'cost': 250.0,
                                                    'desc': 'Completely covered indoor sanctuary filled with rare global antique '
                                                            'collections and royal portraits.',
                                                    'location': 'Alappuzha Town',
                                                    'title': 'Ravi Karunakaran Art & Crystal Museum'},
                                                {   'cost': 100.0,
                                                    'desc': 'Enclosed indoor museum demonstrating traditional Kerala coconut fiber '
                                                            'weaving, crafts, and history.',
                                                    'location': 'Kalavoor, Alappuzha',
                                                    'title': 'International Coir Museum & Live Loom Center'}],
                     'morning': [   {   'category': 'nature',
                                        'cost': 4500.0,
                                        'desc': 'Sail through the tranquil backwaters where the legendary Nehru Trophy Boat Race takes '
                                                'place annually.',
                                        'indoor': False,
                                        'location': 'Punnamada Jetty, Alappuzha',
                                        'title': 'Punnamada Lake Houseboat Boarding & Backwater Safari'},
                                    {   'category': 'culture',
                                        'cost': 50.0,
                                        'desc': 'Climb the red-and-white 1862 lighthouse for a 360-degree aerial panorama over the Arabian '
                                                'Sea and palm canopy.',
                                        'indoor': True,
                                        'location': 'Civil Station Ward, Alappuzha',
                                        'title': 'Alappuzha Lighthouse & Maritime Heritage Museum'},
                                    {   'category': 'nature',
                                        'cost': 0.0,
                                        'desc': 'Quiet morning beach walk watching traditional fishermen launch wooden canoes into the '
                                                'gentle morning waves.',
                                        'indoor': False,
                                        'location': 'Mararikulam North, Alappuzha',
                                        'title': 'Marari Beach Sunrise Walk & Fishermen Hamlet'}],
                     'name': 'Alappuzha (Alleppey), Kerala, India',
                     'themes': {   1: 'Vembanad Backwaters, Kettuvallam Houseboat & Village Canals',
                                   2: 'Alappuzha Beach, Historic Lighthouse & Marari Seaside',
                                   3: 'Kuttanad Below-Sea-Level Farming & Coir Handicrafts'}},
    'amritsar': {   'afternoon': [   {   'category': 'culture',
                                         'cost': 50.0,
                                         'desc': "World's first museum dedicated to the 1947 partition of India, preserving oral history "
                                                 'recordings, personal letters, and refugee artifacts.',
                                         'indoor': True,
                                         'location': 'Town Hall, Katra Ahluwalia, Amritsar',
                                         'title': 'The Partition Museum (Town Hall)'},
                                     {   'category': 'culture',
                                         'cost': 180.0,
                                         'desc': '18th-century military fortress built by Maharaja Ranjit Singh, featuring the Toshakhana '
                                                 'treasury and ancient coin museums.',
                                         'indoor': True,
                                         'location': 'Old Cantt Rd, Amritsar',
                                         'title': 'Gobindgarh Fort & 7D Heritage Show'},
                                     {   'category': 'shopping',
                                         'cost': 200.0,
                                         'desc': 'Vibrant bazaars renowned for colorful hand-embroidered Phulkari dupattas, Punjabi '
                                                 'juttis, and papad-warian.',
                                         'indoor': True,
                                         'location': 'Hall Bazaar, Amritsar',
                                         'title': 'Hall Bazaar & Katra Jaimal Singh Phulkari Trail'}],
                    'evening': [   {   'category': 'culture',
                                       'cost': 0.0,
                                       'desc': 'Electrifying military ceremony characterized by synchronized high-kick drill movements by '
                                               'BSF soldiers as national flags are lowered at sunset.',
                                       'indoor': False,
                                       'location': 'Wagah Border, 30 km from Amritsar',
                                       'title': 'Wagah Border Indo-Pak Beating Retreat Ceremony'},
                                   {   'category': 'food',
                                       'cost': 300.0,
                                       'desc': 'Crisp flaky tandoor-baked potato and paneer kulcha topped with desi ghee, spicy chickpea '
                                               'chole, and a tall steel glass of sweet malai lassi.',
                                       'indoor': True,
                                       'location': 'Chowk Passian / Maqbool Rd, Amritsar',
                                       'title': 'Authentic Amritsari Kulcha with Chole & Lassi (Kesar Da Dhaba)'},
                                   {   'category': 'culture',
                                       'cost': 0.0,
                                       'desc': 'Witness the sacred night procession where the Guru Granth Sahib scripture is carried in a '
                                               'golden palanquin to the Akal Takht for the night.',
                                       'indoor': True,
                                       'location': 'Sri Harmandir Sahib',
                                       'title': 'Golden Temple Illumination & Palki Sahib Night Ceremony'}],
                    'indoor_replacements': [   {   'cost': 50.0,
                                                   'desc': 'Air-conditioned museum halls preserving precious historical archives safely '
                                                           'indoors.',
                                                   'location': 'Town Hall, Amritsar',
                                                   'title': 'The Partition Museum Town Hall'},
                                               {   'cost': 180.0,
                                                   'desc': 'Covered stone bastions holding historic armaments and visual 7D theaters.',
                                                   'location': 'Old Cantt Rd, Amritsar',
                                                   'title': 'Gobindgarh Fort Indoor Heritage & Warfare Galleries'}],
                    'morning': [   {   'category': 'culture',
                                       'cost': 0.0,
                                       'desc': 'Most sacred Sikh shrine in the world, clad in pure gold foil and surrounded by the holy '
                                               'Amrit Sarovar pool where hymns play 24 hours.',
                                       'indoor': True,
                                       'location': 'Golden Temple Rd, Amritsar',
                                       'title': 'Golden Temple (Sri Harmandir Sahib) & Pavitra Sarovar'},
                                   {   'category': 'culture',
                                       'cost': 0.0,
                                       'desc': "World's largest free community kitchen serving hot nutritious dal, roti, and kheer to over "
                                               '100,000 visitors every day regardless of religion or caste.',
                                       'indoor': True,
                                       'location': 'Inside Golden Temple Complex',
                                       'title': 'Guru Ka Langar Community Kitchen Seva'},
                                   {   'category': 'culture',
                                       'cost': 0.0,
                                       'desc': 'Solemn historic site of the tragic 1919 massacre, preserving the bullet marks on brick '
                                               "walls and the historic Martyrs' Well.",
                                       'indoor': False,
                                       'location': 'Near Golden Temple, Amritsar',
                                       'title': 'Jallianwala Bagh Historic Memorial Park'}],
                    'name': 'Amritsar, Punjab, India',
                    'themes': {   1: 'Golden Temple (Sri Harmandir Sahib) & Pavitra Sarovar',
                                  2: 'Jallianwala Bagh Memorial & Partition Museum',
                                  3: 'Wagah Border Beating Retreat & Amritsari Gastronomy'}},
    'bengaluru': {   'afternoon': [   {   'category': 'culture',
                                          'cost': 75.0,
                                          'desc': 'Hands-on interactive science museum with animatronic dinosaurs, aerospace engine '
                                                  'exhibits, and biotech galleries.',
                                          'indoor': True,
                                          'location': 'Kasturba Rd, Cubbon Park, Bengaluru',
                                          'title': 'Visvesvaraya Industrial & Technological Museum (VITM)'},
                                      {   'category': 'culture',
                                          'cost': 50.0,
                                          'desc': 'Exquisite 1791 teakwood palace adorned with carved pillars, floral motifs, and nearby '
                                                  "Asia's most fragrant wholesale flower market.",
                                          'indoor': True,
                                          'location': 'Chamrajpet, Bengaluru',
                                          'title': "Tipu Sultan's Summer Palace & KR Flower Market"},
                                      {   'category': 'culture',
                                          'cost': 50.0,
                                          'desc': 'Colonial heritage mansion displaying modern Indian art sculptures, paintings by Amrita '
                                                  'Sher-Gil, and peaceful garden cafe.',
                                          'indoor': True,
                                          'location': 'Manikyavelu Mansion, Palace Rd, Bengaluru',
                                          'title': 'National Gallery of Modern Art (NGMA Bengaluru)'}],
                     'evening': [   {   'category': 'food',
                                        'cost': 200.0,
                                        'desc': 'Crispy golden butter-laden Benne Masala Dosa served with spicy mint and coconut chutney, '
                                                'paired with frothy tumbler filter coffee.',
                                        'indoor': True,
                                        'location': 'Malleshwaram / Gandhi Bazaar, Bengaluru',
                                        'title': 'Legendary CTR / Vidyarthi Bhavan Benne Masala Dosa'},
                                    {   'category': 'sightseeing',
                                        'cost': 0.0,
                                        'desc': '300-acre green lung of the city leading to the grand Neo-Dravidian illuminated stone '
                                                "facade of Karnataka's legislative parliament.",
                                        'indoor': False,
                                        'location': 'Ambedkar Veedhi, Bengaluru',
                                        'title': 'Cubbon Park Bamboo Groves & Vidhana Soudha Illuminated View'},
                                    {   'category': 'food',
                                        'cost': 800.0,
                                        'desc': 'Sample locally crafted mango cider, craft ales, and international fusion dining in the '
                                                'pub capital of India.',
                                        'indoor': True,
                                        'location': '100 Feet Rd, Indiranagar, Bengaluru',
                                        'title': 'Indiranagar / Koramangala Craft Gastronomy & Brew Trail'}],
                     'indoor_replacements': [   {   'cost': 75.0,
                                                    'desc': '5 floors of indoor interactive science experiments and aerospace galleries.',
                                                    'location': 'Cubbon Park, Bengaluru',
                                                    'title': 'Visvesvaraya Science Museum & Engine Hall'},
                                                {   'cost': 80.0,
                                                    'desc': "Indoor display of India's indigenous aircraft, jet engines, and flight "
                                                            'simulators.',
                                                    'location': 'Marathahalli, Bengaluru',
                                                    'title': 'HAL Heritage Centre & Aerospace Museum'},
                                                {   'cost': 0.0,
                                                    'desc': 'Massive air-conditioned retail, multiplex, and dining destination.',
                                                    'location': 'Whitefield / Rajajinagar, Bengaluru',
                                                    'title': 'Phoenix Marketcity / Orion Mall'}],
                     'morning': [   {   'category': 'culture',
                                        'cost': 250.0,
                                        'desc': "1887 royal palace inspired by England's Windsor Castle, featuring fortified towers, wood "
                                                'carvings, and paintings by Raja Ravi Varma.',
                                        'indoor': True,
                                        'location': 'Vasanth Nagar, Bengaluru',
                                        'title': 'Bangalore Palace & Tudor-Style Royal Castle'},
                                    {   'category': 'nature',
                                        'cost': 50.0,
                                        'desc': '240-acre botanical paradise commissioned by Hyder Ali, housing century-old trees and the '
                                                "famous iron-and-glass conservatory modeled after London's Crystal Palace.",
                                        'indoor': False,
                                        'location': 'Mavalli, Bengaluru',
                                        'title': 'Lalbagh Botanical Garden & 1889 Historic Glass House'},
                                    {   'category': 'adventure',
                                        'cost': 350.0,
                                        'desc': 'Open safari through rugged scrub forest observing Royal Bengal tigers, Asiatic lions, and '
                                                "India's first butterfly conservatory.",
                                        'indoor': False,
                                        'location': 'Bannerghatta Rd, Bengaluru',
                                        'title': 'Bannerghatta Biological Park Tiger & Lion Safari'}],
                     'name': 'Bengaluru (Bangalore), Karnataka, India',
                     'themes': {   1: 'Royal Bangalore Palace, Tudor Architecture & Tipu Sultan Fort',
                                   2: 'Lalbagh Glass House, Cubbon Park & Science Museum',
                                   3: 'Bangalore Masala Dosa, Filter Coffee & Craft Brewery Trail'}},
    'chennai': {   'afternoon': [   {   'category': 'culture',
                                        'cost': 50.0,
                                        'desc': "The first English fortress in India founded in 1644, housing St. Mary's Church and "
                                                'colonial military artifacts.',
                                        'indoor': True,
                                        'location': 'Rajaji Salai, Chennai',
                                        'title': 'Fort St. George & Clive Collection Museum'},
                                    {   'category': 'culture',
                                        'cost': 50.0,
                                        'desc': "India's second-oldest museum housing the world-famous Chola bronzes including Nataraja "
                                                'and Amaravati Buddhist sculptures.',
                                        'indoor': True,
                                        'location': 'Pantheon Rd, Egmore, Chennai',
                                        'title': 'Government Museum Egmore & National Art Gallery'},
                                    {   'category': 'culture',
                                        'cost': 0.0,
                                        'desc': 'Stately 16th-century Neo-Gothic cathedral built over the tomb of St. Thomas the Apostle, '
                                                "one of only three in the world built over an apostle's grave.",
                                        'indoor': True,
                                        'location': 'Santhome High Rd, Chennai',
                                        'title': 'San Thome Cathedral Basilica'}],
                   'evening': [   {   'category': 'relaxation',
                                      'cost': 20.0,
                                      'desc': "India's longest natural urban beach; ride the elevator up the lighthouse for ocean breezes "
                                              'and try crispy sundal (seasoned chickpeas).',
                                      'indoor': False,
                                      'location': 'Marina Beach, Chennai',
                                      'title': 'Marina Beach Promenade & 1977 Chennai Lighthouse'},
                                  {   'category': 'food',
                                      'cost': 250.0,
                                      'desc': 'Feast on piping-hot melt-in-mouth steamed idlis with 4 varieties of chutneys, crispy medu '
                                              'vada, and frothy degree filter coffee.',
                                      'indoor': True,
                                      'location': 'GN Chetty Rd / Mylapore, Chennai',
                                      'title': 'Murugan Idli Shop & Traditional Mylapore Filter Kaapi'},
                                  {   'category': 'culture',
                                      'cost': 300.0,
                                      'desc': 'Renowned academy of Indian classical arts and Carnatic music set in lush peaceful natural '
                                              'environs.',
                                      'indoor': True,
                                      'location': 'Thiruvanmiyur, Chennai',
                                      'title': 'Kalakshetra Foundation Classical Bharatanatyam Recital'}],
                   'indoor_replacements': [   {   'cost': 50.0,
                                                  'desc': "World's greatest indoor collection of ancient Chola and Pallava bronze "
                                                          'masterpieces.',
                                                  'location': 'Egmore, Chennai',
                                                  'title': 'Government Museum Bronze Gallery (Egmore)'},
                                              {   'cost': 50.0,
                                                  'desc': 'Air-sheltered colonial heritage galleries with historic weapons, coins, and '
                                                          'maps.',
                                                  'location': 'Rajaji Salai, Chennai',
                                                  'title': 'Fort Museum (Fort St. George)'},
                                              {   'cost': 0.0,
                                                  'desc': 'Massive fully covered shopping, entertainment, and fine-dining complex.',
                                                  'location': 'Royapettah / Velachery',
                                                  'title': 'Express Avenue / Phoenix Marketcity Chennai'}],
                   'morning': [   {   'category': 'culture',
                                      'cost': 50.0,
                                      'desc': "7th-century rock-cut Pallava monolithic shrines, Arjuna's Penance giant bas-relief, and "
                                              'ancient temples battered by the Bay of Bengal waves.',
                                      'indoor': False,
                                      'location': 'Mahabalipuram Coastal Zone',
                                      'title': 'Mahabalipuram Shore Temple & Pancha Rathas (UNESCO)'},
                                  {   'category': 'culture',
                                      'cost': 0.0,
                                      'desc': 'Vibrant Dravidian temple with a 37-meter rainbow gopuram dedicated to Lord Shiva, '
                                              'surrounded by jasmine flower stalls and bronze brassware.',
                                      'indoor': True,
                                      'location': 'Mylapore, Chennai',
                                      'title': 'Kapaleeshwarar Temple & Mylapore Heritage Walk'},
                                  {   'category': 'culture',
                                      'cost': 150.0,
                                      'desc': 'Cross-cultural village displaying 18 authentic historic heritage houses moved '
                                              'brick-by-brick from Tamil Nadu, Kerala, Karnataka, and Andhra.',
                                      'indoor': True,
                                      'location': 'East Coast Road, Muttukadu',
                                      'title': 'DakshinaChitra Living Heritage Museum'}],
                   'name': 'Chennai & Mahabalipuram, Tamil Nadu, India',
                   'themes': {   1: 'UNESCO Shore Temple, Pancha Rathas & Coastal Stone Sculptures',
                                 2: 'Marina Beach, Chennai Lighthouse & Fort St. George',
                                 3: 'Kapaleeshwarar Temple, Mylapore Heritage & South Indian Gastronomy'}},
    'delhi_agra': {   'afternoon': [   {   'category': 'culture',
                                           'cost': 50.0,
                                           'desc': 'Grand Mughal fortress palace where Shah Jahan was imprisoned with views of the Taj '
                                                   'Mahal across the river.',
                                           'indoor': True,
                                           'location': 'Agra Fort, Rakabganj, Agra',
                                           'title': 'Agra Fort & Jahangiri Mahal'},
                                       {   'category': 'culture',
                                           'cost': 50.0,
                                           'desc': 'The architectural forerunner of the Taj Mahal set in geometric water gardens built in '
                                                   '1570.',
                                           'indoor': False,
                                           'location': 'Nizamuddin East, New Delhi',
                                           'title': "Humayun's Tomb Persian Gardens"},
                                       {   'category': 'culture',
                                           'cost': 50.0,
                                           'desc': 'Houses over 200,000 works of art spanning 5,000 years, including the Indus Valley '
                                                   "'Dancing Girl' bronze.",
                                           'indoor': True,
                                           'location': 'Janpath, New Delhi',
                                           'title': 'National Museum of India'}],
                      'evening': [   {   'category': 'food',
                                         'cost': 300.0,
                                         'desc': 'Taste historic stuffed fried parathas, jalebis at Old Famous Jalebi Wala, and savory '
                                                 'Daulat ki Chaat.',
                                         'indoor': False,
                                         'location': 'Old Delhi',
                                         'title': 'Chandni Chowk Street Food & Paranthe Wali Gali'},
                                     {   'category': 'sightseeing',
                                         'cost': 0.0,
                                         'desc': 'Walk along the grand illuminated boulevard under the 42-meter triumphal arch memorial.',
                                         'indoor': False,
                                         'location': 'Rajpath, New Delhi',
                                         'title': 'India Gate War Memorial & Kartavya Path Walk'},
                                     {   'category': 'relaxation',
                                         'cost': 50.0,
                                         'desc': 'Charbagh garden on the opposite bank of the Yamuna River offering tranquil twilight '
                                                 'views of the marble dome.',
                                         'indoor': False,
                                         'location': 'Opposite Taj Mahal, Agra',
                                         'title': 'Mehtab Bagh Sunset View of the Taj Mahal'}],
                      'indoor_replacements': [   {   'cost': 50.0,
                                                     'desc': 'Completely air-conditioned world-class galleries displaying Indus Valley '
                                                             'artifacts, miniature paintings, and silk route relics.',
                                                     'location': 'Janpath, New Delhi',
                                                     'title': 'National Museum of India'},
                                                 {   'cost': 250.0,
                                                     'desc': 'Magnificent indoor exhibition halls displaying Vedic history with robotic '
                                                             'animatronics and indoor boat ride.',
                                                     'location': 'NH 24, New Delhi',
                                                     'title': 'Akshardham Temple Indoor Cultural Boat Ride & Hall'}],
                      'morning': [   {   'category': 'sightseeing',
                                         'cost': 250.0,
                                         'desc': "Emperor Shah Jahan's world-famous 1648 white marble mausoleum reflecting in the Yamuna "
                                                 'River pools at dawn.',
                                         'indoor': False,
                                         'location': 'Dharmapuri, Forest Colony, Agra',
                                         'title': 'Taj Mahal Sunrise Monument to Love'},
                                     {   'category': 'culture',
                                         'cost': 50.0,
                                         'desc': "The world's tallest brick minaret (72.5m) built in 1192 surrounded by ancient "
                                                 'Indo-Islamic stone carvings.',
                                         'indoor': False,
                                         'location': 'Mehrauli, New Delhi',
                                         'title': 'Qutub Minar & Iron Pillar Complex'},
                                     {   'category': 'culture',
                                         'cost': 50.0,
                                         'desc': 'Massive red sandstone fortified palace that served as the imperial seat of Mughal '
                                                 'emperors for two centuries.',
                                         'indoor': True,
                                         'location': 'Netaji Subhash Marg, Chandni Chowk, Delhi',
                                         'title': 'Red Fort (Lal Qila) & Diwan-i-Khas'}],
                      'name': 'Delhi & Agra (Golden Triangle), India',
                      'themes': {   1: 'Wonders of the World: Taj Mahal & Agra Fort',
                                    2: "Mughal Monuments of Delhi: Qutub Minar & Humayun's Tomb",
                                    3: 'Chandni Chowk Food, Red Fort & India Gate'}},
    'dubai': {   'afternoon': [   {   'category': 'shopping',
                                      'cost': 2200.0,
                                      'desc': "One of the world's largest retail destinations with 1,200 stores, indoor Olympic ice rink, "
                                              'and a 10-million-liter walk-through marine tank.',
                                      'indoor': True,
                                      'location': 'Financial Center Rd, Downtown Dubai',
                                      'title': 'Dubai Mall & Indoor Aquarium Underwater Zoo'},
                                  {   'category': 'culture',
                                      'cost': 3400.0,
                                      'desc': 'Torus-shaped architectural wonder adorned with Arabic calligraphy poetry, showcasing AI, '
                                              'space exploration, and bio-engineering.',
                                      'indoor': True,
                                      'location': 'Sheikh Zayed Road, Dubai',
                                      'title': 'Museum of the Future Interactive Exploration'},
                                  {   'category': 'culture',
                                      'cost': 50.0,
                                      'desc': 'Glide across the saltwater creek on a traditional motorized wooden abra for only 1 AED to '
                                              'explore heritage waterfront trading quays.',
                                      'indoor': False,
                                      'location': 'Deira & Bur Dubai Creek',
                                      'title': 'Old Dubai Creek Traditional Abra Boat Ride'}],
                 'evening': [   {   'category': 'adventure',
                                    'cost': 3200.0,
                                    'desc': 'High-octane red dune bashing, sandboarding, camel rides, followed by Tanoura dancing, fire '
                                            'shows, and Arabian barbecue under starlit skies.',
                                    'indoor': False,
                                    'location': 'Lahbab Red Dunes Desert, Dubai',
                                    'title': 'Desert 4x4 Dune Bashing Safari & BBQ Dinner'},
                                {   'category': 'sightseeing',
                                    'cost': 0.0,
                                    'desc': "World's tallest performing fountain dancing to world music with 6,600 superlights and water "
                                            'jets shooting 150 meters high.',
                                    'indoor': False,
                                    'location': 'Burj Khalifa Lake, Downtown Dubai',
                                    'title': 'Dubai Fountain Lake Choreographed Evening Show'},
                                {   'category': 'food',
                                    'cost': 2500.0,
                                    'desc': 'Two-hour evening dinner cruise aboard a traditional illuminated wooden dhow past shimmering '
                                            'skyscrapers and luxury superyachts.',
                                    'indoor': True,
                                    'location': 'Dubai Marina Promenade',
                                    'title': 'Dubai Marina Walkway & Dhow Dinner Cruise'}],
                 'indoor_replacements': [   {   'cost': 3400.0,
                                                'desc': '100% climate-controlled futuristic indoor innovation sanctuary.',
                                                'location': 'Sheikh Zayed Rd, Dubai',
                                                'title': 'Museum of the Future'},
                                            {   'cost': 2200.0,
                                                'desc': 'Completely sheltered indoor marine wonder with sand tiger sharks and giant '
                                                        'stingrays.',
                                                'location': 'The Dubai Mall',
                                                'title': 'Dubai Aquarium & Underwater Tunnel'}],
                 'morning': [   {   'category': 'sightseeing',
                                    'cost': 3800.0,
                                    'desc': "Ascend the world's tallest building (828 m) in high-speed elevators for breathtaking "
                                            '360-degree aerial views over the Arabian Gulf.',
                                    'indoor': True,
                                    'location': 'Downtown Dubai',
                                    'title': "Burj Khalifa 'At the Top' Observation Deck (124th Floor)"},
                                {   'category': 'sightseeing',
                                    'cost': 1200.0,
                                    'desc': '150-meter-tall golden picture frame featuring a transparent glass floor bridge bridging '
                                            'historic Old Dubai with ultra-modern New Dubai.',
                                    'indoor': True,
                                    'location': 'Zabeel Park, Dubai',
                                    'title': 'Dubai Frame Glass Walkway Experience'},
                                {   'category': 'nature',
                                    'cost': 1800.0,
                                    'desc': "World's largest natural flower garden featuring 150 million blooming flowers arranged into "
                                            'full-size Emirates A380 planes and fairytale castles.',
                                    'indoor': False,
                                    'location': 'Al Barsha South 3, Dubai',
                                    'title': 'Dubai Miracle Garden & Floral Castles'}],
                 'name': 'Dubai, United Arab Emirates',
                 'themes': {   1: 'Burj Khalifa 124th Floor, Dubai Mall & Fountain Show',
                               2: 'Dubai Desert Safari, Dune Bashing & Bedouin Camp',
                               3: 'Old Dubai Creek Abra Ride, Gold & Spice Souks'}},
    'goa': {
        'name': 'Goa, India',
        'themes': {
            1: 'North Goa Coastal Fort & Beach Sightseeing (Day 1)',
            2: 'Calangute, Anjuna & Vagator Beach Outdoor Activities (Day 2)',
            3: 'Old Goa Heritage Churches & Fontainhas Latin Quarter (Day 3)'
        },
        'day_specific_plans': {
            1: [
                {
                    'title': 'Fort Aguada & 1864 Portuguese Coastal Lighthouse',
                    'time_slot': 'Morning',
                    'category': 'sightseeing',
                    'location': 'Sinquerim Beach, Candolim, North Goa',
                    'cost': 50.0,
                    'duration_hours': 2.5,
                    'indoor': False,
                    'opening_hours': '09:00 AM - 06:00 PM [Verified]',
                    'verified_status': 'Verified Venue',
                    'family_friendly': True,
                    'admission_price_inr': 50.0,
                    'travel_distance_km': 4.5,
                    'desc': '17th-century Portuguese fortress and historic stone lighthouse overlooking the Mandovi River meeting the Arabian Sea.'
                },
                {
                    'title': 'Baga Beach Coastal Walk & Watersports Boardwalk',
                    'time_slot': 'Afternoon',
                    'category': 'adventure',
                    'location': 'Baga Beach, North Goa',
                    'cost': 1200.0,
                    'duration_hours': 3.0,
                    'indoor': False,
                    'opening_hours': '09:00 AM - 06:30 PM [Verified]',
                    'verified_status': 'Verified Venue',
                    'family_friendly': True,
                    'admission_price_inr': 0.0,
                    'travel_distance_km': 8.0,
                    'desc': 'Lively golden sand beach with seaside eateries, breezy boardwalk strolls, and watersport launch pads.'
                },
                {
                    'title': 'Candolim Beach Sunset & Goan Seafood Dinner',
                    'time_slot': 'Evening',
                    'category': 'relaxation',
                    'location': 'Candolim Beach Road, North Goa',
                    'cost': 750.0,
                    'duration_hours': 2.5,
                    'indoor': False,
                    'opening_hours': '06:00 PM - 11:00 PM [Verified]',
                    'verified_status': 'Verified Venue',
                    'family_friendly': True,
                    'admission_price_inr': 0.0,
                    'travel_distance_km': 3.2,
                    'desc': 'Panoramic sunset view over the Arabian Sea followed by butter-garlic tiger prawns and Goan fish thali.'
                }
            ],
            2: [
                {
                    'title': 'Calangute Beach Adventure Jet Skiing & Parasailing',
                    'time_slot': 'Morning',
                    'category': 'adventure',
                    'location': 'Calangute Main Beach, North Goa',
                    'cost': 1800.0,
                    'duration_hours': 3.0,
                    'indoor': False,
                    'opening_hours': '09:00 AM - 05:30 PM [Verified]',
                    'verified_status': 'Verified Venue',
                    'family_friendly': True,
                    'admission_price_inr': 1800.0,
                    'travel_distance_km': 5.0,
                    'desc': 'Outdoor motorized jet ski rides, parasailing with sea views, and banana boat rides on Goa’s busiest beach.'
                },
                {
                    'title': 'Anjuna Beach Open-Air Flea Market & Red Cliff Walk',
                    'time_slot': 'Afternoon',
                    'category': 'shopping',
                    'location': 'Anjuna Beach Coastline, North Goa',
                    'cost': 200.0,
                    'duration_hours': 2.5,
                    'indoor': False,
                    'opening_hours': '10:00 AM - 06:30 PM [Verified]',
                    'verified_status': 'Verified Venue',
                    'family_friendly': True,
                    'admission_price_inr': 0.0,
                    'travel_distance_km': 7.5,
                    'desc': 'Famous open-air seaside market with handmade jewelry, bohemian crafts, and red laterite coastal cliffs.'
                },
                {
                    'title': 'Vagator Beach Sunset & Cliffside Shack Experience',
                    'time_slot': 'Evening',
                    'category': 'relaxation',
                    'location': 'Vagator Beach Cliff Trail, North Goa',
                    'cost': 900.0,
                    'duration_hours': 2.5,
                    'indoor': False,
                    'opening_hours': '05:00 PM - 10:30 PM [Verified]',
                    'verified_status': 'Verified Venue',
                    'family_friendly': True,
                    'admission_price_inr': 0.0,
                    'travel_distance_km': 4.0,
                    'desc': 'Scenic dramatic rocky cliffs overlooking the sunset with outdoor music, chilled mocktails, and fresh seafood.'
                }
            ],
            3: [
                {
                    'title': 'Old Goa Basilica of Bom Jesus & Se Cathedral',
                    'time_slot': 'Morning',
                    'category': 'culture',
                    'location': 'Old Goa (Velha Goa)',
                    'cost': 0.0,
                    'duration_hours': 2.5,
                    'indoor': True,
                    'opening_hours': '09:00 AM - 06:30 PM [Verified]',
                    'verified_status': 'Verified Venue',
                    'family_friendly': True,
                    'admission_price_inr': 0.0,
                    'travel_distance_km': 18.0,
                    'desc': '16th-century UNESCO World Heritage Baroque church enshrining the sacred relics of St. Francis Xavier.'
                },
                {
                    'title': 'Fontainhas Latin Quarter Portuguese Heritage Walk',
                    'time_slot': 'Afternoon',
                    'category': 'culture',
                    'location': 'Fontainhas, Panaji (Panjim), Goa',
                    'cost': 0.0,
                    'duration_hours': 2.5,
                    'indoor': False,
                    'opening_hours': '09:00 AM - 07:00 PM [Verified]',
                    'verified_status': 'Verified Venue',
                    'family_friendly': True,
                    'admission_price_inr': 0.0,
                    'travel_distance_km': 9.5,
                    'desc': 'Picturesque old Latin quarter with vibrant pastel villas, projecting Portuguese balconies, and heritage art lanes.'
                },
                {
                    'title': 'Mandovi River Luxury Sunset Cruise with Folk Dances',
                    'time_slot': 'Evening',
                    'category': 'relaxation',
                    'location': 'Santa Monica Jetty, Panaji',
                    'cost': 600.0,
                    'duration_hours': 2.0,
                    'indoor': True,
                    'opening_hours': '05:30 PM - 08:30 PM [Verified]',
                    'verified_status': 'Verified Venue',
                    'family_friendly': True,
                    'admission_price_inr': 600.0,
                    'travel_distance_km': 1.5,
                    'desc': 'River cruise along the Mandovi estuary featuring live Goan Dekhni folk dancing, music, and illuminated city vistas.'
                }
            ]
        },
        'day2_rain_replacements': [
            {
                'time_slot': 'Morning',
                'title': 'Houses of Goa Museum & Mario Miranda Gallery',
                'category': 'culture',
                'location': 'Salvador do Mundo, Alto Porvorim (15 mins from Calangute hub)',
                'cost': 100.0,
                'duration_hours': 2.0,
                'indoor': True,
                'opening_hours': '10:00 AM - 07:30 PM (Tuesday to Sunday) [Verified]',
                'verified_status': 'Verified Venue',
                'family_friendly': True,
                'admission_price_inr': 100.0,
                'travel_distance_km': 6.5,
                'accessibility_features': ['wheelchair_accessible', 'step_free_ramp'],
                'ai_replacement_reason': 'Jet skiing and parasailing at Calangute beach are strictly prohibited and hazardous during monsoon rainfall. Swapped for the iconic Houses of Goa Museum—a 3-tier ship-shaped indoor building celebrating Goan domestic architecture and cartoonist Mario Miranda’s art gallery. It is 100% weather-sheltered, family-friendly, and only 6.5 km from the hotel hub.',
                'desc': 'Covered 3-story architectural ship-shaped museum designed by Gerard da Cunha showcasing centuries of Goan domestic architecture, antique tiles, and Mario Miranda art.'
            },
            {
                'time_slot': 'Afternoon',
                'title': 'Goa State Museum & Cultural Heritage Galleries',
                'category': 'culture',
                'location': 'Patto Plaza, Panaji, Goa',
                'cost': 20.0,
                'duration_hours': 2.5,
                'indoor': True,
                'opening_hours': '09:30 AM - 05:30 PM (Monday to Friday) [Verified]',
                'verified_status': 'Verified Venue',
                'family_friendly': True,
                'admission_price_inr': 20.0,
                'travel_distance_km': 4.2,
                'accessibility_features': ['wheelchair_accessible', 'elevator_access', 'step_free_access'],
                'ai_replacement_reason': 'Anjuna’s open-air dirt trails and flea market stalls get severely waterlogged and muddy during continuous rainfall. Replaced with the spacious, climate-controlled Goa State Museum housing over 8,000 antiquities, stone sculptures, wooden furniture, and numismatic exhibits with certified step-free wheelchair accessibility.',
                'desc': 'Air-conditioned state museum featuring 14 galleries including ancient Kadamba stone carvings, Christian Art treasures, and Portuguese royal banqueting carriages.'
            },
            {
                'time_slot': 'Evening',
                'title': 'Fontainhas Covered Art Gallery & Confeitaria 31 de Janeiro',
                'category': 'food',
                'location': 'Fontainhas Latin Quarter, Panaji, Goa',
                'cost': 350.0,
                'duration_hours': 2.5,
                'indoor': True,
                'opening_hours': '10:00 AM - 08:00 PM [Verified]',
                'verified_status': 'Verified Venue',
                'family_friendly': True,
                'admission_price_inr': 350.0,
                'travel_distance_km': 1.8,
                'accessibility_features': ['covered_paved_walkway', 'accessible_seating'],
                'ai_replacement_reason': 'Exposed coastal cliff shacks at Vagator suffer from strong wind gusts, slippery rocks, and zero sunset visibility in the rain. Replaced with Fontainhas’ sheltered heritage art sanctuary (Gitanjali Gallery) and the historic 1930s Confeitaria 31 de Janeiro bakery for warm traditional Goan Bebinca and spiced tea in a dry, historic indoor setting.',
                'desc': 'Sheltered Indo-Portuguese heritage sanctuary featuring authentic Goan art canvases, azulejo hand-painted tiles, and wood-fired traditional Goan Bebinca dessert.'
            }
        ],
        'morning': [
            {'category': 'sightseeing', 'cost': 50.0, 'desc': 'Fort Aguada coastal fort.', 'indoor': False, 'location': 'Candolim', 'title': 'Fort Aguada'},
            {'category': 'adventure', 'cost': 1800.0, 'desc': 'Calangute beach watersports.', 'indoor': False, 'location': 'Calangute', 'title': 'Calangute Beach Watersports'},
            {'category': 'culture', 'cost': 0.0, 'desc': 'Basilica of Bom Jesus church.', 'indoor': True, 'location': 'Old Goa', 'title': 'Basilica of Bom Jesus'}
        ],
        'afternoon': [
            {'category': 'adventure', 'cost': 1200.0, 'desc': 'Baga Beach coastal activities.', 'indoor': False, 'location': 'Baga', 'title': 'Baga Beach Boardwalk'},
            {'category': 'shopping', 'cost': 200.0, 'desc': 'Anjuna Flea Market.', 'indoor': False, 'location': 'Anjuna', 'title': 'Anjuna Beach Flea Market'},
            {'category': 'culture', 'cost': 0.0, 'desc': 'Fontainhas Latin Quarter walk.', 'indoor': False, 'location': 'Panaji', 'title': 'Fontainhas Latin Quarter'}
        ],
        'evening': [
            {'category': 'relaxation', 'cost': 750.0, 'desc': 'Candolim beach sunset.', 'indoor': False, 'location': 'Candolim', 'title': 'Candolim Beach Sunset'},
            {'category': 'relaxation', 'cost': 900.0, 'desc': 'Vagator cliff shack sunset.', 'indoor': False, 'location': 'Vagator', 'title': 'Vagator Beach Sunset'},
            {'category': 'relaxation', 'cost': 600.0, 'desc': 'Mandovi River sunset cruise.', 'indoor': True, 'location': 'Panaji', 'title': 'Mandovi River Luxury Sunset Cruise'}
        ],
        'indoor_replacements': [
            {'cost': 100.0, 'desc': 'Houses of Goa Museum.', 'location': 'Porvorim', 'title': 'Houses of Goa Museum & Mario Miranda Gallery'},
            {'cost': 20.0, 'desc': 'Goa State Museum.', 'location': 'Panaji', 'title': 'Goa State Museum & Cultural Heritage Galleries'},
            {'cost': 350.0, 'desc': 'Fontainhas Covered Gallery.', 'location': 'Panaji', 'title': 'Fontainhas Covered Art Gallery & Confeitaria 31 de Janeiro'}
        ]
    },
    'morning': [
        {'title': 'Breakfast at Café Sprüngli', 'category': 'food', 'location': 'Paradeplatz, Zurich', 'cost': 1800.0, 'indoor': True, 'desc': 'Famous Swiss artisanal chocolates, hot drinking chocolate, and freshly baked Birchermüesli.', 'rating': 4.6, 'duration': '0.5 hrs'},
        {'title': 'Chapel Bridge & Historic Water Tower', 'category': 'culture', 'location': 'Old Town, Lucerne', 'cost': 0.0, 'indoor': False, 'desc': 'World-famous 14th-century covered wooden footbridge adorned with historical triangular paintings.', 'rating': 4.8, 'duration': '1.5 hrs'},
        {'title': 'Harder Kulm Funicular & Panoramic Bridge', 'category': 'sightseeing', 'location': 'Interlaken', 'cost': 3400.0, 'indoor': False, 'desc': 'Ascend to 1,322m for breathtaking vistas of the Eiger, Mönch, and Jungfrau peaks between Lake Thun and Lake Brienz.', 'rating': 4.8, 'duration': '2.0 hrs'},
        {'title': 'First Cliff Walk by Tissot', 'category': 'adventure', 'location': 'Grindelwald First', 'cost': 3200.0, 'indoor': False, 'desc': 'Suspended alpine footbridge hugging sheer mountain cliffs offering thrilling views of the Grindelwald valley.', 'rating': 4.9, 'duration': '2.5 hrs'},
        {'title': 'Lindt Home of Chocolate & Giant Fountain', 'category': 'culture', 'location': 'Kilchberg, Zurich', 'cost': 1500.0, 'indoor': True, 'desc': 'Marvel at the 9-meter chocolate fountain and sample unlimited Swiss truffles and praline masterclasses.', 'rating': 4.8, 'duration': '2.0 hrs'}
    ],
    'afternoon': [
        {'title': 'City Tour - Old Town Zurich', 'category': 'culture', 'location': 'Altstadt, Zurich', 'cost': 0.0, 'indoor': False, 'desc': 'Explore historic cobblestone alleys, Grossmünster twin towers, and scenic riverside promenades.', 'rating': 4.7, 'duration': '1.5 hrs'},
        {'title': 'Lion Monument & Lake Lucerne Cruise', 'category': 'sightseeing', 'location': 'Löwenplatz, Lucerne', 'cost': 2800.0, 'indoor': False, 'desc': 'Visit the poignant dying lion rock relief, followed by a scenic mountain paddle-steamer cruise.', 'rating': 4.8, 'duration': '2.0 hrs'},
        {'title': 'Lake Brienz Turquoise Boat Tour', 'category': 'nature', 'location': 'Bönigen, Interlaken', 'cost': 2500.0, 'indoor': False, 'desc': 'Glide across glacial turquoise waters framed by cascading waterfalls and steep mountain slopes.', 'rating': 4.8, 'duration': '2.0 hrs'},
        {'title': 'Bachalpsee Mirror Lake Alpine Hike', 'category': 'nature', 'location': 'First, Grindelwald', 'cost': 0.0, 'indoor': False, 'desc': 'Iconic alpine trail leading to the crystal-clear mountain lake reflecting the snow-capped Schreckhorn.', 'rating': 4.9, 'duration': '2.5 hrs'},
        {'title': 'Swiss National Museum & Cultural Treasures', 'category': 'culture', 'location': 'Museumstrasse, Zurich', 'cost': 1100.0, 'indoor': True, 'desc': 'Fairy-tale castle housing centuries of Swiss craftsmanship, armor, stained glass, and history.', 'rating': 4.6, 'duration': '2.0 hrs'}
    ],
    'evening': [
        {'title': 'Evening at Lake Zurich & Sunset Dining', 'category': 'relaxation', 'location': 'Bürkliplatz, Zurich', 'cost': 3500.0, 'indoor': True, 'desc': 'Relax by the tranquil waterfront watching mountain sunsets, followed by fresh Swiss lake trout dining.', 'rating': 4.8, 'duration': '2.0 hrs'},
        {'title': 'Authentic Swiss Fondue at Restaurant Fritschi', 'category': 'food', 'location': 'Old Town, Lucerne', 'cost': 3800.0, 'indoor': True, 'desc': 'Savor bubbling Gruyère and Emmental cheese fondue with crispy crusty bread and Swiss white wine.', 'rating': 4.7, 'duration': '2.0 hrs'},
        {'title': 'Höhematte Meadow Stroll & Victoria Terrace', 'category': 'relaxation', 'location': 'Höheweg, Interlaken', 'cost': 2200.0, 'indoor': True, 'desc': 'Watch paragliders touch down against twilight mountain backdrops while enjoying alpine coffee and pastries.', 'rating': 4.7, 'duration': '1.5 hrs'},
        {'title': 'Chalet Raclette Dinner in Grindelwald Village', 'category': 'food', 'location': 'Dorfstrasse, Grindelwald', 'cost': 3600.0, 'indoor': True, 'desc': 'Traditional wooden chalet serving molten raclette cheese over new potatoes, gherkins, and dried meats.', 'rating': 4.8, 'duration': '2.0 hrs'},
        {'title': 'Bahnhofstrasse Shopping & Farewell Vista', 'category': 'shopping', 'location': 'Bahnhofstrasse, Zurich', 'cost': 2000.0, 'indoor': True, 'desc': 'Stroll Europe finest boulevard, buying souvenirs, Swiss watches, and artisan chocolate boxes.', 'rating': 4.7, 'duration': '2.0 hrs'}
    ],
    'indoor_replacements': [
        {'title': 'Swiss National Museum (Landesmuseum)', 'cost': 1100.0, 'location': 'Zurich Center', 'desc': 'Fully enclosed historic castle galleries with interactive Swiss cultural exhibits and audio tours.'},
        {'title': 'Lindt Home of Chocolate Indoor Experience', 'cost': 1500.0, 'location': 'Kilchberg', 'desc': 'Weatherproof indoor sensory chocolate museum featuring 500-liter flowing chocolate fountains.'},
        {'title': 'Kunsthaus Zurich Modern & Classical Gallery', 'cost': 2100.0, 'location': 'Heimplatz, Zurich', 'desc': 'Premier Swiss art museum housing masterworks by Giacometti, Monet, and Picasso.'}
    ]
}

def get_real_destination_data(destination: str) -> dict:
    """Intelligently matches destination query to verified real place data."""
    dest_clean = destination.lower().replace(",", " ").replace("-", " ").replace("&", " ").replace("/", " ")
    tokens = dest_clean.split()

    if "switzerland" in dest_clean or "zurich" in dest_clean or "lucerne" in dest_clean or "interlaken" in dest_clean or "grindelwald" in dest_clean or "swiss" in dest_clean:
        return REAL_PLACES_DATABASE.get("switzerland")
    
    # Priority 1: Specific city and landmark keywords (SPECIFIC FIRST)
    if "tirupati" in dest_clean or "tirumala" in dest_clean or "balaji" in dest_clean:
        return REAL_PLACES_DATABASE.get("tirupati")
    if "vizag" in dest_clean or "visakhapatnam" in dest_clean or "araku" in dest_clean or "kursura" in dest_clean or "rushikonda" in dest_clean:
        return REAL_PLACES_DATABASE.get("vizag")
    if "hyderabad" in dest_clean or "charminar" in dest_clean or "secunderabad" in dest_clean or "golconda" in dest_clean or "salar jung" in dest_clean:
        return REAL_PLACES_DATABASE.get("hyderabad")
    if "munnar" in dest_clean or "eravikulam" in dest_clean or "anamudi" in dest_clean:
        return REAL_PLACES_DATABASE.get("munnar")
    if "wayanad" in dest_clean or "banasura" in dest_clean or "edakkal" in dest_clean or "chembra" in dest_clean:
        return REAL_PLACES_DATABASE.get("wayanad")
    if "mysore" in dest_clean or "mysuru" in dest_clean or "chamundi" in dest_clean:
        return REAL_PLACES_DATABASE.get("mysore")
    if "pondicherry" in dest_clean or "puducherry" in dest_clean or "auroville" in dest_clean or "matrimandir" in dest_clean:
        return REAL_PLACES_DATABASE.get("pondicherry")
    if "kashmir" in dest_clean or "srinagar" in dest_clean or "gulmarg" in dest_clean or "dal lake" in dest_clean or "pahalgam" in dest_clean:
        return REAL_PLACES_DATABASE.get("kashmir")
    if "alappuzha" in dest_clean or "alleppey" in dest_clean or "backwater" in dest_clean or "houseboat" in dest_clean:
        return REAL_PLACES_DATABASE.get("alappuzha")
    if "kochi" in dest_clean or "cochin" in dest_clean or "fort kochi" in dest_clean or "ernakulam" in dest_clean:
        return REAL_PLACES_DATABASE.get("kochi")
    if "bengaluru" in dest_clean or "bangalore" in dest_clean or "lalbagh" in dest_clean or "cubbon" in dest_clean:
        return REAL_PLACES_DATABASE.get("bengaluru")
    if "chennai" in dest_clean or "madras" in dest_clean or "mahabalipuram" in dest_clean or "mylapore" in dest_clean:
        return REAL_PLACES_DATABASE.get("chennai")
    if "mumbai" in dest_clean or "bombay" in dest_clean or "marine drive" in dest_clean or "gateway of india" in dest_clean:
        return REAL_PLACES_DATABASE.get("mumbai")
    if "kolkata" in dest_clean or "calcutta" in dest_clean or "howrah" in dest_clean or "victoria memorial" in dest_clean:
        return REAL_PLACES_DATABASE.get("kolkata")
    if "varanasi" in dest_clean or "banaras" in dest_clean or "kashi" in dest_clean or "ganga aarti" in dest_clean:
        return REAL_PLACES_DATABASE.get("varanasi")
    if "ooty" in dest_clean or "nilgiri" in dest_clean or "doddabetta" in dest_clean:
        return REAL_PLACES_DATABASE.get("ooty")
    if "amritsar" in dest_clean or "golden temple" in dest_clean or "wagah" in dest_clean:
        return REAL_PLACES_DATABASE.get("amritsar")
    if "udaipur" in dest_clean or "lake pichola" in dest_clean:
        return REAL_PLACES_DATABASE.get("udaipur")
    if "jaipur" in dest_clean or "amber fort" in dest_clean or "hawa mahal" in dest_clean:
        return REAL_PLACES_DATABASE.get("jaipur")
    if "goa" in dest_clean or "panaji" in dest_clean or "calangute" in dest_clean or "baga" in dest_clean:
        return REAL_PLACES_DATABASE.get("goa")
    if "manali" in dest_clean or "solang" in dest_clean or "atal tunnel" in dest_clean:
        return REAL_PLACES_DATABASE.get("manali")
    if "delhi" in dest_clean or "agra" in dest_clean or "taj mahal" in dest_clean or "qutub" in dest_clean:
        return REAL_PLACES_DATABASE.get("delhi_agra")
    if "kerala" in dest_clean:
        return REAL_PLACES_DATABASE.get("kerala")
    if "dubai" in dest_clean or "burj khalifa" in dest_clean:
        return REAL_PLACES_DATABASE.get("dubai")
    if "singapore" in dest_clean or "marina bay" in dest_clean:
        return REAL_PLACES_DATABASE.get("singapore")
    if "london" in dest_clean or "tower bridge" in dest_clean:
        return REAL_PLACES_DATABASE.get("london")
    if "paris" in dest_clean or "eiffel" in dest_clean or "louvre" in dest_clean:
        return REAL_PLACES_DATABASE.get("paris")
    if "rome" in dest_clean or "colosseum" in dest_clean or "vatican" in dest_clean:
        return REAL_PLACES_DATABASE.get("rome")
    if "tokyo" in dest_clean or "senso ji" in dest_clean:
        return REAL_PLACES_DATABASE.get("tokyo")

    # Priority 2: General substring matching
    for key, data in REAL_PLACES_DATABASE.items():
        if key in dest_clean:
            return data
            
    # Priority 3: State-level fallbacks if no specific city was matched
    if "telangana" in dest_clean:
        return REAL_PLACES_DATABASE.get("hyderabad")
    if "andhra" in dest_clean:
        return REAL_PLACES_DATABASE.get("vizag")
    if "karnataka" in dest_clean:
        return REAL_PLACES_DATABASE.get("bengaluru")
    if "tamil nadu" in dest_clean:
        return REAL_PLACES_DATABASE.get("chennai")
    if "maharashtra" in dest_clean:
        return REAL_PLACES_DATABASE.get("mumbai")
    if "rajasthan" in dest_clean:
        return REAL_PLACES_DATABASE.get("jaipur")
    if "himachal" in dest_clean:
        return REAL_PLACES_DATABASE.get("manali")

    return None
