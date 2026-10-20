from schemas import TravelerProfile
from config import get_llm

class ProfilerAgent:
    """
    Analyzes traveler constraints, group dynamics, budget ceilings, 
    and mobility/accessibility needs.
    """
    def __init__(self):
        self.llm = get_llm()

    def analyze_profile(self, profile: TravelerProfile) -> dict:
        daily_budget = round(profile.budget / max(1, profile.duration_days), 2)
        
        # Enforce accessibility and tempo constraints based on traveler type
        accessibility_flags = list(profile.accessibility_requirements)
        pacing = profile.pace_preference

        if profile.traveler_type == "seniors":
            if "senior_friendly" not in accessibility_flags:
                accessibility_flags.append("senior_friendly")
            pacing = "relaxed"
        elif profile.traveler_type == "family":
            if "family_friendly" not in accessibility_flags:
                accessibility_flags.append("family_friendly")
        elif profile.traveler_type == "college_group":
            pacing = "fast_paced"

        prompt = (
            f"As an AI Tourism Profiler, analyze this traveler profile for {profile.destination}:\n"
            f"- Group Size & Type: {profile.group_size} travelers ({profile.traveler_type})\n"
            f"- Duration: {profile.duration_days} days\n"
            f"- Total Budget: ₹{profile.budget} (₹{daily_budget}/day)\n"
            f"- Interests: {', '.join(profile.interests)}\n"
            f"- Accessibility Needs: {', '.join(accessibility_flags) if accessibility_flags else 'None'}\n"
            f"- Pace: {pacing}\n"
            f"Provide a brief 2-sentence optimization strategy for itinerary construction."
        )

        try:
            llm_response = self.llm.invoke(prompt)
            persona_strategy = llm_response.content if hasattr(llm_response, "content") else str(llm_response)
        except Exception:
            persona_strategy = (
                f"Optimized for {profile.traveler_type} travelers focusing on {', '.join(profile.interests)} "
                f"with a daily budget cap of ₹{daily_budget}."
            )

        return {
            "daily_budget": daily_budget,
            "effective_pace": pacing,
            "accessibility_flags": accessibility_flags,
            "persona_strategy": persona_strategy
        }
