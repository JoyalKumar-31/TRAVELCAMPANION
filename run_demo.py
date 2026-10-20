"""
End-to-End Demonstration Script for AI Adaptive Tourism Companion
Demonstrates all 8 AI & Agentic roles:
1. Personalized Itinerary Generation via LangGraph pipeline (in ₹ INR)
2. Real-Time Dynamic Replanning (Monsoon Rainfall Disruption + Ranked Alternatives)
3. Group Travel: Voting Consensus, Accommodation Recommendations & Transit Optimization
4. Smart Packing Checklist Generation (Weather & Demographics Aware)
5. Landmark Recognition & Vision AI (Computer Vision Monument Scanning)
6. What-If Travel Simulator (Hypothetical Contingency Shocks)
7. Multilingual Conversational Companion (Voice narration + Phrasebooks)
8. Safety Indicators & SOS Emergency Assistance
"""

import sys
import json

# Ensure Windows terminal prints UTF-8 characters cleanly
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")

from schemas import (
    TravelerProfile, 
    DisruptionEvent, 
    GroupConsensusRequest, 
    GroupMember,
    SmartPackingRequest,
    LandmarkRecognitionRequest,
    WhatIfRequest,
    CompanionChatRequest,
    EmergencyRequest
)
from graph.tourism_graph import tourism_agent_graph
from agents import (
    AdaptiveReplannerAgent,
    GroupConsensusAgent,
    SmartPackingAgent,
    LandmarkVisionAgent,
    WhatIfTravelSimulator,
    MultilingualCompanionAgent,
    SafetyEcoAgent
)

def print_separator(title: str):
    print("\n" + "=" * 80)
    print(f"  {title}")
    print("=" * 80 + "\n")

def run_demo():
    # =========================================================================
    # DEMO 1: PERSONALIZED ITINERARY GENERATION
    # =========================================================================
    print_separator("DEMO 1: PERSONALIZED ITINERARY GENERATION IN INDIAN RUPEES (₹)")

    profile = TravelerProfile(
        destination="Hyderabad (Charminar, Golconda Fort & Salar Jung Museum), Telangana",
        duration_days=3,
        budget=20000.0,
        group_size=2,
        traveler_type="couple",
        interests=["culture", "local food", "history", "sightseeing"],
        accessibility_requirements=["wheelchair_accessible"],
        pace_preference="moderate"
    )

    print(f"Input Profile:\n- Destination: {profile.destination}\n- Duration: {profile.duration_days} Days")
    print(f"- Total Budget: ₹{profile.budget:,.0f} (₹{profile.budget/profile.duration_days:,.0f}/day)")
    print(f"- Traveler Type: {profile.traveler_type}\n- Interests: {profile.interests}")
    print(f"- Accessibility: {profile.accessibility_requirements}")
    print("\nExecuting LangGraph Multi-Agent Pipeline...")

    initial_state = {
        "profile": profile,
        "disruption": None,
        "logs": []
    }

    final_state = tourism_agent_graph.invoke(initial_state)

    itinerary = final_state["itinerary"]
    logs = final_state["logs"]

    print("\n[Agent Logs]:")
    for log in logs:
        print(f"  > {log}")

    print(f"\nGenerated Itinerary Title: {itinerary.trip_title}")
    print(f"Total Cost: ₹{itinerary.total_estimated_cost:,.0f} (Budget: ₹{itinerary.budget_limit:,.0f})")
    print(f"Eco-Tourism Score: {itinerary.eco_score.score}/100 (Green Transit: {itinerary.eco_score.green_transport_percent}%)")
    print(f"Safety Rating: {itinerary.safety.safety_rating}")

    for day in itinerary.days:
        print(f"\n--- Day {day.day_number}: {day.focus_theme} (Cost: ₹{day.total_day_cost:,.0f}) ---")
        for act in day.activities:
            loc_type = "Indoor" if act.is_indoor else "Outdoor"
            print(f"  [{act.time_slot}] {act.title} (₹{act.estimated_cost:,.0f}) | {loc_type} | Loc: {act.location}")

    # =========================================================================
    # DEMO 2: REAL-TIME ADAPTIVE REPLANNING
    # =========================================================================
    print_separator("DEMO 2: REAL-TIME ADAPTIVE REPLANNING (MONSOON DISRUPTION)")
    print("Simulating Real-Time Event: Torrential Rain and Flash Flooding on Day 1 Morning.")
    
    disruption = DisruptionEvent(
        day_number=1,
        time_slot="Morning",
        disruption_type="weather",
        description="Torrential rainfall alert and thunderstorm warning in central heritage zone",
        severity="high"
    )

    print(f"Live Alert: Day {disruption.day_number} | {disruption.time_slot} | {disruption.description}")
    print("Invoking Adaptive Replanner Agent...")

    replanner = AdaptiveReplannerAgent()
    updated_itinerary, adaptation_result = replanner.adapt(itinerary, disruption)

    print("\n[Adaptation Result]:")
    print(f"Status: {adaptation_result.status}")
    print(f"Original Plan : {adaptation_result.original_activity_title}")
    print(f"Substituted To: {adaptation_result.substitute_activity.title} (Indoor: {adaptation_result.substitute_activity.is_indoor})")
    print(f"Budget Variance: ₹{adaptation_result.budget_variance:,.0f}")
    print(f"AI Explanation: {adaptation_result.reason_for_change}")

    if adaptation_result.top_alternatives:
        print(f"\nTop Ranked Fallback Options:")
        for idx, alt in enumerate(adaptation_result.top_alternatives, 1):
            print(f"  {idx}. {alt.activity.title} (Match: {alt.match_score}%, Transit: {alt.transit_distance_km} km) - {alt.reason}")

    # =========================================================================
    # DEMO 3: GROUP TRAVEL CONSENSUS, ACCOMMODATIONS & TRANSIT
    # =========================================================================
    print_separator("DEMO 3: GROUP TRAVEL: CONSENSUS, ACCOMMODATIONS & TRANSIT")

    group_req = GroupConsensusRequest(
        destination="Hyderabad, Telangana",
        duration_days=3,
        members=[
            GroupMember(name="Rahul", interests=["adventure", "history", "nightlife"], max_budget=15000.0),
            GroupMember(name="Priya", interests=["culture", "local food", "photography"], max_budget=18000.0),
            GroupMember(name="Ananya", interests=["shopping", "local food", "relaxation"], max_budget=12000.0),
            GroupMember(name="Arjun", interests=["history", "culture", "relaxation"], max_budget=14000.0)
        ]
    )

    print(f"Group: 4 Friends traveling to {group_req.destination}")
    for m in group_req.members:
        print(f"  - {m.name}: Interests={m.interests}, Individual Max Budget=₹{m.max_budget:,.0f}")

    group_agent = GroupConsensusAgent()
    group_res = group_agent.harmonize_group(group_req)

    print(f"\nConsensus Summary: {group_res.consensus_summary}")
    print(f"Ranked Group Interests: {group_res.aggregated_interests[:5]}")
    print(f"Recommended Fair Budget Per Person: ₹{group_res.cost_per_person:,.0f} (Total Pool: ₹{group_res.recommended_shared_budget:,.0f})")

    print(f"\nGroup Accommodation Recommendations:")
    for acc in group_res.recommended_accommodations:
        print(f"  * [{acc.type}] {acc.name} - ₹{acc.price_per_night:,.0f}/night (Total: ₹{acc.total_estimated_cost:,.0f})")
        print(f"    Rating: {acc.suitability_rating} | Amenities: {', '.join(acc.amenities[:3])}")

    print(f"\nTransportation Optimization:")
    for tr in group_res.transportation_options:
        print(f"  * {tr.mode} - ₹{tr.estimated_cost_per_person:,.0f}/person | Carbon: {tr.carbon_footprint_kg} kg CO2")
        print(f"    Verdict: {tr.recommendation_verdict}")

    # =========================================================================
    # DEMO 4: SMART PACKING CHECKLIST GENERATOR
    # =========================================================================
    print_separator("DEMO 4: SMART PACKING CHECKLIST GENERATOR (AI CLIMATE & ACTIVITY)")

    packing_agent = SmartPackingAgent()
    packing_req = SmartPackingRequest(
        destination="Hyderabad, Telangana",
        duration_days=3,
        traveler_type="couple",
        planned_activities=["heritage walk", "food trail", "temple visit"]
    )
    packing_res = packing_agent.generate_checklist(packing_req)

    print(f"Destination Climate: {packing_res.expected_temp_celsius} ({packing_res.weather_summary})")
    print(f"Total Recommended Items: {packing_res.total_items} across {len(packing_res.categories)} categories\n")

    for cat in packing_res.categories:
        print(f"[{cat.category_name}]:")
        for item in cat.items[:2]:
            essential_badge = "[ESSENTIAL]" if item.essential else "[OPTIONAL]"
            print(f"  - {essential_badge} {item.item} ({item.note})")

    # =========================================================================
    # DEMO 5: LANDMARK RECOGNITION & VISION AI
    # =========================================================================
    print_separator("DEMO 5: LANDMARK RECOGNITION & VISION AI (MONUMENT SCANNING)")

    vision_agent = LandmarkVisionAgent()
    scan_req = LandmarkRecognitionRequest(landmark_hint="charminar four minarets old city")
    scan_res = vision_agent.recognize_landmark(scan_req)

    print(f"Detected Landmark : {scan_res.landmark_name} (Confidence: {scan_res.confidence_score*100:.1f}%)")
    print(f"Location          : {scan_res.city}, {scan_res.country}")
    print(f"Architectural Era : {scan_res.architectural_style}")
    print(f"Historical Context: {scan_res.historical_summary}")
    print(f"Ticket / Timings  : {scan_res.estimated_entry_fee} | Best: {scan_res.best_visiting_time}")
    print(f"Wheelchair Access : {'Yes (Ground plaza level)' if scan_res.wheelchair_accessible else 'Step-restricted (Ground accessible, minarets steep spiral steps)'}")
    print(f"\n30-Second Audio Guide Narrative:")
    print(f"  \"{scan_res.audio_guide_script[:180]}...\"")

    # =========================================================================
    # DEMO 6: WHAT-IF TRAVEL SIMULATOR
    # =========================================================================
    print_separator("DEMO 6: WHAT-IF TRAVEL SIMULATOR (HYPOTHETICAL CONTINGENCY SHOCKS)")

    whatif_agent = WhatIfTravelSimulator()

    # Scenario A: 25% Budget Cut
    whatif_req_a = WhatIfRequest(
        itinerary=itinerary,
        scenario_type="budget_cut",
        parameter_value="25% budget reduction"
    )
    whatif_res_a = whatif_agent.simulate_scenario(whatif_req_a)

    print(f"Scenario 1: {whatif_res_a.scenario_title}")
    print(f"  - Feasibility Score: {whatif_res_a.feasibility_score}/100")
    print(f"  - Budget Impact    : ₹{whatif_res_a.cost_delta:,.2f} variance")
    print(f"  - Mitigation Plan  : {whatif_res_a.mitigation_strategy}")
    for impact in whatif_res_a.impact_analysis:
        print(f"    * {impact}")

    # Scenario B: Sudden Venue Closure
    whatif_req_b = WhatIfRequest(
        itinerary=itinerary,
        scenario_type="attraction_closure",
        parameter_value="Golconda Fort closed for VIP diplomatic visit",
        affected_day=1
    )
    whatif_res_b = whatif_agent.simulate_scenario(whatif_req_b)

    print(f"\nScenario 2: {whatif_res_b.scenario_title}")
    print(f"  - Mitigation Plan: {whatif_res_b.mitigation_strategy}")
    print(f"  - AI Advice      : {whatif_res_b.ai_recommendation_notes}")

    # =========================================================================
    # DEMO 7: MULTILINGUAL CONVERSATIONAL COMPANION
    # =========================================================================
    print_separator("DEMO 7: MULTILINGUAL CONVERSATIONAL COMPANION (VOICE & PHRASEBOOK)")

    companion = MultilingualCompanionAgent()
    chat_req = CompanionChatRequest(
        query="What are the best street food items to eat near Charminar in the evening?",
        destination="Hyderabad, Telangana",
        language="Hindi"
    )
    chat_res = companion.respond(chat_req)

    print(f"User Query      : {chat_req.query}")
    print(f"Language Target : {chat_res.language}")
    print(f"AI Guide Answer : {chat_res.response_text}")
    print(f"\nLocal Colloquial Phrasebook (Hyderabad):")
    for eng, loc in list(chat_res.useful_local_phrases.items())[:4]:
        print(f"  * {eng:<32} -> {loc}")

    # =========================================================================
    # DEMO 8: TOURIST SAFETY & EMERGENCY ASSISTANCE
    # =========================================================================
    print_separator("DEMO 8: TOURIST SAFETY & SOS EMERGENCY ASSISTANCE")

    safety_agent = SafetyEcoAgent()
    emg_res = safety_agent.generate_emergency_support("Hyderabad, Telangana", "general")

    print(f"Destination Safety Status: {emg_res.safety_status}")
    print("Primary Emergency Hotlines:")
    for service, phone in emg_res.primary_emergency_numbers.items():
        print(f"  - {service:<26}: {phone}")

    print("\nImmediate Action Steps for Tourist in Crisis:")
    for step in emg_res.immediate_action_steps[:3]:
        print(f"  {step}")

    print_separator("ALL 8 AI AGENT DEMONSTRATIONS COMPLETED SUCCESSFULLY")

if __name__ == "__main__":
    run_demo()
