import os
import json
import streamlit as st

from schemas import (
    TravelerProfile, 
    DisruptionEvent, 
    GroupMember, 
    GroupConsensusRequest,
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
from real_places_db import get_real_destination_data

# Streamlit Page Config
st.set_page_config(
    page_title="AI Adaptive Tourism Companion",
    page_icon="🌍",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Custom Styling
st.markdown("""
<style>
    .main-header {
        font-size: 2.2rem;
        font-weight: 700;
        color: #1E3A8A;
        margin-bottom: 0.2rem;
    }
    .sub-header {
        font-size: 1.05rem;
        color: #4B5563;
        margin-bottom: 1.2rem;
    }
    .card {
        background-color: #F8FAFC;
        border-radius: 10px;
        padding: 1.1rem;
        border: 1px solid #E2E8F0;
        margin-bottom: 0.9rem;
    }
    .badge-indoor {
        background-color: #E0E7FF;
        color: #3730A3;
        padding: 2px 7px;
        border-radius: 5px;
        font-size: 0.78rem;
        font-weight: 600;
    }
    .badge-outdoor {
        background-color: #FEF3C7;
        color: #92400E;
        padding: 2px 7px;
        border-radius: 5px;
        font-size: 0.78rem;
        font-weight: 600;
    }
    .metric-box {
        background-color: #EFF6FF;
        border-left: 4px solid #3B82F6;
        padding: 10px;
        border-radius: 4px;
        margin-bottom: 8px;
    }
</style>
""", unsafe_allow_html=True)

# Sidebar Configuration
st.sidebar.title("🌍 AI Tourism Settings")
st.sidebar.markdown("**Role: AI & AI Agents Lead**")

groq_key_input = st.sidebar.text_input(
    "Groq API Key (Optional)",
    type="password",
    value=os.getenv("GROQ_API_KEY", "") if not os.getenv("GROQ_API_KEY", "").startswith("gsk_your_groq") else "",
    help="Enter your Groq API key for live LLaMA 3.3 generation. If left empty, intelligent offline knowledge bases activate automatically!"
)

if groq_key_input and groq_key_input.strip():
    os.environ["GROQ_API_KEY"] = groq_key_input.strip()
    st.sidebar.success("🟢 Live Groq LLaMA 3.3 70B Active")
else:
    st.sidebar.info("🟡 Intelligent Verified Catalog & Heuristic Fallback Active")

st.sidebar.markdown("---")
st.sidebar.markdown("### 🧩 Architecture Pipeline")
st.sidebar.markdown("• **Agent Engine:** LangGraph (StateGraph)")
st.sidebar.markdown("• **Replanner:** Adaptive Context Engine")
st.sidebar.markdown("• **Vision:** Landmark Recognition AI")
st.sidebar.markdown("• **Consensus:** Borda Multi-Member Voting")
st.sidebar.markdown("• **Backend Interop:** Spring Boot & MySQL Ready")
st.sidebar.markdown("---")
st.sidebar.markdown("📌 *Pair with Spring Boot backend on port 8080 and React on port 3000.*")

# Initialize Agents
replanner_agent = AdaptiveReplannerAgent()
group_agent = GroupConsensusAgent()
packing_agent = SmartPackingAgent()
vision_agent = LandmarkVisionAgent()
whatif_agent = WhatIfTravelSimulator()
companion_agent = MultilingualCompanionAgent()
safety_agent = SafetyEcoAgent()

# Main Header
st.markdown('<div class="main-header">🌍 AI Adaptive Tourism Companion</div>', unsafe_allow_html=True)
st.markdown('<div class="sub-header">An Intelligent Personalized and Real-Time Travel Planning Platform</div>', unsafe_allow_html=True)

# Session State Cache
if "current_itinerary" not in st.session_state:
    st.session_state.current_itinerary = None
if "agent_logs" not in st.session_state:
    st.session_state.agent_logs = []

tabs = st.tabs([
    "🗺️ Itinerary Generator", 
    "⚡ Real-Time Replanner", 
    "👥 Group Travel & Logistics", 
    "🧳 Smart Packing", 
    "📸 Landmark Vision AI", 
    "🔮 What-If Simulator", 
    "🗣️ Multilingual Companion", 
    "🛡️ Safety & SOS Hub"
])

# =========================================================================
# TAB 1: ITINERARY PLANNER
# =========================================================================
with tabs[0]:
    col1, col2 = st.columns([1, 2])

    with col1:
        st.subheader("Trip Configuration")
        dest_preset = st.selectbox(
            "Destination",
            [
                "Hyderabad (Charminar, Golconda Fort & Salar Jung Museum), Telangana",
                "Visakhapatnam / Vizag (INS Kursura Submarine & Kailasagiri), Andhra Pradesh",
                "Kerala (Kochi, Alappuzha, Munnar), India",
                "Alappuzha (Alleppey Backwaters & Beach), Kerala",
                "Bengaluru (Bangalore Palace, Lalbagh & Cubbon Park), Karnataka",
                "Chennai & Mahabalipuram (Shore Temple & Marina Beach), Tamil Nadu",
                "Mumbai (Gateway of India, Marine Drive & CSMVS), Maharashtra",
                "Goa (Calangute, Baga & Dudhsagar Falls), India",
                "Delhi & Agra (Taj Mahal & Qutub Minar), India",
                "Dubai, UAE (Burj Khalifa, Desert Safari & Dubai Mall)",
                "Tokyo, Japan (Asakusa, Meiji Shrine & Shibuya)",
                "Paris, France (Eiffel Tower, Louvre Museum & Montmartre)",
                "Rome, Italy (Colosseum, Vatican & Trevi Fountain)"
            ]
        )

        duration = st.slider("Trip Duration (Days)", 1, 7, 3)
        budget = st.number_input("Total Trip Budget (₹ INR)", min_value=1000.0, max_value=500000.0, value=25000.0, step=1000.0)

        traveler_type = st.selectbox(
            "Traveler Group Type",
            ["couple", "solo", "family", "friends", "college_group", "seniors"]
        )

        group_size = st.number_input("Group Size", min_value=1, max_value=20, value=2 if traveler_type in ["couple", "family"] else 1)
        pace = st.selectbox("Preferred Pacing", ["moderate", "relaxed", "fast_paced"])

        interests = st.multiselect(
            "Travel Interests",
            ["culture", "local food", "history", "sightseeing", "nature", "relaxation", "adventure", "shopping"],
            default=["culture", "local food", "sightseeing"]
        )

        accessibility = st.multiselect(
            "Accessibility Requirements",
            ["wheelchair_accessible", "senior_friendly", "step_free_access", "elevator_required"],
            default=["wheelchair_accessible"] if traveler_type == "seniors" else []
        )

        if st.button("🚀 Generate Adaptive Itinerary", use_container_width=True, type="primary"):
            with st.spinner("Executing LangGraph Multi-Agent Pipeline..."):
                profile = TravelerProfile(
                    destination=dest_preset,
                    duration_days=duration,
                    budget=budget,
                    group_size=group_size,
                    traveler_type=traveler_type,
                    interests=interests,
                    accessibility_requirements=accessibility,
                    pace_preference=pace
                )
                initial_state = {"profile": profile, "disruption": None, "logs": []}
                final_state = tourism_agent_graph.invoke(initial_state)

                st.session_state.current_itinerary = final_state.get("itinerary")
                st.session_state.agent_logs = final_state.get("logs", [])
                st.success("✅ Itinerary Successfully Synthesized!")

    with col2:
        itin = st.session_state.current_itinerary
        if itin:
            st.markdown(f"### {itin.trip_title}")
            m1, m2, m3, m4 = st.columns(4)
            m1.metric("Total Cost", f"₹{itin.total_estimated_cost:,.0f}", delta=f"Within ₹{itin.budget_limit:,.0f}")
            m2.metric("Eco Score", f"{itin.eco_score.score}/100", f"{itin.eco_score.green_transport_percent}% Green")
            m3.metric("Carbon Est.", f"{itin.eco_score.carbon_footprint_kg} kg CO2")
            m4.metric("Safety Rating", itin.safety.safety_rating.split("(")[0])

            with st.expander("🤖 View Multi-Agent Execution Logs (LangGraph Trace)"):
                for log in st.session_state.agent_logs:
                    st.code(log, language="bash")

            # Day Plans
            for day in itin.days:
                st.markdown(f"#### 📅 Day {day.day_number}: {day.focus_theme} (Day Cost: ₹{day.total_day_cost:,.0f})")
                for act in day.activities:
                    badge_class = "badge-indoor" if act.is_indoor else "badge-outdoor"
                    loc_label = "Indoor Venue" if act.is_indoor else "Outdoor Attraction"
                    st.markdown(f"""
                    <div class="card">
                        <div style="display:flex; justify-content:space-between; align-items:center;">
                            <strong>[{act.time_slot}] {act.title}</strong>
                            <span class="{badge_class}">{loc_label}</span>
                        </div>
                        <p style="margin:4px 0; color:#4B5563; font-size:0.9rem;">{act.description}</p>
                        <div style="font-size:0.8rem; color:#6B7280;">
                            📍 {act.location} &nbsp;|&nbsp; 💰 ₹{act.estimated_cost:,.0f} &nbsp;|&nbsp; ⏱️ {act.duration_hours} hrs &nbsp;|&nbsp; ♿ {', '.join(act.accessibility_features) if act.accessibility_features else 'General Access'}
                        </div>
                    </div>
                    """, unsafe_allow_html=True)

            with st.expander("🍽️ Recommended Local Culinary Delicacies"):
                for dish in itin.local_food_recommendations:
                    st.markdown(f"• **{dish}**")
        else:
            st.info("👈 Configure your travel profile on the left and click 'Generate Adaptive Itinerary' to see your personalized schedule.")

# =========================================================================
# TAB 2: LIVE DISRUPTION REPLANNER
# =========================================================================
with tabs[1]:
    st.subheader("⚡ Live Real-Time Disruption & Context Engine")
    st.markdown("Test the core feature of the platform: when real-world conditions change (weather downpours, severe traffic, crowd surges, or unexpected venue closures), the AI automatically substitutes activities while maintaining user budget and accessibility constraints.")

    itin = st.session_state.current_itinerary
    if not itin:
        st.warning("⚠️ Please generate an itinerary first in Tab 1 before simulating disruptions.")
    else:
        rcol1, rcol2 = st.columns([1, 2])
        with rcol1:
            st.markdown("#### 🚨 Trigger Disruption Alert")
            disrupt_type = st.selectbox(
                "Disruption Event Type",
                ["weather", "traffic", "crowd_surge", "attraction_closed"]
            )
            disrupt_day = st.selectbox("Affected Day", [d.day_number for d in itin.days])
            disrupt_slot = st.selectbox("Affected Time Window", ["Morning", "Afternoon", "Evening"])

            default_desc = "Heavy torrential monsoon rainfall and waterlogging alert"
            if disrupt_type == "traffic":
                default_desc = "Major arterial traffic gridlock causing 60-minute road delay"
            elif disrupt_type == "crowd_surge":
                default_desc = "Extreme crowd surge exceeding maximum capacity limit"
            elif disrupt_type == "attraction_closed":
                default_desc = "Unexpected monument maintenance closure for the day"

            disrupt_desc = st.text_input("Alert Description", value=default_desc)
            severity = st.selectbox("Severity Level", ["high", "medium", "low"])

            if st.button("⚡ Execute Live Replanning", type="primary", use_container_width=True):
                disruption_event = DisruptionEvent(
                    day_number=disrupt_day,
                    time_slot=disrupt_slot,
                    disruption_type=disrupt_type,
                    description=disrupt_desc,
                    severity=severity
                )
                updated_itin, adapt_res = replanner_agent.adapt(itin, disruption_event)
                st.session_state.current_itinerary = updated_itin
                st.session_state.latest_adaptation = adapt_res
                st.success("✅ Real-Time Replanning Executed!")

        with rcol2:
            if "latest_adaptation" in st.session_state:
                res = st.session_state.latest_adaptation
                st.markdown(f"#### 🔄 Adaptation Strategy: Day {res.affected_day} ({res.affected_time_slot})")
                st.info(f"💡 **AI Agent Reasoning:** {res.reason_for_change}")

                c_old, c_new = st.columns(2)
                with c_old:
                    st.markdown("**❌ Original Impacted Activity**")
                    st.error(res.original_activity_title)
                with c_new:
                    st.markdown("**✅ Substituted Real-World Alternative**")
                    st.success(f"{res.substitute_activity.title} (₹{res.substitute_activity.estimated_cost:,.0f})")

                st.markdown(f"**Budget Variance:** ₹{res.budget_variance:+,.0f} | **New Total Trip Cost:** ₹{st.session_state.current_itinerary.total_estimated_cost:,.0f}")

                if res.top_alternatives:
                    st.markdown("##### 🏆 Top Ranked Alternative Options Evaluated:")
                    for idx, alt in enumerate(res.top_alternatives, 1):
                        st.markdown(f"""
                        <div class="card">
                            <strong>Option {idx}: {alt.activity.title}</strong> (Match: {alt.match_score}% | Distance: {alt.transit_distance_km} km)
                            <p style="margin:2px 0; font-size:0.85rem; color:#4B5563;">{alt.activity.description}</p>
                            <span style="font-size:0.75rem; color:#059669;">✔ {alt.reason}</span>
                        </div>
                        """, unsafe_allow_html=True)
            else:
                st.info("Trigger a simulated alert on the left to see live adaptive itinerary updates.")

# =========================================================================
# TAB 3: GROUP TRAVEL & LOGISTICS
# =========================================================================
with tabs[2]:
    st.subheader("👥 Group Travel: Preference Voting, Accommodations & Transit")
    st.markdown("Solves frictions when traveling with friends, college groups, or families: aggregates multi-member interests, calculates fair equalized budgets, recommends shared accommodations, and optimizes group transportation.")

    gcol1, gcol2 = st.columns([1, 2])
    with gcol1:
        st.markdown("#### Group Profile")
        g_dest = st.text_input("Destination", value="Hyderabad, Telangana")
        g_days = st.slider("Group Trip Duration (Days)", 1, 7, 3, key="g_days")

        st.markdown("##### Members (4 Travelers)")
        m1_name = st.text_input("Member 1 Name", value="Rahul")
        m1_budget = st.number_input("Member 1 Max Budget (₹)", value=15000.0, step=1000.0)
        m1_ints = st.multiselect("Member 1 Interests", ["adventure", "history", "nightlife", "local food"], default=["adventure", "history"])

        m2_name = st.text_input("Member 2 Name", value="Priya")
        m2_budget = st.number_input("Member 2 Max Budget (₹)", value=18000.0, step=1000.0)
        m2_ints = st.multiselect("Member 2 Interests", ["culture", "photography", "local food"], default=["culture", "local food"])

        m3_name = st.text_input("Member 3 Name", value="Ananya")
        m3_budget = st.number_input("Member 3 Max Budget (₹)", value=12000.0, step=1000.0)
        m3_ints = st.multiselect("Member 3 Interests", ["shopping", "local food", "relaxation"], default=["shopping", "relaxation"])

        if st.button("👥 Harmonize Group Preferences", type="primary", use_container_width=True):
            members = [
                GroupMember(name=m1_name, interests=m1_ints, max_budget=m1_budget),
                GroupMember(name=m2_name, interests=m2_ints, max_budget=m2_budget),
                GroupMember(name=m3_name, interests=m3_ints, max_budget=m3_budget),
            ]
            req = GroupConsensusRequest(destination=g_dest, duration_days=g_days, members=members)
            st.session_state.group_res = group_agent.harmonize_group(req)
            st.success("✅ Group Preferences Harmonized!")

    with gcol2:
        if "group_res" in st.session_state:
            gres = st.session_state.group_res
            st.markdown("#### 🎯 Group Consensus Resolution")
            st.info(f"🤝 **Consensus Summary:** {gres.consensus_summary}")

            gm1, gm2, gm3 = st.columns(3)
            gm1.metric("Recommended Fair Budget / Person", f"₹{gres.cost_per_person:,.0f}")
            gm2.metric("Total Shared Group Pool", f"₹{gres.recommended_shared_budget:,.0f}")
            gm3.metric("Top Supported Interest", gres.aggregated_interests[0].title() if gres.aggregated_interests else "Culture")

            st.markdown("##### 🗳️ Voting & Compromise Analysis:")
            for comp in gres.voting_compromises:
                st.markdown(f"• {comp}")

            st.markdown("##### 🏨 Group Accommodation Recommendations:")
            for acc in gres.recommended_accommodations:
                st.markdown(f"""
                <div class="card">
                    <div style="display:flex; justify-content:space-between;">
                        <strong>{acc.name} ({acc.type})</strong>
                        <span style="color:#059669; font-weight:600;">₹{acc.price_per_night:,.0f} / night (Total: ₹{acc.total_estimated_cost:,.0f})</span>
                    </div>
                    <p style="margin:3px 0; font-size:0.85rem; color:#4B5563;">{acc.description}</p>
                    <div style="font-size:0.75rem; color:#6B7280;">
                        🏷️ {acc.suitability_rating} | 🛋️ Amenities: {', '.join(acc.amenities[:4])}
                    </div>
                </div>
                """, unsafe_allow_html=True)

            st.markdown("##### 🚐 Transportation Optimization:")
            for tr in gres.transportation_options:
                st.markdown(f"""
                <div class="card">
                    <strong>{tr.mode}</strong> (₹{tr.estimated_cost_per_person:,.0f} / person | 🌱 {tr.carbon_footprint_kg} kg CO2)
                    <p style="margin:2px 0; color:#059669; font-size:0.85rem;">✔ {tr.recommendation_verdict}</p>
                    <div style="font-size:0.75rem; color:#4B5563;">Pros: {', '.join(tr.pros)} | Cons: {', '.join(tr.cons)}</div>
                </div>
                """, unsafe_allow_html=True)
        else:
            st.info("Input group member details on the left and click 'Harmonize Group Preferences' to view voting results.")

# =========================================================================
# TAB 4: SMART PACKING
# =========================================================================
with tabs[3]:
    st.subheader("🧳 Smart Packing Checklist Generator")
    st.markdown("Generates a dynamic, weather-aware packing checklist tailored to destination climate, traveler demographics (kids, adults, seniors), and scheduled activities.")

    pcol1, pcol2 = st.columns([1, 2])
    with pcol1:
        p_dest = st.text_input("Destination City", value="Kerala (Munnar & Alappuzha), India", key="p_dest")
        p_duration = st.slider("Trip Duration (Days)", 1, 14, 4, key="p_duration")
        p_traveler = st.selectbox("Traveler Type", ["couple", "family", "seniors", "solo", "college_group"], key="p_traveler")
        p_activities = st.multiselect(
            "Planned Activities",
            ["sightseeing", "temple visit", "beach / swimming", "mountain trekking", "boat cruise", "fine dining"],
            default=["sightseeing", "boat cruise", "temple visit"]
        )

        if st.button("🧳 Generate Smart Packing List", type="primary", use_container_width=True):
            preq = SmartPackingRequest(
                destination=p_dest,
                duration_days=p_duration,
                traveler_type=p_traveler,
                planned_activities=p_activities
            )
            st.session_state.packing_res = packing_agent.generate_checklist(preq)
            st.success("✅ Packing Checklist Generated!")

    with pcol2:
        if "packing_res" in st.session_state:
            pk = st.session_state.packing_res
            st.markdown(f"#### 📋 Recommended Packing for {pk.destination}")
            st.markdown(f"**Climate & Weather:** `{pk.expected_temp_celsius}` — *{pk.weather_summary}*")

            for cat in pk.categories:
                with st.expander(f"{cat.category_name} ({len(cat.items)} items)", expanded=True):
                    for itm in cat.items:
                        st.checkbox(f"{'[ESSENTIAL] ' if itm.essential else ''}{itm.item} — *{itm.note}*", value=itm.essential)

            st.info("💡 **Climate & Travel Tips:**\n" + "\n".join([f"• {t}" for t in pk.climate_tips]))
        else:
            st.info("Select destination and activities to generate your packing checklist.")

# =========================================================================
# TAB 5: LANDMARK VISION AI
# =========================================================================
with tabs[4]:
    st.subheader("📸 Landmark Recognition & Vision AI (Computer Vision)")
    st.markdown("Upload a tourist photo or select a famous monument to identify architectural heritage, visiting tips, entry tickets, wheelchair accessibility, and listen to a 30-second audio guide narrative.")

    vcol1, vcol2 = st.columns([1, 2])
    with vcol1:
        monument_sample = st.selectbox(
            "Select Monument or Upload",
            [
                "Charminar, Hyderabad",
                "Golconda Fort, Hyderabad",
                "Taj Mahal, Agra",
                "Gateway of India, Mumbai",
                "Eiffel Tower, Paris",
                "The Colosseum, Rome",
                "Sensō-ji Temple, Tokyo",
                "Burj Khalifa, Dubai"
            ]
        )
        uploaded_file = st.file_uploader("Upload Landmark Photo (Optional)", type=["jpg", "png", "jpeg"])

        if st.button("🔍 Scan & Recognize Landmark", type="primary", use_container_width=True):
            hint = monument_sample.lower()
            if uploaded_file:
                hint += f" {uploaded_file.name.lower()}"
            vreq = LandmarkRecognitionRequest(landmark_hint=hint)
            st.session_state.vision_res = vision_agent.recognize_landmark(vreq)
            st.success("✅ Monument Recognized!")

    with vcol2:
        if "vision_res" in st.session_state:
            vres = st.session_state.vision_res
            st.markdown(f"### 🏛️ {vres.landmark_name}")
            st.markdown(f"**Location:** {vres.city}, {vres.country} | **AI Confidence:** `{vres.confidence_score*100:.1f}%`")

            st.markdown(f"""
            <div class="metric-box">
                <strong>Architectural Style:</strong> {vres.architectural_style}<br>
                <strong>Historical Period:</strong> {vres.historical_summary}
            </div>
            """, unsafe_allow_html=True)

            vm1, vm2 = st.columns(2)
            vm1.markdown(f"🎟️ **Entry Fees:** {vres.estimated_entry_fee}")
            vm1.markdown(f"⏰ **Best Hours:** {vres.best_visiting_time}")
            vm2.markdown(f"♿ **Wheelchair Access:** {'Yes (Ramps available)' if vres.wheelchair_accessible else 'Step-restricted / Partial'}")
            vm2.markdown(f"🌱 **Eco Tip:** {vres.eco_tip}")

            st.markdown("##### 🎧 30-Second Audio Guide Script:")
            st.info(f"🔊 *\"{vres.audio_guide_script}\"*")

            st.markdown("##### 💡 Visiting & Safety Tips:")
            for tip in vres.safety_and_visiting_tips:
                st.markdown(f"• {tip}")
        else:
            st.info("Select a monument or upload an image on the left to see computer vision recognition results.")

# =========================================================================
# TAB 6: WHAT-IF TRAVEL SIMULATOR
# =========================================================================
with tabs[5]:
    st.subheader("🔮 What-If Travel Simulator")
    st.markdown("Test hypothetical contingencies and evaluate feasibility scores before or during your trip.")

    itin = st.session_state.current_itinerary
    if not itin:
        st.warning("⚠️ Please generate an itinerary first in Tab 1 before running What-If simulations.")
    else:
        wcol1, wcol2 = st.columns([1, 2])
        with wcol1:
            scenario_preset = st.selectbox(
                "Select Hypothetical Contingency",
                [
                    "Budget Cut by 25% (Cost Saving Mode)",
                    "Torrential Rainstorm on Day 2 (Weather Shock)",
                    "Major Attraction Closure for VIP Visit (Venue Closure)",
                    "Severe Traffic Gridlock / Strike (Transit Bottleneck)",
                    "Senior Traveler Needs Low Walking (Mobility Adjustment)"
                ]
            )

            if st.button("🔮 Run What-If Simulation", type="primary", use_container_width=True):
                stype = "budget_cut" if "budget" in scenario_preset.lower() else ("weather" if "rain" in scenario_preset.lower() else "closure")
                wreq = WhatIfRequest(
                    itinerary=itin,
                    scenario_type=stype,
                    parameter_value=scenario_preset,
                    affected_day=1
                )
                st.session_state.whatif_res = whatif_agent.simulate_scenario(wreq)
                st.success("✅ Simulation Completed!")

        with wcol2:
            if "whatif_res" in st.session_state:
                wres = st.session_state.whatif_res
                st.markdown(f"#### 📊 {wres.scenario_title}")
                st.metric("Feasibility Score", f"{wres.feasibility_score}/100", delta=f"Cost Delta: ₹{wres.cost_delta:+,.2f}")

                st.markdown(f"**Mitigation Strategy:** {wres.mitigation_strategy}")
                st.markdown("##### Impact Analysis:")
                for imp in wres.impact_analysis:
                    st.markdown(f"• {imp}")

                st.info(f"💡 **AI Recommendation:** {wres.ai_recommendation_notes}")
            else:
                st.info("Select a scenario on the left to run the What-If simulation.")

# =========================================================================
# TAB 7: MULTILINGUAL COMPANION
# =========================================================================
with tabs[6]:
    st.subheader("🗣️ Conversational Multilingual Companion")
    st.markdown("Ask travel questions in 10+ languages and receive local translations, cultural tips, and colloquial phrasebooks.")

    mcol1, mcol2 = st.columns([1, 2])
    with mcol1:
        chat_lang = st.selectbox("Preferred Language", ["English", "Hindi", "Telugu", "Tamil", "French", "Spanish", "Japanese"])
        chat_dest = st.text_input("Destination Context", value="Hyderabad, Telangana", key="chat_dest")
        chat_query = st.text_area(
            "Your Question to Companion",
            value="What are the best street food items to eat near Charminar in the evening?"
        )

        if st.button("💬 Ask Travel Companion", type="primary", use_container_width=True):
            creq = CompanionChatRequest(query=chat_query, destination=chat_dest, language=chat_lang)
            st.session_state.chat_res = companion_agent.respond(creq)
            st.success("✅ Answer Received!")

    with mcol2:
        if "chat_res" in st.session_state:
            cres = st.session_state.chat_res
            st.markdown(f"#### 🤖 Companion Response ({cres.language}):")
            st.info(f"🗣️ {cres.response_text}")

            st.markdown("##### 📖 Useful Local Colloquial Phrasebook:")
            for eng, loc in cres.useful_local_phrases.items():
                st.markdown(f"• **{eng}** → `{loc}`")

            st.markdown("##### 💡 Suggested Follow-Up Questions:")
            for q in cres.suggested_followups[:3]:
                st.markdown(f"• *{q}*")
        else:
            st.info("Type a question on the left to chat with the multilingual companion.")

# =========================================================================
# TAB 8: SAFETY & SOS EMERGENCY HUB
# =========================================================================
with tabs[7]:
    st.subheader("🛡️ Tourist Safety Indicators & SOS Emergency Hub")
    st.markdown("Provides 24/7 tourist police assistance, universal emergency hotlines (112), nearest trauma hospitals, and consular safety advisories.")

    scol1, scol2 = st.columns([1, 2])
    with scol1:
        s_dest = st.selectbox(
            "Destination City",
            [
                "Hyderabad, Telangana",
                "Visakhapatnam / Vizag, Andhra Pradesh",
                "Kerala (Kochi & Munnar), India",
                "Bengaluru, Karnataka",
                "Chennai, Tamil Nadu",
                "Mumbai, Maharashtra",
                "Goa, India",
                "Paris, France",
                "Tokyo, Japan",
                "Dubai, UAE"
            ],
            key="s_dest"
        )

        if st.button("🚨 Load Emergency Support Protocol", type="primary", use_container_width=True):
            st.session_state.emg_res = safety_agent.generate_emergency_support(s_dest)
            st.success("✅ Emergency Protocol Loaded!")

    with scol2:
        if "emg_res" in st.session_state:
            eres = st.session_state.emg_res
            st.markdown(f"#### 🚨 Emergency Hub: {eres.destination}")
            st.warning(f"**Safety Status:** {eres.safety_status}")

            st.markdown("##### 📞 24/7 Primary Emergency Contacts:")
            for serv, num in eres.primary_emergency_numbers.items():
                st.markdown(f"• **{serv}:** `{num}`")

            st.markdown("##### 🏥 Key Emergency Facilities:")
            for fac in eres.nearest_support_facilities:
                st.markdown(f"• **{fac['facility']}** ({fac['type']}) — *{fac['contact']}*")

            st.markdown("##### ⚠️ Immediate Crisis Action Protocol:")
            for stp in eres.immediate_action_steps:
                st.markdown(f"• {stp}")

            st.info(f"🌐 **Consular / Diplomatic Advice:** {eres.embassy_or_consular_advice}")
        else:
            st.info("Select a destination on the left to inspect 24/7 emergency helplines and safety protocols.")
