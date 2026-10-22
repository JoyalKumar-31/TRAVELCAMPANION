import os
from typing import List, Dict
from collections import Counter
from schemas import (
    GroupConsensusRequest, 
    GroupConsensusResult, 
    GroupMember,
    ExpenseBreakdown,
    MemberSplitSummary,
    AccommodationOption,
    TransportationOption
)
from config import get_llm

# Daily Baseline Rates per Person in ₹ INR based on Destination Tiers
DESTINATION_DAILY_RATES: Dict[str, float] = {
    "switzerland": 12000.0,
    "paris": 13000.0,
    "dubai": 11000.0,
    "rome": 12500.0,
    "tokyo": 11500.0,
    "singapore": 10500.0,
    "london": 13500.0,
    "kashmir": 4200.0,
    "goa": 3500.0,
    "kerala": 3800.0,
    "manali": 3400.0,
    "delhi": 3200.0,
    "agra": 3200.0,
    "hyderabad": 2800.0,
    "vizag": 2600.0,
    "visakhapatnam": 2600.0,
    "jaipur": 3000.0,
    "rajasthan": 3000.0,
    "varanasi": 2500.0,
    "ladakh": 4500.0,
    "ooty": 3000.0
}

def get_destination_base_rate(destination: str) -> float:
    dest_lower = (destination or "").lower()
    for key, rate in DESTINATION_DAILY_RATES.items():
        if key in dest_lower:
            return rate
    return 3500.0

class GroupConsensusAgent:
    """
    Solves group travel frictions:
    - Calculates destination-aware fair shared budget and per-person cost
    - Computes proportional & equalized expense splitting across members
    - Generates category breakdown (lodging, dining, activities, shared transit)
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

        duration_days = max(1, request.duration_days)
        destination_name = request.destination or "Destination"
        clean_city = destination_name.split(",")[0].split("(")[0].strip()

        # 1. Aggregate Interests
        all_interests = []
        for m in members:
            all_interests.extend(m.interests)
        
        interest_counts = Counter(all_interests)
        ranked_interests = [item for item, count in interest_counts.most_common()]
        if not ranked_interests:
            ranked_interests = ["sightseeing", "culture", "local food", "relaxation"]

        # 2. Destination-Aware Fair Budget Calculation
        base_rate_per_day = get_destination_base_rate(destination_name)
        # Groups of 3+ benefit from lodging room sharing and shared cabs
        group_economy_factor = 0.80 if num_members >= 4 else (0.88 if num_members >= 2 else 1.0)
        dest_benchmark_per_person = round(base_rate_per_day * duration_days * group_economy_factor, 2)

        # Extract declared member budgets
        member_budgets = [m.effective_budget for m in members]
        min_budget_in_group = min(member_budgets)
        avg_budget = sum(member_budgets) / num_members

        # Harmonize: Blend destination benchmark with declared budgets to stay both realistic and affordable
        # Ensure we do not drastically exceed the lowest member's threshold
        if min_budget_in_group > 0:
            blended_target = (dest_benchmark_per_person * 0.50) + (avg_budget * 0.50)
            recommended_per_person = round(min(blended_target, min_budget_in_group * 1.25), 2)
            recommended_per_person = max(recommended_per_person, min_budget_in_group * 0.90)
        else:
            recommended_per_person = dest_benchmark_per_person

        recommended_per_person = round(recommended_per_person, 2)
        total_shared_budget = round(recommended_per_person * num_members, 2)

        # 3. Expense Category Breakdown (Lodging, Food, Sightseeing, Transport)
        expense_breakdown = [
            ExpenseBreakdown(
                category="🏨 Shared Lodging & Villas",
                amount_total=round(total_shared_budget * 0.35, 2),
                amount_per_person=round(recommended_per_person * 0.35, 2),
                percentage=35,
                note=f"2 persons per room or 1 private {num_members}-guest villa"
            ),
            ExpenseBreakdown(
                category="🍽️ Group Dining & Meals",
                amount_total=round(total_shared_budget * 0.25, 2),
                amount_per_person=round(recommended_per_person * 0.25, 2),
                percentage=25,
                note="Breakfast included + family-style shared lunches & dinners"
            ),
            ExpenseBreakdown(
                category="🎟️ Activities & Monument Passes",
                amount_total=round(total_shared_budget * 0.25, 2),
                amount_per_person=round(recommended_per_person * 0.25, 2),
                percentage=25,
                note="Group entry passes, guided heritage tours & excursions"
            ),
            ExpenseBreakdown(
                category="🚐 Shared Local Transit & Cabs",
                amount_total=round(total_shared_budget * 0.15, 2),
                amount_per_person=round(recommended_per_person * 0.15, 2),
                percentage=15,
                note=f"Split dedicated minivan / tempo traveler between all {num_members} travelers"
            )
        ]

        # 4. Member Contribution Splits Matrix (Equal 1/N Split vs Stated Budget)
        member_splits: List[MemberSplitSummary] = []
        split_details: Dict[str, float] = {}
        for m in members:
            stated = m.effective_budget
            balance = round(stated - recommended_per_person, 2)
            if balance > 500:
                status = f"Surplus (+₹{int(balance):,})"
            elif balance < -500:
                status = f"Shortfall (-₹{int(abs(balance)):,})"
            else:
                status = "Fully Balanced"

            member_splits.append(MemberSplitSummary(
                name=m.name,
                stated_budget=stated,
                fair_share=recommended_per_person,
                balance=balance,
                status=status
            ))
            split_details[m.name] = recommended_per_person

        # 5. Compromises & Voting Insights
        voting_compromises = []
        for interest, count in interest_counts.most_common():
            percentage = int((count / num_members) * 100)
            if percentage >= 60:
                voting_compromises.append(f"Strong Consensus: {interest.title()} approved by {percentage}% of the group.")
            elif percentage >= 40:
                voting_compromises.append(f"Compromise Window: {interest.title()} ({percentage}% support) scheduled for a dedicated half-day excursion.")
            else:
                voting_compromises.append(f"Elective Option: {interest.title()} ({percentage}% support) set as optional free-time activity.")

        # 6. Group Accommodation Recommendations
        nights = max(1, duration_days - 1)
        accommodations = self._recommend_accommodations(clean_city, num_members, recommended_per_person, nights)

        # 7. Transportation Optimization
        transport_options = self._optimize_transportation(clean_city, num_members, duration_days)

        consensus_summary = (
            f"Calculated for {clean_city} ({duration_days} Days): Total group budget of ₹{int(total_shared_budget):,} "
            f"split equally into ₹{int(recommended_per_person):,} per member across {num_members} travelers. "
            f"Lodging and cab sharing delivers ~{int((1-group_economy_factor)*100)}% cost savings per person."
        )

        return GroupConsensusResult(
            destination=destination_name,
            duration_days=duration_days,
            group_size=num_members,
            aggregated_interests=ranked_interests,
            recommended_shared_budget=total_shared_budget,
            cost_per_person=recommended_per_person,
            harmonized_budget_limit=total_shared_budget,
            consensus_summary=consensus_summary,
            voting_compromises=voting_compromises,
            split_details=split_details,
            expense_breakdown=expense_breakdown,
            member_splits=member_splits,
            recommended_accommodations=accommodations,
            transportation_options=transport_options
        )

    def _recommend_accommodations(
        self, city: str, group_size: int, per_person_budget: float, nights: int
    ) -> List[AccommodationOption]:
        options = []
        nightly_budget_pool = max(2500.0, (per_person_budget * 0.35 * group_size) / max(1, nights))

        # Option 1: Multi-Bedroom Villa / Entire Private Home
        villa_price = round(nightly_budget_pool * 1.05, 2)
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
        apt_price = round(nightly_budget_pool * 0.82, 2)
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
        hotel_price = round(nightly_budget_pool * 1.15, 2)
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
        van_day_rate = 3200.0 if group_size <= 6 else 4800.0
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
                f"Entire group of {group_size} travels together with zero luggage hassle",
                "Dedicated driver handles parking and navigation",
                f"Saves ~₹{int(van_day_rate * 0.4):,}/day compared to booking separate taxis"
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
                f"Extremely cost-effective (₹120/person/day unlimited passes in {city})",
                "Reduces carbon emissions by over 80%"
            ],
            cons=[
                "Requires walking 5-10 minutes between stations",
                "Crowded during morning (09:00) and evening (18:30) rush"
            ]
        ))

        # Option 3: Split App-Based Cabs
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
