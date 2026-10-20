from typing import List, Dict
from collections import Counter
from schemas import (
    GroupConsensusRequest, 
    GroupConsensusResult, 
    GroupMember,
    AccommodationOption,
    TransportationOption
)
from config import get_llm

class GroupConsensusAgent:
    """
    Solves group travel frictions:
    - Aggregates multi-member preferences via Borda / Voting counts
    - Identifies consensus vs elective compromises
    - Calculates fair shared budget & equalized expense splitting
    - Recommends optimized group accommodations (villas, serviced apartments, suites)
    - Optimizes multi-traveler transportation (tempo traveler, metro passes, split cabs)
    """
    def __init__(self):
        self.llm = get_llm()

    def harmonize_group(self, request: GroupConsensusRequest) -> GroupConsensusResult:
        members = request.members
        num_members = len(members)
        if num_members == 0:
            raise ValueError("Group must contain at least 1 member.")

        # 1. Aggregate Interests
        all_interests = []
        for m in members:
            all_interests.extend(m.interests)
        
        interest_counts = Counter(all_interests)
        ranked_interests = [item for item, count in interest_counts.most_common()]

        # 2. Fair Shared Budget Calculation
        min_budget_in_group = min(m.max_budget for m in members)
        avg_budget = sum(m.max_budget for m in members) / num_members
        
        recommended_per_person = round(min(min_budget_in_group * 1.05, avg_budget), 2)
        total_shared_budget = round(recommended_per_person * num_members, 2)

        split_details = {m.name: recommended_per_person for m in members}

        # 3. Compromises & Insights
        voting_compromises = []
        for interest, count in interest_counts.most_common():
            percentage = int((count / num_members) * 100)
            if percentage >= 60:
                voting_compromises.append(f"Strong Consensus: {interest.title()} approved by {percentage}% of the group.")
            elif percentage >= 40:
                voting_compromises.append(f"Compromise Opportunity: {interest.title()} ({percentage}% support) allocated to dedicated half-day window.")
            else:
                voting_compromises.append(f"Elective Option: {interest.title()} ({percentage}% support) suggested as free-time elective.")

        # 4. Group Accommodation Recommendations
        city_name = request.destination.split(",")[0].strip()
        nights = max(1, request.duration_days - 1)
        accommodations = self._recommend_accommodations(city_name, num_members, recommended_per_person, nights)

        # 5. Transportation Optimization
        transport_options = self._optimize_transportation(city_name, num_members, request.duration_days)

        prompt = (
            f"You are the AI Group Travel Mediator for {num_members} travelers visiting {request.destination}.\n"
            f"Members: {[m.name for m in members]}\n"
            f"Key Interests: {ranked_interests[:4]}\n"
            f"Budget Limit: Min individual budget is ₹{min_budget_in_group}, recommended per person is ₹{recommended_per_person}.\n"
            f"Provide a 2-sentence summary reconciling individual desires into a cohesive, conflict-free itinerary."
        )

        try:
            res = self.llm.invoke(prompt)
            consensus_summary = res.content if hasattr(res, "content") else str(res)
        except Exception:
            consensus_summary = (
                f"Harmonized itinerary integrating top group interests ({', '.join(ranked_interests[:3])}) "
                f"while respecting the most budget-conscious member with a fair ₹{recommended_per_person}/person threshold."
            )

        return GroupConsensusResult(
            destination=request.destination,
            aggregated_interests=ranked_interests,
            recommended_shared_budget=total_shared_budget,
            cost_per_person=recommended_per_person,
            consensus_summary=consensus_summary,
            voting_compromises=voting_compromises,
            split_details=split_details,
            recommended_accommodations=accommodations,
            transportation_options=transport_options
        )

    def _recommend_accommodations(
        self, city: str, group_size: int, per_person_budget: float, nights: int
    ) -> List[AccommodationOption]:
        options = []
        nightly_budget_pool = max(2000.0, (per_person_budget * 0.35 * group_size) / max(1, nights))

        # Option 1: Multi-Bedroom Villa / Entire Private Home
        villa_price = round(min(nightly_budget_pool * 1.05, 8500.0), 2)
        options.append(AccommodationOption(
            id="acc_villa_1",
            name=f"{city} Heritage Garden Villa & Private Courtyard",
            type="Private Multi-Bedroom Villa",
            location=f"Central Heritage Enclave, {city}",
            price_per_night=villa_price,
            total_estimated_cost=round(villa_price * nights, 2),
            max_guests=max(group_size, 6),
            amenities=["Spacious Common Living Lounge", "Private Kitchen", "High-Speed Wi-Fi", "Lawn BBQ Area", "Washing Machine"],
            suitability_rating="Top Pick for Groups (Privacy & Bonding)",
            description=f"Exclusive group living space allowing all {group_size} travelers to stay together, socialize in private lounges, and self-cater breakfast."
        ))

        # Option 2: Serviced Multi-Room Apartment
        apt_price = round(min(nightly_budget_pool * 0.85, 6000.0), 2)
        options.append(AccommodationOption(
            id="acc_apt_2",
            name=f"{city} Urban View 3-BHK Serviced Apartment",
            type="Serviced Apartment",
            location=f"Transit Hub Corridor, {city}",
            price_per_night=apt_price,
            total_estimated_cost=round(apt_price * nights, 2),
            max_guests=max(group_size, 5),
            amenities=["24/7 Security & Elevator", "Air Conditioning in all rooms", "Full Kitchenette", "Daily Housekeeping"],
            suitability_rating="Best Value for Mid-Budget Groups",
            description="Walking distance to metro transit with comfortable twin/double bedding and dedicated dining space."
        ))

        # Option 3: Boutique Hotel Interconnecting Rooms
        hotel_price = round(min(nightly_budget_pool * 1.15, 9500.0), 2)
        options.append(AccommodationOption(
            id="acc_hotel_3",
            name=f"{city} Royal Gateway Boutique Hotel",
            type="Boutique Hotel (Adjacent Rooms)",
            location=f"Downtown Cultural Quarter, {city}",
            price_per_night=hotel_price,
            total_estimated_cost=round(hotel_price * nights, 2),
            max_guests=group_size,
            amenities=["Complimentary Buffet Breakfast", "Swimming Pool", "24/7 Concierge", "Luggage Storage"],
            suitability_rating="Best for High Comfort & Individual Privacy",
            description="Hotel luxury with private en-suite bathrooms for every sub-pair plus central dining and pool."
        ))

        return options

    def _optimize_transportation(
        self, city: str, group_size: int, duration_days: int
    ) -> List[TransportationOption]:
        options = []

        # Option 1: Dedicated Tempo Traveler / AC Minivan (Ideal for >= 4 people)
        van_day_rate = 3200.0 if group_size <= 6 else 4500.0
        van_total = van_day_rate * duration_days
        van_per_person = round(van_total / group_size, 2)
        options.append(TransportationOption(
            id="trans_van",
            mode="Private AC Tempo Traveler / Large Minivan",
            estimated_cost_per_person=van_per_person,
            total_cost=van_total,
            duration_factor="Fast & Seamless (Door-to-Door)",
            carbon_footprint_kg=round(12.5 * duration_days, 1),
            recommendation_verdict="Recommended for Groups of 4+ (Maximum Convenience)",
            pros=[
                "Entire group travels together with zero luggage hassle",
                "Dedicated driver handles parking and navigation",
                "Air-conditioned waiting between sightseeing stops"
            ],
            cons=[
                "Subject to city traffic congestion during rush hours"
            ]
        ))

        # Option 2: Public Rapid Transit / Metro Tourist Passes
        metro_per_day = 120.0
        metro_total = metro_per_day * duration_days * group_size
        metro_per_person = round(metro_per_day * duration_days, 2)
        options.append(TransportationOption(
            id="trans_metro",
            mode="Electrified Metro Rail & Low-Emission Urban Buses",
            estimated_cost_per_person=metro_per_person,
            total_cost=metro_total,
            duration_factor="Traffic-Immune & High Frequency",
            carbon_footprint_kg=round(2.1 * duration_days, 1),
            recommendation_verdict="Most Eco-Friendly & Most Affordable Choice",
            pros=[
                "Completely avoids road gridlock and traffic signals",
                "Extremely cost-effective (₹120/person/day unlimited passes)",
                "Reduces carbon emissions by over 80%"
            ],
            cons=[
                "Requires walking 5-10 minutes between stations",
                "Crowded during morning (09:00) and evening (18:30) rush"
            ]
        ))

        # Option 3: Split App-Based Cabs (Uber / Ola / Ride-Share)
        num_cabs = max(1, (group_size + 3) // 4)
        cab_day_cost = 1400.0 * num_cabs
        cab_total = cab_day_cost * duration_days
        cab_per_person = round(cab_total / group_size, 2)
        options.append(TransportationOption(
            id="trans_cabs",
            mode=f"Split App Cabs ({num_cabs}x On-Demand Sedan / Prime Cabs)",
            estimated_cost_per_person=cab_per_person,
            total_cost=cab_total,
            duration_factor="On-Demand Flexibility",
            carbon_footprint_kg=round(9.5 * duration_days * num_cabs, 1),
            recommendation_verdict="Flexible for Staggered Group Movements",
            pros=[
                "Pay only per trip taken; no upfront vehicle deposit",
                "Allows group to split up for independent evening shopping"
            ],
            cons=[
                "Surge pricing during rain or peak festival hours",
                "Multiple cabs can get separated in traffic"
            ]
        ))

        return options

