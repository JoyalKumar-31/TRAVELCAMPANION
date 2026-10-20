from langgraph.graph import StateGraph, START, END
from graph.state import TourismState
from agents.profiler_agent import ProfilerAgent
from agents.itinerary_agent import ItineraryAgent
from agents.adaptive_replanner import AdaptiveReplannerAgent
from agents.safety_eco_agent import SafetyEcoAgent
from schemas import Itinerary

# Initialize agent instances
profiler = ProfilerAgent()
itinerary_planner = ItineraryAgent()
replanner = AdaptiveReplannerAgent()
safety_eco = SafetyEcoAgent()

def profiler_node(state: TourismState) -> dict:
    profile = state["profile"]
    logs = list(state.get("logs", []))
    logs.append(f"[ProfilerAgent] Analyzing preferences & constraints for {profile.destination}...")
    
    analysis = profiler.analyze_profile(profile)
    logs.append(f"[ProfilerAgent] Daily budget cap: ${analysis['daily_budget']} | Pacing: {analysis['effective_pace']}")
    return {"profile_analysis": analysis, "logs": logs}

def safety_eco_node(state: TourismState) -> dict:
    profile = state["profile"]
    logs = list(state.get("logs", []))
    logs.append(f"[SafetyEcoAgent] Fetching safety indexes, eco-transit metrics, and local cuisine for {profile.destination}...")
    
    safety, eco, food = safety_eco.generate_safety_and_eco(profile.destination)
    logs.append(f"[SafetyEcoAgent] Eco Score: {eco.score}/100 | Safety Rating: {safety.safety_rating}")
    return {"safety_info": safety, "eco_score": eco, "local_food": food, "logs": logs}

def itinerary_planner_node(state: TourismState) -> dict:
    profile = state["profile"]
    analysis = state["profile_analysis"]
    logs = list(state.get("logs", []))
    logs.append(f"[ItineraryAgent] Constructing optimized {profile.duration_days}-day itinerary...")
    
    day_plans = itinerary_planner.generate_day_plans(profile, analysis)
    total_cost = round(sum(d.total_day_cost for d in day_plans), 2)
    
    itinerary = Itinerary(
        trip_title=f"Personalized {profile.duration_days}-Day Journey across {profile.destination}",
        destination=profile.destination,
        duration_days=profile.duration_days,
        total_estimated_cost=total_cost,
        budget_limit=profile.budget,
        traveler_type=profile.traveler_type,
        days=day_plans,
        eco_score=state["eco_score"],
        safety=state["safety_info"],
        local_food_recommendations=state["local_food"]
    )
    logs.append(f"[ItineraryAgent] Itinerary generated. Total cost: ${total_cost} within ${profile.budget} budget.")
    return {"itinerary": itinerary, "logs": logs}

def disruption_monitor_node(state: TourismState) -> dict:
    logs = list(state.get("logs", []))
    disruption = state.get("disruption")
    if disruption:
        logs.append(f"[AdaptiveMonitor] REAL-TIME DISRUPTION DETECTED on Day {disruption.day_number} ({disruption.time_slot}): {disruption.description}")
    else:
        logs.append("[AdaptiveMonitor] All conditions normal. No real-time disruptions.")
    return {"logs": logs}

def check_disruption_condition(state: TourismState) -> str:
    """Routing logic: If disruption exists, branch to adaptive replanner."""
    if state.get("disruption"):
        return "adaptive_replanner"
    return "finalizer"

def adaptive_replanner_node(state: TourismState) -> dict:
    itinerary = state["itinerary"]
    disruption = state["disruption"]
    logs = list(state.get("logs", []))
    logs.append(f"[AdaptiveReplanner] Recalculating schedule and routing alternatives...")
    
    updated_itinerary, adaptation_result = replanner.adapt(itinerary, disruption)
    logs.append(f"[AdaptiveReplanner] Successfully substituted '{adaptation_result.original_activity_title}' -> '{adaptation_result.substitute_activity.title}'")
    logs.append(f"[AdaptiveReplanner] Reason: {adaptation_result.reason_for_change}")
    
    return {
        "itinerary": updated_itinerary,
        "adaptation_result": adaptation_result,
        "logs": logs
    }

def finalizer_node(state: TourismState) -> dict:
    logs = list(state.get("logs", []))
    logs.append("[Orchestrator] Completed AI Tourism Companion graph execution.")
    return {"logs": logs}

def build_tourism_graph():
    """Builds and compiles the LangGraph StateGraph."""
    graph_builder = StateGraph(TourismState)
    
    # Add Nodes
    graph_builder.add_node("profiler", profiler_node)
    graph_builder.add_node("safety_eco", safety_eco_node)
    graph_builder.add_node("itinerary_planner", itinerary_planner_node)
    graph_builder.add_node("disruption_monitor", disruption_monitor_node)
    graph_builder.add_node("adaptive_replanner", adaptive_replanner_node)
    graph_builder.add_node("finalizer", finalizer_node)
    
    # Add Edges
    graph_builder.add_edge(START, "profiler")
    graph_builder.add_edge("profiler", "safety_eco")
    graph_builder.add_edge("safety_eco", "itinerary_planner")
    graph_builder.add_edge("itinerary_planner", "disruption_monitor")
    
    # Conditional Edge for Real-Time Adaptation
    graph_builder.add_conditional_edges(
        "disruption_monitor",
        check_disruption_condition,
        {
            "adaptive_replanner": "adaptive_replanner",
            "finalizer": "finalizer"
        }
    )
    graph_builder.add_edge("adaptive_replanner", "finalizer")
    graph_builder.add_edge("finalizer", END)
    
    return graph_builder.compile()

# Pre-compiled application instance
tourism_agent_graph = build_tourism_graph()
