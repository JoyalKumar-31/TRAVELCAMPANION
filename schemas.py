from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

class TravelerProfile(BaseModel):
    destination: str = Field(..., description="Target destination city or region, e.g., 'Kyoto, Japan' or 'Hyderabad, India'")
    duration_days: int = Field(3, ge=1, le=14, description="Trip duration in days")
    budget: float = Field(..., description="Total budget in USD or INR")
    group_size: int = Field(1, ge=1, description="Number of travelers in the party")
    traveler_type: str = Field("solo", description="solo, couple, family, friends, college_group, or seniors")
    age_groups: List[str] = Field(default_factory=list, description="e.g. ['kids', 'adults', 'seniors']")
    interests: List[str] = Field(default_factory=lambda: ["culture", "sightseeing", "local food"], description="Interests e.g., history, food, adventure, nature")
    preferred_activities: List[str] = Field(default_factory=list, description="e.g. ['museums', 'water_sports', 'temples']")
    dietary_preferences: List[str] = Field(default_factory=list, description="e.g. ['vegetarian', 'vegan', 'halal', 'no_restrictions']")
    accessibility_requirements: List[str] = Field(default_factory=list, description="e.g. wheelchair_accessible, senior_friendly, elevator_required")
    pace_preference: str = Field("moderate", description="relaxed, moderate, or fast_paced")

class Activity(BaseModel):
    id: str
    title: str
    time_slot: str = Field(..., description="Morning (09:00 - 12:00), Afternoon (13:00 - 17:00), Evening (18:00 - 21:00)")
    category: str = Field(..., description="culture, food, nature, adventure, shopping, relaxation")
    location: str
    estimated_cost: float
    duration_hours: float
    is_indoor: bool
    description: str
    accessibility_features: List[str] = Field(default_factory=list)
    eco_friendly: bool = True

class DayPlan(BaseModel):
    day_number: int
    focus_theme: str
    activities: List[Activity]
    total_day_cost: float
    transit_mode: str = "Metro / Walking"

class EcoScore(BaseModel):
    score: int = Field(..., ge=0, le=100, description="Sustainability score 0-100")
    green_transport_percent: int
    eco_friendly_attractions: int
    carbon_footprint_kg: float = 18.5
    recommendations: List[str]

class SafetyInfo(BaseModel):
    safety_rating: str = "High"
    emergency_contacts: Dict[str, str] = Field(default_factory=dict)
    advisories: List[str] = Field(default_factory=list)

class Itinerary(BaseModel):
    trip_title: str
    destination: str
    duration_days: int
    total_estimated_cost: float
    budget_limit: float
    traveler_type: str
    days: List[DayPlan]
    eco_score: EcoScore
    safety: SafetyInfo
    local_food_recommendations: List[str] = Field(default_factory=list)

# Real-time Disruption Models
class DisruptionEvent(BaseModel):
    day_number: int
    time_slot: str  # Morning, Afternoon, Evening
    disruption_type: str = Field(..., description="weather (e.g. rain/storm), traffic, crowd_surge, attraction_closed, budget_limit")
    description: str
    severity: str = "medium"  # low, medium, high

class AlternativeOption(BaseModel):
    activity: Activity
    match_score: int
    transit_distance_km: float
    reason: str

class AdaptationResult(BaseModel):
    status: str
    affected_day: int
    affected_time_slot: str
    original_activity_title: str
    substitute_activity: Activity
    reason_for_change: str
    budget_variance: float
    updated_day_plan: DayPlan
    top_alternatives: List[AlternativeOption] = Field(default_factory=list)

# Group Dynamics Models
class ExpenseBreakdown(BaseModel):
    category: str
    amount_total: float
    amount_per_person: float
    percentage: int
    note: str

class MemberSplitSummary(BaseModel):
    name: str
    stated_budget: float
    fair_share: float
    balance: float
    status: str

class GroupMember(BaseModel):
    name: str
    interests: List[str] = Field(default_factory=list)
    max_budget: Optional[float] = None
    budget_limit: Optional[float] = None
    accessibility_needs: List[str] = Field(default_factory=list)

    @property
    def effective_budget(self) -> float:
        if self.max_budget is not None and self.max_budget > 0:
            return float(self.max_budget)
        if self.budget_limit is not None and self.budget_limit > 0:
            return float(self.budget_limit)
        return 25000.0

class AccommodationOption(BaseModel):
    id: str
    name: str
    type: str  # Boutique Hotel, Multi-Bedroom Villa, Serviced Apartment, Eco-Resort, Group Hostel
    location: str
    price_per_night: float
    total_estimated_cost: float
    max_guests: int
    amenities: List[str]
    suitability_rating: str
    description: str

class TransportationOption(BaseModel):
    id: str
    mode: str  # Dedicated Tempo Traveler / Van, Electric Public Metro, Split Ride-Shares, Rental Cars
    estimated_cost_per_person: float
    total_cost: float
    duration_factor: str
    carbon_footprint_kg: float
    recommendation_verdict: str
    pros: List[str]
    cons: List[str]

class GroupConsensusRequest(BaseModel):
    destination: str
    duration_days: int
    members: List[GroupMember]

class GroupConsensusResult(BaseModel):
    destination: str
    duration_days: int = 5
    group_size: int = 4
    aggregated_interests: List[str]
    recommended_shared_budget: float
    cost_per_person: float
    harmonized_budget_limit: Optional[float] = None
    consensus_summary: str
    voting_compromises: List[str]
    split_details: Dict[str, float]
    expense_breakdown: List[ExpenseBreakdown] = Field(default_factory=list)
    member_splits: List[MemberSplitSummary] = Field(default_factory=list)
    recommended_accommodations: List[AccommodationOption] = Field(default_factory=list)
    transportation_options: List[TransportationOption] = Field(default_factory=list)

# Smart Packing Models
class PackingItem(BaseModel):
    item: str
    essential: bool = True
    category: str
    note: str

class PackingCategory(BaseModel):
    category_name: str
    items: List[PackingItem]

class SmartPackingChecklist(BaseModel):
    destination: str
    duration_days: int
    weather_summary: str
    expected_temp_celsius: str
    categories: List[PackingCategory]
    total_items: int
    climate_tips: List[str]

class SmartPackingRequest(BaseModel):
    destination: str
    duration_days: int = 3
    traveler_type: str = "couple"
    age_groups: List[str] = Field(default_factory=lambda: ["adults"])
    planned_activities: List[str] = Field(default_factory=lambda: ["sightseeing", "walking", "dining"])
    season_or_month: str = "Current Season"

# Landmark Recognition (Computer Vision / Multimodal AI) Models
class LandmarkRecognitionRequest(BaseModel):
    image_base64: Optional[str] = None
    image_url: Optional[str] = None
    landmark_hint: Optional[str] = None

class LandmarkRecognitionResult(BaseModel):
    landmark_name: str
    confidence_score: float = Field(..., ge=0.0, le=1.0)
    city: str
    country: str
    historical_summary: str
    architectural_style: str
    best_visiting_time: str
    estimated_entry_fee: str
    wheelchair_accessible: bool
    safety_and_visiting_tips: List[str]
    eco_tip: str
    audio_guide_script: str

# What-If Travel Simulator Models
class WhatIfRequest(BaseModel):
    itinerary: Itinerary
    scenario_type: str = Field(..., description="weather_disruption, budget_cut, attraction_closure, traffic_gridlock, accessibility_change, member_dropout")
    parameter_value: str = Field(..., description="e.g. '25% budget cut', 'torrential rain day 2', 'Golconda fort closed'")
    affected_day: int = 1
    affected_time_slot: str = "Morning"

class WhatIfSimulationResult(BaseModel):
    scenario_title: str
    impact_analysis: List[str]
    mitigation_strategy: str
    feasibility_score: int = Field(..., ge=0, le=100)
    cost_delta: float
    adjusted_itinerary: Itinerary
    ai_recommendation_notes: str

# Multilingual Companion Models
class CompanionAction(BaseModel):
    action_type: str  # "SET_DESTINATION", "SET_DURATION", "SET_PERSONA", "SWITCH_DAY", "REPLAN", "SCROLL_TO_SECTION", "OPEN_BOOKING", "SWITCH_TRANSIT_MODE"
    payload: Any = None

class CompanionChatRequest(BaseModel):
    query: str
    destination: str = "General"
    language: str = "English"
    traveler_context: Optional[Dict[str, Any]] = None

class CompanionChatResponse(BaseModel):
    response_text: str
    language: str
    audio_narrative_text: str
    useful_local_phrases: Dict[str, str] = Field(default_factory=dict)
    suggested_followups: List[str] = Field(default_factory=list)
    action: Optional[CompanionAction] = None

# Emergency & Tourist Safety Models
class EmergencyRequest(BaseModel):
    destination: str
    current_landmark: Optional[str] = None
    emergency_type: str = "general"  # medical, police, women_safety, tourist_dispute, lost_documents

class EmergencyResponse(BaseModel):
    destination: str
    safety_status: str
    primary_emergency_numbers: Dict[str, str]
    nearest_support_facilities: List[Dict[str, str]]
    immediate_action_steps: List[str]
    embassy_or_consular_advice: str

