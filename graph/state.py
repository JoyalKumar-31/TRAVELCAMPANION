from typing import TypedDict, Optional, List, Dict, Any
from schemas import TravelerProfile, Itinerary, DisruptionEvent, AdaptationResult, SafetyInfo, EcoScore

class TourismState(TypedDict, total=False):
    # Input profile
    profile: TravelerProfile
    
    # Internal agent pipeline data
    profile_analysis: Dict[str, Any]
    safety_info: SafetyInfo
    eco_score: EcoScore
    local_food: List[str]
    
    # Output Itinerary
    itinerary: Optional[Itinerary]
    
    # Real-time condition trigger
    disruption: Optional[DisruptionEvent]
    adaptation_result: Optional[AdaptationResult]
    
    # Agent Execution Log
    logs: List[str]
    error: Optional[str]
